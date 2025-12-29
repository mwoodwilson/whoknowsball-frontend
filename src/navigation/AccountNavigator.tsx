import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TealPineColors } from '../theme/colors';
import AccountScreen from '../screens/AccountScreen';
import EditProfileFieldScreen from '../screens/Account/EditProfileFieldScreen';
import EditEmailScreen from '../screens/Account/EditEmailScreen';
import ChangePasswordScreen from '../screens/Account/ChangePasswordScreen';
import { TwoFactorAuthScreen } from '../screens/Account/TwoFactorAuthScreen';
import ContactSupportScreen from '../screens/Account/ContactSupportScreen';
import DeleteAccountScreen from '../screens/Account/DeleteAccountScreen';

/**
 * Navigation parameter types for Account stack
 */
export type AccountStackParamList = {
  AccountMain: undefined;
  EditProfileField: {
    field: 'full_name' | 'phone' | 'date_of_birth';
    value: string;
    label: string;
  };
  EditEmail: undefined;
  ChangePassword: undefined;
  TwoFactorAuth: undefined;
  ContactSupport: undefined;
  DeleteAccount: undefined;
};

const Stack = createStackNavigator<AccountStackParamList>();

/**
 * AccountNavigator - Stack navigator for account-related screens
 *
 * Screens:
 * - AccountMain: Main account/settings screen
 * - EditProfileField: Generic field editor (name, phone, DOB)
 * - EditEmail: Email change screen with verification
 * - ChangePassword: Password change screen
 * - TwoFactorAuth: 2FA management screen
 * - ContactSupport: Support contact form
 * - DeleteAccount: Account deletion screen
 */
export const AccountNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: TealPineColors.background,
        },
      }}
    >
      <Stack.Screen
        name="AccountMain"
        component={AccountScreen}
        options={{
          title: 'Account',
        }}
      />
      <Stack.Screen
        name="EditProfileField"
        component={EditProfileFieldScreen}
        options={{
          title: 'Edit Profile',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="EditEmail"
        component={EditEmailScreen}
        options={{
          title: 'Change Email',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: 'Change Password',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="TwoFactorAuth"
        component={TwoFactorAuthScreen}
        options={{
          title: 'Two-Factor Authentication',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="ContactSupport"
        component={ContactSupportScreen}
        options={{
          title: 'Contact Support',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          title: 'Delete Account',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
