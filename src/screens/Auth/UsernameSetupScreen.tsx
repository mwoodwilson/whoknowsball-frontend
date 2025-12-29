import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TealPineColors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useUsernameValidation } from '../../hooks/useUsernameValidation';
import { supabase } from '../../services/auth/SupabaseAuthService';

const Logo = require('../../../assets/logo.png');

interface UsernameSetupScreenProps {
  navigation: any;
}

export const UsernameSetupScreen: React.FC<UsernameSetupScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Username validation
  const { isValid: isUsernameValid, error: usernameError, isChecking } = useUsernameValidation(username);

  const handleSaveUsername = async () => {
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!isUsernameValid) {
      setError(usernameError || 'Please enter a valid username');
      return;
    }

    if (!user) {
      setError('No user session found');
      return;
    }

    try {
      setLoading(true);

      // Update user metadata with username
      const { error: updateError } = await supabase.auth.updateUser({
        data: { username },
      });

      if (updateError) {
        throw updateError;
      }

      // Insert username into users table (handle_new_user trigger should have created the row)
      const { error: dbError } = await supabase
        .from('users')
        .update({ username })
        .eq('id', user.id);

      if (dbError) {
        throw dbError;
      }

      // Navigate to main app
      navigation.replace('Main');
    } catch (err: any) {
      setError(err.message || 'Failed to save username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={Logo} style={styles.logo} />
              <Text style={styles.title}>Choose Your Username</Text>
              <Text style={styles.subtitle}>This will be your unique identity</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="account-outline" size={20} color={TealPineColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a unique username"
                    placeholderTextColor={TealPineColors.textSecondary}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={20}
                    editable={!loading}
                    autoFocus
                  />
                  {isChecking && (
                    <ActivityIndicator size="small" color={TealPineColors.primary} style={styles.usernameIndicator} />
                  )}
                  {!isChecking && isUsernameValid && username.length >= 3 && (
                    <Icon name="check-circle" size={20} color="#4CAF50" style={styles.usernameIndicator} />
                  )}
                </View>
                {/* Username validation feedback */}
                {usernameError ? (
                  <Text style={styles.errorHelpText}>{usernameError}</Text>
                ) : isChecking ? (
                  <Text style={styles.checkingText}>Checking availability...</Text>
                ) : (
                  <Text style={styles.helpText}>3-20 characters, letters and numbers only</Text>
                )}
              </View>

              {/* Error Message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle-outline" size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Save Button */}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (loading || !isUsernameValid || username.length === 0) && styles.saveButtonDisabled
                ]}
                onPress={handleSaveUsername}
                disabled={loading || !isUsernameValid || username.length === 0}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Continue</Text>
                )}
              </TouchableOpacity>

              {/* Info text */}
              <Text style={styles.infoText}>
                You can't change your username later, so choose carefully!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TealPineColors.textPrimary,
    height: '100%',
  },
  usernameIndicator: {
    position: 'absolute',
    right: 16,
  },
  helpText: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    marginTop: 6,
    marginLeft: 4,
  },
  errorHelpText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 6,
    marginLeft: 4,
  },
  checkingText: {
    fontSize: 12,
    color: TealPineColors.primary,
    marginTop: 6,
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 8,
    flex: 1,
  },
  saveButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 13,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default UsernameSetupScreen;
