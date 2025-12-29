import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/auth/SupabaseAuthService';

export interface EmailValidationResult {
  isValid: boolean;
  error: string | null;
  isChecking: boolean;
}

/**
 * Hook for real-time email validation with format checking and uniqueness verification
 *
 * Validation rules:
 * - Must be valid email format
 * - Must be unique in database
 *
 * @param email - The email to validate
 * @returns {EmailValidationResult} Validation state and error message
 */
export const useEmailValidation = (email: string): EmailValidationResult => {
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

    // Reset state for empty email
    if (!email || email.trim() === '') {
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
      validateEmail(email);
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
  }, [email]);

  const validateEmail = async (emailToValidate: string) => {
    try {
      // 1. Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailToValidate)) {
        setError('Please enter a valid email address');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // 2. Check uniqueness in database
      abortControllerRef.current = new AbortController();

      // Check in auth.users table via RPC or by querying profiles
      const { data, error: dbError } = await supabase
        .from('users')
        .select('email', { count: 'exact', head: true })
        .eq('email', emailToValidate.toLowerCase());

      // Check if request was aborted (user typed more characters)
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      if (dbError) {
        console.error('Error checking email uniqueness:', dbError);
        setError('Unable to verify email availability');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // Check if email already exists
      const { count } = await supabase
        .from('users')
        .select('email', { count: 'exact', head: true })
        .eq('email', emailToValidate.toLowerCase());

      if (count && count > 0) {
        setError('Email already in use');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // All validations passed
      setIsValid(true);
      setError(null);
      setIsChecking(false);
    } catch (err) {
      console.error('Email validation error:', err);
      setError('Unable to verify email');
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
