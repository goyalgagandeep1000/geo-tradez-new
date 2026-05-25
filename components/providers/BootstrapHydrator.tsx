'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { api } from '@/lib/api-client';

export function BootstrapHydrator() {
  const hydrate = useAppStore((s) => s.hydrateFromApi);

  useEffect(() => {
    api
      .me()
      .then(() => {
        useAppStore.setState({ isAuthenticated: true });
        return hydrate();
      })
      .catch(() => {
        /* guest mode — mock data still works */
      });
  }, [hydrate]);

  return null;
}
