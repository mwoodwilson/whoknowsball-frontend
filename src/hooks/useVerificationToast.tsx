import { useState, useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { useAuth } from '../contexts/AuthContext';
import { useVerificationDeadline } from './useVerificationDeadline';

export const useVerificationToast = () => {
  const { isEmailVerified, isAuthenticated, resendVerificationEmail } = useAuth();
  const { isPastDeadline } = useVerificationDeadline();
  const [countdown, setCountdown] = useState(0);
  const [resending, setResending] = useState(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const toastShownRef = useRef(false);

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

  // Update toast text when countdown changes
  useEffect(() => {
    if (isAuthenticated && !isEmailVerified && toastShownRef.current) {
      let text1: string;
      let text2: string | undefined;

      if (isPastDeadline) {
        // Past 24 hours - urgent message
        text1 = countdown > 0
          ? `Resend verification email to access all features (Wait ${countdown}s)`
          : 'Resend verification email to access all features';
        text2 = countdown > 0 ? undefined : '(tap here)';
      } else {
        // Within 24 hours - warning message
        text1 = countdown > 0
          ? `Verify your email within 24 hours (Wait ${countdown}s before resending)`
          : 'Please verify your email within 24 hours';
        text2 = countdown > 0 ? undefined : 'to continue using all features';
      }

      Toast.show({
        type: 'verificationToast' as any,
        text1,
        text2,
        position: 'top',
        visibilityTime: 0,
        autoHide: false,
        topOffset: 100,
        props: {
          onPress: handleResend,
          disabled: countdown > 0 || resending,
          countdown,
          isPastDeadline,
        },
      });
    }
  }, [countdown, isAuthenticated, isEmailVerified, resending, isPastDeadline]);

  const handleResend = async () => {
    // Don't allow resend if countdown is active or already resending
    if (countdown > 0 || resending) {
      return;
    }

    try {
      setResending(true);
      await resendVerificationEmail();

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Verification email sent!',
        text2: 'Check your inbox',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 100,
      });

      // Start 60 second countdown
      setCountdown(60);

      // After success toast hides (3 seconds), show the main toast again
      setTimeout(() => {
        if (isAuthenticated && !isEmailVerified) {
          const text1 = isPastDeadline
            ? 'Resend verification email to access all features (Wait 60s)'
            : 'Verify your email within 24 hours (Wait 60s before resending)';
          const text2 = undefined; // No text2 when countdown is active

          Toast.show({
            type: 'verificationToast' as any,
            text1,
            text2,
            position: 'top',
            visibilityTime: 0,
            autoHide: false,
            topOffset: 100,
            props: {
              onPress: handleResend,
              disabled: true,
              countdown: 60,
              isPastDeadline,
            },
          });
        }
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to resend email';

      // Parse rate limit error to extract seconds
      const rateLimitMatch = errorMessage.match(/after (\d+) seconds?/i);
      if (rateLimitMatch) {
        const seconds = parseInt(rateLimitMatch[1], 10);
        setCountdown(seconds);
      }

      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Failed to resend email',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 100,
      });

      // After error toast hides (3 seconds), show the main toast again
      setTimeout(() => {
        if (isAuthenticated && !isEmailVerified) {
          let text1: string;
          let text2: string | undefined;

          if (isPastDeadline) {
            // Past 24 hours - urgent message
            text1 = countdown > 0
              ? `Resend verification email to access all features (Wait ${countdown}s)`
              : 'Resend verification email to access all features';
            text2 = countdown > 0 ? undefined : '(tap here)';
          } else {
            // Within 24 hours - warning message
            text1 = countdown > 0
              ? `Verify your email within 24 hours (Wait ${countdown}s before resending)`
              : 'Please verify your email within 24 hours';
            text2 = countdown > 0 ? undefined : 'to continue using all features';
          }

          Toast.show({
            type: 'verificationToast' as any,
            text1,
            text2,
            position: 'top',
            visibilityTime: 0,
            autoHide: false,
            topOffset: 100,
            props: {
              onPress: handleResend,
              disabled: countdown > 0,
              countdown,
              isPastDeadline,
            },
          });
        }
      }, 3000);
    } finally {
      setResending(false);
    }
  };

  // Show toast when user is authenticated but not verified
  useEffect(() => {
    if (isAuthenticated && !isEmailVerified) {
      toastShownRef.current = true;

      let text1: string;
      let text2: string | undefined;

      if (isPastDeadline) {
        // Past 24 hours - urgent message
        text1 = countdown > 0
          ? `Resend verification email to access all features (Wait ${countdown}s)`
          : 'Resend verification email to access all features';
        text2 = countdown > 0 ? undefined : '(tap here)';
      } else {
        // Within 24 hours - warning message
        text1 = countdown > 0
          ? `Verify your email within 24 hours (Wait ${countdown}s before resending)`
          : 'Please verify your email within 24 hours';
        text2 = countdown > 0 ? undefined : 'to continue using all features';
      }

      Toast.show({
        type: 'verificationToast' as any,
        text1,
        text2,
        position: 'top',
        visibilityTime: 0,
        autoHide: false,
        topOffset: 100,
        props: {
          onPress: handleResend,
          disabled: countdown > 0 || resending,
          countdown,
          isPastDeadline,
        },
      });
    } else {
      // Hide toast if user becomes verified or logs out
      if (toastShownRef.current) {
        Toast.hide();
        toastShownRef.current = false;
      }
    }
  }, [isAuthenticated, isEmailVerified, isPastDeadline]);

  return null;
};
