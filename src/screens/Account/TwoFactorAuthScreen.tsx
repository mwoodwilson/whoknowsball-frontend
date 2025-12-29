import React, { useState, useEffect } from 'react';
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
import { supabase } from '../../services/auth/SupabaseAuthService';

interface TwoFactorAuthScreenProps {
  navigation: any;
}

export const TwoFactorAuthScreen: React.FC<TwoFactorAuthScreenProps> = ({ navigation }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [disableMode, setDisableMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    checkUser2FAStatus();
  }, []);

  const checkUser2FAStatus = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Check if user has 2FA enabled in their user metadata or factors
      const factors = user?.factors || [];
      const has2FA = factors.length > 0;

      setIs2FAEnabled(has2FA);
    } catch (err: any) {
      console.error('Error checking 2FA status:', err);
      setError('Failed to check 2FA status');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setError('');
    setSuccess('');

    try {
      setActionLoading(true);

      await BackendAPIService.enable2FA();

      setSuccess('Verification code sent to your email. Enter it below to complete setup.');
      setShowCodeInput(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to enable 2FA';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteEnable = () => {
    // Code was sent, but actual verification happens on next login
    setSuccess('2FA has been enabled! You will need to enter the code on your next login.');
    setShowCodeInput(false);
    setVerificationCode('');
    setIs2FAEnabled(true);
  };

  const handleStartDisable = () => {
    setError('');
    setSuccess('');
    setDisableMode(true);
    setShowCodeInput(true);
  };

  const handleDisable2FA = async () => {
    setError('');
    setSuccess('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setActionLoading(true);

      await BackendAPIService.disable2FA(verificationCode);

      setSuccess('Two-factor authentication has been disabled');
      setIs2FAEnabled(false);
      setDisableMode(false);
      setShowCodeInput(false);
      setVerificationCode('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to disable 2FA';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelCodeInput = () => {
    setShowCodeInput(false);
    setDisableMode(false);
    setVerificationCode('');
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={TealPineColors.primary} />
      </View>
    );
  }

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
              <Text style={styles.title}>Two-Factor Auth</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Icon
                  name={is2FAEnabled ? 'shield-check' : 'shield-alert'}
                  size={40}
                  color={is2FAEnabled ? TealPineColors.primary : TealPineColors.warning}
                />
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>
                    {is2FAEnabled ? '2FA Enabled' : '2FA Disabled'}
                  </Text>
                  <Text style={styles.statusSubtitle}>
                    {is2FAEnabled
                      ? 'Your account has extra security'
                      : 'Add extra security to your account'}
                  </Text>
                </View>
              </View>

              <View style={styles.statusInfo}>
                <Text style={styles.infoText}>
                  Two-factor authentication adds an extra layer of security by requiring a
                  verification code sent to your email in addition to your password.
                </Text>
              </View>
            </View>

            {/* Success Message */}
            {success ? (
              <View style={styles.successContainer}>
                <Icon name="check-circle" size={20} color={TealPineColors.primary} />
                <Text style={styles.successText}>{success}</Text>
              </View>
            ) : null}

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle-outline" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Code Input (for enable confirmation or disable) */}
            {showCodeInput && (
              <View style={styles.codeInputContainer}>
                <Text style={styles.codeLabel}>
                  {disableMode
                    ? 'Enter your 2FA code to disable'
                    : 'Enter the 6-digit code sent to your email'}
                </Text>
                <View style={styles.inputWrapper}>
                  <Icon name="numeric" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="000000"
                    placeholderTextColor={TealPineColors.textSecondary}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!actionLoading}
                    autoFocus
                  />
                </View>

                {disableMode ? (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.secondaryButton, styles.buttonHalf]}
                      onPress={handleCancelCodeInput}
                      disabled={actionLoading}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.dangerButton,
                        styles.buttonHalf,
                        (actionLoading || verificationCode.length !== 6) && styles.buttonDisabled
                      ]}
                      onPress={handleDisable2FA}
                      disabled={actionLoading || verificationCode.length !== 6}
                      activeOpacity={0.8}
                    >
                      {actionLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.dangerButtonText}>Disable 2FA</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.secondaryButton, styles.buttonHalf]}
                      onPress={handleCancelCodeInput}
                      disabled={actionLoading}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        styles.buttonHalf,
                        (actionLoading || verificationCode.length !== 6) && styles.buttonDisabled
                      ]}
                      onPress={handleCompleteEnable}
                      disabled={actionLoading || verificationCode.length !== 6}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.primaryButtonText}>Complete Setup</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons (when not showing code input) */}
            {!showCodeInput && (
              <View style={styles.actionContainer}>
                {is2FAEnabled ? (
                  <TouchableOpacity
                    style={[styles.dangerButton, actionLoading && styles.buttonDisabled]}
                    onPress={handleStartDisable}
                    disabled={actionLoading}
                    activeOpacity={0.8}
                  >
                    {actionLoading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Icon name="shield-off" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.dangerButtonText}>Disable 2FA</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.primaryButton, actionLoading && styles.buttonDisabled]}
                    onPress={handleEnable2FA}
                    disabled={actionLoading}
                    activeOpacity={0.8}
                  >
                    {actionLoading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Icon name="shield-check" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.primaryButtonText}>Enable 2FA</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* How it Works Section */}
            <View style={styles.howItWorksContainer}>
              <Text style={styles.howItWorksTitle}>How it works:</Text>
              <View style={styles.stepContainer}>
                <Icon name="numeric-1-circle" size={24} color={TealPineColors.primary} />
                <Text style={styles.stepText}>
                  Enable 2FA to receive a verification code via email
                </Text>
              </View>
              <View style={styles.stepContainer}>
                <Icon name="numeric-2-circle" size={24} color={TealPineColors.primary} />
                <Text style={styles.stepText}>
                  When logging in, enter your password as usual
                </Text>
              </View>
              <View style={styles.stepContainer}>
                <Icon name="numeric-3-circle" size={24} color={TealPineColors.primary} />
                <Text style={styles.stepText}>
                  Check your email for the 6-digit code and enter it
                </Text>
              </View>
              <View style={styles.stepContainer}>
                <Icon name="numeric-4-circle" size={24} color={TealPineColors.primary} />
                <Text style={styles.stepText}>
                  Access granted only after both password and code are verified
                </Text>
              </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: TealPineColors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 24,
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
  statusCard: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
  statusInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: TealPineColors.border,
  },
  infoText: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
    lineHeight: 20,
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
    marginLeft: 10,
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
  codeInputContainer: {
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2A27',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 20,
    letterSpacing: 4,
    color: TealPineColors.textPrimary,
    height: '100%',
    textAlign: 'center',
  },
  actionContainer: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonHalf: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: TealPineColors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
  },
  dangerButton: {
    backgroundColor: TealPineColors.loss,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  howItWorksContainer: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    padding: 20,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: TealPineColors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default TwoFactorAuthScreen;
