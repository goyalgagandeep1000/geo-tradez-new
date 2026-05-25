'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Edit2, Plus, ExternalLink, Camera, CheckCircle2,
  ShoppingBag, ClipboardList, Target, Eye, Star,
  MoreHorizontal, LayoutGrid, List, ArrowRight, Info,
  ChevronDown, Heart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { storeProducts as mockStoreProducts, revenueData as mockRevenue, savedItems } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';

const storeMetrics = [
  { icon: ShoppingBag,   iconBg: 'bg-green-50',  iconColor: 'text-green-600',  label: 'Total Sales',       value: '$48,629.30', change: '+24.6%', period: 'vs last 30 days' },
  { icon: ClipboardList, iconBg: 'bg-blue-50',   iconColor: 'text-blue-600',   label: 'Orders',            value: '1,248',      change: '+18.3%', period: 'vs last 30 days' },
  { icon: Target,        iconBg: 'bg-orange-50', iconColor: 'text-orange-500', label: 'Conversion Rate',   value: '3.42%',      change: '+8.7%',  period: 'vs last 30 days' },
  { icon: Eye,           iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: 'Store Views',       value: '32,659',     change: '+21.1%', period: 'vs last 30 days' },
];

function MyStorePageContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  const { openModal, addToast, storeProducts, revenueData: storeRevenue } = useAppStore();
  const displayProducts = storeProducts.length > 0 ? storeProducts : mockStoreProducts;
  const chartData = storeRevenue.length > 0 ? storeRevenue : mockRevenue;

  return (
    <div className="flex flex-1 min-h-0 h-full overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-4">

          {/* Store Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-start gap-4">
              {/* Circular store photo */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#c8dae8] shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=120&h=120&fit=crop"
                    alt="HomeHaven Collective"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#4A7C24] rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-extrabold text-[#1A1F2E]">HomeHaven Collective</h2>
                  <CheckCircle2 className="w-5 h-5 text-[#4A7C24]" />
                </div>
                <p className="text-sm text-[#6B7280] mb-2.5">
                  Curated home essentials for modern living. Quality, style, and comfort in every piece.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9CA3AF]">
                  <span>🏠 Home &amp; Kitchen</span>
                  <span>📅 Joined Jan 15, 2024</span>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-[#374151]">4.8</span>
                    <span>(1.2K reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openModal('edit-store')}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-[#c8dae8] rounded-lg text-sm text-[#374151] hover:bg-[#ecf4fb] font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Store
                </button>
                <button
                  onClick={() => openModal('add-product')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4A7C24] text-white rounded-lg text-sm font-semibold hover:bg-[#3A6B1A] shadow-[0_2px_8px_rgba(74,124,36,0.2)]"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
                <button
                  onClick={() => addToast('Opening your public storefront', 'info')}
                  className="flex items-center gap-1.5 text-sm text-[#4A7C24] font-semibold hover:text-[#3A6B1A] ml-1"
                >
                  View Storefront <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {storeMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-[#c8dae8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', metric.iconBg)}>
                    <metric.icon className={cn('w-[18px] h-[18px]', metric.iconColor)} />
                  </div>
                  <Info className="w-3.5 h-3.5 text-[#C5D3E0]" />
                </div>
                <p className="text-xs font-medium text-[#9CA3AF] mb-1">{metric.label}</p>
                <p className="text-xl font-extrabold text-[#1A1F2E] mb-1">{metric.value}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">↑ {metric.change}</span>
                  <span className="text-xs text-[#9CA3AF]">{metric.period}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Products + Analytics side-by-side */}
          <div className="grid xl:grid-cols-3 gap-4">
            {/* Products Grid — takes 2/3 */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1A1F2E]">My Products</h3>
                  <button className="flex items-center gap-1 bg-[#ecf4fb] border border-[#c8dae8] rounded-lg px-2.5 py-1.5 text-xs text-[#374151] font-medium hover:bg-[#F0F7E8]">
                    All Products (12) <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-xs text-[#6B7280] px-3 py-1.5 border border-[#c8dae8] rounded-lg hover:bg-[#ecf4fb] font-medium">
                    Sort: Latest <ChevronDown className="w-3 h-3" />
                  </button>
                  <button onClick={() => setViewMode('grid')} className={cn('w-7 h-7 rounded-lg flex items-center justify-center', viewMode === 'grid' ? 'bg-[#F0F7E8] text-[#4A7C24]' : 'text-[#9CA3AF] hover:bg-[#ecf4fb]')}>
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={cn('w-7 h-7 rounded-lg flex items-center justify-center', viewMode === 'list' ? 'bg-[#F0F7E8] text-[#4A7C24]' : 'text-[#9CA3AF] hover:bg-[#ecf4fb]')}>
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button className="text-xs text-[#4A7C24] font-semibold flex items-center gap-1 ml-1">
                    View All Products <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="group bg-white rounded-xl border border-[#c8dae8] overflow-hidden cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  >
                    <div className="relative h-36 app-image-bg overflow-hidden">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <span className={cn('absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md', product.categoryColor)}>
                        {product.category}
                      </span>
                      <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-3 h-3 text-gray-500" />
                      </button>
                      <span className={cn(
                        'absolute bottom-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md',
                        product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      )}>
                        {product.status}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-semibold text-[#1A1F2E] line-clamp-2 mb-1.5 leading-snug">{product.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-[#374151]">{product.rating}</span>
                          <span className="text-[10px] text-[#9CA3AF]">({product.reviewCount})</span>
                        </div>
                        <span className="text-sm font-bold text-[#1A1F2E]">${product.price}</span>
                      </div>
                      <button className="mt-1.5 w-full text-[10px] font-medium text-[#9CA3AF] hover:text-[#374151] flex items-center justify-center border border-[#dce8f2] rounded-md py-1">
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Analytics + Saved Items */}
            <div className="space-y-4">
              {/* Analytics Chart */}
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-[#1A1F2E]">Product Analytics</h3>
                  <button className="text-xs text-[#6B7280] border border-[#c8dae8] rounded-lg px-2 py-1 flex items-center gap-1">
                    Last 30 Days <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-[#9CA3AF] mb-0.5">Total Revenue</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-extrabold text-[#1A1F2E]">$48,629.30</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ 24.6%</span>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="storeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4A7C24" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#4A7C24" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 8, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E9F0' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#4A7C24" strokeWidth={2} fill="url(#storeGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <button className="mt-1 text-xs text-[#4A7C24] font-semibold flex items-center gap-1">
                  View Full Analytics <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Saved Items */}
              <div className="bg-white rounded-2xl border border-[#c8dae8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#1A1F2E]">Saved Items</h3>
                  <button className="text-xs text-[#4A7C24] font-semibold hover:text-[#3A6B1A]">View All →</button>
                </div>
                <div className="space-y-3">
                  {savedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover app-image-bg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A1F2E] truncate">{item.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#4A7C24]">${item.price}</span>
                        <button className="w-6 h-6 rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-red-400">
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function MyStorePage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6 text-sm text-[#6B7280]">Loading store…</div>}>
      <MyStorePageContent />
    </Suspense>
  );
}
