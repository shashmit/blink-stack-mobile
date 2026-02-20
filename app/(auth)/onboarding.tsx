import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { env } from '@/src/config/env';
import { PrimaryButton } from '@/src/components/ui/PrimaryButton';
import { Screen } from '@/src/components/ui/Screen';
import { useSession } from '@/src/hooks/useSession';

export default function OnboardingScreen() {
  const { completeOnboarding } = useSession();

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Vibing Template</Text>
        <Text style={styles.title}>Auth + Subscription + App, pre-wired for Expo SDK 54.</Text>
        <Text style={styles.copy}>
          Selected auth provider: <Text style={styles.highlight}>{env.authProvider}</Text>. Continue to sign in or create your account.
        </Text>
      </View>

      <PrimaryButton
        label="Continue"
        onPress={() => {
          void (async () => {
            await completeOnboarding();
            router.replace('/(auth)/login');
          })();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  kicker: {
    color: '#38bdf8',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  },
  copy: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
  highlight: {
    color: '#f8fafc',
    fontWeight: '700',
  },
});
