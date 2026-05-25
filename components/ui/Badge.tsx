import { cn } from '@/lib/utils';

const badgeStyles: Record<string, string> = {
  'AI Tool': 'bg-green-100 text-green-700',
  'Course': 'bg-blue-100 text-blue-700',
  'Template': 'bg-purple-100 text-purple-700',
  'Ebook': 'bg-orange-100 text-orange-700',
  'Physical': 'app-image-bg text-gray-700',
  'Active': 'bg-green-100 text-green-700',
  'Draft': 'bg-yellow-100 text-yellow-700',
  'Paused': 'app-image-bg text-gray-600',
  'Trending': 'bg-red-100 text-red-700',
  'Best Seller': 'bg-amber-100 text-amber-700',
  'Top Rated': 'bg-blue-100 text-blue-700',
  'New': 'bg-purple-100 text-purple-700',
  'Pro': 'bg-[#E8F5D8] text-[#3A6B1A]',
  'Completed': 'bg-green-100 text-green-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Failed': 'bg-red-100 text-red-700',
};

interface BadgeProps {
  label: string;
  className?: string;
  style?: Record<string, string>;
}

export function Badge({ label, className, style }: BadgeProps) {
  const baseStyle = badgeStyles[label] || 'app-image-bg text-gray-700';
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md',
        baseStyle,
        className
      )}
      style={style}
    >
      {label}
    </span>
  );
}
