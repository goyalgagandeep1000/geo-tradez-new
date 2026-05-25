'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sparkles, Users, Store, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { icon: Search, label: 'Discover', href: '/discover' },
  { icon: Sparkles, label: 'AI Create', href: '/ai-create' },
  { icon: Users, label: 'Community', href: '/community' },
  { icon: Store, label: 'My Store', href: '/my-store' },
  { icon: GraduationCap, label: 'Learn', href: '/learn' },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#f5faff] border-t border-[#c8dae8] flex md:hidden z-50">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors',
              isActive ? 'text-[#4A7C24]' : 'text-[#9CA3AF]'
            )}
          >
            <tab.icon className={cn('w-5 h-5', isActive && 'text-[#4A7C24]')} />
            <span className={cn('font-medium', isActive ? 'text-[#4A7C24]' : 'text-[#9CA3AF]')}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
