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
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TealPineColors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackendAPIService from '../../services/api/BackendAPIService';
import { useAuth } from '../../contexts/AuthContext';

interface DeleteAccountScreenProps {
  navigation: any;
}

const CONFIRMATION_TEXT = 'DELETE';

export const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth();
  const [confirmationInput, setConfirmationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isConfirmationValid = confirmationInput === CONFIRMATION_TEXT;

  const handleDeleteAccount = async () => {
    setError('');

    if (!isConfirmationValid) {
      setError('Please type DELETE to confirm');
      return;
    }

    // Double confirmation alert
    Alert.alert(
      'Are You Absolutely Sure?',
      'This action cannot be undone. Your account will be permanently deleted and all data anonymized.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              await BackendAPIService.deleteAccount({
                confirmation: CONFIRMATION_TEXT,
              });

              // Sign out and navigate to login
              await signOut();

              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (err: any) {
              console.error('Delete account error:', err);
              setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color={TealPineColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delete Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Warning Banner */}
          <View style={styles.warningBanner}>
            <Icon name="alert-circle" size={48} color={TealPineColors.loss} />
            <Text style={styles.warningTitle}>Warning: Permanent Action</Text>
            <Text style={styles.warningText}>
              Deleting your account is permanent and cannot be undone.
            </Text>
          </View>

          {/* Consequences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What happens when you delete your account:</Text>

            <View style={styles.consequencesList}>
              <View style={styles.consequenceItem}>
                <Icon name="account-remove" size={24} color={TealPineColors.loss} />
                <View style={styles.consequenceTextContainer}>
                  <Text style={styles.consequenceTitle}>Profile Anonymized</Text>
                  <Text style={styles.consequenceText}>
                    Your username, email, and personal information will be permanently removed
                  </Text>
                </View>
              </View>

              <View style={styles.consequenceItem}>
                <Icon name="lock-off" size={24} color={TealPineColors.loss} />
                <View style={styles.consequenceTextContainer}>
                  <Text style={styles.consequenceTitle}>Cannot Recover Account</Text>
                  <Text style={styles.consequenceText}>
                    This action is irreversible. You cannot restore your account or data
                  </Text>
                </View>
              </View>

              <View style={styles.consequenceItem}>
                <Icon name="history" size={24} color={TealPineColors.warning} />
                <View style={styles.consequenceTextContainer}>
                  <Text style={styles.consequenceTitle}>Betting History Preserved</Text>
                  <Text style={styles.consequenceText}>
                    Your bets remain in the system (anonymized) for statistical purposes
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Confirmation Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type DELETE to confirm:</Text>
            <View style={styles.confirmationInputContainer}>
              <TextInput
                style={styles.confirmationInput}
                placeholder="Type DELETE"
                placeholderTextColor={TealPineColors.textSecondary}
                value={confirmationInput}
                onChangeText={setConfirmationInput}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!loading}
                autoFocus
              />
              {isConfirmationValid && (
                <Icon name="check-circle" size={24} color={TealPineColors.primary} style={styles.checkIcon} />
              )}
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={16} color={TealPineColors.loss} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Delete Button */}
          <TouchableOpacity
            style={[
              styles.deleteButton,
              !isConfirmationValid && styles.deleteButtonDisabled
            ]}
            onPress={handleDeleteAccount}
            disabled={!isConfirmationValid || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="delete-forever" size={24} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Delete Account Forever</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: TealPineColors.background,
    borderBottomWidth: 1,
    borderBottomColor: TealPineColors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  warningBanner: {
    alignItems: 'center',
    backgroundColor: `${TealPineColors.loss}15`,
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: `${TealPineColors.loss}40`,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TealPineColors.loss,
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 16,
  },
  consequencesList: {
    gap: 16,
  },
  consequenceItem: {
    flexDirection: 'row',
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    padding: 16,
  },
  consequenceTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  consequenceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 4,
  },
  consequenceText: {
    fontSize: 13,
    color: TealPineColors.textSecondary,
    lineHeight: 18,
  },
  confirmationInputContainer: {
    position: 'relative',
  },
  confirmationInput: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
    borderWidth: 2,
    borderColor: TealPineColors.border,
  },
  checkIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${TealPineColors.loss}20`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: TealPineColors.loss,
    marginLeft: 8,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: TealPineColors.loss,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
  },
});

export default DeleteAccountScreen;
