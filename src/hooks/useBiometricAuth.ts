import { useState, useCallback } from 'react';
import * as Keychain from 'react-native-keychain';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_ENABLED_KEY = 'biometricAuthEnabled';
const BIOMETRIC_PROMPTED_KEY = 'biometricPromptShown';

export interface BiometricCredentials {
  email: string;
  password: string;
}

export const useBiometricAuth = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState<boolean>(false);

  /**
   * Check if device supports biometric authentication (Face ID, Touch ID, or Fingerprint)
   */
  const checkBiometricAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();

      // Check for all supported biometry types across iOS and Android
      const isSupported =
        biometryType === Keychain.BIOMETRY_TYPE.FACE_ID ||
        biometryType === Keychain.BIOMETRY_TYPE.TOUCH_ID ||
        biometryType === Keychain.BIOMETRY_TYPE.FACE ||
        biometryType === Keychain.BIOMETRY_TYPE.FINGERPRINT ||
        biometryType === Keychain.BIOMETRY_TYPE.IRIS;

      setIsBiometricSupported(isSupported);
      return isSupported;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricSupported(false);
      return false;
    }
  }, []);

  /**
   * Get the display name for the biometric type (for user-facing messages)
   */
  const getBiometricTypeName = useCallback(async (): Promise<string> => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();

      switch (biometryType) {
        case Keychain.BIOMETRY_TYPE.FACE_ID:
          return 'Face ID';
        case Keychain.BIOMETRY_TYPE.TOUCH_ID:
          return 'Touch ID';
        case Keychain.BIOMETRY_TYPE.FACE:
          return 'Face Recognition';
        case Keychain.BIOMETRY_TYPE.FINGERPRINT:
          return 'Fingerprint';
        case Keychain.BIOMETRY_TYPE.IRIS:
          return 'Iris Recognition';
        default:
          return 'Biometric Authentication';
      }
    } catch (error) {
      return 'Biometric Authentication';
    }
  }, []);

  /**
   * Check if user has already been prompted for biometric setup
   */
  const hasBeenPrompted = useCallback(async (): Promise<boolean> => {
    try {
      const prompted = await AsyncStorage.getItem(BIOMETRIC_PROMPTED_KEY);
      return prompted === 'true';
    } catch (error) {
      console.error('Error checking prompt status:', error);
      return false;
    }
  }, []);

  /**
   * Mark that user has been prompted for biometric setup
   */
  const markAsPrompted = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(BIOMETRIC_PROMPTED_KEY, 'true');
    } catch (error) {
      console.error('Error marking as prompted:', error);
    }
  }, []);

  /**
   * Save credentials with biometric protection
   * Prompts user if they want to enable biometric auth (if not already prompted)
   */
  const saveBiometricCredentials = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        // Check if biometric auth is available
        const isAvailable = await checkBiometricAvailability();
        if (!isAvailable) {
          return false;
        }

        // Check if user has already been prompted
        const alreadyPrompted = await hasBeenPrompted();
        if (alreadyPrompted) {
          // User has already made a choice, don't prompt again
          return false;
        }

        // Get the biometric type name for personalized message
        const biometricName = await getBiometricTypeName();

        // Prompt user to enable biometric auth
        return new Promise((resolve) => {
          Alert.alert(
            `Enable ${biometricName}?`,
            `Would you like to use ${biometricName} for faster and more secure login?`,
            [
              {
                text: 'Not Now',
                style: 'cancel',
                onPress: async () => {
                  await markAsPrompted();
                  resolve(false);
                },
              },
              {
                text: 'Enable',
                onPress: async () => {
                  try {
                    // Store credentials with biometric protection
                    await Keychain.setGenericPassword(email, password, {
                      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
                      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
                      authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
                    });

                    // Mark biometric as enabled
                    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
                    await markAsPrompted();

                    resolve(true);
                  } catch (error) {
                    console.error('Error saving biometric credentials:', error);
                    await markAsPrompted();
                    resolve(false);
                  }
                },
              },
            ],
            { cancelable: false }
          );
        });
      } catch (error) {
        console.error('Error in saveBiometricCredentials:', error);
        return false;
      }
    },
    [checkBiometricAvailability, getBiometricTypeName, hasBeenPrompted, markAsPrompted]
  );

  /**
   * Check if biometric authentication is currently enabled
   */
  const isBiometricEnabled = useCallback(async (): Promise<boolean> => {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      return false;
    }
  }, []);

  /**
   * Attempt to log in using biometric authentication
   * Returns credentials if successful, null if cancelled or failed
   */
  const loginWithBiometrics = useCallback(
    async (): Promise<BiometricCredentials | null> => {
      try {
        // Check if biometric auth is enabled
        const isEnabled = await isBiometricEnabled();
        if (!isEnabled) {
          return null;
        }

        // Get the biometric type name for personalized prompt
        const biometricName = await getBiometricTypeName();

        // Attempt to retrieve credentials with biometric authentication
        const credentials = await Keychain.getGenericPassword({
          authenticationPrompt: {
            title: `Log in with ${biometricName}`,
            subtitle: 'Authenticate to access your account',
            cancel: 'Cancel',
          },
        });

        if (credentials && credentials.username && credentials.password) {
          return {
            email: credentials.username,
            password: credentials.password,
          };
        }

        return null;
      } catch (error: any) {
        // User cancelled or authentication failed
        console.log('Biometric authentication cancelled or failed:', error);
        return null;
      }
    },
    [isBiometricEnabled, getBiometricTypeName]
  );

  /**
   * Clear stored biometric credentials and disable biometric auth
   */
  const clearBiometricCredentials = useCallback(async (): Promise<void> => {
    try {
      await Keychain.resetGenericPassword();
      await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
      console.log('Biometric credentials cleared');
    } catch (error) {
      console.error('Error clearing biometric credentials:', error);
    }
  }, []);

  /**
   * Reset the biometric prompt flag (for testing or if user wants to be asked again)
   */
  const resetPromptFlag = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(BIOMETRIC_PROMPTED_KEY);
    } catch (error) {
      console.error('Error resetting prompt flag:', error);
    }
  }, []);

  return {
    checkBiometricAvailability,
    getBiometricTypeName,
    saveBiometricCredentials,
    loginWithBiometrics,
    clearBiometricCredentials,
    isBiometricEnabled,
    isBiometricSupported,
    resetPromptFlag,
  };
};
