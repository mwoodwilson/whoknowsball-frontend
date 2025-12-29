import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { UsernameSetupScreen } from '../screens/Auth/UsernameSetupScreen';
import { ForgotPasswordScreen } from '../screens/Auth/ForgotPasswordScreen';
import { PasswordResetScreen } from '../screens/Auth/PasswordResetScreen';
import { TermsOfServiceScreen } from '../screens/Legal/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from '../screens/Legal/PrivacyPolicyScreen';
import EditProfileFieldScreen from '../screens/Account/EditProfileFieldScreen';
import EditEmailScreen from '../screens/Account/EditEmailScreen';
import ChangePasswordScreen from '../screens/Account/ChangePasswordScreen';
import { TwoFactorAuthScreen } from '../screens/Account/TwoFactorAuthScreen';
import ContactSupportScreen from '../screens/Account/ContactSupportScreen';
import DeleteAccountScreen from '../screens/Account/DeleteAccountScreen';

export type RootStackParamList = {
  MainApp: undefined;
  Login: undefined;
  Register: undefined;
  UsernameSetup: undefined;
  ForgotPassword: undefined;
  PasswordReset: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
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

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  // TODO: Add auth state check here
  // For now, start with MainApp (tabs) - users can access Login from MyBets/Account tabs
  const isAuthenticated = false;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main app with tabs - accessible without auth */}
      <Stack.Screen name="MainApp" component={TabNavigator} />

      {/* Auth screens - modal style with swipe to dismiss */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="UsernameSetup"
        component={UsernameSetupScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: false, // Prevent dismissal - user must complete username setup
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: false, // Prevent dismissal - user must complete password reset
          headerShown: false,
        }}
      />

      {/* Legal screens - modal style with swipe to dismiss */}
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />

      {/* Account screens - modal style with swipe to dismiss */}
      <Stack.Screen
        name="EditProfileField"
        component={EditProfileFieldScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="EditEmail"
        component={EditEmailScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="TwoFactorAuth"
        component={TwoFactorAuthScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="ContactSupport"
        component={ContactSupportScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
    </Stack.Navigator>
  );
};
