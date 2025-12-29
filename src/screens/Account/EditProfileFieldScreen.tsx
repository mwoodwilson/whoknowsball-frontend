import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TealPineColors, borderRadius } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import BackendAPIService from '../../services/api/BackendAPIService';

interface EditProfileFieldScreenProps {
  navigation: any;
  route: {
    params: {
      field: 'full_name' | 'phone' | 'date_of_birth';
      label: string;
      value: string;
    };
  };
}

/**
 * EditProfileFieldScreen - Generic reusable screen for editing profile fields
 *
 * Handles editing of single profile fields (full name, phone, date of birth).
 * This screen receives the field type, label, and current value via route params.
 *
 * Features:
 * - Generic field editing interface
 * - Validates input based on field type
 * - Saves changes via PUT /api/v1/users/profile endpoint
 * - Updates Supabase user metadata
 * - Loading states and error handling
 * - Automatic navigation back on success
 *
 * API Integration:
 * - PUT /api/v1/users/profile
 *   Body: { full_name?, phone?, date_of_birth? }
 *   Response: { success: true, user: { ... } }
 *
 * @example
 * navigation.navigate('EditProfileField', {
 *   field: 'full_name',
 *   label: 'Full Name',
 *   value: 'John Doe'
 * });
 */
const EditProfileFieldScreen: React.FC<EditProfileFieldScreenProps> = ({
  navigation,
  route,
}) => {
  const { field, label, value: initialValue } = route.params;
  const { user, checkVerificationStatus } = useAuth();

  const [value, setValue] = useState(initialValue || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get field-specific configuration
  const getFieldConfig = () => {
    switch (field) {
      case 'full_name':
        return {
          placeholder: 'Enter your full name',
          keyboardType: 'default' as const,
          autoCapitalize: 'words' as const,
          maxLength: 100,
        };
      case 'phone':
        return {
          placeholder: 'Enter your phone number',
          keyboardType: 'phone-pad' as const,
          autoCapitalize: 'none' as const,
          maxLength: 20,
        };
      case 'date_of_birth':
        return {
          placeholder: 'YYYY-MM-DD',
          keyboardType: 'default' as const,
          autoCapitalize: 'none' as const,
          maxLength: 10,
        };
      default:
        return {
          placeholder: 'Enter value',
          keyboardType: 'default' as const,
          autoCapitalize: 'none' as const,
          maxLength: 100,
        };
    }
  };

  const fieldConfig = getFieldConfig();

  // Validate input based on field type
  const validateInput = (input: string): { valid: boolean; error?: string } => {
    if (!input.trim()) {
      return { valid: false, error: `${label} is required` };
    }

    switch (field) {
      case 'full_name':
        if (input.trim().length < 2) {
          return { valid: false, error: 'Name must be at least 2 characters' };
        }
        break;
      case 'phone':
        // Basic phone validation (allows various formats)
        const phoneRegex = /^[+]?[\d\s\-()]+$/;
        if (!phoneRegex.test(input)) {
          return { valid: false, error: 'Please enter a valid phone number' };
        }
        break;
      case 'date_of_birth':
        // Validate date format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(input)) {
          return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
        }
        // Validate date is valid and in the past
        const date = new Date(input);
        if (isNaN(date.getTime())) {
          return { valid: false, error: 'Please enter a valid date' };
        }
        if (date > new Date()) {
          return { valid: false, error: 'Date of birth cannot be in the future' };
        }
        // Check age is reasonable (between 13 and 120 years old)
        const age = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 13) {
          return { valid: false, error: 'You must be at least 13 years old' };
        }
        if (age > 120) {
          return { valid: false, error: 'Please enter a valid date of birth' };
        }
        break;
    }

    return { valid: true };
  };

  const handleSave = async () => {
    // Clear previous error
    setError('');

    // Validate input
    const validation = validateInput(value);
    if (!validation.valid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    // Check if value has changed
    if (value.trim() === initialValue) {
      Alert.alert('No Changes', 'You have not made any changes.', [{ text: 'OK' }]);
      return;
    }

    try {
      setLoading(true);

      // Call backend API to update profile
      const updateData = {
        [field]: value.trim(),
      };

      console.log('[EditProfileField] Updating profile:', updateData);
      const response = await BackendAPIService.updateProfile(updateData);

      if (response.success) {
        console.log('[EditProfileField] Profile updated successfully');

        // Refresh user data to get updated metadata
        await checkVerificationStatus();

        // Show success message and navigate back
        Alert.alert('Success', `${label} updated successfully`, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('[EditProfileField] Error updating profile:', err);
      const errorMessage = err.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);

      // Show error alert
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={24} color={TealPineColors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit {label}</Text>
            <View style={styles.backButton} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={fieldConfig.placeholder}
                  placeholderTextColor={TealPineColors.textSecondary}
                  value={value}
                  onChangeText={setValue}
                  keyboardType={fieldConfig.keyboardType}
                  autoCapitalize={fieldConfig.autoCapitalize}
                  autoCorrect={false}
                  maxLength={fieldConfig.maxLength}
                  editable={!loading}
                  autoFocus
                />
              </View>
              {field === 'date_of_birth' && (
                <Text style={styles.helperText}>
                  Format: YYYY-MM-DD (e.g., 1990-01-15)
                </Text>
              )}
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle-outline" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: TealPineColors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
  },
  formContainer: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: TealPineColors.border,
    borderRadius: borderRadius,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: TealPineColors.textPrimary,
    height: '100%',
  },
  helperText: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 8,
    flex: 1,
  },
  saveButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: borderRadius,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textSecondary,
  },
});

export default EditProfileFieldScreen;
