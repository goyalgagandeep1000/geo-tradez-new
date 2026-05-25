'use client';
import { useState, use, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star, CheckCircle2, ShoppingCart, Heart, Share2, ChevronRight,
  Download, FileText, RefreshCw, Headphones, Shield, Package,
  ChevronLeft, ExternalLink, Maximize2, Play, ArrowLeft, ArrowRight,
  Clock, Users, Globe, Zap, Info, Eye
} from 'lucide-react';
import Link from 'next/link';
import { products as mockProducts } from '@/lib/mockData';
import { api } from '@/lib/api-client';
import type { Product } from '@/types';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

const tabs = ['Overview', "What's Included", 'Reviews 2.1K', 'Seller Info', 'FAQs'];

const reviewStars = [
  { stars: 5, count: 1854 },
  { stars: 4, count: 196 },
  { stars: 3, count: 62 },
  { stars: 2, count: 18 },
  { stars: 1, count: 16 },
];

const deliveryInfo = [
  { label: 'Delivery', value: 'Instant Download' },
  { label: 'File Type', value: 'ZIP, JSON, PDF' },
  { label: 'Access Type', value: 'Online Access' },
  { label: 'License', value: 'Regular License' },
  { label: 'Updates', value: 'Lifetime Updates' },
  { label: 'Support', value: '6 Months Support' },
  { label: 'Language', value: 'English' },
  { label: 'Compatibility', value: 'Web, Windows, Mac' },
];

const trustBadges = [
  { icon: Download, label: 'Instant Download', sub: 'Get access immediately' },
  { icon: Shield, label: 'Secure Payment', sub: '100% secure checkout' },
  { icon: RefreshCw, label: 'Lifetime Access', sub: 'Use forever, no expiry' },
  { icon: Globe, label: 'Refund Policy', sub: '14-day money-back' },
  { icon: Zap, label: 'Commercial Use', sub: 'Use in unlimited projects' },
];

// Extra gallery images per product (using different aspects of the same product)
function getProductGallery(productImage: string): string[] {
  // Build a 4-image gallery: main + 3 filtered variants using Unsplash params
  const base = productImage.split('?')[0];
  return [
    `${base}?w=600&h=500&fit=crop`,
    `${base}?w=600&h=500&fit=crop&sat=-50`,
    `${base}?w=600&h=500&fit=crop&con=-30`,
    `${base}?w=600&h=500&fit=crop&blur=2`,
  ];
}

export default function ProductViewPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [product, setProduct] = useState<Product>(mockProducts[0]);
  const { addToCart, toggleWishlist, isInWishlist, openModal, toggleSavedItem, savedItems, addToast } = useAppStore();

  useEffect(() => {
    api.getProduct(productId)
      .then(setProduct)
      .catch(() => {
        const found = mockProducts.find((p) => p.id === productId);
        if (found) setProduct(found);
      });
  }, [productId]);

  const saved = isInWishlist(product.id) || savedItems.includes(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const thumbImages = getProductGallery(product.image);

  const relatedProducts = mockProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF] mb-5">
          <Link href="/discover" className="hover:text-[#374151] flex items-center gap-1">
            Discover
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#6B7280]">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#374151] font-semibold truncate">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left column: image + gallery + tabs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Product detail header */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Image column */}
              <div className="space-y-3">
                {/* Main image with nav arrows */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-square">
                  <img
                    src={thumbImages[selectedThumb]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {product.badge && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500 text-white shadow-sm">
                        ⭐ {product.badge}
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500 text-white shadow-sm">
                      🏆 Top Rated
                    </span>
                  </div>
                  {/* Expand icon */}
                  <button className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center hover:bg-black/60 backdrop-blur-sm">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </button>
                  {/* Left/Right navigation arrows */}
                  <button
                    onClick={() => setSelectedThumb(Math.max(0, selectedThumb - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#374151]" />
                  </button>
                  <button
                    onClick={() => setSelectedThumb(Math.min(thumbImages.length - 1, selectedThumb + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white"
                  >
                    <ChevronRight className="w-4 h-4 text-[#374151]" />
                  </button>
                  {/* Preview Demo button overlay */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center">
                    <button className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all border border-white/20">
                      <Play className="w-3.5 h-3.5 fill-white" /> Preview Demo
                    </button>
                  </div>
                </div>

                {/* Thumbnail strip */}
                <div className="flex gap-2 overflow-x-auto scroll-hide">
                  {thumbImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedThumb(i)}
                      className={cn(
                        'w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
                        selectedThumb === i ? 'border-[#4A7C24]' : 'border-transparent hover:border-[#E5E9F0]'
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <button className="w-14 h-14 rounded-xl border-2 border-dashed border-[#E5E9F0] flex items-center justify-center text-xs text-[#9CA3AF] shrink-0 bg-[#f5faff] font-semibold">
                    +6
                  </button>
                </div>
              </div>

              {/* Product info column */}
              <div>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md', product.categoryColor)}>
                  {product.category}
                </span>
                <h1 className="text-xl font-extrabold text-[#1A1F2E] mt-2 mb-2 leading-tight">{product.title}</h1>
                <p className="text-sm text-[#6B7280] mb-3 leading-relaxed">
                  Generate high-converting content, copy, and ideas in seconds with the power of AI.
                </p>
                {/* Seller row */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
                    {product.seller.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-[#374151]">{product.seller}</span>
                  {product.sellerVerified && (
                    <span className="flex items-center gap-1 text-xs text-[#4A7C24] font-semibold bg-[#F0F7E8] px-2 py-0.5 rounded-full border border-[#E8F5D8]">
                      <CheckCircle2 className="w-3 h-3" /> Verified Seller
                    </span>
                  )}
                </div>
                {/* Stars */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn('w-4 h-4', i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[#1A1F2E]">{product.rating}</span>
                  <span className="text-xs text-[#9CA3AF]">({product.reviewCount} reviews)</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { icon: Star, label: 'Seller Rating', val: '4.9' },
                    { icon: Users, label: 'Total Sales', val: '12.4K' },
                    { icon: Clock, label: 'Response Time', val: '2 hrs' },
                    { icon: CheckCircle2, label: 'Positive Feedback', val: '98%' },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#f5faff] border border-[#F1F5F9] rounded-xl p-2.5 flex items-center gap-2">
                      <s.icon className="w-4 h-4 text-[#4A7C24] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#1A1F2E]">{s.val}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E9F0] rounded-xl text-sm text-[#374151] hover:bg-[#ecf4fb] transition-colors font-medium">
                  <ExternalLink className="w-4 h-4 text-[#4A7C24]" /> Visit Store
                </button>
              </div>
            </div>

            {/* Trust badges row */}
            <div className="flex items-start gap-0 overflow-x-auto scroll-hide divide-x divide-[#F1F5F9] bg-white rounded-xl border border-[#E5E9F0] px-2 py-3">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 px-4 shrink-0">
                  <badge.icon className="w-4 h-4 text-[#4A7C24] shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#374151]">{badge.label}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-[#E5E9F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="border-b border-[#F1F5F9] flex overflow-x-auto scroll-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all shrink-0',
                      activeTab === tab
                        ? 'border-[#4A7C24] text-[#4A7C24]'
                        : 'border-transparent text-[#6B7280] hover:text-[#374151]'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === 'Overview' && (
                  <div className="space-y-4">
                    <p className="text-sm text-[#374151] leading-relaxed">
                      AI Writer Pro is your all-in-one writing assistant that generates high-quality content for blogs, ads, emails, product descriptions, and more. Save time, boost productivity, and scale your content creation effortlessly.
                    </p>
                    {/* Delivery info grid */}
                    <div className="grid grid-cols-2 gap-0 border border-[#F1F5F9] rounded-xl overflow-hidden">
                      {deliveryInfo.map((item, i) => (
                        <div key={item.label} className={cn('flex items-center gap-2 px-4 py-2.5', i % 2 === 0 ? 'bg-[#f5faff]' : 'bg-white', i > 1 ? 'border-t border-[#F1F5F9]' : '')}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C24] shrink-0" />
                          <span className="text-xs text-[#9CA3AF] w-20 shrink-0">{item.label}</span>
                          <span className="text-xs font-semibold text-[#374151]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'Reviews 2.1K' && (
                  <div className="space-y-5">
                    <div className="flex items-start gap-6">
                      <div className="text-center">
                        <p className="text-5xl font-extrabold text-[#1A1F2E]">4.9</p>
                        <div className="flex gap-0.5 mt-1 justify-center">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                        <p className="text-xs text-[#9CA3AF] mt-1">(2,346 reviews)</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {reviewStars.map((r) => {
                          const total = reviewStars.reduce((a, b) => a + b.count, 0);
                          const pct = Math.round((r.count / total) * 100);
                          return (
                            <div key={r.stars} className="flex items-center gap-2">
                              <span className="text-xs text-[#6B7280] w-7 text-right">{r.stars} Stars</span>
                              <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-[#9CA3AF] w-8 text-right">{r.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Filter row */}
                    <div className="flex gap-2 flex-wrap">
                      {['Most Recent', 'Highest Rated', 'With Images', 'Verified Purchases Only'].map((f, i) => (
                        <button key={f} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', i === 0 ? 'bg-[#ecf4fb] border-[#E5E9F0] text-[#374151]' : 'border-[#E5E9F0] text-[#9CA3AF] hover:border-[#4A7C24]')}>
                          {f} {i < 3 ? '▾' : ''}
                        </button>
                      ))}
                    </div>
                    {/* Sample review */}
                    <div className="border-t border-[#F1F5F9] pt-4">
                      <div className="flex items-center gap-3 mb-2">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia" alt="Sophia" className="w-8 h-8 rounded-full app-image-bg" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-[#374151]">Sophia Martinez</p>
                            <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#4A7C24]" /> Verified Purchase
                            </span>
                            <span className="text-xs text-[#9CA3AF]">May 24, 2024</span>
                          </div>
                          <div className="flex gap-0.5 mt-0.5">
                            {[...Array(4)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#374151] leading-relaxed">This tool is a game-changer! It writes high-quality content in seconds...</p>
                    </div>
                  </div>
                )}

                {!['Overview', 'Reviews 2.1K'].includes(activeTab) && (
                  <p className="text-sm text-[#9CA3AF] text-center py-8">Content coming soon...</p>
                )}
              </div>
            </div>

            {/* You May Also Like */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#1A1F2E]">You May Also Like</h3>
                <button className="text-sm text-[#4A7C24] font-semibold flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.map((p, i) => (
                  <Link key={p.id} href={`/discover/${p.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -2 }}
                    className="group bg-white rounded-xl border border-[#E5E9F0] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer"
                  >
                    <div className="relative h-24 app-image-bg overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-2.5 h-2.5 text-gray-500" />
                      </button>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-[#1A1F2E] line-clamp-2 leading-snug mb-1">{p.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] text-[#6B7280]">{p.rating}</span>
                        </div>
                        <span className="text-xs font-bold text-[#1A1F2E]">${p.price}</span>
                      </div>
                    </div>
                  </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Purchase panel */}
          <div className="space-y-3">
            {/* Limited Time Offer badge */}
            <div className="bg-white rounded-2xl border border-[#E5E9F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Header: Limited Time Offer */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#FFFBF0] border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-amber-700">Limited Time Offer</span>
                </div>
                {discount > 0 && (
                  <span className="text-xs font-extrabold text-white bg-red-500 px-2 py-0.5 rounded-lg">-{discount}%</span>
                )}
              </div>

              <div className="p-4">
                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-3xl font-extrabold text-[#1A1F2E]">${product.price}.00</span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#9CA3AF] line-through">${product.originalPrice}.00</span>
                    )}
                  </div>
                  <p className="text-xs text-[#9CA3AF]">One-time payment • Lifetime access</p>
                </div>

                {/* License Type */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#374151] mb-1.5">License Type</p>
                  <button className="w-full flex items-center justify-between px-3 py-2.5 border border-[#E5E9F0] rounded-xl text-sm text-[#374151] font-medium hover:border-[#4A7C24] bg-white">
                    Regular License <ChevronRight className="w-4 h-4 text-[#9CA3AF] rotate-90" />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 mb-4">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openModal('checkout', { productId: product.id })}
                    className="w-full py-3 bg-[#4A7C24] text-white font-bold rounded-xl hover:bg-[#3A6B1A] shadow-[0_2px_8px_rgba(74,124,36,0.3)] flex items-center justify-center gap-2 text-sm"
                  >
                    <Zap className="w-4 h-4" /> Buy Now
                  </motion.button>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full py-2.5 border border-[#E5E9F0] text-[#374151] font-semibold rounded-xl hover:bg-[#ecf4fb] flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      toggleWishlist(product.id);
                      toggleSavedItem(product.id);
                    }}
                    className={cn(
                      'w-full py-2.5 font-medium rounded-xl hover:bg-[#ecf4fb] flex items-center justify-center gap-2 text-sm',
                      saved ? 'text-[#4A7C24] bg-[#F0F7E8]' : 'text-[#6B7280]'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', saved && 'fill-[#4A7C24]')} /> Save for Later
                  </button>
                </div>

                {/* Secure badge */}
                <p className="text-center text-xs text-[#9CA3AF] flex items-center justify-center gap-1 mb-4">
                  <Shield className="w-3 h-3" /> Secure checkout • SSL Encrypted
                </p>

                {/* Includes */}
                <div className="mb-4 space-y-1.5">
                  <p className="text-xs font-bold text-[#374151] mb-2">Includes:</p>
                  {[
                    { icon: FileText, label: 'Files & Templates' },
                    { icon: Download, label: 'Step-by-step Guide' },
                    { icon: RefreshCw, label: 'Lifetime Updates' },
                    { icon: Headphones, label: 'Priority Support' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span className="text-xs text-[#374151]">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* 14-day guarantee */}
                <div className="bg-[#F0F7E8] rounded-xl p-3 border border-[#E8F5D8] flex items-center gap-2.5 mb-4">
                  <Shield className="w-5 h-5 text-[#4A7C24] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#2D5016]">14-Day Money-Back Guarantee</p>
                  </div>
                </div>

                {/* Seller card */}
                <div className="border border-[#E5E9F0] rounded-xl p-3">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {product.seller.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-[#374151]">{product.seller}</p>
                        <CheckCircle2 className="w-3 h-3 text-[#4A7C24]" />
                        <span className="text-[10px] text-[#4A7C24] font-medium">Verified Seller</span>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-[#374151] border border-[#E5E9F0] px-2.5 py-1.5 rounded-lg hover:bg-[#ecf4fb]">
                      Visit Store
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { val: '4.9', label: 'Rating' },
                      { val: '12.4K', label: 'Sales' },
                      { val: '2 hrs', label: 'Response' },
                      { val: '98%', label: 'Positive' },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-xs font-extrabold text-[#1A1F2E]">{s.val}</p>
                        <p className="text-[9px] text-[#9CA3AF]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                addToast('Product link copied to clipboard');
              }}
              className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#6B7280] mx-4"
            >
              <Share2 className="w-4 h-4" /> Share this product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
