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

interface EditEmailScreenProps {
  navigation: any;
}

/**
 * EditEmailScreen - Screen for changing user email address
 *
 * Handles email changes with special verification flow.
 * Email changes trigger a verification email to the new address.
 *
 * Features:
 * - Current email display
 * - New email input with validation
 * - Duplicate email detection
 * - Verification email notification
 * - Loading states and error handling
 * - Informative success message
 *
 * API Integration:
 * - PUT /api/v1/users/email
 *   Body: { new_email: string }
 *   Response: { success: true, message: string }
 *   Errors: 400 (validation), 409 (duplicate)
 *
 * Flow:
 * 1. User enters new email
 * 2. Backend validates and updates email (unverified)
 * 3. Verification email sent to new address
 * 4. User must verify new email via link
 * 5. Old email remains active until new one is verified
 *
 * @example
 * navigation.navigate('EditEmail');
 */
const EditEmailScreen: React.FC<EditEmailScreenProps> = ({ navigation }) => {
  const { user, checkVerificationStatus } = useAuth();

  const currentEmail = user?.email || '';
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    // Clear previous error
    setError('');
    setSuccess(false);

    // Validate new email
    if (!newEmail.trim()) {
      setError('Please enter a new email address');
      return;
    }

    if (!validateEmail(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if email is the same as current
    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      Alert.alert('No Changes', 'This is already your current email address.', [
        { text: 'OK' },
      ]);
      return;
    }

    try {
      setLoading(true);

      console.log('[EditEmail] Updating email to:', newEmail);
      const response = await BackendAPIService.updateEmail({ new_email: newEmail });

      if (response.success) {
        console.log('[EditEmail] Email update initiated successfully');
        setSuccess(true);

        // Refresh user data
        await checkVerificationStatus();

        // Show success message with instructions
        Alert.alert(
          'Verification Email Sent',
          `We've sent a verification email to ${newEmail}. Please check your inbox and click the verification link to complete the email change.\n\nYour current email (${currentEmail}) will remain active until you verify the new one.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to update email');
      }
    } catch (err: any) {
      console.error('[EditEmail] Error updating email:', err);

      let errorMessage = 'Failed to update email. Please try again.';

      // Handle specific error cases
      if (err.response?.status === 409) {
        errorMessage = 'This email is already in use by another account';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || 'Invalid email address';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
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
            <Text style={styles.headerTitle}>Change Email</Text>
            <View style={styles.backButton} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <Icon name="information-outline" size={20} color={TealPineColors.info} />
              <Text style={styles.infoBannerText}>
                Changing your email will require verification. A confirmation link will be sent to
                your new email address.
              </Text>
            </View>

            {/* Current Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Email</Text>
              <View style={styles.currentEmailContainer}>
                <Icon name="email-outline" size={20} color={TealPineColors.textSecondary} />
                <Text style={styles.currentEmailText}>{currentEmail}</Text>
              </View>
            </View>

            {/* New Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Email</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="email-outline"
                  size={20}
                  color={TealPineColors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter new email address"
                  placeholderTextColor={TealPineColors.textSecondary}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  autoComplete="email"
                  editable={!loading}
                  autoFocus
                />
              </View>
            </View>

            {/* Success Message */}
            {success ? (
              <View style={styles.successContainer}>
                <Icon name="email-check-outline" size={16} color={TealPineColors.primary} />
                <Text style={styles.successText}>
                  Verification email sent! Check your inbox.
                </Text>
              </View>
            ) : null}

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
                <Text style={styles.saveButtonText}>Send Verification Email</Text>
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

            {/* Additional Info */}
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalInfoText}>
                Your current email will remain active until you verify the new one. Make sure you
                have access to the new email address before proceeding.
              </Text>
            </View>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${TealPineColors.info}20`,
    borderRadius: borderRadius,
    padding: 16,
    marginBottom: 24,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: TealPineColors.info,
    marginLeft: 12,
    lineHeight: 20,
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
  currentEmailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.surface,
    borderRadius: borderRadius,
    paddingHorizontal: 16,
    height: 56,
  },
  currentEmailText: {
    fontSize: 16,
    color: TealPineColors.textSecondary,
    marginLeft: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.border,
    borderRadius: borderRadius,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TealPineColors.textPrimary,
    height: '100%',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${TealPineColors.primary}20`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: TealPineColors.primary,
    marginLeft: 8,
    flex: 1,
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
  additionalInfo: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: TealPineColors.border,
  },
  additionalInfoText: {
    fontSize: 13,
    color: TealPineColors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default EditEmailScreen;
