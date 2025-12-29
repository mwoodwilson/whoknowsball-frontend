import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TealPineColors } from '../../theme/colors';

// Simple Google "G" logo using SVG-style rendering with basic shapes and colors
const GoogleLogo: React.FC = () => (
  <View style={styles.googleLogoWrapper}>
    <View style={styles.googleG}>
      <Text style={styles.googleGText}>G</Text>
    </View>
  </View>
);

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  disabled?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onApplePress,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google Sign-In Button */}
      <TouchableOpacity
        style={[styles.socialButton, styles.googleButton, disabled && styles.buttonDisabled]}
        onPress={onGooglePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <GoogleLogo />
        <Text style={[styles.buttonText, styles.googleButtonText]}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Apple Sign-In Button */}
      <TouchableOpacity
        style={[styles.socialButton, styles.appleButton, disabled && styles.buttonDisabled]}
        onPress={onApplePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Icon name="apple" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={[styles.buttonText, styles.appleButtonText]}>Continue with Apple</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: TealPineColors.textSecondary + '30',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: TealPineColors.textSecondary,
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleLogoWrapper: {
    marginRight: 12,
  },
  googleG: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  googleGText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  googleButtonText: {
    color: '#1F1F1F',
  },
  appleButtonText: {
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
