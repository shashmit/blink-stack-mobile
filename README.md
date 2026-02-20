# Vibing

Vibing is a production-ready mobile application built using
[Expo](https://expo.dev/) (SDK 54) and React Native. It uses a scalable, modern
mobile stack featuring robust authentication, subscription management, push
notifications, and analytics out-of-the-box.

## Features

- **Expo Router:** File-based routing with support for typed routes.
- **Authentication:** Modular auth integration supporting `basic`, `clerk`,
  `supabase`, and `appwrite`.
- **Subscriptions:** In-app purchases and subscription flows powered by
  [RevenueCat](https://www.revenuecat.com/).
- **State & Data Fetching:** Utilizes
  [TanStack Query](https://tanstack.com/query) for robust remote data fetching
  and caching.
- **Forms & Validation:** Built with
  [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/).
- **Push Notifications:** Integrated with `onesignal` or `novu`.
- **Error Tracking & Monitoring:** Bootstrapped with
  [Sentry](https://sentry.io/).

## Project Structure

The project is structured to separate routing, business logic, and UI components
cleanly:

- **`/app`**: Contains all Expo Router screens and route groups.
  - `(auth)`: Onboarding, Login, and Signup screens.
  - `(subscription)`: Screens related to pricing plans and restoring purchases.
  - `(app)`: The protected main application area, visible only to authenticated
    users with active subscriptions.
- **`/src`**: Houses the core business logic, minimizing logic within screen
  components.
  - `/components`: Reusable UI components.
  - `/hooks`: Custom React hooks, including data-fetching with TanStack Query.
  - `/providers`: Context providers for global state (e.g., SessionProvider,
    SubscriptionProvider, NotificationProvider).
  - `/config`: Configuration files and environmental variable parsing.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the sample environment file to `.env.local`:

```bash
cp .env.example .env.local
```

Fill out the required variables such as:

- `EXPO_PUBLIC_AUTH_PROVIDER`
- `EXPO_PUBLIC_NOTIFICATION_PROVIDER`
- `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`
- `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID`
- `EXPO_PUBLIC_SENTRY_DSN`

_Alternatively, run the configuration wizard:_

```bash
npm run configure
```

### 3. Run the App

Start the Expo development server on your preferred platform:

```bash
npm run ios     # For iOS simulator
npm run android # For Android emulator
npm run web     # For web preview
```

> **Note:** All start scripts (`start`, `ios`, `android`, `web`) run lint checks
> first and will intentionally fail if ESLint reports errors or warnings to
> maintain code quality.

## Quality Gates

Before committing, ensure your code passes the following checks:

- **Linting:** `npm run lint` (Checks for code style and formatting issues)
- **Type Checking:** `npm run typecheck` (Ensures strict TypeScript compliance)

## License

MIT
