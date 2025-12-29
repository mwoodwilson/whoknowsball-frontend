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

interface TermsOfServiceScreenProps {
  navigation: any;
}

export const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ navigation }) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:bkshelpteam@gmail.com');
  };

  const handleNCPGPress = () => {
    Linking.openURL('https://www.ncpgambling.org');
  };

  const handleGAPress = () => {
    Linking.openURL('https://www.gamblersanonymous.org');
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.documentTitle}>WHOKNOWSBALL TERMS OF SERVICE</Text>
        <Text style={styles.lastUpdated}>Last Updated: December 14, 2025</Text>

        {/* Section 1 */}
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing, downloading, or using WhoKnowsBall ("the App"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must immediately uninstall and discontinue use of the App.
        </Text>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>2. Nature of the App (Entertainment Only)</Text>
        <Text style={styles.importantNotice}>
          IMPORTANT NOTICE: WhoKnowsBall is a social sports prediction platform designed strictly for entertainment purposes.
        </Text>

        <Text style={styles.subsectionTitle}>NO REAL MONEY GAMBLING</Text>
        <Text style={styles.paragraph}>
          The App does not offer real money gambling. You cannot win real money, tangible goods, or items of monetary value based on the outcome of your predictions.
        </Text>

        <Text style={styles.subsectionTitle}>SIMULATED CURRENCY ONLY</Text>
        <Text style={styles.paragraph}>
          All currency and points in the App are fictional and simulated. You can bet any amount ($1, $1M, $1B) with zero real-world consequences or value. All amounts are for entertainment and ranking purposes only.
        </Text>

        <Text style={styles.subsectionTitle}>NO SWEEPSTAKES</Text>
        <Text style={styles.paragraph}>
          The App is not a sweepstakes or lottery. No prizes of any kind are awarded through the App.
        </Text>

        <Text style={styles.subsectionTitle}>SIMULATED ODDS</Text>
        <Text style={styles.paragraph}>
          Any odds, lines, or sports data displayed are for simulation and entertainment only and may not reflect real-time market data.
        </Text>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>3. User Eligibility</Text>

        <Text style={styles.subsectionTitle}>Age Requirement</Text>
        <Text style={styles.paragraph}>
          You must be at least 18 years old (or the age of majority in your jurisdiction, whichever is higher) to use the App.
        </Text>

        <Text style={styles.subsectionTitle}>Prohibited Jurisdictions</Text>
        <Text style={styles.paragraph}>
          You agree not to use the App from any jurisdiction where social sports prediction games are prohibited by law. WhoKnowsBall reserves the right to use geolocation technology to verify your location and block access from restricted areas.
        </Text>

        <Text style={styles.subsectionTitle}>Apple/Google Compliance</Text>
        <Text style={styles.paragraph}>
          By using the App, you represent that you are not located in a country that is subject to a U.S. Government embargo or designated as a "terrorist supporting" country.
        </Text>

        {/* Section 4 */}
        <Text style={styles.sectionTitle}>4. Simulated Currency and Gameplay</Text>
        <Text style={styles.paragraph}>
          The App allows you to make predictions and accumulate simulated points and currency for leaderboard tracking and entertainment purposes only.
        </Text>

        <Text style={styles.subsectionTitle}>No Ownership</Text>
        <Text style={styles.paragraph}>
          You acknowledge that you have no property, proprietary, or ownership interest in any simulated currency, points, or rankings within the App.
        </Text>

        <Text style={styles.subsectionTitle}>Zero Monetary Value</Text>
        <Text style={styles.paragraph}>
          Simulated currency has absolutely no cash value and cannot be exchanged, traded, sold, or redeemed for real money, goods, services, or anything of value.
        </Text>

        <Text style={styles.subsectionTitle}>Fictional Amounts</Text>
        <Text style={styles.paragraph}>
          You may bet, win, or accumulate any fictional amount (including $1M, $1B, or larger) within the App. These amounts are meaningless outside the App and have no bearing on your actual finances or obligations.
        </Text>

        <Text style={styles.subsectionTitle}>Non-Transferable</Text>
        <Text style={styles.paragraph}>
          You may not sell, trade, or transfer simulated currency or account balances to other users or third parties. Any attempt to do so is a violation of these Terms and may result in immediate account termination.
        </Text>

        <Text style={styles.subsectionTitle}>Revocability</Text>
        <Text style={styles.paragraph}>
          WhoKnowsBall, LLC reserves the absolute right to manage, regulate, control, modify, eliminate, or reset simulated currency and points at its sole discretion, with or without notice, and shall have no liability to you or any third party for exercising these rights.
        </Text>

        <Text style={styles.subsectionTitle}>No Refunds</Text>
        <Text style={styles.paragraph}>
          Since simulated currency has no value, there are no refunds, disputes, or claims related to simulated currency balances.
        </Text>

        {/* Section 5 */}
        <Text style={styles.sectionTitle}>5. Sports Data and Odds Disclaimer</Text>

        <Text style={styles.subsectionTitle}>Third-Party Sources</Text>
        <Text style={styles.paragraph}>
          Sports data, scores, and odds are provided by third-party vendors. We make no guarantees regarding the accuracy, timeliness, or completeness of such data.
        </Text>

        <Text style={styles.subsectionTitle}>Delays and Errors</Text>
        <Text style={styles.paragraph}>
          Data may be delayed. You acknowledge that "live" or "real-time" data may not be synchronized with actual game events. We are not liable for any errors in scoring or odds that may affect leaderboard rankings.
        </Text>

        <Text style={styles.subsectionTitle}>No Reliance</Text>
        <Text style={styles.paragraph}>
          You agree that you will not rely on data from the App for any real-world betting or financial decisions. This App is for entertainment only.
        </Text>

        {/* Section 6 */}
        <Text style={styles.sectionTitle}>6. Responsible Social Gameplay</Text>
        <Text style={styles.paragraph}>
          Although WhoKnowsBall is free-to-play with simulated currency, we support responsible gaming habits.
        </Text>

        <Text style={styles.subsectionTitle}>Self-Exclusion</Text>
        <Text style={styles.paragraph}>
          If you feel your usage is becoming problematic, you may contact support at bkshelpteam@gmail.com to suspend your account for a defined period.
        </Text>

        <Text style={styles.subsectionTitle}>No Real Betting</Text>
        <Text style={styles.paragraph}>
          The App is not a gambling facilitation tool and does not involve real money. Any attempt to use the App to facilitate illegal off-platform betting (e.g., "settling up" real money with friends based on App results) is strictly prohibited and will result in a permanent ban.
        </Text>

        <Text style={styles.subsectionTitle}>Problem Gambling Resources</Text>
        <Text style={styles.paragraph}>
          If you or someone you know struggles with gambling, please reach out to these resources:
        </Text>
        <Text style={styles.bulletPoint}>• National Council on Problem Gambling: 1-800-GAMBLER (1-800-426-2537)</Text>
        <TouchableOpacity onPress={handleNCPGPress}>
          <Text style={styles.linkBullet}>• National Problem Gambling Helpline: https://www.ncpgambling.org</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGAPress}>
          <Text style={styles.linkBullet}>• Gamblers Anonymous: https://www.gamblersanonymous.org</Text>
        </TouchableOpacity>

        {/* Section 7 */}
        <Text style={styles.sectionTitle}>7. User Account and Security</Text>

        <Text style={styles.subsectionTitle}>One Account Policy</Text>
        <Text style={styles.paragraph}>
          You may only register and operate one (1) account. Creating multiple accounts ("smurfing") to manipulate leaderboards or bypass restrictions is prohibited.
        </Text>

        <Text style={styles.subsectionTitle}>Your Responsibility</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your login credentials. We are not liable for any loss or damage arising from unauthorized access to your account.
        </Text>

        <Text style={styles.subsectionTitle}>Account Termination</Text>
        <Text style={styles.paragraph}>
          We reserve the right to terminate any account that violates these Terms, including duplicate accounts.
        </Text>

        {/* Section 8 */}
        <Text style={styles.sectionTitle}>8. Prohibited Conduct</Text>
        <Text style={styles.paragraph}>
          You agree not to:
        </Text>
        <Text style={styles.bulletPoint}>• Use any automated software, bots, cheats, or scripts to access or interact with the App.</Text>
        <Text style={styles.bulletPoint}>• Engage in collusion with other users to manipulate outcomes or rankings.</Text>
        <Text style={styles.bulletPoint}>• Exploit any bugs, glitches, or errors in the App ("exploit abuse").</Text>
        <Text style={styles.bulletPoint}>• Harass, abuse, or threaten other users or WhoKnowsBall staff.</Text>
        <Text style={styles.bulletPoint}>• Post content that is offensive, defamatory, or violates the rights of others.</Text>
        <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to the App or other users' accounts.</Text>
        <Text style={styles.bulletPoint}>• Upload or transmit viruses or malicious code.</Text>
        <Text style={styles.bulletPoint}>• Impersonate any person or entity.</Text>
        <Text style={styles.bulletPoint}>• Interfere with the proper functioning of the App.</Text>

        {/* Section 9 */}
        <Text style={styles.sectionTitle}>9. Intellectual Property Rights</Text>

        <Text style={styles.subsectionTitle}>Ownership</Text>
        <Text style={styles.paragraph}>
          WhoKnowsBall, LLC owns all rights, title, and interest in the App, including software, text, graphics, logos, and all other intellectual property.
        </Text>

        <Text style={styles.subsectionTitle}>Limited License</Text>
        <Text style={styles.paragraph}>
          You are granted a limited, non-exclusive, non-transferable license to access and use the App for personal, non-commercial purposes only.
        </Text>

        <Text style={styles.subsectionTitle}>User Content</Text>
        <Text style={styles.paragraph}>
          By posting content (predictions, comments, profile information) to the App, you grant WhoKnowsBall a worldwide, royalty-free, perpetual, and irrevocable license to use, display, and distribute such content in connection with operating the App.
        </Text>

        <Text style={styles.subsectionTitle}>Your Representation</Text>
        <Text style={styles.paragraph}>
          You represent that you own or have the necessary rights to any content you submit and that such content does not violate any third-party intellectual property rights.
        </Text>

        {/* Section 10 */}
        <Text style={styles.sectionTitle}>10. Disclaimer of Warranties</Text>
        <Text style={styles.legalText}>
          THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </Text>
        <Text style={styles.bulletPoint}>• Warranties of MERCHANTABILITY</Text>
        <Text style={styles.bulletPoint}>• Fitness for a particular purpose</Text>
        <Text style={styles.bulletPoint}>• Non-infringement of third-party rights</Text>
        <Text style={styles.bulletPoint}>• Accuracy of sports data or odds</Text>
        <Text style={styles.bulletPoint}>• Uninterrupted or error-free operation</Text>
        <Text style={styles.bulletPoint}>• Freedom from viruses or harmful components</Text>
        <Text style={styles.legalText}>
          WE DO NOT WARRANT THAT THE APP WILL BE SECURE, UNINTERRUPTED, OR ERROR-FREE AT ALL TIMES.
        </Text>

        {/* Section 11 */}
        <Text style={styles.sectionTitle}>11. Limitation of Liability</Text>
        <Text style={styles.legalText}>
          IN NO EVENT SHALL WHOKNOWSBALL, LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR:
        </Text>
        <Text style={styles.bulletPoint}>• Any indirect, incidental, special, consequential, or punitive damages</Text>
        <Text style={styles.bulletPoint}>• Any loss of profits, revenue, data, or use</Text>
        <Text style={styles.bulletPoint}>• Any loss of goodwill or intangible losses</Text>
        <Text style={styles.bulletPoint}>• Any damages arising from your use of the App, including inaccurate predictions or leaderboard rankings</Text>
        <Text style={styles.legalText}>
          OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE APP SHALL NOT EXCEED THE AMOUNT YOU PAID US (IF ANY) IN THE LAST SIX (6) MONTHS, OR $100, WHICHEVER IS GREATER. SINCE THE APP IS FREE AND SIMULATED, THIS LIABILITY CAP WILL TYPICALLY BE $100.
        </Text>

        {/* Section 12 */}
        <Text style={styles.sectionTitle}>12. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          The App may integrate with third-party services such as:
        </Text>
        <Text style={styles.bulletPoint}>• Authentication providers (Google, Apple)</Text>
        <Text style={styles.bulletPoint}>• Backend services (Supabase)</Text>
        <Text style={styles.bulletPoint}>• Sports data providers (Sportradar, APIs)</Text>
        <Text style={styles.paragraph}>
          Your use of these third-party services is subject to their respective terms of service and privacy policies. We are not responsible for third-party services or their practices.
        </Text>

        {/* Section 13 */}
        <Text style={styles.sectionTitle}>13. Dispute Resolution and Arbitration</Text>
        <Text style={styles.importantNotice}>
          PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.
        </Text>

        <Text style={styles.subsectionTitle}>Binding Arbitration</Text>
        <Text style={styles.paragraph}>
          Any dispute arising from these Terms or your use of the App shall be resolved through binding arbitration administered by the American Arbitration Association (AAA), rather than in court.
        </Text>

        <Text style={styles.subsectionTitle}>Class Action Waiver</Text>
        <Text style={styles.paragraph}>
          You agree to resolve disputes only on an individual basis and waive any right to bring a class action, consolidated action, or representative action against WhoKnowsBall.
        </Text>

        <Text style={styles.subsectionTitle}>Opt-Out</Text>
        <Text style={styles.paragraph}>
          You may opt out of this arbitration agreement within 30 days of first accepting these Terms by sending a written notice to bkshelpteam@gmail.com.
        </Text>

        {/* Section 14 */}
        <Text style={styles.sectionTitle}>14. App Store and Platform Terms (iOS/Android)</Text>

        <Text style={styles.subsectionTitle}>Independent Agreement</Text>
        <Text style={styles.paragraph}>
          These Terms are between you and WhoKnowsBall, LLC. Apple and Google are not party to this agreement.
        </Text>

        <Text style={styles.subsectionTitle}>No Support Obligation</Text>
        <Text style={styles.paragraph}>
          Apple and Google have no obligation to provide maintenance, support, or warranty services for the App.
        </Text>

        <Text style={styles.subsectionTitle}>Third-Party Beneficiaries</Text>
        <Text style={styles.paragraph}>
          Apple and Google are third-party beneficiaries of these Terms and have the right to enforce them against you.
        </Text>

        <Text style={styles.subsectionTitle}>App Store Compliance</Text>
        <Text style={styles.paragraph}>
          You acknowledge that the App is provided through app stores and your use is subject to the respective app store's terms and guidelines.
        </Text>

        {/* Section 15 */}
        <Text style={styles.sectionTitle}>15. Termination</Text>
        <Text style={styles.paragraph}>
          We reserve the right to suspend or terminate your account and your access to the App at any time, with or without notice, for any reason, including but not limited to:
        </Text>
        <Text style={styles.bulletPoint}>• Violation of these Terms</Text>
        <Text style={styles.bulletPoint}>• Violation of App Store guidelines</Text>
        <Text style={styles.bulletPoint}>• Fraudulent or suspicious activity</Text>
        <Text style={styles.bulletPoint}>• Multiple account creation</Text>
        <Text style={styles.bulletPoint}>• Use from a prohibited jurisdiction</Text>
        <Text style={styles.paragraph}>
          Upon termination, your license to use the App is immediately revoked. Your simulated currency and rankings will be permanently deleted with no compensation.
        </Text>

        {/* Section 16 */}
        <Text style={styles.sectionTitle}>16. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. We will notify users of any material changes by:
        </Text>
        <Text style={styles.bulletPoint}>• Posting the new Terms in the App</Text>
        <Text style={styles.bulletPoint}>• Updating the "Last Updated" date at the top of this document</Text>
        <Text style={styles.bulletPoint}>• Requesting renewed acceptance upon next login (for material changes)</Text>
        <Text style={styles.paragraph}>
          Your continued use of the App after changes to these Terms constitutes acceptance of the modified Terms. If you do not agree to any modifications, you must immediately uninstall and stop using the App.
        </Text>

        {/* Section 17 */}
        <Text style={styles.sectionTitle}>17. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
        </Text>

        {/* Section 18 */}
        <Text style={styles.sectionTitle}>18. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms of Service, please contact us at:
        </Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.contactLink}>Email: bkshelpteam@gmail.com</Text>
        </TouchableOpacity>
        <Text style={styles.contactInfo}>Mailing Address: [Your Business Address]</Text>

        {/* Section 19 */}
        <Text style={styles.sectionTitle}>19. Entire Agreement</Text>
        <Text style={styles.paragraph}>
          These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and WhoKnowsBall, LLC regarding your use of the App and supersede all prior agreements and understandings.
        </Text>

        {/* Section 20 */}
        <Text style={styles.sectionTitle}>20. Severability</Text>
        <Text style={styles.paragraph}>
          If any provision of these Terms is found to be invalid or unenforceable, that provision shall be severed, and the remaining provisions shall continue in full force and effect.
        </Text>

        {/* Acknowledgment */}
        <Text style={styles.sectionTitle}>Acknowledgment</Text>
        <Text style={styles.paragraph}>
          By using WhoKnowsBall, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. You further acknowledge that:
        </Text>
        <Text style={styles.bulletPoint}>• This App is for entertainment purposes only and does not involve real money or gambling.</Text>
        <Text style={styles.bulletPoint}>• All currency and bets are simulated and have zero monetary value.</Text>
        <Text style={styles.bulletPoint}>• You understand the risks of simulated gaming and engage at your own discretion.</Text>
        <Text style={styles.bulletPoint}>• You are at least 18 years old and located in a jurisdiction where the App is legal.</Text>

        <Text style={styles.footer}>
          End of Terms of Service
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
  documentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    marginBottom: 24,
    fontStyle: 'italic',
    textAlign: 'center',
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
    color: TealPineColors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  importantNotice: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.warning,
    lineHeight: 22,
    marginBottom: 16,
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: TealPineColors.warning,
  },
  paragraph: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  legalText: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '500',
  },
  bulletPoint: {
    fontSize: 14,
    color: TealPineColors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
    marginLeft: 16,
  },
  linkBullet: {
    fontSize: 14,
    color: TealPineColors.primary,
    lineHeight: 22,
    marginBottom: 6,
    marginLeft: 16,
    textDecorationLine: 'underline',
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
    fontSize: 14,
    color: TealPineColors.textSecondary,
    lineHeight: 20,
    marginTop: 32,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '600',
  },
  copyright: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default TermsOfServiceScreen;
