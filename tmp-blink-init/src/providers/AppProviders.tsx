import { ClerkProvider } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';

import { env } from '@/src/config/env';
import { clerkTokenCache } from '@/src/lib/clerk-token-cache';
import { NotificationProvider } from '@/src/providers/NotificationProvider';
import { SessionProvider } from '@/src/providers/SessionProvider';
import { SubscriptionProvider } from '@/src/providers/SubscriptionProvider';

function ProviderTree({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <SubscriptionProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </SubscriptionProvider>
    </SessionProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  if (env.authProvider === 'clerk' && !env.clerkPublishableKey) {
    throw new Error('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required when auth provider is set to clerk.');
  }

  return (
    <QueryClientProvider client={queryClient}>
      {env.authProvider === 'clerk' ? (
        <ClerkProvider publishableKey={env.clerkPublishableKey} tokenCache={clerkTokenCache}>
          <ProviderTree>{children}</ProviderTree>
        </ClerkProvider>
      ) : (
        <ProviderTree>{children}</ProviderTree>
      )}
    </QueryClientProvider>
  );
}
