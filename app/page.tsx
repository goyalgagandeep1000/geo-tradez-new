'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HeroGlobe } from '@/components/home/HeroGlobe';
import {
  Store, Megaphone, Globe, Settings, ShoppingCart, Play,
  CheckCircle, RefreshCw, TrendingUp, Users,
  Star, DollarSign, MapPin, ArrowRight, Mail, Crown,
  LogIn, UserPlus
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';

/* Circular G logo */
function GeoLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center shrink-0">
      <div className="absolute inset-0 rounded-full border-2 border-[#4A7C24]" />
      <div className="absolute inset-0.5 rounded-full bg-[#4A7C24]" />
      <span className="relative text-white font-extrabold leading-none select-none" style={{ fontSize: size * 0.38, fontFamily: 'Sora, Inter, sans-serif' }}>G</span>
    </div>
  );
}

const features = [
  { icon: Store, title: 'Smart Store Setup', desc: 'Launch your professional store in minutes with powerful templates.' },
  { icon: Megaphone, title: 'Powerful Marketing', desc: 'Promote, run campaigns, and grow your audience with advanced tools.' },
  { icon: Globe, title: 'Sell Globally', desc: 'Reach millions of customers worldwide with multi-currency and multi-language support.' },
  { icon: Settings, title: 'Automate & Scale', desc: 'Automate tasks, manage orders, and scale your business with smart automation.' },
];

const stats = [
  { icon: DollarSign, value: '$2.4B+', label: 'Total Sales Generated', sub: '+28% growth this year', bg: 'bg-[#1E3A5F]' },
  { icon: Users, value: '125K+', label: 'Active Users', sub: 'From 180+ countries', bg: 'bg-[#1A3A2A]' },
  { icon: TrendingUp, value: '3.24%', label: 'Average Conversion Rate', sub: '+1.2% vs industry average', bg: 'bg-[#1A2A3A]' },
  { icon: Store, value: '18K+', label: 'Active Stores', sub: 'Across all categories', bg: 'bg-[#2A1A3A]' },
  { icon: MapPin, value: '180+', label: 'Countries Reached', sub: 'Global community', bg: 'bg-[#3A1A1A]' },
];

const testimonials = [
  {
    name: 'James Carter',
    role: 'Founder, UrbanHike',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    quote: 'Geotradez helped me launch and grow my store globally. The tools are powerful, yet so easy to use.',
    rating: 4,
  },
  {
    name: 'Priya Sharma',
    role: 'CEO, Orik & Awake',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=80&h=80&fit=crop&crop=face',
    quote: 'The built-in marketing tools and analytics give our store the growth boost we always needed.',
    rating: 4,
  },
  {
    name: 'Sophia Lee',
    role: 'Owner, Grow Beauty',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    quote: 'I can manage everything in one place. Geotradez is a game-changer for e-commerce businesses.',
    rating: 5,
  },
];

export default function HomePage() {
  const { openModal, addToast, newsletterEmail, subscribeNewsletter } = useAppStore();
  const [emailInput, setEmailInput] = useState('');

  return (
    <div className="min-h-screen app-shell-bg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav className="bg-white border-b border-[#c8dae8] sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <GeoLogo size={32} />
            <span className="font-bold text-[#1A1F2E] text-[15px]" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Geotradez</span>
          </div>
          {/* Right nav items */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:flex items-center gap-1.5 text-sm text-[#374151] font-medium px-3 py-2 hover:text-[#1A1F2E] transition-colors">
              <LogIn className="w-4 h-4" /> Login
            </Link>
            <Link href="/login" className="hidden sm:flex items-center gap-1.5 text-sm text-[#374151] font-medium px-3 py-2 hover:text-[#1A1F2E] transition-colors">
              <UserPlus className="w-4 h-4" /> Register
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-[#4A7C24] hover:bg-[#3A6B1A] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-[0_2px_8px_rgba(74,124,36,0.3)] transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" /> Sign Up
            </Link>
            <button
              onClick={() => openModal('upgrade-pro')}
              className="flex items-center gap-1.5 bg-white border border-[#c8dae8] text-sm text-[#374151] font-medium px-3 py-2 rounded-lg hover:bg-[#ecf4fb] transition-all"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" /> Upgrade
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-[#F0F7E8] border border-[#E8F5D8] px-3 py-1.5 rounded-full mb-5">
              <Star className="w-3.5 h-3.5 text-[#4A7C24] fill-[#4A7C24]" />
              <span className="text-xs font-semibold text-[#3A6B1A]">The Smarter Way to Sell Globally</span>
            </div>

            <h1 className="text-[42px] font-extrabold text-[#1A1F2E] leading-tight mb-2" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Welcome to Geotradez
            </h1>
            <h2 className="text-[28px] font-extrabold text-[#4A7C24] mb-4 leading-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Build. Market. Sell. Grow Globally.
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-7 max-w-md">
              Geotradez is an all-in-one upgraded online marketing and e-commerce platform that helps you build your store, market your brand, and grow globally â€” like Shopify or Amazon, but more advanced.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link href="/discover" className="inline-flex items-center gap-2 bg-[#4A7C24] hover:bg-[#3A6B1A] text-white font-semibold px-6 py-3 rounded-xl shadow-[0_2px_8px_rgba(74,124,36,0.3)] transition-all text-sm">
                  <ShoppingCart className="w-4 h-4" /> Start Selling
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link href="/ai-create" className="inline-flex items-center gap-2 bg-white border border-[#c8dae8] text-[#374151] font-semibold px-6 py-3 rounded-xl hover:bg-[#ecf4fb] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-sm">
                  <Play className="w-4 h-4 text-[#4A7C24]" /> Explore Platform
                </Link>
              </motion.div>
            </div>
            <div className="flex items-center gap-5 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" /> 7-Day Free Trial
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#9CA3AF]" /> Cancel Anytime
              </span>
            </div>
          </motion.div>

          {/* Right - Globe with floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative flex items-center justify-center min-h-[520px]"
          >
            <HeroGlobe />
          </motion.div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="bg-white border-y border-[#c8dae8] py-8">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-[#F1F5F9]">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 px-6 first:pl-0 last:pr-0 py-2"
            >
              <div className="w-10 h-10 rounded-full bg-[#F0F7E8] border border-[#E8F5D8] flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-[#4A7C24]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1A1F2E] mb-1">{f.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-[#1A1F2E] mb-2" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            Loved by Entrepreneurs Worldwide
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-[#c8dae8] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] relative"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#c8dae8] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#1A1F2E]">{t.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                ))}
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">{t.quote}</p>
              {/* Large quotation mark */}
              <div className="absolute bottom-4 right-5 text-5xl text-[#E8F5D8] font-serif leading-none select-none">&rdquo;</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Bar â€” dark navy background */}
      <section className="py-12" style={{ background: 'linear-gradient(135deg, #0F1B2E 0%, #1A2840 50%, #0F1B2E 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center mx-auto mb-3 border border-white/10`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{s.value}</p>
              <p className="text-xs text-blue-200 font-medium leading-tight">{s.label}</p>
              <p className="text-xs text-blue-300/60 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1F2E] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-6 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <GeoLogo size={28} />
                <span className="font-bold text-white text-[15px]" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Geotradez</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs">The all-in-one platform to build, market, and sell your products globally.</p>
            </div>
            {/* Columns */}
            {[
              { title: 'Platform', links: ['Overview', 'How It Works', 'Pricing'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'Guides'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact Us', 'Status'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link href="/discover" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Newsletter + bottom */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">Â© 2024 Geotradez. All rights reserved.</p>
            <div className="flex items-center gap-0 bg-white/5 rounded-lg overflow-hidden border border-white/10">
              <div className="flex items-center gap-2 px-3 py-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-transparent text-xs text-gray-300 placeholder:text-gray-500 focus:outline-none w-40"
                />
              </div>
              <button
                onClick={() => {
                  if (!emailInput.includes('@')) {
                    addToast('Enter a valid email', 'error');
                    return;
                  }
                  subscribeNewsletter(emailInput);
                  setEmailInput('');
                }}
                className="bg-[#4A7C24] text-white text-xs font-semibold px-4 py-2.5 hover:bg-[#3A6B1A] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
