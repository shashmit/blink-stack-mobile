# AGENTS

## Default Skill For This Repo

- Always use `$react-native-expo-quality` for Expo/React Native implementation work in this project.
- Skill path: `.codex/skills/react-native-expo-quality/SKILL.md`

## Project Architecture Rules

- Keep route groups in `/app`:
  - `(auth)` for onboarding/login/signup
  - `(subscription)` for RevenueCat purchase + restore
  - `(app)` for post-subscription product screens
- Keep business logic in `/src` and keep screen files thin.
- Provider boundaries:
  - Auth: `src/providers/SessionProvider.tsx`
  - Subscription: `src/providers/SubscriptionProvider.tsx`
  - Notifications: `src/providers/NotificationProvider.tsx`

## Integration Stack

- Expo SDK 54 + React Native 0.81
- Auth options: `basic`, `clerk`, `supabase`, `appwrite`
- Subscriptions: RevenueCat (`react-native-purchases`)
- Notifications: `onesignal` or `novu` (or `none`)
- Data/query: TanStack Query
- Forms/validation: React Hook Form + Zod
- Monitoring: Sentry

## Quality Gates

1. Run `npm run lint` after code changes.
2. Run `npm run typecheck` after code changes.
3. Keep `.env.example` updated whenever env usage changes.
4. Preserve provider-selected behavior through `EXPO_PUBLIC_*` env settings.
5. Keep the CLI setup flow in `bin/blink-stack-mobile.mjs` aligned with runtime env requirements.
