export interface Product {
  id: string;
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  seller: string;
  sellerVerified: boolean;
  rating: number;
  reviewCount: string;
  price: number;
  originalPrice?: number;
  badge?: 'Best Seller' | 'Trending' | 'Top Rated' | 'New';
  type: 'digital' | 'physical';
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isPro: boolean;
  country: string;
  flag: string;
  online?: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  accountMask: string;
  type: 'Withdrawal' | 'Deposit';
  paymentMethod: 'Bank' | 'PayPal' | 'Wise';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  balance: number;
}

export interface Message {
  id: string;
  user: User;
  content: string;
  time: string;
  reactions: { emoji: string; count: number }[];
  embed?: {
    icon: string;
    title: string;
    subtitle: string;
  };
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  section: string;
  active?: boolean;
}

export interface Course {
  id: string;
  thumbnail: string;
  category: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: string;
  price: number | 'Free';
  progress?: number;
  enrolled?: boolean;
}

export interface StoreProduct {
  id: string;
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: string;
  status: 'Active' | 'Draft' | 'Paused';
}

export interface ChatHistory {
  id: string;
  title: string;
  category: string;
  time: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'message' | 'review' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}
