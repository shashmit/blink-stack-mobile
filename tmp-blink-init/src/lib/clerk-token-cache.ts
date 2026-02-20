import * as SecureStore from 'expo-secure-store';

export const clerkTokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    await SecureStore.setItemAsync(key, token);
  },
};
