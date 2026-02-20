import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useSession } from '@/src/hooks/useSession';
import { useSubscription } from '@/src/hooks/useSubscription';

export default function IndexScreen() {
  const { status: sessionStatus, isSignedIn, onboardingCompleted } = useSession();
  const { status: subscriptionStatus, hasSubscriptionAccess } = useSubscription();

  if (sessionStatus === 'loading' || subscriptionStatus === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#60a5fa" />
      </View>
    );
  }

  if (!onboardingCompleted) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasSubscriptionAccess) {
    return <Redirect href="/(subscription)" />;
  }

  return <Redirect href="/(app)" />;
}
