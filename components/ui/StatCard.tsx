'use client';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  period?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  iconBg = 'bg-[#E8F5D8]',
  iconColor = 'text-[#4A7C24]',
  label,
  value,
  change,
  changePositive = true,
  period,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white rounded-xl border border-[#c8dae8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        {change && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              changePositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
          >
            {changePositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#1A1F2E]">{value}</p>
      {period && <p className="text-xs text-[#9CA3AF] mt-1">{period}</p>}
    </motion.div>
  );
}
