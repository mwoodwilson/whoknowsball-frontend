import { useState, useEffect, useRef } from 'react';
import { Filter } from 'bad-words';
import { supabase } from '../services/auth/SupabaseAuthService';

// Initialize profanity filter with custom words
const filter = new Filter();
// Add any additional custom offensive words beyond the default list
// filter.addWords('customword1', 'customword2');

export interface UsernameValidationResult {
  isValid: boolean;
  error: string | null;
  isChecking: boolean;
}

/**
 * Hook for real-time username validation with profanity filtering and uniqueness checking
 *
 * Validation rules:
 * - Length: 3-20 characters
 * - Characters: Only letters (a-z, A-Z) and numbers (0-9)
 * - Case-sensitive
 * - No profanity
 * - Must be unique in database
 *
 * @param username - The username to validate
 * @returns {UsernameValidationResult} Validation state and error message
 */
export const useUsernameValidation = (username: string): UsernameValidationResult => {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Use ref to track the latest validation request
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset state for empty username
    if (!username || username.trim() === '') {
      setIsValid(false);
      setError(null);
      setIsChecking(false);
      return;
    }

    // Set checking state immediately for better UX
    setIsChecking(true);
    setError(null);

    // Debounce validation by 500ms
    validationTimeoutRef.current = setTimeout(() => {
      validateUsername(username);
    }, 500);

    // Cleanup function
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [username]);

  const validateUsername = async (usernameToValidate: string) => {
    try {
      // 1. Check length (3-20 characters)
      if (usernameToValidate.length < 3) {
        setError('Username must be at least 3 characters');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      if (usernameToValidate.length > 20) {
        setError('Username must be no more than 20 characters');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // 2. Check characters (only letters and numbers)
      const validCharactersRegex = /^[a-zA-Z0-9]+$/;
      if (!validCharactersRegex.test(usernameToValidate)) {
        setError('Username can only contain letters and numbers');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // 3. Check for profanity
      if (filter.isProfane(usernameToValidate)) {
        setError('Username contains inappropriate language');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // 4. Check uniqueness in database
      abortControllerRef.current = new AbortController();

      const { data, error: dbError } = await supabase
        .from('users')
        .select('username', { count: 'exact', head: true })
        .eq('username', usernameToValidate);

      // Check if request was aborted (user typed more characters)
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      if (dbError) {
        console.error('Error checking username uniqueness:', dbError);
        setError('Unable to verify username availability');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // Check if username already exists
      // Note: Supabase returns count in the response metadata
      const { count } = await supabase
        .from('users')
        .select('username', { count: 'exact', head: true })
        .eq('username', usernameToValidate);

      if (count && count > 0) {
        setError('Username is already taken');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // All validations passed
      setIsValid(true);
      setError(null);
      setIsChecking(false);
    } catch (err) {
      console.error('Username validation error:', err);
      setError('Unable to verify username');
      setIsValid(false);
      setIsChecking(false);
    }
  };

  return {
    isValid,
    error,
    isChecking,
  };
};
