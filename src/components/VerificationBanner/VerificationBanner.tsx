import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';

export const VerificationBanner: React.FC = () => {
  const { isEmailVerified, isAuthenticated, resendVerificationEmail, checkVerificationStatus } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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

  // Don't show if user is verified, not authenticated, or banner is dismissed
  if (isEmailVerified || !isAuthenticated || dismissed) {
    return null;
  }

  const handleResend = async () => {
    // Don't allow resend if countdown is active
    if (countdown > 0 || resending) {
      return;
    }

    try {
      setResending(true);
      setMessage(null);
      setShowSuccess(false);
      await resendVerificationEmail();
      setShowSuccess(true);
      setCountdown(60); // Start 60 second countdown
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to resend email';

      // Parse rate limit error to extract seconds
      const rateLimitMatch = errorMessage.match(/after (\d+) seconds?/i);
      if (rateLimitMatch) {
        const seconds = parseInt(rateLimitMatch[1], 10);
        setCountdown(seconds);
        setMessage(`Please wait ${seconds} seconds before resending.`);
      } else {
        setMessage(errorMessage);
      }

      setTimeout(() => setMessage(null), 3000);
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setMessage(null);
      await checkVerificationStatus();
      setMessage('Status refreshed');
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage('Failed to refresh status');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setRefreshing(false);
    }
  };

  // Determine what message to show
  const displayMessage = showSuccess
    ? 'Verification email sent!'
    : message
    ? message
    : 'Please verify your email within 24 hours to continue using all features';

  console.log('=== VerificationBanner DEBUG ===');
  console.log('isEmailVerified:', isEmailVerified);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('dismissed:', dismissed);
  console.log('displayMessage:', displayMessage);
  console.log('displayMessage length:', displayMessage?.length);

  return (
    <View style={styles.container}>
      <View style={styles.bannerTouchable}>
        <View style={styles.content}>
          {resending ? (
            <ActivityIndicator size="small" color="#92400E" style={styles.icon} />
          ) : (
            <Icon name="reload" size={20} color="#92400E" style={styles.icon} />
          )}
          <View style={[styles.textContainer, {backgroundColor: 'blue', minHeight: 30}]}>
            <Text style={[styles.text, {backgroundColor: 'green', color: '#FFFFFF'}]}>STATIC TEST TEXT</Text>
            <Text style={[styles.text, {backgroundColor: 'orange'}]}>{displayMessage || 'TEST TEXT VISIBLE'}</Text>
            {countdown > 0 && (
              <Text style={styles.countdownText}>Wait {countdown}s before resending</Text>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setDismissed(true)}
        style={styles.closeButton}
        activeOpacity={0.7}
      >
        <Icon name="close" size={18} color="#92400E" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EAB308',
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D97706',
    borderRadius: 8,
    alignItems: 'center',
  },
  bannerTouchable: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'purple',
    minHeight: 40,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  countdownText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '400',
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
});
