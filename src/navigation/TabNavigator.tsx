import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TealPineColors } from '../theme/colors';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../contexts/AuthContext';
import { useVerificationToast } from '../hooks/useVerificationToast';
import { useVerificationDeadline } from '../hooks/useVerificationDeadline';
import { VerificationRequiredModal } from '../components/VerificationRequiredModal/VerificationRequiredModal';

const Logo = require('../../assets/logo.png');

// Import screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { MyBetsScreen } from '../screens/MyBets/MyBetsScreen';
import MyBKSScreen from '../screens/MyBKS/MyBKSScreen';
import AccountScreen from '../screens/AccountScreen';
import LeaderboardScreen from '../screens/Leaderboard/LeaderboardScreen';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: TealPineColors.textPrimary,
    fontFamily: 'BebasNeue-Regular',
    letterSpacing: 1.2,
  },
  loginButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  userIconButton: {
    marginRight: 16,
    padding: 4,
  },
  userIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TealPineColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: TealPineColors.primary,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: TealPineColors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  logoutText: {
    color: '#FF6B6B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: TealPineColors.primary,
    opacity: 0.2,
    marginHorizontal: 12,
  },
});

// Header Title Component
const HeaderTitle = () => {
  return (
    <Text style={styles.headerTitle}>
      NO CASH OUT. KNOW BALL.
    </Text>
  );
};

// Header Right Component with User Icon
const HeaderRight = () => {
  const navigation = useNavigation<any>();
  const { isAuthenticated, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePress = () => {
    if (isAuthenticated) {
      // Show dropdown menu
      setMenuVisible(true);
    } else {
      // Navigate to Login screen
      navigation.navigate('Login');
    }
  };

  const handleMenuItemPress = (action: 'profile' | 'settings' | 'logout') => {
    setMenuVisible(false);

    switch (action) {
      case 'profile':
        navigation.navigate('Account');
        break;
      case 'settings':
        navigation.navigate('Account');
        break;
      case 'logout':
        Alert.alert(
          'Log Out',
          'Are you sure you want to log out?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Log Out',
              style: 'destructive',
              onPress: () => {
                signOut();
                navigation.navigate('Home');
              },
            },
          ],
          { cancelable: true }
        );
        break;
    }
  };

  if (!isAuthenticated) {
    // Show "Log In" button for unauthenticated users
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={styles.loginButton}
        activeOpacity={0.7}
      >
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    );
  }

  // Show account icon with dropdown menu for authenticated users
  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.userIconButton}
        activeOpacity={0.7}
      >
        <View style={styles.userIconCircle}>
          <Icon name="account" size={20} color={TealPineColors.textPrimary} />
        </View>
      </TouchableOpacity>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('profile')}
              activeOpacity={0.7}
            >
              <Icon name="account-circle" size={20} color={TealPineColors.textPrimary} />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('settings')}
              activeOpacity={0.7}
            >
              <Icon name="cog" size={20} color={TealPineColors.textPrimary} />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('logout')}
              activeOpacity={0.7}
            >
              <Icon name="logout" size={20} color="#FF6B6B" />
              <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export const TabNavigator = () => {
  // Show verification toast for unverified users
  useVerificationToast();

  // Get authentication and verification status
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const { isPastDeadline, isUnverified } = useVerificationDeadline();

  // State for modals
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: TealPineColors.background,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: TealPineColors.primary,
          tabBarInactiveTintColor: TealPineColors.textSecondary,
          headerStyle: {
            backgroundColor: TealPineColors.background,
          },
          headerTintColor: TealPineColors.textPrimary,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Image
              source={Logo}
              style={{
                width: 32,
                height: 32,
                marginLeft: 16,
                resizeMode: 'contain',
              }}
            />
          ),
          headerRight: () => <HeaderRight />,
        }}
        screenListeners={({ navigation }) => ({
          tabPress: (e) => {
            // Get the target tab name from the route
            const targetRoute = e.target?.split('-')[0];

            // Handle restricted tabs (Leaderboard, MyBKS, Account)
            // MyBets tab now handles its own access logic in-screen
            // Only restrict other tabs if past deadline and unverified
            if (isPastDeadline && !isEmailVerified &&
                targetRoute !== 'Home' && targetRoute !== 'MyBets') {
              // Prevent navigation
              e.preventDefault();

              // Show verification modal
              setShowVerificationModal(true);
            }
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="home" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="MyBets"
          component={MyBetsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="receipt" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="trophy-outline" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="MyBKS"
          component={MyBKSScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="brain" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>

      {/* Verification Required Modal - For unverified users past 24hr deadline */}
      <VerificationRequiredModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </>
  );
};
