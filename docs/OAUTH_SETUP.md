# OAuth Provider Setup Guide

This guide walks through configuring Google and Apple OAuth providers in Supabase for WhoKnowsBall authentication.

## Prerequisites

- Supabase project created
- Access to Supabase Dashboard
- Apple Developer Account (for Apple Sign-In)
- Google Cloud Console access (for Google Sign-In)

---

## 1. Google OAuth Setup

### Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: WhoKnowsBall
   - User support email: your email
   - Developer contact: your email
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: WhoKnowsBall Web Client
   - Authorized redirect URIs:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
7. Save your **Client ID** and **Client Secret**

### Step 2: Configure in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your WhoKnowsBall project
3. Navigate to **Authentication > Providers**
4. Find **Google** in the provider list
5. Toggle **Enable Sign in with Google**
6. Fill in the configuration:
   - **Client ID (for OAuth)**: Paste the Client ID from Google Cloud Console
   - **Client Secret (for OAuth)**: Paste the Client Secret from Google Cloud Console
   - **Redirect URL**: Should auto-populate as:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
7. Click **Save**

### Step 3: Test Google OAuth (Optional)

1. Run the app on a device/simulator
2. Navigate to Login or Register screen
3. Tap "Continue with Google"
4. Verify redirect to Google sign-in
5. After authentication, verify callback to `whoknowsball://auth/callback`
6. Confirm user is logged in or redirected to username setup

---

## 2. Apple OAuth Setup

### Step 1: Configure Apple Developer Portal

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select **Identifiers** from sidebar
4. Click the **+** button to create a new identifier

#### Create Services ID

1. Select **Services IDs** and click Continue
2. Fill in the details:
   - Description: WhoKnowsBall Sign In
   - Identifier: `com.whoknowsball.signin` (must be unique)
3. Click Continue and Register
4. Click on your newly created Services ID
5. Check **Sign In with Apple**
6. Click **Configure**:
   - Primary App ID: Select your main app identifier (com.whoknowsball)
   - Domains and Subdomains:
     ```
     your-project.supabase.co
     ```
   - Return URLs:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
7. Click **Save** and **Continue**

#### Create Private Key

1. In Apple Developer Portal, go to **Keys**
2. Click the **+** button
3. Enter a key name: WhoKnowsBall Sign In Key
4. Check **Sign In with Apple**
5. Click **Configure** next to Sign In with Apple
6. Select your Primary App ID
7. Click **Save** and **Continue**
8. Click **Register**
9. **Download the .p8 key file** (you can only download once!)
10. Note the **Key ID** shown on the confirmation page

#### Get Team ID

1. In Apple Developer Portal, click on your account name (top right)
2. Go to **Membership**
3. Copy your **Team ID** (10-character alphanumeric code)

### Step 2: Configure in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your WhoKnowsBall project
3. Navigate to **Authentication > Providers**
4. Find **Apple** in the provider list
5. Toggle **Enable Sign in with Apple**
6. Fill in the configuration:
   - **Services ID**: `com.whoknowsball.signin` (from Step 1)
   - **Team ID**: Your 10-character Team ID (from Step 1)
   - **Key ID**: Key ID from the private key creation (from Step 1)
   - **Private Key**: Open the downloaded .p8 file in a text editor and paste the entire contents (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
   - **Redirect URL**: Should auto-populate as:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
7. Click **Save**

### Step 3: Update iOS Configuration

The iOS Info.plist has already been configured with the required URL scheme. Verify these entries exist in `ios/WhoKnowsBall/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>com.whoknowsball</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>whoknowsball</string>
    </array>
  </dict>
</array>
```

### Step 4: Test Apple OAuth (Optional)

1. Run the app on an iOS device or simulator (iOS 13+)
2. Navigate to Login or Register screen
3. Tap "Continue with Apple"
4. Verify redirect to Apple sign-in sheet
5. After authentication, verify callback to `whoknowsball://auth/callback`
6. Confirm user is logged in or redirected to username setup

---

## 3. Verify Deep Link Configuration

Both iOS and Android have been configured to handle the `whoknowsball://` URL scheme.

### iOS Configuration

File: `ios/WhoKnowsBall/Info.plist`

Already configured with CFBundleURLTypes for the `whoknowsball` scheme.

### Android Configuration

File: `android/app/src/main/AndroidManifest.xml`

Already configured with intent-filter:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="whoknowsball" />
</intent-filter>
```

---

## 4. OAuth Flow Overview

### For New Users (No Username)

1. User taps "Continue with Google" or "Continue with Apple"
2. App calls `signInWithGoogle()` or `signInWithApple()` from AuthContext
3. User is redirected to provider's OAuth page
4. After successful authentication, provider redirects to Supabase callback URL
5. Supabase processes the OAuth callback and redirects to `whoknowsball://auth/callback`
6. App receives deep link and navigates back to the app
7. AuthContext checks if user has username in metadata
8. Since no username exists, `needsUsername: true` is returned
9. App navigates to UsernameSetupScreen
10. User enters and saves username
11. App navigates to main app (MainApp)

### For Existing Users (Has Username)

1. User taps "Continue with Google" or "Continue with Apple"
2. App calls `signInWithGoogle()` or `signInWithApple()` from AuthContext
3. User is redirected to provider's OAuth page
4. After successful authentication, provider redirects to Supabase callback URL
5. Supabase processes the OAuth callback and redirects to `whoknowsball://auth/callback`
6. App receives deep link and navigates back to the app
7. AuthContext checks if user has username in metadata
8. Since username exists, `needsUsername: false` is returned
9. App navigates back to previous screen (dismisses modal)

---

## 5. Troubleshooting

### Google OAuth Issues

**Problem**: "Error 400: redirect_uri_mismatch"
- **Solution**: Verify the redirect URI in Google Cloud Console matches exactly:
  ```
  https://your-project.supabase.co/auth/v1/callback
  ```

**Problem**: User sees OAuth consent screen on every login
- **Solution**: In Google Cloud Console OAuth consent screen, add your email to "Test users" or publish the app

### Apple OAuth Issues

**Problem**: "invalid_client" error
- **Solution**: Verify Services ID, Team ID, and Key ID are correct in Supabase Dashboard

**Problem**: Private key error
- **Solution**: Ensure you copied the entire .p8 file contents including headers:
  ```
  -----BEGIN PRIVATE KEY-----
  [key contents]
  -----END PRIVATE KEY-----
  ```

**Problem**: Redirect URL doesn't work
- **Solution**: Verify the Return URL in Apple Developer Portal matches:
  ```
  https://your-project.supabase.co/auth/v1/callback
  ```

### Deep Link Issues

**Problem**: App doesn't open after OAuth callback
- **iOS**: Rebuild the app after modifying Info.plist
- **Android**: Rebuild the app after modifying AndroidManifest.xml

**Problem**: Deep link opens browser instead of app
- **Solution**: Ensure app is installed and URL scheme is correctly configured

---

## 6. Security Considerations

1. **Never commit OAuth credentials to version control**
   - Keep .p8 files secure and private
   - Store Client Secrets securely
   - Use environment variables for sensitive data

2. **Validate redirect URLs**
   - Only use HTTPS for production
   - Verify redirect URLs match exactly in all providers

3. **Review OAuth scopes**
   - Request minimal permissions needed
   - Google: Basic profile info and email
   - Apple: Name and email (user can hide email)

4. **Monitor OAuth usage**
   - Check Supabase Dashboard > Authentication > Users
   - Review OAuth provider analytics

---

## 7. Next Steps

After completing OAuth setup:

1. ✅ Test Google OAuth on iOS and Android
2. ✅ Test Apple OAuth on iOS
3. ✅ Verify username setup flow for new users
4. ✅ Verify direct login flow for existing users
5. ✅ Test deep link handling on both platforms
6. Test session persistence (up to 1 month)
7. Implement email verification reminder system
8. Add analytics tracking for OAuth sign-ins

---

## Support

If you encounter issues:

1. Check [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
2. Review [React Navigation Deep Linking](https://reactnavigation.org/docs/deep-linking/)
3. Check application logs for detailed error messages
