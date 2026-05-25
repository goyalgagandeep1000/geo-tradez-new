'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, MessageCircle, ChevronDown, Menu, Settings, LogOut, User, ShoppingCart } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { currentUser } from '@/lib/mockData';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

function GeoLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 flex items-center justify-center"
    >
      <div className="absolute inset-0 rounded-full border-2 border-[#4A7C24]" />
      <div className="absolute inset-0.5 rounded-full bg-[#4A7C24]" />
      <span className="relative text-white font-extrabold text-[11px] leading-none select-none" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
        G
      </span>
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    toggleSidebar,
    activePanel,
    setActivePanel,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationCount,
    cartCount,
    openModal,
    addToast,
  } = useAppStore();

  const unread = unreadNotificationCount();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [setActivePanel]);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 bg-[#f5faff]/95 backdrop-blur-md border-b border-[#c8dae8] flex items-center px-5 gap-4 sticky top-0 z-30"
    >
      <Link href="/" className="flex items-center gap-2 mr-2 hover:opacity-80 transition-opacity shrink-0">
        <GeoLogo size={28} />
        <span className="font-bold text-[#1A1F2E] text-[14px] hidden lg:block" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
          Geotradez
        </span>
      </Link>

      <button
        onClick={toggleSidebar}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#ecf4fb] hover:text-[#374151] transition-colors shrink-0"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 relative" ref={panelRef}>
        <Link
          href="/discover"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#6B7280] hover:bg-[#ecf4fb] transition-colors"
          title="Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount() > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#4A7C24] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {cartCount()}
            </span>
          )}
        </Link>

        <button
          onClick={() => setActivePanel(activePanel === 'notifications' ? null : 'notifications')}
          className={cn(
            'relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
            activePanel === 'notifications' ? 'bg-[#F0F7E8] text-[#4A7C24]' : 'text-[#6B7280] hover:bg-[#ecf4fb]'
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#4A7C24] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {unread}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActivePanel(activePanel === 'messages' ? null : 'messages');
            router.push('/community');
          }}
          className={cn(
            'relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
            activePanel === 'messages' ? 'bg-[#F0F7E8] text-[#4A7C24]' : 'text-[#6B7280] hover:bg-[#ecf4fb]'
          )}
          aria-label="Messages"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-[#E5E9F0] mx-1" />

        <button
          onClick={() => setActivePanel(activePanel === 'user' ? null : 'user')}
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors',
            activePanel === 'user' ? 'bg-[#F0F7E8]' : 'hover:bg-[#ecf4fb]'
          )}
        >
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" online />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-[#1A1F2E] leading-tight">{currentUser.name}</p>
            <p className="text-xs text-[#6B7280]">Pro Seller</p>
          </div>
          <ChevronDown className={cn('w-3.5 h-3.5 text-[#9CA3AF] hidden sm:block transition-transform', activePanel === 'user' && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {activePanel === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#c8dae8] shadow-[0_12px_40px_rgba(20,40,80,0.12)] overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#dce8f2]">
                <h3 className="text-sm font-bold text-[#1A1F2E]">Notifications</h3>
                <button onClick={markAllNotificationsRead} className="text-xs text-[#4A7C24] font-semibold hover:text-[#3A6B1A]">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 border-b border-[#f5f8fc] hover:bg-[#ecf4fb] transition-colors',
                      !n.read && 'bg-[#F0F7E8]/50'
                    )}
                  >
                    <p className="text-xs font-bold text-[#1A1F2E]">{n.title}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">{n.description}</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-1">{n.time}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activePanel === 'user' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-[#c8dae8] shadow-[0_12px_40px_rgba(20,40,80,0.12)] overflow-hidden z-50 py-1"
            >
              {[
                { icon: User, label: 'My Profile', href: '/settings' },
                { icon: Settings, label: 'Settings', href: '/settings' },
                { icon: ShoppingCart, label: 'My Cart', href: '/discover' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setActivePanel(null)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#ecf4fb] transition-colors"
                >
                  <item.icon className="w-4 h-4 text-[#9CA3AF]" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => openModal('upgrade-pro')}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#4A7C24] font-semibold hover:bg-[#F0F7E8] transition-colors"
              >
                <span className="w-4 h-4 text-center">👑</span>
                Upgrade to Pro
              </button>
              <div className="h-px bg-[#dce8f2] my-1" />
              <button
                onClick={() => {
                  addToast('Signed out (demo)', 'info');
                  setActivePanel(null);
                  router.push('/');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
