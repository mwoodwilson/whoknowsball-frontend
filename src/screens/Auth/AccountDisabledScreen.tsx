import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TealPineColors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';

const Logo = require('../../../assets/logo.png');

interface AccountDisabledScreenProps {
  navigation?: any;
}

export const AccountDisabledScreen: React.FC<AccountDisabledScreenProps> = ({ navigation }) => {
  const { user, resendVerificationEmail, signOut } = useAuth();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleResend = async () => {
    try {
      setResending(true);
      setMessage(null);
      await resendVerificationEmail();
      setMessage('Verification email sent! Check your inbox.');
      setCountdown(60); // Start 60 second countdown
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to resend verification email';

      // Parse rate limit error to extract seconds
      const rateLimitMatch = errorMessage.match(/after (\d+) seconds?/i);
      if (rateLimitMatch) {
        const seconds = parseInt(rateLimitMatch[1], 10);
        setCountdown(seconds);
        setMessage(`Please wait ${seconds} seconds before resending.`);
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = async () => {
    try {
      await signOut();
      if (navigation) {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon name="clock-alert-outline" size={80} color="#FF6B6B" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Account Disabled</Text>

        {/* Description */}
        <Text style={styles.description}>
          Your account was not verified within 24 hours.
        </Text>
        <Text style={styles.descriptionSecondary}>
          Check your email for the verification link or request a new one.
        </Text>

        {/* Email Display */}
        {user?.email && (
          <View style={styles.emailContainer}>
            <Icon name="email-outline" size={16} color={TealPineColors.textSecondary} />
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        )}

        {/* Success/Error Message */}
        {message && (
          <View style={styles.messageContainer}>
            <Icon
              name={message.includes('Failed') ? "alert-circle-outline" : "check-circle-outline"}
              size={16}
              color={message.includes('Failed') ? "#FF6B6B" : TealPineColors.primary}
            />
            <Text style={[
              styles.messageText,
              message.includes('Failed') && styles.messageError
            ]}>
              {message}
            </Text>
          </View>
        )}

        {/* Resend Button */}
        <TouchableOpacity
          style={[styles.primaryButton, (resending || countdown > 0) && styles.buttonDisabled]}
          onPress={handleResend}
          disabled={resending || countdown > 0}
          activeOpacity={0.8}
        >
          {resending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              <Icon name="email-fast-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Back to Login Button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackToLogin}
          disabled={resending}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: TealPineColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  descriptionSecondary: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  emailText: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    marginLeft: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  messageText: {
    fontSize: 14,
    color: TealPineColors.primary,
    marginLeft: 8,
    flex: 1,
  },
  messageError: {
    color: '#FF6B6B',
  },
  primaryButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: TealPineColors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: TealPineColors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountDisabledScreen;
