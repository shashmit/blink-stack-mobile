import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { CustomerInfo, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';

import { env } from '@/src/config/env';
import { toErrorMessage } from '@/src/lib/errors';
import {
  getCustomerInfo,
  getOfferings,
  hasRevenueCatConfig,
  initializeRevenueCat,
  purchaseSubscription,
  restoreSubscription,
} from '@/src/services/subscription/revenuecat-service';
import { useSession } from '@/src/providers/SessionProvider';

type SubscriptionStatus = 'loading' | 'ready' | 'disabled' | 'error';

type SubscriptionContextValue = {
  status: SubscriptionStatus;
  hasActiveSubscription: boolean;
  hasSubscriptionAccess: boolean;
  offerings: PurchasesOfferings | null;
  availablePackages: PurchasesPackage[];
  isProcessingPurchase: boolean;
  error: string | null;
  refresh(): Promise<void>;
  purchase(pkg: PurchasesPackage): Promise<void>;
  restore(): Promise<void>;
  bypassForTemplate(): Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);
const BYPASS_KEY = 'vibing:subscription:bypass';

function getHasEntitlement(info: CustomerInfo | null): boolean {
  if (!info) {
    return false;
  }

  const entitlementId = env.revenueCatEntitlementId;
  if (entitlementId && info.entitlements.active[entitlementId]) {
    return true;
  }

  return Object.keys(info.entitlements.active).length > 0;
}

export function SubscriptionProvider({ children }: PropsWithChildren) {
  const { user } = useSession();
  const [status, setStatus] = useState<SubscriptionStatus>('loading');
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [hasBypassedSubscription, setHasBypassedSubscription] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const bypass = await AsyncStorage.getItem(BYPASS_KEY);
      setHasBypassedSubscription(bypass === 'true');
    })();
  }, []);

  const refresh = useCallback(async () => {
    if (!hasRevenueCatConfig()) {
      setStatus('disabled');
      setOfferings(null);
      setHasActiveSubscription(false);
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      await initializeRevenueCat(user?.id);
      const [nextOfferings, customerInfo] = await Promise.all([getOfferings(), getCustomerInfo()]);
      setOfferings(nextOfferings);
      setHasActiveSubscription(getHasEntitlement(customerInfo));
      setStatus('ready');
    } catch (value) {
      setStatus('error');
      setError(toErrorMessage(value));
    }
  }, [user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    setIsProcessingPurchase(true);
    setError(null);

    try {
      const customerInfo = await purchaseSubscription(pkg);
      setHasActiveSubscription(getHasEntitlement(customerInfo));
    } catch (value) {
      setError(toErrorMessage(value));
    } finally {
      setIsProcessingPurchase(false);
    }
  }, []);

  const restore = useCallback(async () => {
    setError(null);

    try {
      const customerInfo = await restoreSubscription();
      setHasActiveSubscription(getHasEntitlement(customerInfo));
    } catch (value) {
      setError(toErrorMessage(value));
    }
  }, []);

  const bypassForTemplate = useCallback(async () => {
    await AsyncStorage.setItem(BYPASS_KEY, 'true');
    setHasBypassedSubscription(true);
  }, []);

  const value = useMemo<SubscriptionContextValue>(
    () => {
      const availablePackages = offerings?.current?.availablePackages ?? [];

      return {
        status,
        hasActiveSubscription,
        hasSubscriptionAccess: hasActiveSubscription || hasBypassedSubscription,
        offerings,
        availablePackages,
        isProcessingPurchase,
        error,
        refresh,
        purchase,
        restore,
        bypassForTemplate,
      };
    },
    [
      status,
      hasActiveSubscription,
      offerings,
      hasBypassedSubscription,
      isProcessingPurchase,
      error,
      refresh,
      purchase,
      restore,
      bypassForTemplate,
    ],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used inside SubscriptionProvider.');
  }

  return context;
}
