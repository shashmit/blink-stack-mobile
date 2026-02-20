import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This route does not exist.</Text>
        <Link href="/" style={styles.link}>
          Back to root
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
    backgroundColor: '#020617',
  },
  title: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '600',
  },
  link: {
    color: '#60a5fa',
    fontSize: 16,
  },
});
