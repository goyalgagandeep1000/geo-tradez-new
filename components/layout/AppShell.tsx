'use client';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { useAppStore } from '@/store/appStore';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex h-screen app-shell-bg overflow-hidden">
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[220px]'
        }`}
      >
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col pb-16 md:pb-0 app-shell-bg">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
