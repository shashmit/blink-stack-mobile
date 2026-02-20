import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, type PurchasesOfferings, type PurchasesPackage } from 'react-native-purchases';

import { env } from '@/src/config/env';

let isConfigured = false;

function getApiKey(): string {
  if (Platform.OS === 'ios') {
    return env.revenueCatApiKeyIos;
  }

  if (Platform.OS === 'android') {
    return env.revenueCatApiKeyAndroid;
  }

  return '';
}

export function hasRevenueCatConfig(): boolean {
  return Boolean(getApiKey());
}

export async function initializeRevenueCat(appUserId?: string): Promise<void> {
  if (isConfigured || !hasRevenueCatConfig()) {
    return;
  }

  await Purchases.configure({
    apiKey: getApiKey(),
    appUserID: appUserId,
  });

  isConfigured = true;
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (!hasRevenueCatConfig()) {
    return null;
  }

  await initializeRevenueCat();
  return Purchases.getOfferings();
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!hasRevenueCatConfig()) {
    return null;
  }

  await initializeRevenueCat();
  return Purchases.getCustomerInfo();
}

export async function purchaseSubscription(pkg: PurchasesPackage): Promise<CustomerInfo> {
  await initializeRevenueCat();
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

export async function restoreSubscription(): Promise<CustomerInfo> {
  await initializeRevenueCat();
  return Purchases.restorePurchases();
}
