import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TealPineColors } from '../../theme/colors';

interface PrivacyPolicyScreenProps {
  navigation: any;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:bkshelpteam@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={TealPineColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: December 2025</Text>
        <Text style={styles.effectiveDate}>Effective Date: December 2025</Text>

        <Text style={styles.intro}>
          WhoKnowsBall, LLC ("WhoKnowsBall," "Company," "we," "us," or "our") is committed to protecting your privacy and ensuring you understand how your personal information is collected, used, and shared. This Privacy Policy describes our practices regarding information collected through our mobile application WhoKnowsBall (the "App") and any related services, features, or content we offer (collectively, the "Services").
        </Text>

        <Text style={styles.intro}>
          By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
        </Text>

        {/* Section 1 */}
        <Text style={styles.sectionTitle}>1. INFORMATION WE COLLECT</Text>
        <Text style={styles.paragraph}>
          We collect information in several ways: directly from you, automatically when you use our Services, and from third-party sources. The types of information we collect include:
        </Text>

        <Text style={styles.subsectionTitle}>1.1 Information You Provide Directly</Text>

        <Text style={styles.subsubsectionTitle}>Account Registration Information</Text>
        <Text style={styles.bulletPoint}>• Email address</Text>
        <Text style={styles.bulletPoint}>• Username</Text>
        <Text style={styles.bulletPoint}>• Password (stored in encrypted form)</Text>
        <Text style={styles.bulletPoint}>• Full name (optional)</Text>
        <Text style={styles.bulletPoint}>• Phone number (optional)</Text>
        <Text style={styles.bulletPoint}>• Date of birth (for age verification)</Text>
        <Text style={styles.bulletPoint}>• Profile picture (optional)</Text>

        <Text style={styles.subsubsectionTitle}>Communications</Text>
        <Text style={styles.bulletPoint}>• Customer support inquiries and correspondence</Text>
        <Text style={styles.bulletPoint}>• Feedback and survey responses</Text>
        <Text style={styles.bulletPoint}>• Any other information you choose to provide</Text>

        <Text style={styles.subsubsectionTitle}>User-Generated Content</Text>
        <Text style={styles.bulletPoint}>• Sports predictions and selections</Text>
        <Text style={styles.bulletPoint}>• Betting history and patterns</Text>
        <Text style={styles.bulletPoint}>• BKS (Ball Knowing Score) data and statistics</Text>
        <Text style={styles.bulletPoint}>• Leaderboard rankings and achievements</Text>

        <Text style={styles.subsectionTitle}>1.2 Information Collected Automatically</Text>
        <Text style={styles.paragraph}>
          When you access or use our Services, we automatically collect certain information, including:
        </Text>

        <Text style={styles.subsubsectionTitle}>Device Information</Text>
        <Text style={styles.bulletPoint}>• Device type, model, and manufacturer</Text>
        <Text style={styles.bulletPoint}>• Operating system and version</Text>
        <Text style={styles.bulletPoint}>• Unique device identifiers (IDFA, IDFV, Android ID)</Text>
        <Text style={styles.bulletPoint}>• Mobile network information</Text>
        <Text style={styles.bulletPoint}>• Screen resolution and device settings</Text>

        <Text style={styles.subsubsectionTitle}>Usage Information</Text>
        <Text style={styles.bulletPoint}>• App features accessed and interactions</Text>
        <Text style={styles.bulletPoint}>• Time and duration of sessions</Text>
        <Text style={styles.bulletPoint}>• Pages and screens viewed</Text>
        <Text style={styles.bulletPoint}>• Actions taken within the App</Text>
        <Text style={styles.bulletPoint}>• Referring and exit pages</Text>

        <Text style={styles.subsubsectionTitle}>Location Information</Text>
        <Text style={styles.bulletPoint}>• General location based on IP address</Text>
        <Text style={styles.bulletPoint}>• State/region for compliance purposes</Text>
        <Text style={styles.paragraph}>
          Note: We do not collect precise GPS location data.
        </Text>

        <Text style={styles.subsubsectionTitle}>Log and Performance Data</Text>
        <Text style={styles.bulletPoint}>• IP address</Text>
        <Text style={styles.bulletPoint}>• Browser type and version (if applicable)</Text>
        <Text style={styles.bulletPoint}>• Error logs and crash reports</Text>
        <Text style={styles.bulletPoint}>• Performance metrics and diagnostics</Text>
        <Text style={styles.bulletPoint}>• Date and time stamps of access</Text>

        <Text style={styles.subsectionTitle}>1.3 Information from Third-Party Sources</Text>

        <Text style={styles.subsubsectionTitle}>Social Login Providers</Text>
        <Text style={styles.paragraph}>
          If you choose to register or log in using Google or Apple Sign-In, we may receive:
        </Text>
        <Text style={styles.bulletPoint}>• Name and email address</Text>
        <Text style={styles.bulletPoint}>• Profile picture</Text>
        <Text style={styles.bulletPoint}>• Unique identifier from the provider</Text>
        <Text style={styles.paragraph}>
          The specific information shared depends on your privacy settings with those providers.
        </Text>

        <Text style={styles.subsubsectionTitle}>Analytics and Advertising Partners</Text>
        <Text style={styles.paragraph}>
          We may receive aggregated or de-identified information from analytics providers about how users interact with our Services.
        </Text>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>2. HOW WE USE YOUR INFORMATION</Text>
        <Text style={styles.paragraph}>
          We use the information we collect for the following purposes:
        </Text>

        <Text style={styles.subsectionTitle}>2.1 To Provide and Maintain Our Services</Text>
        <Text style={styles.bulletPoint}>• Create and manage your account</Text>
        <Text style={styles.bulletPoint}>• Process and track your sports predictions</Text>
        <Text style={styles.bulletPoint}>• Calculate and display your BKS score</Text>
        <Text style={styles.bulletPoint}>• Maintain leaderboards and rankings</Text>
        <Text style={styles.bulletPoint}>• Provide customer support and respond to inquiries</Text>
        <Text style={styles.bulletPoint}>• Send transactional communications (e.g., account verification, password resets)</Text>

        <Text style={styles.subsectionTitle}>2.2 To Improve and Develop Our Services</Text>
        <Text style={styles.bulletPoint}>• Analyze usage patterns and trends</Text>
        <Text style={styles.bulletPoint}>• Conduct research and development</Text>
        <Text style={styles.bulletPoint}>• Test and develop new features</Text>
        <Text style={styles.bulletPoint}>• Personalize your experience</Text>
        <Text style={styles.bulletPoint}>• Optimize App performance and user interface</Text>

        <Text style={styles.subsectionTitle}>2.3 To Communicate With You</Text>
        <Text style={styles.bulletPoint}>• Send important notices about the Services</Text>
        <Text style={styles.bulletPoint}>• Notify you of changes to our policies</Text>
        <Text style={styles.bulletPoint}>• Provide updates about your account and activity</Text>
        <Text style={styles.bulletPoint}>• Send promotional communications (with your consent)</Text>

        <Text style={styles.subsectionTitle}>2.4 To Ensure Safety and Security</Text>
        <Text style={styles.bulletPoint}>• Verify user identity and age</Text>
        <Text style={styles.bulletPoint}>• Detect, prevent, and address fraud and abuse</Text>
        <Text style={styles.bulletPoint}>• Monitor for violations of our Terms of Service</Text>
        <Text style={styles.bulletPoint}>• Protect the rights, property, and safety of our users and the public</Text>
        <Text style={styles.bulletPoint}>• Enforce our legal rights and remedies</Text>

        <Text style={styles.subsectionTitle}>2.5 To Comply With Legal Obligations</Text>
        <Text style={styles.bulletPoint}>• Respond to legal requests and court orders</Text>
        <Text style={styles.bulletPoint}>• Comply with applicable laws and regulations</Text>
        <Text style={styles.bulletPoint}>• Cooperate with law enforcement when required</Text>
        <Text style={styles.bulletPoint}>• Establish, exercise, or defend legal claims</Text>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>3. HOW WE SHARE YOUR INFORMATION</Text>
        <Text style={styles.paragraph}>
          We do NOT sell your personal information to third parties. We may share your information only in the following circumstances:
        </Text>

        <Text style={styles.subsectionTitle}>3.1 Service Providers</Text>
        <Text style={styles.paragraph}>
          We engage trusted third-party companies and individuals to perform services on our behalf, including:
        </Text>
        <Text style={styles.bulletPoint}>• Cloud hosting and infrastructure (Supabase)</Text>
        <Text style={styles.bulletPoint}>• Authentication services (Google, Apple)</Text>
        <Text style={styles.bulletPoint}>• Analytics and performance monitoring</Text>
        <Text style={styles.bulletPoint}>• Customer support tools</Text>
        <Text style={styles.bulletPoint}>• Email delivery services</Text>
        <Text style={styles.paragraph}>
          These providers have access to your information only to perform specific tasks on our behalf and are contractually obligated to protect your information and use it only for the purposes for which it was disclosed.
        </Text>

        <Text style={styles.subsectionTitle}>3.2 Legal Requirements and Protection</Text>
        <Text style={styles.paragraph}>
          We may disclose your information if required to do so by law or in the good faith belief that such disclosure is necessary to:
        </Text>
        <Text style={styles.bulletPoint}>• Comply with a legal obligation, subpoena, or court order</Text>
        <Text style={styles.bulletPoint}>• Protect and defend our rights or property</Text>
        <Text style={styles.bulletPoint}>• Prevent or investigate possible wrongdoing</Text>
        <Text style={styles.bulletPoint}>• Protect the personal safety of users or the public</Text>
        <Text style={styles.bulletPoint}>• Protect against legal liability</Text>

        <Text style={styles.subsectionTitle}>3.3 Business Transfers</Text>
        <Text style={styles.paragraph}>
          If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of company assets, your information may be transferred as part of that transaction. We will notify you via email and/or prominent notice in the App of any change in ownership or uses of your personal information.
        </Text>

        <Text style={styles.subsectionTitle}>3.4 With Your Consent</Text>
        <Text style={styles.paragraph}>
          We may share your information with third parties when you have given us your explicit consent to do so.
        </Text>

        <Text style={styles.subsectionTitle}>3.5 Aggregated or De-Identified Information</Text>
        <Text style={styles.paragraph}>
          We may share aggregated or de-identified information that cannot reasonably be used to identify you for research, marketing, analytics, and other purposes.
        </Text>

        <Text style={styles.subsectionTitle}>3.6 Public Information</Text>
        <Text style={styles.paragraph}>
          Certain information is publicly visible to other users:
        </Text>
        <Text style={styles.bulletPoint}>• Username</Text>
        <Text style={styles.bulletPoint}>• BKS score and ranking</Text>
        <Text style={styles.bulletPoint}>• Leaderboard position</Text>
        <Text style={styles.bulletPoint}>• Public profile information you choose to share</Text>

        {/* Section 4 */}
        <Text style={styles.sectionTitle}>4. DATA SECURITY</Text>
        <Text style={styles.paragraph}>
          We implement appropriate technical and organizational security measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </Text>

        <Text style={styles.subsectionTitle}>Technical Safeguards</Text>
        <Text style={styles.bulletPoint}>• Encryption of data in transit using TLS/SSL</Text>
        <Text style={styles.bulletPoint}>• Encryption of data at rest</Text>
        <Text style={styles.bulletPoint}>• Secure password hashing using industry-standard algorithms</Text>
        <Text style={styles.bulletPoint}>• Regular security assessments and vulnerability testing</Text>
        <Text style={styles.bulletPoint}>• Firewalls and intrusion detection systems</Text>

        <Text style={styles.subsectionTitle}>Organizational Safeguards</Text>
        <Text style={styles.bulletPoint}>• Access controls limiting employee access to personal data</Text>
        <Text style={styles.bulletPoint}>• Employee training on data protection and security</Text>
        <Text style={styles.bulletPoint}>• Incident response procedures</Text>
        <Text style={styles.bulletPoint}>• Regular review of security practices</Text>

        <Text style={styles.paragraph}>
          Despite our efforts, no security measures are perfect or impenetrable. We cannot guarantee the absolute security of your information. In the event of a data breach that affects your personal information, we will notify you in accordance with applicable law.
        </Text>

        {/* Section 5 */}
        <Text style={styles.sectionTitle}>5. DATA RETENTION</Text>
        <Text style={styles.paragraph}>
          We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements.
        </Text>

        <Text style={styles.subsectionTitle}>Retention Periods</Text>
        <Text style={styles.bulletPoint}>• Active account data: Retained while your account is active</Text>
        <Text style={styles.bulletPoint}>• Deleted account data: Deleted or anonymized within 30 days of account deletion</Text>
        <Text style={styles.bulletPoint}>• Transaction and prediction history: Retained for up to 7 years for legal and tax purposes</Text>
        <Text style={styles.bulletPoint}>• Communications and support records: Retained for 3 years</Text>
        <Text style={styles.bulletPoint}>• Log and analytics data: Retained for up to 2 years</Text>

        <Text style={styles.paragraph}>
          We may retain certain information for longer periods when required by law or when necessary to establish, exercise, or defend legal claims.
        </Text>

        {/* Section 6 */}
        <Text style={styles.sectionTitle}>6. YOUR PRIVACY RIGHTS AND CHOICES</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you may have certain rights regarding your personal information. We are committed to honoring these rights regardless of your location.
        </Text>

        <Text style={styles.subsectionTitle}>6.1 Access and Portability</Text>
        <Text style={styles.paragraph}>
          You have the right to request access to the personal information we hold about you and to receive a copy of your data in a structured, commonly used, and machine-readable format.
        </Text>

        <Text style={styles.subsectionTitle}>6.2 Correction</Text>
        <Text style={styles.paragraph}>
          You have the right to request correction of inaccurate or incomplete personal information. You can update most account information directly through the App settings.
        </Text>

        <Text style={styles.subsectionTitle}>6.3 Deletion</Text>
        <Text style={styles.paragraph}>
          You have the right to request deletion of your personal information. You can delete your account through the App settings, or by contacting us. Note that we may retain certain information as required by law or for legitimate business purposes.
        </Text>

        <Text style={styles.subsectionTitle}>6.4 Opt-Out of Marketing</Text>
        <Text style={styles.paragraph}>
          You can opt out of receiving promotional communications from us by following the unsubscribe instructions in those messages or by adjusting your notification preferences in the App.
        </Text>

        <Text style={styles.subsectionTitle}>6.5 Do Not Sell or Share</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal information. We also do not share your personal information for cross-context behavioral advertising purposes.
        </Text>

        <Text style={styles.subsectionTitle}>6.6 Restriction of Processing</Text>
        <Text style={styles.paragraph}>
          In certain circumstances, you may have the right to request that we restrict the processing of your personal information.
        </Text>

        <Text style={styles.subsectionTitle}>6.7 Withdrawal of Consent</Text>
        <Text style={styles.paragraph}>
          Where we rely on your consent to process your personal information, you have the right to withdraw that consent at any time.
        </Text>

        <Text style={styles.subsectionTitle}>How to Exercise Your Rights</Text>
        <Text style={styles.paragraph}>
          To exercise any of these rights, please contact us at:
        </Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.contactLink}>bkshelpteam@gmail.com</Text>
        </TouchableOpacity>
        <Text style={styles.paragraph}>
          We will respond to your request within 45 days. In some cases, we may need to verify your identity before processing your request.
        </Text>

        {/* Section 7 */}
        <Text style={styles.sectionTitle}>7. STATE-SPECIFIC PRIVACY RIGHTS</Text>

        <Text style={styles.subsectionTitle}>7.1 California Residents (CCPA/CPRA)</Text>
        <Text style={styles.paragraph}>
          If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):
        </Text>
        <Text style={styles.bulletPoint}>• Right to Know: You can request information about the categories and specific pieces of personal information we have collected, the sources of that information, our business purposes for collecting it, and the categories of third parties with whom we share it.</Text>
        <Text style={styles.bulletPoint}>• Right to Delete: You can request deletion of your personal information, subject to certain exceptions.</Text>
        <Text style={styles.bulletPoint}>• Right to Correct: You can request correction of inaccurate personal information.</Text>
        <Text style={styles.bulletPoint}>• Right to Opt-Out of Sale/Sharing: We do not sell personal information or share it for cross-context behavioral advertising.</Text>
        <Text style={styles.bulletPoint}>• Right to Limit Use of Sensitive Personal Information: You can limit our use of sensitive personal information to purposes necessary to provide the Services.</Text>
        <Text style={styles.bulletPoint}>• Right to Non-Discrimination: We will not discriminate against you for exercising your privacy rights.</Text>

        <Text style={styles.paragraph}>
          Categories of personal information collected in the past 12 months include: identifiers, commercial information, internet activity, geolocation data, and inferences.
        </Text>

        <Text style={styles.subsectionTitle}>7.2 Virginia Residents (VCDPA)</Text>
        <Text style={styles.paragraph}>
          Virginia residents have rights under the Virginia Consumer Data Protection Act, including the right to access, correct, delete, obtain a copy of, and opt out of targeted advertising and sale of personal data.
        </Text>

        <Text style={styles.subsectionTitle}>7.3 Colorado Residents (CPA)</Text>
        <Text style={styles.paragraph}>
          Colorado residents have rights under the Colorado Privacy Act, including the right to opt out of targeted advertising, sale of personal data, and profiling.
        </Text>

        <Text style={styles.subsectionTitle}>7.4 Connecticut Residents (CTDPA)</Text>
        <Text style={styles.paragraph}>
          Connecticut residents have rights under the Connecticut Data Privacy Act similar to those provided to Virginia and Colorado residents.
        </Text>

        <Text style={styles.subsectionTitle}>7.5 Utah Residents (UCPA)</Text>
        <Text style={styles.paragraph}>
          Utah residents have rights under the Utah Consumer Privacy Act, including the right to access, delete, and obtain a copy of personal data.
        </Text>

        <Text style={styles.subsectionTitle}>7.6 Nevada Residents</Text>
        <Text style={styles.paragraph}>
          Nevada residents may opt out of the sale of certain "covered information" as defined under Nevada law. We do not currently sell covered information as defined by Nevada law.
        </Text>

        <Text style={styles.subsectionTitle}>7.7 Appeals Process</Text>
        <Text style={styles.paragraph}>
          If we deny your privacy rights request, you may appeal by contacting us at bkshelpteam@gmail.com with "Privacy Appeal" in the subject line. We will respond to appeals within 60 days.
        </Text>

        {/* Section 8 */}
        <Text style={styles.sectionTitle}>8. INTERNATIONAL DATA TRANSFERS</Text>
        <Text style={styles.paragraph}>
          Your information may be transferred to, stored, and processed in the United States or other countries where our service providers are located. These countries may have different data protection laws than your country of residence.
        </Text>
        <Text style={styles.paragraph}>
          By using our Services, you consent to the transfer of your information to the United States and other jurisdictions. We take steps to ensure that your information receives an adequate level of protection in the jurisdictions in which we process it.
        </Text>

        {/* Section 9 */}
        <Text style={styles.sectionTitle}>9. CHILDREN'S PRIVACY</Text>
        <Text style={styles.paragraph}>
          Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
        </Text>
        <Text style={styles.paragraph}>
          If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers within a reasonable time.
        </Text>

        {/* Section 10 */}
        <Text style={styles.sectionTitle}>10. COOKIES AND TRACKING TECHNOLOGIES</Text>
        <Text style={styles.paragraph}>
          We and our service providers use cookies, pixel tags, local storage, and similar technologies to collect information about your interactions with our Services.
        </Text>

        <Text style={styles.subsectionTitle}>Types of Technologies Used</Text>
        <Text style={styles.bulletPoint}>• Session Cookies: Temporary cookies that expire when you close the App</Text>
        <Text style={styles.bulletPoint}>• Persistent Cookies: Cookies that remain on your device for a set period</Text>
        <Text style={styles.bulletPoint}>• Local Storage: Data stored locally on your device</Text>
        <Text style={styles.bulletPoint}>• Analytics Tools: To understand how users interact with our Services</Text>

        <Text style={styles.subsectionTitle}>Purposes</Text>
        <Text style={styles.bulletPoint}>• Essential functionality (authentication, security)</Text>
        <Text style={styles.bulletPoint}>• Performance and analytics</Text>
        <Text style={styles.bulletPoint}>• Remembering your preferences</Text>

        <Text style={styles.subsectionTitle}>Your Choices</Text>
        <Text style={styles.paragraph}>
          You can manage cookies through your device settings. Please note that disabling certain cookies may affect the functionality of our Services.
        </Text>

        {/* Section 11 */}
        <Text style={styles.sectionTitle}>11. DO NOT TRACK SIGNALS</Text>
        <Text style={styles.paragraph}>
          Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your online activity tracked. Because there is no uniform standard for DNT signals, our Services do not currently respond to DNT signals. However, you can exercise choices regarding tracking as described in this Privacy Policy.
        </Text>

        {/* Section 12 */}
        <Text style={styles.sectionTitle}>12. THIRD-PARTY LINKS AND SERVICES</Text>
        <Text style={styles.paragraph}>
          Our Services may contain links to third-party websites or services that are not operated by us. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices.
        </Text>
        <Text style={styles.paragraph}>
          We encourage you to review the privacy policies of any third-party services you access:
        </Text>
        <Text style={styles.bulletPoint}>• Supabase: https://supabase.com/privacy</Text>
        <Text style={styles.bulletPoint}>• Google: https://policies.google.com/privacy</Text>
        <Text style={styles.bulletPoint}>• Apple: https://www.apple.com/legal/privacy</Text>

        {/* Section 13 */}
        <Text style={styles.sectionTitle}>13. AUTOMATED DECISION-MAKING</Text>
        <Text style={styles.paragraph}>
          We use automated processes to calculate your BKS (Ball Knowing Score) based on your prediction accuracy and other factors. This score is used for leaderboard rankings and displaying your performance statistics. You can contact us if you have questions about how your score is calculated.
        </Text>

        {/* Section 14 */}
        <Text style={styles.sectionTitle}>14. CHANGES TO THIS PRIVACY POLICY</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
        </Text>
        <Text style={styles.bulletPoint}>• Update the "Last Updated" date at the top of this policy</Text>
        <Text style={styles.bulletPoint}>• Notify you via email or in-App notification</Text>
        <Text style={styles.bulletPoint}>• Post the updated policy in the App</Text>
        <Text style={styles.paragraph}>
          We encourage you to review this Privacy Policy periodically. Your continued use of our Services after any changes indicates your acceptance of the updated policy.
        </Text>

        {/* Section 15 */}
        <Text style={styles.sectionTitle}>15. CONTACT US</Text>
        <Text style={styles.paragraph}>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
        </Text>
        <Text style={styles.contactInfo}>WhoKnowsBall, LLC</Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.contactLink}>Email: bkshelpteam@gmail.com</Text>
        </TouchableOpacity>
        <Text style={styles.contactInfo}>Response Time: Within 45 days</Text>

        <Text style={styles.paragraph}>
          For privacy-related requests, please include "Privacy Request" in your email subject line and provide sufficient information for us to verify your identity.
        </Text>

        <Text style={styles.footer}>
          By using WhoKnowsBall, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of your information as described herein.
        </Text>

        <Text style={styles.copyright}>
          © 2025 WhoKnowsBall, LLC. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: TealPineColors.surface,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  lastUpdated: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  effectiveDate: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  intro: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
    marginTop: 28,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  subsubsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TealPineColors.primary,
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
    marginLeft: 16,
  },
  contactInfo: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
    marginLeft: 16,
  },
  contactLink: {
    fontSize: 14,
    color: TealPineColors.primary,
    lineHeight: 22,
    marginBottom: 8,
    marginLeft: 16,
    textDecorationLine: 'underline',
  },
  footer: {
    fontSize: 13,
    color: TealPineColors.textSecondary,
    lineHeight: 20,
    marginTop: 32,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  copyright: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PrivacyPolicyScreen;
