import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TealPineColors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ContactSupportScreenProps {
  navigation: any;
}

const SUBJECT_OPTIONS = [
  { label: 'Bug Report', value: 'Bug Report' },
  { label: 'Feature Request', value: 'Feature Request' },
  { label: 'Account Issue', value: 'Account Issue' },
  { label: 'General Question', value: 'General Question' },
  { label: 'Other', value: 'Other' },
];

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 2000;
const SUPPORT_EMAIL = 'bkshelpteam@gmail.com';

export const ContactSupportScreen: React.FC<ContactSupportScreenProps> = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const handleSubmit = () => {
    setError('');

    // Validate subject
    if (!subject) {
      setError('Please select a subject');
      return;
    }

    // Validate message length
    if (message.trim().length < MIN_MESSAGE_LENGTH) {
      setError(`Message must be at least ${MIN_MESSAGE_LENGTH} characters`);
      return;
    }

    if (message.trim().length > MAX_MESSAGE_LENGTH) {
      setError(`Message must not exceed ${MAX_MESSAGE_LENGTH} characters`);
      return;
    }

    // Build mailto URL
    const emailSubject = encodeURIComponent(`[WhoKnowsBall] ${subject}`);
    const emailBody = encodeURIComponent(message.trim());
    const mailtoURL = `mailto:${SUPPORT_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

    Linking.openURL(mailtoURL).catch(() => {
      Alert.alert(
        'No Email App',
        `Please email us directly at ${SUPPORT_EMAIL}`,
        [{ text: 'OK' }]
      );
    });
  };

  const getSelectedSubjectLabel = () => {
    const selected = SUBJECT_OPTIONS.find(opt => opt.value === subject);
    return selected?.label || 'Select a subject';
  };

  const characterCount = message.length;
  const isMessageValid = characterCount >= MIN_MESSAGE_LENGTH && characterCount <= MAX_MESSAGE_LENGTH;
  const canSubmit = subject && isMessageValid;

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
          <Text style={styles.headerTitle}>Contact Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Icon name="email-outline" size={20} color={TealPineColors.info} />
            <Text style={styles.infoBannerText}>
              This will open your email app to send us a message
            </Text>
          </View>

          {/* Subject Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSubjectPicker(!showSubjectPicker)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.pickerButtonText,
                !subject && styles.pickerButtonTextPlaceholder
              ]}>
                {getSelectedSubjectLabel()}
              </Text>
              <Icon
                name={showSubjectPicker ? "chevron-up" : "chevron-down"}
                size={24}
                color={TealPineColors.textSecondary}
              />
            </TouchableOpacity>

            {/* Subject Options */}
            {showSubjectPicker && (
              <View style={styles.pickerOptions}>
                {SUBJECT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.pickerOption,
                      subject === option.value && styles.pickerOptionSelected
                    ]}
                    onPress={() => {
                      setSubject(option.value);
                      setShowSubjectPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      subject === option.value && styles.pickerOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {subject === option.value && (
                      <Icon name="check" size={20} color={TealPineColors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Message Textarea */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Message *</Text>
              <Text style={[
                styles.characterCounter,
                characterCount > MAX_MESSAGE_LENGTH && styles.characterCounterError,
                isMessageValid && characterCount > 0 && styles.characterCounterValid
              ]}>
                {characterCount}/{MAX_MESSAGE_LENGTH}
              </Text>
            </View>
            <TextInput
              style={styles.textarea}
              placeholder={`Describe your issue or question (min ${MIN_MESSAGE_LENGTH} characters)`}
              placeholderTextColor={TealPineColors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={8}
              maxLength={MAX_MESSAGE_LENGTH}
              textAlignVertical="top"
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={16} color={TealPineColors.loss} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Open Email</Text>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${TealPineColors.info}20`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  infoBannerText: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  pickerButtonText: {
    fontSize: 16,
    color: TealPineColors.textPrimary,
  },
  pickerButtonTextPlaceholder: {
    color: TealPineColors.textSecondary,
  },
  pickerOptions: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: TealPineColors.border,
  },
  pickerOptionSelected: {
    backgroundColor: `${TealPineColors.primary}15`,
  },
  pickerOptionText: {
    fontSize: 16,
    color: TealPineColors.textPrimary,
  },
  pickerOptionTextSelected: {
    color: TealPineColors.primary,
    fontWeight: '600',
  },
  textarea: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: TealPineColors.textPrimary,
    minHeight: 160,
  },
  characterCounter: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
  },
  characterCounterValid: {
    color: TealPineColors.primary,
  },
  characterCounterError: {
    color: TealPineColors.loss,
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
  submitButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ContactSupportScreen;
