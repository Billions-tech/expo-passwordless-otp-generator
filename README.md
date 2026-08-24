# Campus Access Portal

A modern Expo + Supabase passwordless authentication flow for student access portals:

- Step 1: request a one-time passcode with an email address
- Step 2: enter the code from that email
- Final: session is granted only after OTP verification

This project is built as a mobile-first app with Expo Router. No seeded student data or password is required to test the sign-in flow.

## Features

- Passwordless email OTP login
- Protected routes for authenticated users
- Toast notifications for login and verification feedback
- Clean modern mobile UI for campus portal usage
- Resend-code support

## Tech Stack

- Expo SDK 57.0.13
- React Native 0.86.2
- Expo Router for file-based routing
- Supabase Auth (email/password + OTP)
- AsyncStorage for session persistence
- TypeScript (strict mode)
- react-native-toast-message for user feedback

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up local environment variables

Create a `.env.local` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_APP_SCHEME=campusaccess
```

Get these values from your Supabase Dashboard:

- **SUPABASE_URL**: Settings → General → Project URL
- **SUPABASE_SERVICE_ROLE_KEY**: Settings → API → Service role secret
- **EXPO_PUBLIC_SUPABASE_ANON_KEY**: Settings → API → Anon public key

### 3. Start the app

```bash
npm start
```

Then:

- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

## Authentication Flow

1. The first screen asks only for an email address.
2. Supabase sends a one-time sign-in code. New users may be created automatically when enabled in Supabase Auth.
3. The app moves directly to the verification screen for that requested email.
4. The user enters the 6-digit code or requests a replacement code.
5. Supabase creates the session and the protected dashboard opens.

No password or seeded student record is required. The client can add new emails through the normal Supabase Auth settings and test them immediately.

### Step-by-Step Flow Diagram

```
Request code screen
    ↓
(Enter email)
    ↓
Send OTP to email
    ↓
Redirect to OTP verification screen
    ↓
Enter 6-digit code
    ↓
Verify OTP
    ↓
Session created
    ↓
Dashboard access
```

## Testing the Flow

To test the complete passwordless flow with any permitted email:

1. **From the welcome screen**: Enter an email address
2. **Check email**: Look for the OTP code (check spam folder)
3. **Enter OTP**: Copy the 6-digit code and paste it
4. **Access dashboard**: Once verified, you'll see your student profile

### Important Notes

- Each login requires a fresh OTP
- OTP codes typically expire after 10 minutes
- If the code expires, just sign in again to get a new one
- Previous sessions don't bypass OTP (by design)

## Build for Android APK

### Prerequisites

- Node.js 18+ and npm
- EAS CLI installed globally
- Expo account (free)
- Android development environment (optional for local builds)

### Option 1: Build via EAS (Recommended)

EAS (Expo Application Services) handles the build without needing local Android setup.

**Step 1: Install EAS CLI**

```bash
npm install -g eas-cli
```

**Step 2: Log in to Expo**

```bash
eas login
```

Enter your Expo account credentials (create one at https://expo.dev if you don't have it).

**Step 3: Build the preview APK**

```bash
eas build --platform android --profile preview
```

The `preview` profile creates an installable APK through EAS cloud builds. No Android SDK is required locally.

**Step 4: Download the APK**

Once the build completes, you'll get a download link. The APK is ready to install on Android devices via:

```bash
adb install ~/Downloads/app.apk
```

Or directly transfer the APK file to your device and tap to install.

### Production Android Build

For Google Play distribution, build an Android App Bundle:

```bash
eas build --platform android --profile production
```

### Option 2: Local Android Build (Advanced)

If you have Android Studio and the SDK configured:

**Step 1: Generate a keystore** (first time only)

```bash
keytool -genkey -v -keystore app.jks -keyalg RSA -keysize 2048 -validity 10000 -alias app
```

**Step 2: Build the APK**

```bash
eas build --platform android --profile preview --local
```

Or use Expo's managed workflow:

```bash
expo prebuild --clean
./gradlew assembleRelease
```

### Testing the APK on Device

1. **Enable USB debugging** on your Android device (Settings → Developer Options)
2. **Connect** via USB
3. **Install**:
   ```bash
   adb install app.apk
   ```
4. **Launch** the Campus Access Portal app
5. **Test** the 2FA flow

### Troubleshooting Builds

| Issue                   | Solution                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `expo-router` not found | Run `npm install` again                                        |
| Keystore errors         | Ensure the keystore file exists and password is correct        |
| Build fails on EAS      | Check `eas.json` configuration and rebuild                     |
| APK won't install       | Ensure device has enough storage and developer mode is enabled |

## Project Structure

```
.
├── app/
│   ├── _layout.tsx                 # Root layout with routing logic
│   ├── (auth)/
│   │   ├── request.tsx             # Login screen wrapper
│   │   └── verify.tsx              # OTP verification wrapper
│   ├── (tabs)/
│   │   ├── _layout.tsx             # Tab navigation
│   │   └── index.tsx               # Dashboard
│   └── screens/
│       ├── RequestOtpScreen.tsx      # Step 1: Request email OTP
│       └── VerifyOtpScreen.tsx      # Step 2: OTP verification
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── useAuth.ts                  # Auth state management
│   └── toast.ts                    # Toast notification helper
├── components/
│   └── ToastHost.tsx               # Toast display component
├── .env.local                       # Local environment config
└── package.json
```

## Environment Files Explained

- `.env` – Shared environment variables (avoid committing secrets)
- `.env.local` – Local development secrets (add to .gitignore)
- `env.ts` – App-accessible Expo PUBLIC environment variables

Always keep your `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and never commit it.

## Common Tasks

### Regenerate demo accounts

```bash
npm start
```

### Test on iOS

```bash
npm run ios
```

### Test on web

```bash
npm run web
```

### Lint code

```bash
npm run lint
```

### Check TypeScript

```bash
npx tsc --noEmit
```

## Security Notes

- The **service role key** is never exposed to the frontend
- Session tokens are stored in `AsyncStorage` (encrypted on modern devices)
- OTP is sent via email and is short-lived (typically 10 minutes)
- OTP is the sign-in credential and is short-lived
- All auth state is protected by route guards

## Support & Documentation

- [Expo Docs](https://docs.expo.dev)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Expo Router Docs](https://expo.github.io/router/introduction)
- [React Native Docs](https://reactnative.dev)

## License

This project is open source and available under the MIT License.

```bash
eas login
```

### 3. Configure the project

```bash
eas build:configure
```

### 4. Create an Android build

```bash
eas build --platform android --profile production
```

If you want a local build instead of cloud build, use Android Studio + Gradle, but EAS is the easiest path for APK generation.

### 5. Download the APK

After the build finishes, download the APK from the EAS build dashboard or the generated artifact URL.

## Notes

- Keep the service-role key only in local development environment files.
- Never expose it in the app bundle or public repos.
- OTP emails require correct Supabase email auth configuration and a valid SMTP provider.

## License

This project is for educational and demo purposes, and can be adapted for real deployment.
