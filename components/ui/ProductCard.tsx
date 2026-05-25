'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, Heart, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const badgeStyles: Record<string, string> = {
  'Best Seller': 'bg-amber-100 text-amber-700',
  'Trending':    'bg-red-100 text-red-600',
  'Top Rated':   'bg-blue-100 text-blue-700',
  'New':         'bg-purple-100 text-purple-700',
};

const badgeIcons: Record<string, string> = {
  'Best Seller': '⭐',
  'Trending':    '🔥',
  'Top Rated':   '🏆',
  'New':         '✨',
};

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, openModal } = useAppStore();
  const saved = isInWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
        transition={{ duration: 0.2 }}
        className="group app-card rounded-xl overflow-hidden h-full flex flex-col"
      >
        <div className={cn('relative bg-white p-2', featured ? 'h-48' : 'h-40')}>
          <Link href={`/discover/${product.id}`} className="relative block w-full h-full rounded-xl overflow-hidden app-image-bg">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="absolute top-2 left-2 flex gap-1 pointer-events-none">
            {product.badge && (
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md shadow-sm', badgeStyles[product.badge])}>
                {badgeIcons[product.badge]} {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-500 text-white shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white z-10"
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={cn('w-3.5 h-3.5', saved ? 'text-red-500 fill-red-500' : 'text-gray-500')} />
          </button>
          <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() => openModal('quick-view', { productId: product.id })}
              className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#F0F7E8]"
              aria-label="Quick view"
            >
              <Eye className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button
              onClick={() => addToCart(product.id)}
              className="w-7 h-7 rounded-full bg-[#4A7C24] shadow-sm flex items-center justify-center hover:bg-[#3A6B1A]"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        <Link href={`/discover/${product.id}`} className="p-3 flex-1 flex flex-col">
          <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded-md w-fit', product.categoryColor)}>
            {product.category}
          </span>
          <h3 className="mt-1.5 text-sm font-semibold text-[#10183f] line-clamp-2 leading-snug">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[#5a6480]">by {product.seller}</span>
            {product.sellerVerified && (
              <CheckCircle2 className="w-3 h-3 text-[#4A7C24] shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span className="text-xs font-bold text-[#374151]">{product.rating}</span>
            <span className="text-xs text-[#9CA3AF]">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-2 mt-auto">
            <span className="text-base font-bold text-[#1A1F2E]">${product.price}.00</span>
            {product.originalPrice && (
              <span className="text-xs text-[#9CA3AF] line-through">${product.originalPrice}.00</span>
            )}
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
