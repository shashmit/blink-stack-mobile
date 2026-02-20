import { Account, Client, ID } from 'react-native-appwrite';

import { env, requiresConfig } from '@/src/config/env';
import type { AuthCredentials, AuthService, AuthUser } from '@/src/services/auth/types';

let accountClient: Account | null = null;

function getAccountClient() {
  if (accountClient) {
    return accountClient;
  }

  const client = new Client()
    .setEndpoint(requiresConfig(env.appwriteEndpoint, 'EXPO_PUBLIC_APPWRITE_ENDPOINT'))
    .setProject(requiresConfig(env.appwriteProjectId, 'EXPO_PUBLIC_APPWRITE_PROJECT_ID'));

  accountClient = new Account(client);
  return accountClient;
}

function mapUser(user: { $id: string; email: string; name?: string }): AuthUser {
  return {
    id: user.$id,
    email: user.email,
    name: user.name ?? null,
  };
}

export const appwriteAuthService: AuthService = {
  provider: 'appwrite',
  async signIn(input: AuthCredentials) {
    const account = getAccountClient();
    await account.createEmailPasswordSession(input.email, input.password);
    const user = await account.get();
    return mapUser(user);
  },
  async signUp(input: AuthCredentials) {
    const account = getAccountClient();
    await account.create(ID.unique(), input.email, input.password, input.name);
    await account.createEmailPasswordSession(input.email, input.password);
    const user = await account.get();
    return mapUser(user);
  },
  async signOut() {
    const account = getAccountClient();
    await account.deleteSession('current');
  },
  async getCurrentUser() {
    const account = getAccountClient();
    try {
      const user = await account.get();
      return mapUser(user);
    } catch {
      return null;
    }
  },
};
