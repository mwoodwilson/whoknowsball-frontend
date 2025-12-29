import React, { useState, useEffect, useRef } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TealPineColors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import SupabaseAuthService from '../../services/auth/SupabaseAuthService';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import { SocialLoginButtons } from '../../components/Auth/SocialLoginButtons';

const Logo = require('../../../assets/logo.png');

/**
 * LoginScreen Component
 *
 * Features:
 * - Manual login with email/password
 * - Remember Me checkbox (saves email to AsyncStorage)
 * - iOS Password Autofill support
 * - Biometric authentication (Face ID/Touch ID)
 *   - Automatic login attempt on screen mount if biometric is enabled
 *   - Prompts user to enable biometric after first successful login
 *   - Falls back to manual login if biometric fails or is cancelled
 * - Email verification resend functionality
 *
 * TODO: Add "Disable Face ID" option in Account/Settings screen
 *       - Allow users to disable biometric login from settings
 *       - Use clearBiometricCredentials() from useBiometricAuth hook
 */

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const {
    checkBiometricAvailability,
    saveBiometricCredentials,
    loginWithBiometrics,
    isBiometricEnabled,
  } = useBiometricAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAttempted, setBiometricAttempted] = useState(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved email on mount
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Failed to load saved email:', error);
      }
    };
    loadSavedEmail();
  }, []);

  // Attempt biometric login on mount
  useEffect(() => {
    const attemptBiometricLogin = async () => {
      try {
        // Check if biometric is enabled and we haven't attempted yet
        const biometricEnabled = await isBiometricEnabled();
        if (biometricEnabled && !biometricAttempted) {
          setBiometricAttempted(true);

          // Attempt to get credentials via biometric authentication
          const credentials = await loginWithBiometrics();

          if (credentials) {
            // Set credentials in state
            setEmail(credentials.email);
            setPassword(credentials.password);

            // Automatically trigger login
            setLoading(true);
            try {
              await signIn(credentials.email, credentials.password);
              // On success, navigate back to main app
              navigation.goBack();
            } catch (err: any) {
              const errorMessage = err.message || 'Login failed. Please try again.';
              setError(errorMessage);

              // Show resend button if account is disabled due to email verification
              if (errorMessage.includes('disabled') || errorMessage.includes('verify')) {
                setShowResendButton(true);
              }
            } finally {
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error('Biometric login failed:', error);
        // If biometric fails, user can still log in manually
      }
    };

    attemptBiometricLogin();
  }, [biometricAttempted, isBiometricEnabled, loginWithBiometrics, signIn, navigation]);

  // Cleanup countdown interval on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [countdown]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResendVerification = async () => {
    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setResendLoading(true);
      setResendSuccess(false);
      const { error } = await SupabaseAuthService.resendVerificationEmail(email);

      if (error) {
        const errorMessage = error.message || 'Failed to resend verification email';

        // Parse rate limit error to extract seconds
        const rateLimitMatch = errorMessage.match(/after (\d+) seconds?/i);
        if (rateLimitMatch) {
          const seconds = parseInt(rateLimitMatch[1], 10);
          setCountdown(seconds);
          setError(`Please wait ${seconds} seconds before resending.`);
        } else {
          setError(errorMessage);
        }
      } else {
        setResendSuccess(true);
        setCountdown(60); // Start 60 second countdown
        setTimeout(() => setResendSuccess(false), 5000); // Hide success message after 5 seconds
      }
    } catch (err: any) {
      setError('Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogin = async () => {
    // Clear previous errors and states
    setError('');
    setShowResendButton(false);
    setResendSuccess(false);

    // Validate inputs
    if (!email.trim()) {
      setError('Email or username is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);

      // Save or remove email based on Remember Me checkbox
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
      }

      // Prompt for biometric setup if not already enabled
      // This only prompts once per device (hook handles the prompt logic)
      const biometricEnabled = await isBiometricEnabled();
      if (!biometricEnabled) {
        const available = await checkBiometricAvailability();
        if (available) {
          // saveBiometricCredentials handles user prompting and stores credentials if accepted
          await saveBiometricCredentials(email, password);
        }
      }

      // On success, navigate back to main app
      navigation.goBack();
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);

      // Show resend button if account is disabled due to email verification
      if (errorMessage.includes('disabled') || errorMessage.includes('verify')) {
        setShowResendButton(true);
      }
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView>
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email or Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email or Username</Text>
              <View style={styles.inputWrapper}>
                <Icon name="email-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email or username"
                  placeholderTextColor={TealPineColors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="username"
                  autoComplete="username"
                  testID="login-email-input"
                  accessibilityLabel="Email or username"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor={TealPineColors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  autoComplete="password"
                  testID="login-password-input"
                  accessibilityLabel="Password"
                  editable={!loading}
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
            </View>

            {/* Forgot Password Link */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Resend Success Message */}
            {resendSuccess ? (
              <View style={styles.successContainer}>
                <Icon name="email-check-outline" size={16} color={TealPineColors.primary} />
                <Text style={styles.successText}>Verification email sent! Check your inbox.</Text>
              </View>
            ) : null}

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle-outline" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Resend Verification Button */}
            {showResendButton ? (
              <TouchableOpacity
                style={[styles.resendButton, (countdown > 0) && styles.resendButtonDisabled]}
                onPress={handleResendVerification}
                disabled={resendLoading || countdown > 0}
                activeOpacity={0.8}
              >
                {resendLoading ? (
                  <ActivityIndicator size="small" color={TealPineColors.primary} />
                ) : (
                  <View style={styles.resendButtonContent}>
                    <Icon name="email-fast-outline" size={18} color={TealPineColors.primary} />
                    <Text style={styles.resendButtonText}>
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : null}

            {/* Remember Me Checkbox */}
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              disabled={loading}
              activeOpacity={0.7}
            >
              <View style={styles.checkboxContainer}>
                <Icon
                  name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={rememberMe ? TealPineColors.primary : TealPineColors.textSecondary}
                />
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
              >
                <Text style={styles.signupLink}>Sign up</Text>
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
    justifyContent: 'center',
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
  loginButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.primary,
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
  resendButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: TealPineColors.primary,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.primary,
    marginLeft: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxContainer: {
    marginRight: 8,
  },
  rememberMeText: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: TealPineColors.primary,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
