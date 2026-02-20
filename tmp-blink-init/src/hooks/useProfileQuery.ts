import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/src/hooks/useSession';

export function useProfileQuery() {
  const { user } = useSession();

  return useQuery({
    queryKey: ['profile', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
      return user;
    },
  });
}
