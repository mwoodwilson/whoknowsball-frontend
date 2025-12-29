import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { TealPineColors } from '../../theme/colors';

interface VerificationRequiredModalProps {
  visible: boolean;
  onClose?: () => void;
}

export const VerificationRequiredModal: React.FC<VerificationRequiredModalProps> = ({
  visible,
  onClose,
}) => {
  const { resendVerificationEmail } = useAuth();
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
    // Don't allow resend if countdown is active or already resending
    if (countdown > 0 || resending) {
      return;
    }

    try {
      setResending(true);
      setMessage(null);
      await resendVerificationEmail();

      // Show success message
      setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
      setCountdown(60);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to resend email';

      // Parse rate limit error to extract seconds
      const rateLimitMatch = errorMessage.match(/after (\d+) seconds?/i);
      if (rateLimitMatch) {
        const seconds = parseInt(rateLimitMatch[1], 10);
        setCountdown(seconds);
      }

      // Show error message
      setMessage({ type: 'error', text: errorMessage });

      // Hide error message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } finally {
      setResending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon name="email-lock" size={64} color={TealPineColors.primary} />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Email Verification Required</Text>

          {/* Message */}
          <Text style={styles.message}>
            Please verify your email to access this feature. Check your inbox for the verification link.
          </Text>

          {/* Status message (success or error) */}
          {message && (
            <View style={[
              styles.statusMessage,
              message.type === 'success' ? styles.successMessage : styles.errorMessage
            ]}>
              <Icon
                name={message.type === 'success' ? 'check-circle' : 'alert-circle'}
                size={16}
                color="#FFFFFF"
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>{message.text}</Text>
            </View>
          )}

          {/* Resend Button */}
          <TouchableOpacity
            style={[
              styles.resendButton,
              (countdown > 0 || resending) && styles.resendButtonDisabled
            ]}
            onPress={handleResend}
            disabled={countdown > 0 || resending}
            activeOpacity={0.8}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Icon name="email-sync" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Optional close button for future use */}
          {onClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 16,
    padding: 32,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  successMessage: {
    backgroundColor: '#10B981',
  },
  errorMessage: {
    backgroundColor: '#EF4444',
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  resendButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  resendButtonDisabled: {
    backgroundColor: TealPineColors.textSecondary,
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  closeButtonText: {
    color: TealPineColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
