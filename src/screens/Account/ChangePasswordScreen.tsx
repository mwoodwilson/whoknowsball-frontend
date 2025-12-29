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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TealPineColors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackendAPIService from '../../services/api/BackendAPIService';

interface ChangePasswordScreenProps {
  navigation: any;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[a-zA-Z]/.test(password)) {
      errors.push('At least one letter');
    }
    if (!/\d/.test(password)) {
      errors.push('At least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleChangePassword = async () => {
    setError('');

    // Validate current password
    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    // Validate new password
    if (!newPassword) {
      setError('New password is required');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(`Password must have: ${validation.errors.join(', ')}`);
      return;
    }

    // Check password confirmation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Check that new password is different from current
    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    try {
      setLoading(true);

      await BackendAPIService.changePassword(currentPassword, newPassword);

      // Success - navigate back with success indication
      navigation.goBack();

      // TODO: Show success toast
      // Toast.show({
      //   type: 'success',
      //   text1: 'Password Changed',
      //   text2: 'Your password has been updated successfully',
      // });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to change password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(newPassword);
  const isFormValid =
    currentPassword.length > 0 &&
    passwordValidation.isValid &&
    newPassword === confirmPassword;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Icon name="arrow-left" size={24} color={TealPineColors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.title}>Change Password</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Current Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="lock-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter current password"
                    placeholderTextColor={TealPineColors.textSecondary}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    textContentType="password"
                    autoComplete="off"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={TealPineColors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="lock-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter new password"
                    placeholderTextColor={TealPineColors.textSecondary}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    textContentType="newPassword"
                    autoComplete="off"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={TealPineColors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="lock-check-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Re-enter new password"
                    placeholderTextColor={TealPineColors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    textContentType="newPassword"
                    autoComplete="off"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={TealPineColors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <View style={styles.requirement}>
                  <Icon
                    name={newPassword.length >= 8 ? 'check-circle' : 'circle-outline'}
                    size={16}
                    color={newPassword.length >= 8 ? TealPineColors.primary : TealPineColors.textSecondary}
                  />
                  <Text style={[
                    styles.requirementText,
                    newPassword.length >= 8 && styles.requirementMet
                  ]}>
                    Minimum 8 characters
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Icon
                    name={/[a-zA-Z]/.test(newPassword) ? 'check-circle' : 'circle-outline'}
                    size={16}
                    color={/[a-zA-Z]/.test(newPassword) ? TealPineColors.primary : TealPineColors.textSecondary}
                  />
                  <Text style={[
                    styles.requirementText,
                    /[a-zA-Z]/.test(newPassword) && styles.requirementMet
                  ]}>
                    At least one letter
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Icon
                    name={/\d/.test(newPassword) ? 'check-circle' : 'circle-outline'}
                    size={16}
                    color={/\d/.test(newPassword) ? TealPineColors.primary : TealPineColors.textSecondary}
                  />
                  <Text style={[
                    styles.requirementText,
                    /\d/.test(newPassword) && styles.requirementMet
                  ]}>
                    At least one number
                  </Text>
                </View>
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
                style={[
                  styles.saveButton,
                  (!isFormValid || loading) && styles.saveButtonDisabled
                ]}
                onPress={handleChangePassword}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save New Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: TealPineColors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2A27',
    borderRadius: 12,
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
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  requirementsContainer: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: TealPineColors.textSecondary,
    marginLeft: 10,
  },
  requirementMet: {
    color: TealPineColors.primary,
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
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ChangePasswordScreen;
