import React from 'react';
import { LogBox, ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { TealPineColors } from './src/theme/colors';
import AccountDisabledScreen from './src/screens/Auth/AccountDisabledScreen';
import Toast, { BaseToast } from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Suppress non-breaking development warnings for MVP
LogBox.ignoreAllLogs();

// Deep linking configuration for OAuth callbacks and password reset
const linking = {
  prefixes: ['whoknowsball://'],
  config: {
    screens: {
      MainApp: 'main',
      Login: 'login',
      Register: 'register',
      UsernameSetup: 'username-setup',
      ForgotPassword: 'forgot-password',
      PasswordReset: {
        path: 'reset-password',
        parse: {
          token: (token: string) => token,
          type: (type: string) => type,
        },
      },
    },
  },
};

// Custom toast configuration for verification banner
const toastConfig = {
  verificationToast: ({ text1, text2, props }: any) => {
    // Use urgent orange/red color when past deadline, blue when within 24 hours
    const backgroundColor = props.isPastDeadline ? '#F97316' : '#60A5FA';
    const iconName = props.isPastDeadline ? 'alert-circle' : 'email-alert';

    return (
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={0.8}
        disabled={props.disabled}
        style={{
          width: '90%',
          backgroundColor,
          borderRadius: 8,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Icon name={iconName} size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
            {text1}
          </Text>
          {text2 && (
            <Text style={{ color: '#FFFFFF', fontSize: 12, opacity: 0.9, marginTop: 4 }}>
              {text2}
            </Text>
          )}
        </View>
        {props.disabled && (
          <View style={{ marginLeft: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>
              {props.countdown}s
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  },
};

const AppContent = () => {
  const { loading, accountExpired, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: TealPineColors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={TealPineColors.primary} />
      </View>
    );
  }

  // Show AccountDisabledScreen if user is authenticated but account is expired
  if (isAuthenticated && accountExpired) {
    return <AccountDisabledScreen />;
  }

  return (
    <NavigationContainer
      linking={linking}
      onStateChange={(state) => console.log('Navigation state:', JSON.stringify(state, null, 2))}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Provider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}

export default App;
