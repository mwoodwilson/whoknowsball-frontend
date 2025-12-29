import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface VerificationDeadlineStatus {
  isPastDeadline: boolean;
  isUnverified: boolean;
  hoursRemaining: number;
  hoursSinceCreation: number;
}

/**
 * Hook to calculate if user is past the 24-hour verification deadline
 *
 * Returns:
 * - isPastDeadline: true if user has been unverified for more than 24 hours
 * - isUnverified: true if user is authenticated but email is not verified
 * - hoursRemaining: hours remaining before 24-hour deadline (0 if past deadline)
 * - hoursSinceCreation: hours elapsed since account creation
 */
export const useVerificationDeadline = (): VerificationDeadlineStatus => {
  const { user, isEmailVerified, isAuthenticated } = useAuth();

  return useMemo(() => {
    // User is not logged in or email is verified
    if (!isAuthenticated || !user || isEmailVerified) {
      return {
        isPastDeadline: false,
        isUnverified: false,
        hoursRemaining: 0,
        hoursSinceCreation: 0,
      };
    }

    // User is authenticated but email verification status not available
    if (!user.created_at) {
      return {
        isPastDeadline: false,
        isUnverified: true,
        hoursRemaining: 24,
        hoursSinceCreation: 0,
      };
    }

    // Calculate hours since account creation
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    // Determine if past 24-hour deadline
    const isPastDeadline = hoursSinceCreation >= 24;
    const hoursRemaining = Math.max(0, Math.ceil(24 - hoursSinceCreation));

    return {
      isPastDeadline,
      isUnverified: true,
      hoursRemaining,
      hoursSinceCreation: Math.floor(hoursSinceCreation),
    };
  }, [user, isEmailVerified, isAuthenticated]);
};
