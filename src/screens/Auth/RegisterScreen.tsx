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
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TealPineColors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useUsernameValidation } from '../../hooks/useUsernameValidation';
import { useEmailValidation } from '../../hooks/useEmailValidation';
import { SocialLoginButtons } from '../../components/Auth/SocialLoginButtons';

const Logo = require('../../../assets/logo.png');

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);

  // Email validation
  const { isValid: isEmailValid, error: emailError, isChecking: isCheckingEmail } = useEmailValidation(email);

  // Username validation
  const { isValid: isUsernameValid, error: usernameError, isChecking: isCheckingUsername } = useUsernameValidation(username);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Clear previous errors
    setError('');

    // Validate inputs
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!isEmailValid) {
      setError(emailError || 'Please enter a valid email address');
      return;
    }

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!isUsernameValid) {
      setError(usernameError || 'Please enter a valid username');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 10) {
      setError('Password must be at least 10 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      // Pass username as metadata to be stored in user profile
      await signUp(email, password, { username });
      // Show success message about email verification
      setShowSuccessMessage(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { needsUsername } = await signInWithGoogle();

      if (needsUsername) {
        // Navigate to username setup screen for new social users
        navigation.navigate('UsernameSetup');
      } else {
        // User already has username, navigate back to app
        navigation.goBack();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Google sign-in failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      const { needsUsername } = await signInWithApple();

      if (needsUsername) {
        // Navigate to username setup screen for new social users
        navigation.navigate('UsernameSetup');
      } else {
        // User already has username, navigate back to app
        navigation.goBack();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Apple sign-in failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          bounces={false}
        >
          <View style={styles.content}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="close" size={28} color={TealPineColors.textSecondary} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={[
                styles.inputWrapper,
                emailError && email.length > 0 && styles.inputWrapperError
              ]}>
                <Icon name="email-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={TealPineColors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {isCheckingEmail && (
                  <ActivityIndicator size="small" color={TealPineColors.primary} style={styles.usernameIndicator} />
                )}
                {!isCheckingEmail && isEmailValid && email.length > 0 && (
                  <Icon name="check-circle" size={20} color="#4CAF50" style={styles.usernameIndicator} />
                )}
                {!isCheckingEmail && emailError && email.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setEmail('')}
                    style={styles.clearButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              {/* Email validation feedback */}
              {emailError && email.length > 0 && (
                <Text style={styles.errorHelpText}>{emailError}</Text>
              )}
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={[
                styles.inputWrapper,
                usernameError && username.length > 0 && styles.inputWrapperError
              ]}>
                <Icon name="account-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Choose a unique username"
                  placeholderTextColor={TealPineColors.textSecondary}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={20}
                  editable={!loading}
                />
                {isCheckingUsername && (
                  <ActivityIndicator size="small" color={TealPineColors.primary} style={styles.usernameIndicator} />
                )}
                {!isCheckingUsername && isUsernameValid && username.length >= 3 && (
                  <Icon name="check-circle" size={20} color="#4CAF50" style={styles.usernameIndicator} />
                )}
                {!isCheckingUsername && usernameError && username.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setUsername('')}
                    style={styles.clearButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              {/* Username validation feedback */}
              {usernameError ? (
                <Text style={styles.errorHelpText}>{usernameError}</Text>
              ) : isCheckingUsername ? (
                <Text style={styles.checkingText}>Checking availability...</Text>
              ) : (
                <Text style={styles.helpText}>3-20 characters, letters and numbers only</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Min 10 characters"
                  placeholderTextColor={TealPineColors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                  textContentType="newPassword"
                  autoComplete="off"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={TealPineColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.helpText}>Min 10 characters</Text>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-check-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Re-enter your password"
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

            {/* Terms of Service Acceptance */}
            <View style={styles.tosContainer}>
              <TouchableOpacity
                onPress={() => setTosAccepted(!tosAccepted)}
                style={styles.checkboxButton}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, tosAccepted && styles.checkboxChecked]}>
                  {tosAccepted && (
                    <Icon name="check" size={16} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={styles.tosText}>
                I agree to the{' '}
                <Text
                  onPress={() => navigation.navigate('TermsOfService')}
                  style={styles.tosLink}
                >
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text
                  onPress={() => navigation.navigate('PrivacyPolicy')}
                  style={styles.tosLink}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>

            {/* Success Message */}
            {showSuccessMessage ? (
              <View style={styles.successContainer}>
                <Icon name="email-check-outline" size={20} color={TealPineColors.primary} />
                <View style={styles.successTextContainer}>
                  <Text style={styles.successTitle}>Check your email!</Text>
                  <Text style={styles.successText}>
                    We've sent a verification link to {email}. Please verify within 24 hours.
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle-outline" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                (loading || !isUsernameValid || email.length === 0 || password.length < 10 || !tosAccepted) && styles.registerButtonDisabled
              ]}
              onPress={handleRegister}
              disabled={loading || !isUsernameValid || email.length === 0 || password.length < 10 || !tosAccepted}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>

            {/* Social Login Buttons */}
            <SocialLoginButtons
              onGooglePress={handleGoogleLogin}
              onApplePress={handleAppleLogin}
              disabled={loading}
            />
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
    width: '100%',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: TealPineColors.surface,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: TealPineColors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
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
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputWrapperError: {
    borderColor: '#EF4444',
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
  helpText: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    marginTop: 6,
    marginLeft: 4,
  },
  errorHelpText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
  },
  checkingText: {
    fontSize: 12,
    color: TealPineColors.primary,
    marginTop: 6,
    marginLeft: 4,
  },
  usernameIndicator: {
    position: 'absolute',
    right: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
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
  registerButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 0,
  },
  loginText: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.primary,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${TealPineColors.primary}20`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.primary,
    marginBottom: 4,
  },
  successText: {
    fontSize: 13,
    color: TealPineColors.textPrimary,
    lineHeight: 18,
  },
  tosContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  checkboxButton: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: TealPineColors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: TealPineColors.primary,
    borderColor: TealPineColors.primary,
  },
  tosText: {
    flex: 1,
    fontSize: 13,
    color: TealPineColors.textSecondary,
    lineHeight: 20,
  },
  tosLink: {
    color: TealPineColors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

export default RegisterScreen;
