'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, LayoutGrid, List, ChevronRight, ChevronLeft,
  Download, Star, Shield, RefreshCw, X, Check, SlidersHorizontal,
  Grid3X3, Shirt, Cpu, Home, Sparkles, BookOpen, GraduationCap,
  Bot, Layout, Package, ArrowRight, MoreHorizontal, Infinity
} from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { products as mockProducts } from '@/lib/mockData';
import { api } from '@/lib/api-client';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

const categories = [
  { icon: Grid3X3,      label: 'All Products' },
  { icon: Shirt,        label: 'Clothing' },
  { icon: Cpu,          label: 'Electronics' },
  { icon: Home,         label: 'Home & Kitchen' },
  { icon: Sparkles,     label: 'Beauty' },
  { icon: BookOpen,     label: 'Books & Ebooks' },
  { icon: GraduationCap, label: 'Courses' },
  { icon: Bot,          label: 'AI Tools' },
  { icon: Layout,       label: 'Templates' },
  { icon: Package,      label: 'Accessories' },
];

const trustBadges = [
  { icon: Download,  label: 'Instant Download', sub: 'Get access right away' },
  { icon: Shield,    label: 'Secure Payment',   sub: '100% secure checkout' },
  { icon: Infinity,  label: 'Lifetime Access',  sub: 'Use forever, no expiry' },
  { icon: RefreshCw, label: 'Refund Policy',    sub: '14-day money-back' },
  { icon: Star,      label: 'Top Quality',      sub: 'Trusted by thousands' },
];

const sortOptions = [
  { value: 'default',    label: 'Most Relevant' },
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'popular',    label: 'Most Popular' },
];

const productCategories = ['AI Tool', 'Course', 'Template', 'Ebook', 'Physical'];
const productTypes      = ['digital', 'physical'];
const ratingOptions     = [4.5, 4.0, 3.5, 3.0];

export default function DiscoverPage() {
  const [productList, setProductList] = useState<Product[]>(mockProducts);
  const [activeCategory, setActiveCategory] = useState('All Products');

  useEffect(() => {
    api.getProducts().then(setProductList).catch(() => setProductList(mockProducts));
  }, []);
  const [viewMode, setViewMode]             = useState<'grid' | 'list'>('grid');
  const [showFilter, setShowFilter]         = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  /* ── Filter state ── */
  const [sortBy,          setSortBy]          = useState('default');
  const [selCategories,   setSelCategories]   = useState<string[]>([]);
  const [priceMin,        setPriceMin]        = useState('');
  const [priceMax,        setPriceMax]        = useState('');
  const [minRating,       setMinRating]       = useState(0);
  const [selTypes,        setSelTypes]        = useState<string[]>([]);
  const [searchQuery,     setSearchQuery]     = useState('');

  /* active filter count badge */
  const activeCount =
    (sortBy !== 'default' ? 1 : 0) +
    selCategories.length +
    (priceMin || priceMax ? 1 : 0) +
    (minRating ? 1 : 0) +
    selTypes.length;

  /* close on outside click */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setShowFilter(false);
    }
    if (showFilter) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showFilter]);

  function resetFilters() {
    setSortBy('default'); setSelCategories([]); setPriceMin('');
    setPriceMax(''); setMinRating(0); setSelTypes([]);
  }

  function toggleArray<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  /* ── Filtered + sorted products ── */
  const filtered = useMemo(() => {
    let list = [...productList];

    if (activeCategory !== 'All Products') {
      const map: Record<string, string[]> = {
        'AI Tools':     ['AI Tool'],
        'Courses':      ['Course'],
        'Templates':    ['Template'],
        'Books & Ebooks': ['Ebook'],
        'Electronics':  ['Physical'],
        'Clothing':     ['Physical'],
      };
      const cats = map[activeCategory] || [activeCategory];
      list = list.filter((p) => cats.includes(p.category));
    }

    if (selCategories.length)  list = list.filter((p) => selCategories.includes(p.category));
    if (selTypes.length)       list = list.filter((p) => selTypes.includes(p.type));
    if (minRating)             list = list.filter((p) => p.rating >= minRating);
    if (priceMin !== '')       list = list.filter((p) => p.price >= Number(priceMin));
    if (priceMax !== '')       list = list.filter((p) => p.price <= Number(priceMax));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     list.sort((a, b) => Number(b.id) - Number(a.id)); break;
      case 'popular':    list.sort((a, b) => parseFloat(b.reviewCount) - parseFloat(a.reviewCount)); break;
    }

    return list;
  }, [activeCategory, selCategories, selTypes, minRating, priceMin, priceMax, sortBy, searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-extrabold text-[#1A1F2E] flex items-center gap-2"
            style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            Discover <span className="text-[#4A7C24] text-2xl">✦</span>
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Find top digital and physical products to build, market, sell, and grow your business globally.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              placeholder="Search clothing, electronics, templates, courses, AI tools, ebooks, accessories, and more..."
              className="w-full h-11 pl-10 pr-12 bg-white border border-[#c8dae8] rounded-xl text-sm text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4A7C24] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            />
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-[#F0F7E8] flex items-center justify-center hover:bg-[#E8F5D8]"
              title="Clear search"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4A7C24]" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery((q) => q)}
            className="h-11 px-6 bg-[#4A7C24] text-white text-sm font-bold rounded-xl hover:bg-[#3A6B1A] shadow-[0_2px_8px_rgba(74,124,36,0.3)]"
          >
            Search
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scroll-hide pb-2 mb-5">
          {categories.map((cat) => (
            <button key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                activeCategory === cat.label
                  ? 'bg-[#3A6B1A] text-white shadow-sm'
                  : 'bg-white border border-[#c8dae8] text-[#374151] hover:border-[#4A7C24] hover:text-[#4A7C24]'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />{cat.label}
            </button>
          ))}
          <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 bg-white border border-[#c8dae8] text-[#374151] hover:border-[#4A7C24]">
            <MoreHorizontal className="w-3.5 h-3.5" /> More
          </button>
        </div>

        {/* Sort & Filter row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2" ref={filterRef}>
            {/* Sort & Filter button */}
            <div className="relative">
              <button
                onClick={() => setShowFilter((p) => !p)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
                  showFilter
                    ? 'bg-[#4A7C24] text-white border-[#4A7C24] shadow-[0_2px_8px_rgba(74,124,36,0.25)]'
                    : 'bg-white border-[#c8dae8] text-[#374151] hover:bg-[#ecf4fb]'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Sort &amp; Filter
                {activeCount > 0 && (
                  <span className={cn('w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center',
                    showFilter ? 'bg-white text-[#4A7C24]' : 'bg-[#4A7C24] text-white'
                  )}>
                    {activeCount}
                  </span>
                )}
              </button>

              {/* ── Filter Dropdown Panel ── */}
              <AnimatePresence>
                {showFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-[#c8dae8] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
                  >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#dce8f2]">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-[#4A7C24]" />
                        <span className="text-sm font-extrabold text-[#1A1F2E]">Sort &amp; Filter</span>
                        {activeCount > 0 && (
                          <span className="text-xs font-bold text-[#4A7C24] bg-[#F0F7E8] px-2 py-0.5 rounded-full">
                            {activeCount} active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {activeCount > 0 && (
                          <button onClick={resetFilters}
                            className="text-xs text-red-500 font-semibold hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50">
                            Reset all
                          </button>
                        )}
                        <button onClick={() => setShowFilter(false)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#ecf4fb]">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-5 max-h-[480px] overflow-y-auto">

                      {/* ── Sort by ── */}
                      <div>
                        <p className="text-xs font-extrabold text-[#374151] uppercase tracking-wider mb-2.5">Sort By</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {sortOptions.map((opt) => (
                            <button key={opt.value}
                              onClick={() => setSortBy(opt.value)}
                              className={cn(
                                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left',
                                sortBy === opt.value
                                  ? 'bg-[#4A7C24] text-white border-[#4A7C24]'
                                  : 'bg-white border-[#c8dae8] text-[#374151] hover:border-[#4A7C24] hover:bg-[#F0F7E8]'
                              )}
                            >
                              {sortBy === opt.value && <Check className="w-3 h-3 shrink-0" />}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-[#F1F5F9]" />

                      {/* ── Category ── */}
                      <div>
                        <p className="text-xs font-extrabold text-[#374151] uppercase tracking-wider mb-2.5">Category</p>
                        <div className="flex flex-wrap gap-1.5">
                          {productCategories.map((cat) => (
                            <button key={cat}
                              onClick={() => setSelCategories((p) => toggleArray(p, cat))}
                              className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                                selCategories.includes(cat)
                                  ? 'bg-[#4A7C24] text-white border-[#4A7C24]'
                                  : 'bg-white border-[#c8dae8] text-[#374151] hover:border-[#4A7C24]'
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-[#F1F5F9]" />

                      {/* ── Price Range ── */}
                      <div>
                        <p className="text-xs font-extrabold text-[#374151] uppercase tracking-wider mb-2.5">Price Range (USD)</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">$</span>
                            <input type="number" placeholder="Min"
                              value={priceMin}
                              onChange={(e) => setPriceMin(e.target.value)}
                              className="w-full pl-6 pr-3 py-2 border border-[#c8dae8] rounded-xl text-xs focus:outline-none focus:border-[#4A7C24] placeholder:text-[#9CA3AF]"
                            />
                          </div>
                          <span className="text-[#9CA3AF] text-sm font-medium">–</span>
                          <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">$</span>
                            <input type="number" placeholder="Max"
                              value={priceMax}
                              onChange={(e) => setPriceMax(e.target.value)}
                              className="w-full pl-6 pr-3 py-2 border border-[#c8dae8] rounded-xl text-xs focus:outline-none focus:border-[#4A7C24] placeholder:text-[#9CA3AF]"
                            />
                          </div>
                        </div>
                        {/* Quick price presets */}
                        <div className="flex gap-1.5 mt-2">
                          {[['0','25'],['25','50'],['50','100'],['100','']].map(([min, max]) => (
                            <button key={`${min}-${max}`}
                              onClick={() => { setPriceMin(min); setPriceMax(max); }}
                              className={cn(
                                'flex-1 py-1.5 rounded-lg text-[10px] font-semibold border transition-all',
                                priceMin === min && priceMax === max
                                  ? 'bg-[#4A7C24] text-white border-[#4A7C24]'
                                  : 'bg-white border-[#c8dae8] text-[#6B7280] hover:border-[#4A7C24]'
                              )}
                            >
                              {max ? `$${min}–$${max}` : `$${min}+`}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-[#F1F5F9]" />

                      {/* ── Rating ── */}
                      <div>
                        <p className="text-xs font-extrabold text-[#374151] uppercase tracking-wider mb-2.5">Minimum Rating</p>
                        <div className="flex gap-2">
                          {ratingOptions.map((r) => (
                            <button key={r}
                              onClick={() => setMinRating(minRating === r ? 0 : r)}
                              className={cn(
                                'flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border text-xs font-bold transition-all',
                                minRating === r
                                  ? 'bg-amber-400 text-white border-amber-400'
                                  : 'bg-white border-[#c8dae8] text-[#374151] hover:border-amber-300'
                              )}
                            >
                              <Star className="w-3 h-3 fill-current" /> {r}+
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-[#F1F5F9]" />

                      {/* ── Product Type ── */}
                      <div>
                        <p className="text-xs font-extrabold text-[#374151] uppercase tracking-wider mb-2.5">Product Type</p>
                        <div className="flex gap-2">
                          {productTypes.map((t) => (
                            <button key={t}
                              onClick={() => setSelTypes((p) => toggleArray(p, t))}
                              className={cn(
                                'flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all',
                                selTypes.includes(t)
                                  ? 'bg-[#4A7C24] text-white border-[#4A7C24]'
                                  : 'bg-white border-[#c8dae8] text-[#374151] hover:border-[#4A7C24]'
                              )}
                            >
                              {t === 'digital' ? '💾 Digital' : '📦 Physical'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Apply footer */}
                    <div className="px-4 py-3 border-t border-[#dce8f2] bg-[#f5faff] flex items-center justify-between">
                      <span className="text-xs text-[#9CA3AF]">
                        {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
                      </span>
                      <button
                        onClick={() => setShowFilter(false)}
                        className="px-5 py-2 bg-[#4A7C24] text-white text-sm font-bold rounded-xl hover:bg-[#3A6B1A] shadow-[0_2px_8px_rgba(74,124,36,0.25)]"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="text-sm text-[#9CA3AF]">
              1–{Math.min(filtered.length, 12)} of {filtered.length} products
            </span>
          </div>

          {/* View toggle + pagination */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => setViewMode('grid')} className={cn('w-8 h-8 rounded-lg flex items-center justify-center', viewMode === 'grid' ? 'bg-[#F0F7E8] text-[#4A7C24]' : 'text-[#9CA3AF] hover:bg-[#ecf4fb]')}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={cn('w-8 h-8 rounded-lg flex items-center justify-center', viewMode === 'list' ? 'bg-[#F0F7E8] text-[#4A7C24]' : 'text-[#9CA3AF] hover:bg-[#ecf4fb]')}>
              <List className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 ml-1">
              <button className="w-7 h-7 rounded-lg bg-white border border-[#c8dae8] flex items-center justify-center hover:bg-[#ecf4fb]">
                <ChevronLeft className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-white border border-[#c8dae8] flex items-center justify-center hover:bg-[#ecf4fb]">
                <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-start gap-6 overflow-x-auto scroll-hide mb-6 py-3 px-4 bg-white rounded-xl border border-[#c8dae8]">
          {trustBadges.map((badge, i) => (
            <div key={badge.label} className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#F0F7E8] flex items-center justify-center">
                <badge.icon className="w-4 h-4 text-[#4A7C24]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#374151]">{badge.label}</p>
                <p className="text-[10px] text-[#9CA3AF]">{badge.sub}</p>
              </div>
              {i < trustBadges.length - 1 && <div className="ml-3 w-px h-6 bg-[#F1F5F9] shrink-0" />}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#F0F7E8] flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[#4A7C24]" />
            </div>
            <h3 className="text-base font-bold text-[#1A1F2E] mb-2">No products found</h3>
            <p className="text-sm text-[#9CA3AF] mb-4">Try adjusting your filters or clearing them</p>
            <button onClick={resetFilters}
              className="px-5 py-2 bg-[#4A7C24] text-white text-sm font-semibold rounded-xl hover:bg-[#3A6B1A]">
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Recommended For You */}
        {filtered.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-extrabold text-[#1A1F2E] flex items-center gap-2"
                style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                Recommended For You <span className="text-[#4A7C24]">✦</span>
              </h2>
              <button className="text-sm text-[#4A7C24] font-semibold flex items-center gap-1 hover:text-[#3A6B1A]">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Handpicked top products based on global trends and seller performance.
            </p>
            <motion.div
              initial="hidden" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} featured />
              ))}
            </motion.div>
            <div className="flex justify-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`rounded-full transition-all ${i === 0 ? 'w-4 h-2 bg-[#4A7C24]' : 'w-2 h-2 bg-[#E5E9F0]'}`} />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        {filtered.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-[#1A1F2E]"
                style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                All Products
              </h2>
              <button className="text-sm text-[#4A7C24] font-semibold flex items-center gap-1">
                View All Products <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <motion.div
              initial="hidden" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3"
            >
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
