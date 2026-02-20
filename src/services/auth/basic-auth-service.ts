import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthCredentials, AuthService, AuthUser } from '@/src/services/auth/types';

const BASIC_AUTH_KEY = 'vibing:auth:basic';

type BasicAuthRecord = {
  user: AuthUser;
  password: string;
};

async function readRecord(): Promise<BasicAuthRecord | null> {
  const raw = await AsyncStorage.getItem(BASIC_AUTH_KEY);
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as BasicAuthRecord;
}

async function writeRecord(record: BasicAuthRecord): Promise<void> {
  await AsyncStorage.setItem(BASIC_AUTH_KEY, JSON.stringify(record));
}

export const basicAuthService: AuthService = {
  provider: 'basic',
  async signIn(input: AuthCredentials) {
    const record = await readRecord();

    if (!record || record.user.email.toLowerCase() !== input.email.toLowerCase() || record.password !== input.password) {
      throw new Error('Invalid credentials. Sign up first or check your email/password.');
    }

    return record.user;
  },
  async signUp(input: AuthCredentials) {
    const user: AuthUser = {
      id: `basic-${Date.now()}`,
      email: input.email,
      name: input.name ?? null,
    };

    await writeRecord({ user, password: input.password });
    return user;
  },
  async signOut() {
    return Promise.resolve();
  },
  async getCurrentUser() {
    const record = await readRecord();
    return record?.user ?? null;
  },
};
