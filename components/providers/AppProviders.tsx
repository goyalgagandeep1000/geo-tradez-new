'use client';
import { ToastContainer } from '@/components/ui/Toast';
import { GlobalModals } from '@/components/modals/GlobalModals';
import { BootstrapHydrator } from '@/components/providers/BootstrapHydrator';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BootstrapHydrator />
      <ToastContainer />
      <GlobalModals />
    </>
  );
}
