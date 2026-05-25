'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search, Sparkles, Users, Store, Wallet,
  Crown, ChevronRight, Settings, TrendingUp,
  Zap, BarChart2, Package, Heart, ArrowUpRight,
  CreditCard, Download, FileText, CheckCircle2, Sprout
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { currentUser, communityMembers } from '@/lib/mockData';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Search,   label: 'Discover',   href: '/discover' },
  { icon: Sparkles, label: 'AI Create',  href: '/ai-create' },
  { icon: Users,    label: 'Community',  href: '/community' },
  { icon: Store,    label: 'My Store',   href: '/my-store' },
  { icon: Wallet,   label: 'Wallet',     href: '/wallet' },
];

/* Circular G logo */
function GeoLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-[#4A7C24]" />
      <div className="absolute inset-0.5 rounded-full bg-[#4A7C24]" />
      <span className="relative text-white font-extrabold leading-none select-none"
        style={{ fontSize: size * 0.38, fontFamily: 'Sora, Inter, sans-serif' }}>G</span>
    </div>
  );
}

interface SidebarProps { collapsed?: boolean }

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { openModal, addToast } = useAppStore();
  const isDiscover  = pathname.startsWith('/discover');
  const isMyStore   = pathname.startsWith('/my-store');
  const isWallet    = pathname.startsWith('/wallet');
  const isCommunity = pathname.startsWith('/community');

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed left-0 top-0 h-full flex flex-col z-40 transition-all duration-300 overflow-y-auto',
        'bg-[#f5faff] border-r border-[#c8dae8] shadow-[2px_0_12px_rgba(30,55,90,0.06)]',
        collapsed ? 'w-[72px]' : 'w-[220px]'
      )}
    >
      {/* ── Logo → home ── */}
      <Link
        href="/"
        className={cn(
          'flex items-center gap-2.5 px-4 py-4 border-b border-[#dce8f2] hover:bg-[#ecf4fb] transition-colors',
          collapsed && 'justify-center px-0'
        )}
      >
        <GeoLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-[#1A1F2E] text-[15px] tracking-tight"
            style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            Geotradez
          </span>
        )}
      </Link>

      {/* ── Nav items ── */}
      <nav className="px-2 py-3">
        <div className="space-y-0.5">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <motion.div key={item.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }} className="relative">
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-[#F0F7E8] rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <Link href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
                    collapsed && 'justify-center px-0 py-2.5',
                    isActive ? 'text-[#3A6B1A] font-semibold' : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#ecf4fb]'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn(
                    'shrink-0 transition-colors',
                    collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]',
                    isActive ? 'text-[#4A7C24]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]'
                  )} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Settings */}
        <div className="mt-3 pt-3 border-t border-[#dce8f2]">
          {(() => {
            const isActive = pathname === '/settings';
            return (
              <Link href="/settings"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
                  collapsed && 'justify-center px-0',
                  isActive ? 'bg-[#F0F7E8] text-[#3A6B1A] font-semibold' : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#ecf4fb]'
                )}
              >
                <Settings className={cn('shrink-0 w-[18px] h-[18px]', isActive ? 'text-[#4A7C24]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]')} />
                {!collapsed && <span className="text-sm">Settings</span>}
              </Link>
            );
          })()}
        </div>
      </nav>

      {/* ── DISCOVER PULSE (only on /discover) ── */}
      {!collapsed && isDiscover && (
        <div className="mx-3 mb-3 border-t border-[#dce8f2] pt-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Zap className="w-3.5 h-3.5 text-[#4A7C24]" />
            <span className="text-xs font-bold text-[#1A1F2E]">Discover Pulse</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] mb-2.5">Live product movement across the marketplace</p>
          {/* Trending */}
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1.5">
              <TrendingUp className="w-3 h-3 text-[#4A7C24]" />
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Trending Demand</p>
            </div>
            {[{ cat: 'AI Tools', pct: '+32%' }, { cat: 'Templates', pct: '+18%' }, { cat: 'Courses', pct: '+14%' }].map((item) => (
              <div key={item.cat} className="flex items-center justify-between py-1">
                <span className="text-xs text-[#374151]">{item.cat}</span>
                <span className="text-xs font-semibold text-green-600">{item.pct}</span>
              </div>
            ))}
          </div>
          {/* Live Activity */}
          <div className="mb-3">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Live Buyer Activity</p>
            {[
              { n: '1,284', label: 'buyers browsing now' },
              { n: '342',   label: 'products viewed today' },
              { n: '86',    label: 'carts created today' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-xs font-semibold text-[#1A1F2E]">{item.n}</span>
                <span className="text-[10px] text-[#9CA3AF]">{item.label}</span>
              </div>
            ))}
          </div>
          {/* Top Opportunity */}
          <div className="mb-1">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Top Opportunity</p>
            {[
              { key: 'High demand',     val: 'AI Tools' },
              { key: 'Rising product',  val: 'AI Store Kit' },
              { key: 'Best price range', val: '$19 – $49' },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-1 py-0.5">
                <span className="text-[10px] text-[#9CA3AF] shrink-0">{item.key}:</span>
                <span className="text-[10px] font-semibold text-[#374151]">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MY STORE sub-nav (only on /my-store) ── */}
      {!collapsed && isMyStore && (
        <div className="mx-3 mb-3 border-t border-[#dce8f2] pt-3 space-y-0.5">
          {[
            { icon: BarChart2, label: 'Store Analytics', href: '/my-store' },
            { icon: Package,   label: 'My Products',     href: '/my-store?tab=products' },
            { icon: TrendingUp, label: 'Product Analytics', href: '/my-store?tab=analytics' },
            { icon: Heart,     label: 'Saved Items',    href: '/my-store?tab=saved' },
          ].map((item) => {
            const active = pathname === item.href && !item.href.includes('?') || (item.href === '/my-store' && pathname === '/my-store');
            return (
              <Link key={item.label} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  active ? 'bg-[#F0F7E8] text-[#3A6B1A] font-semibold' : 'text-[#6B7280] hover:bg-[#ecf4fb] hover:text-[#374151]'
                )}>
                <item.icon className={cn('w-4 h-4 shrink-0', active ? 'text-[#4A7C24]' : 'text-[#9CA3AF]')} />
                {item.label}
              </Link>
            );
          })}

          {/* Store Growth Tip */}
          <div className="mt-2 bg-[#ecf4fb] rounded-xl p-3 border border-[#c8dae8]">
            <div className="flex items-center gap-2 mb-1.5">
              <Sprout className="w-4 h-4 text-[#4A7C24]" />
              <span className="text-xs font-bold text-[#374151]">Store Growth Tip</span>
            </div>
            <p className="text-xs text-[#6B7280] mb-2 leading-relaxed">
              Add more product images and optimize descriptions to boost conversions.
            </p>
            <button
              onClick={() => openModal('edit-store')}
              className="text-xs text-[#4A7C24] font-semibold flex items-center gap-1 hover:text-[#3A6B1A]"
            >
              Improve Store <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Store Health */}
          <div className="mt-2 bg-white border border-[#c8dae8] rounded-xl p-3">
            <h4 className="text-xs font-bold text-[#374151] mb-2">Store Health</h4>
            <div className="flex items-center justify-center mb-2">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#F0F7E8" strokeWidth="6" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#4A7C24" strokeWidth="6"
                    strokeDasharray={`${(92 / 100) * 163.4} 163.4`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-[#1A1F2E]">92%</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-center font-bold text-[#4A7C24] mb-2">Excellent</p>
            <div className="space-y-1">
              {['Profile Complete','Products Active','Policies Added','Response Rate'].map((l) => (
                <div key={l} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                  <span className="text-xs text-[#6B7280]">{l}</span>
                </div>
              ))}
            </div>
            <button className="mt-2 text-xs text-[#4A7C24] font-semibold flex items-center gap-1">
              View Full Report <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ── WALLET Quick Links (only on /wallet) ── */}
      {!collapsed && isWallet && (
        <div className="mx-3 mb-3 border-t border-[#dce8f2] pt-3">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider px-1 mb-2">
            Wallet Quick Links
          </p>
          {[
            { icon: ArrowUpRight, label: 'Withdraw Funds' },
            { icon: CreditCard,   label: 'Payment Methods' },
            { icon: Download,     label: 'Download Statement' },
            { icon: FileText,     label: 'Tax Documents' },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.label === 'Withdraw Funds') openModal('withdraw');
                else if (link.label === 'Payment Methods') window.location.href = '/wallet';
                else addToast(`${link.label} — opening shortly`, 'info');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#6B7280] hover:bg-[#ecf4fb] hover:text-[#374151] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <link.icon className="w-4 h-4 text-[#9CA3AF]" />
                {link.label}
              </div>
              <ChevronRight className="w-3 h-3 text-[#C5D3E0]" />
            </button>
          ))}

          {/* Upgrade CTA */}
          <div className="mt-3 p-3 bg-[#F0F7E8] rounded-xl border border-[#E8F5D8]">
            <p className="text-xs font-bold text-[#2D5016] mb-1">Upgrade to Pro</p>
            <p className="text-xs text-[#6B7280] mb-2">Unlock faster payouts, lower fees, and exclusive benefits.</p>
            <button
              onClick={() => openModal('upgrade-pro')}
              className="w-full bg-[#4A7C24] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#3A6B1A]"
            >
              Upgrade Now →
            </button>
          </div>
        </div>
      )}

      {/* ── COMMUNITY "Grow together" (only on /community) ── */}
      {!collapsed && isCommunity && (
        <div className="mx-3 mb-3 border-t border-[#dce8f2] pt-3">
          <div className="bg-[#ecf4fb] rounded-xl p-3 border border-[#c8dae8]">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm">🌱</span>
              <p className="text-xs font-bold text-[#374151]">Grow together,</p>
            </div>
            <p className="text-xs font-bold text-[#374151] mb-1">win together.</p>
            <p className="text-[10px] text-[#9CA3AF] mb-2 leading-relaxed">
              Be part of a global community built for creators and sellers.
            </p>
            <div className="flex -space-x-1.5">
              {communityMembers.slice(0, 5).map((m) => (
                <img key={m.id} src={m.avatar} alt={m.name}
                  className="w-6 h-6 rounded-full border-2 border-white app-image-bg" />
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-[#4A7C24] flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">+</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Pro badge ── */}
      {!collapsed && (
        <div className="mx-2 mb-3 mt-auto p-3 bg-[#F0F7E8] rounded-xl border border-[#E8F5D8]">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-[#4A7C24]" />
            <span className="text-xs font-bold text-[#2D5016]">Pro Seller</span>
          </div>
          <p className="text-[11px] text-[#6B7280] mb-1.5">You&apos;re on the Pro plan</p>
          <button
            onClick={() => openModal('upgrade-pro')}
            className="text-xs text-[#4A7C24] font-medium flex items-center gap-1 hover:text-[#3A6B1A]"
          >
            Unlock all features <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── User profile ── */}
      <div className={cn('border-t border-[#dce8f2] px-3 py-3 flex items-center gap-2.5', collapsed && 'justify-center px-0')}>
        <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" online={true} />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1A1F2E] truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-[#6B7280]">Pro Seller</span>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
