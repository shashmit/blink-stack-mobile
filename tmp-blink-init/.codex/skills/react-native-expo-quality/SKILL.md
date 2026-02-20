---
name: react-native-expo-quality
description: Use this skill when working on Expo SDK 54 React Native code in this repo to enforce route-group architecture, provider-driven state, safe integrations (auth/subscription/notifications), and strong TypeScript quality checks.
---

# React Native Expo Quality

## When To Use

Use this skill for any mobile feature, refactor, or bug fix in this repository.

## Goals

- Preserve route groups: `(auth)`, `(subscription)`, `(app)`.
- Keep provider boundaries clean: auth, subscription, notifications, app providers.
- Keep integrations safe-by-default: fail with clear messages when required env keys are missing.
- Favor typed APIs and Zod validation for user-facing forms and env parsing.

## Architecture Guardrails

- Routing lives in `/app`; business logic lives in `/src`.
- `app/index.tsx` controls gate flow and redirects.
- `src/providers/SessionProvider.tsx` is the single source of truth for auth state.
- `src/providers/SubscriptionProvider.tsx` is the single source of truth for entitlement status.
- `src/providers/NotificationProvider.tsx` wraps provider-specific notification behavior.
- Avoid importing provider SDKs directly in route files when a service/provider already exists.

## Coding Rules

- TypeScript strict mode must pass (`npm run typecheck`).
- Reuse shared UI controls in `src/components/ui` and shared forms in `src/components/forms`.
- Keep errors user-readable and convert unknown errors via `toErrorMessage`.
- Keep asynchronous side effects in providers/services, not screen components.
- Keep screens thin: render state + call provider actions.

## Integration Rules

- Auth provider options: `basic`, `clerk`, `supabase`, `appwrite`.
- Subscription: RevenueCat only.
- Notifications: `onesignal`, `novu`, or `none`.
- Monitoring: Sentry initialized globally from env.

## Pre-PR Checklist

1. Run `npm run typecheck`.
2. Ensure no route-group regressions in `/app`.
3. Ensure all new env vars are documented in `.env.example`.
4. Verify provider selection logic still works with defaults.
