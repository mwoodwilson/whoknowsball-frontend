import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TealPineColors, borderRadius } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';

// Import reusable components from Task 0
import { SettingsSection } from '../components/Account/SettingsSection';
import { SettingsRow } from '../components/Account/SettingsRow';
import { SettingsToggleRow } from '../components/Account/SettingsToggleRow';
import { SettingsDropdownRow } from '../components/Account/SettingsDropdownRow';

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * AccountScreen - User profile and settings screen
 *
 * Displays user profile information, security settings, app preferences,
 * help resources, and account management options.
 *
 * Features:
 * - User profile details (name, email, phone, DOB)
 * - Security settings (password, 2FA)
 * - App preferences (notifications, theme, language)
 * - Help & Support links
 * - Account management (sign out, delete account)
 *
 * Navigation: Connected to bottom tab navigator (Task 10)
 */
const AccountScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<AccountScreenNavigationProp>();

  // Local state for toggles (placeholder values - will connect to backend/storage later)
  // 2FA state removed for MVP - re-enable when backend email is configured
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false); // Disabled by default - Coming Soon

  // Get user metadata from Supabase user object
  const username = user?.user_metadata?.username || 'User';
  const email = user?.email || 'Not set';
  const fullName = user?.user_metadata?.full_name || '';
  const phone = user?.user_metadata?.phone || 'Not set';
  const dateOfBirth = user?.user_metadata?.date_of_birth || 'Not set';

  // Display name for header - show full name if set, otherwise placeholder
  const displayName = fullName.trim() ? fullName : 'Firstname Lastname';

  // Navigation handlers for account screens
  const handleEditFullName = () => {
    navigation.navigate('EditProfileField', {
      field: 'full_name',
      value: fullName.trim() || '',
      label: 'Full Name',
    });
  };

  const handleEditEmail = () => {
    navigation.navigate('EditEmail');
  };

  const handleEditPhone = () => {
    navigation.navigate('EditProfileField', {
      field: 'phone',
      value: phone,
      label: 'Phone',
    });
  };

  const handleEditDateOfBirth = () => {
    navigation.navigate('EditProfileField', {
      field: 'date_of_birth',
      value: dateOfBirth,
      label: 'Date of Birth',
    });
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  // 2FA handler removed for MVP - re-enable when backend email is configured

  const handleTogglePushNotifications = (_value: boolean) => {
    // Push notifications not implemented yet - show coming soon message
    Alert.alert(
      'Coming Soon',
      'Push notifications will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleContactSupport = () => {
    navigation.navigate('ContactSupport');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              console.log('[Account] User signed out successfully');
            } catch (error) {
              console.error('[Account] Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    navigation.navigate('DeleteAccount');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color={TealPineColors.primary} />
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Profile Section */}
        <SettingsSection
          title="Profile"
          icon={<Ionicons name="person-outline" size={20} color={TealPineColors.primary} />}
        >
          <SettingsRow
            icon={<Ionicons name="person-outline" size={20} color={TealPineColors.primary} />}
            label="Full Name"
            description={fullName.trim() || 'Not set'}
            onPress={handleEditFullName}
          />
          <SettingsRow
            icon={<Ionicons name="mail-outline" size={20} color={TealPineColors.primary} />}
            label="Email"
            description={email}
            onPress={handleEditEmail}
          />
          <SettingsRow
            icon={<Ionicons name="call-outline" size={20} color={TealPineColors.primary} />}
            label="Phone"
            description={phone}
            onPress={handleEditPhone}
          />
          <SettingsRow
            icon={<Ionicons name="calendar-outline" size={20} color={TealPineColors.primary} />}
            label="Date of Birth"
            description={dateOfBirth}
            onPress={handleEditDateOfBirth}
          />
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection
          title="Security"
          icon={<Ionicons name="shield-checkmark-outline" size={20} color={TealPineColors.primary} />}
        >
          <SettingsRow
            icon={<Ionicons name="lock-closed-outline" size={20} color={TealPineColors.primary} />}
            label="Change Password"
            onPress={handleChangePassword}
          />
          {/* 2FA hidden for MVP - enable when backend email sending is configured */}
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection
          title="Preferences"
          icon={<Ionicons name="settings-outline" size={20} color={TealPineColors.primary} />}
        >
          <SettingsToggleRow
            icon={<Ionicons name="notifications-outline" size={20} color={TealPineColors.textSecondary} />}
            label="Push Notifications"
            description="Coming Soon"
            value={pushNotificationsEnabled}
            onValueChange={handleTogglePushNotifications}
          />
          <SettingsDropdownRow
            icon={<Ionicons name="color-palette-outline" size={20} color={TealPineColors.textSecondary} />}
            label="Theme"
            options={[{ label: 'Dark', value: 'dark' }]}
            selectedValue="dark"
            onValueChange={() => {}}
            disabled
          />
          <SettingsDropdownRow
            icon={<Ionicons name="language-outline" size={20} color={TealPineColors.textSecondary} />}
            label="Language"
            options={[{ label: 'English', value: 'en' }]}
            selectedValue="en"
            onValueChange={() => {}}
            disabled
          />
        </SettingsSection>

        {/* Help & Support Section */}
        <SettingsSection
          title="Help & Support"
          icon={<Ionicons name="help-circle-outline" size={20} color={TealPineColors.primary} />}
        >
          <SettingsRow
            icon={<Ionicons name="chatbubble-outline" size={20} color={TealPineColors.primary} />}
            label="Contact Support"
            onPress={handleContactSupport}
          />
          <SettingsRow
            icon={<Ionicons name="shield-outline" size={20} color={TealPineColors.primary} />}
            label="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsRow
            icon={<Ionicons name="document-text-outline" size={20} color={TealPineColors.primary} />}
            label="Terms of Service"
            onPress={handleTermsOfService}
          />
        </SettingsSection>

        {/* Account Management Section */}
        <SettingsSection
          title="Account"
          icon={<Ionicons name="warning-outline" size={20} color={TealPineColors.loss} />}
        >
          <SettingsRow
            icon={<Ionicons name="log-out-outline" size={20} color={TealPineColors.loss} />}
            label="Sign Out"
            onPress={handleSignOut}
            danger
            showChevron={false}
          />
          <SettingsRow
            icon={<Ionicons name="trash-outline" size={20} color={TealPineColors.loss} />}
            label="Delete Account"
            onPress={handleDeleteAccount}
            danger
            showChevron={false}
          />
        </SettingsSection>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: TealPineColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: TealPineColors.primary,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
  versionText: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});

export default AccountScreen;
