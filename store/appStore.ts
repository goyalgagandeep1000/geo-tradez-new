'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, Transaction, User, Channel, StoreProduct, Message } from '@/types';
import { notifications as initialNotifications, transactions as initialTransactions } from '@/lib/mockData';
import { api } from '@/lib/api-client';

export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface CommunityMessage {
  id: string;
  userId: string;
  content: string;
  time: string;
  reactions: { emoji: string; count: number }[];
  embed?: { icon: string; title: string; subtitle: string };
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface AiThread {
  id: string;
  title: string;
  messages: AiMessage[];
  updatedAt: string;
}

export type ModalType =
  | 'checkout'
  | 'withdraw'
  | 'add-product'
  | 'edit-store'
  | 'create-channel'
  | 'upgrade-pro'
  | 'quick-view'
  | null;

export interface ModalState {
  type: ModalType;
  data?: Record<string, unknown>;
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function messageToCommunity(msg: Message): CommunityMessage {
  return {
    id: msg.id,
    userId: msg.user.id,
    content: msg.content,
    time: msg.time,
    reactions: msg.reactions,
    embed: msg.embed,
  };
}

interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrateFromApi: () => Promise<void>;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;

  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;

  cart: string[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  isInCart: (productId: string) => boolean;
  cartCount: () => number;
  checkout: (productIds?: string[]) => Promise<void>;

  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;

  savedItems: string[];
  toggleSavedItem: (productId: string) => Promise<void>;

  notifications: Notification[];
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  unreadNotificationCount: () => number;

  activePanel: 'notifications' | 'messages' | 'user' | null;
  setActivePanel: (panel: 'notifications' | 'messages' | 'user' | null) => void;

  walletBalance: number;
  balanceHidden: boolean;
  toggleBalanceHidden: () => void;
  transactions: Transaction[];
  withdrawFunds: (amount: number, method: string) => Promise<boolean>;

  channels: Channel[];
  channelIdByName: Record<string, string>;
  communityMessages: Record<string, CommunityMessage[]>;
  sendCommunityMessage: (channelName: string, content: string) => Promise<void>;
  toggleReaction: (channelName: string, messageId: string, emoji: string) => Promise<void>;
  createChannel: (name: string) => Promise<void>;

  aiThreads: AiThread[];
  activeAiThreadId: string | null;
  createAiThread: (title?: string) => Promise<string>;
  setActiveAiThread: (id: string) => void;
  sendAiMessage: (content: string) => Promise<void>;
  clearActiveAiThread: () => Promise<void>;

  enrolledCourses: string[];
  courseProgress: Record<string, number>;
  enrollCourse: (courseId: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  getCourseProgress: (courseId: string) => number | undefined;

  storeProducts: StoreProduct[];
  addStoreProduct: (data: { title: string; category: string; price: number }) => Promise<void>;
  revenueData: { date: string; revenue: number }[];

  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  profile: { name: string; email: string; bio: string };
  updateProfile: (data: Partial<{ name: string; email: string; bio: string }>) => Promise<void>;

  modal: ModalState;
  openModal: (type: NonNullable<ModalType>, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  newsletterEmail: string;
  subscribeNewsletter: (email: string) => Promise<void>;
}

const defaultCommunityMessages: Record<string, CommunityMessage[]> = {
  'Global Chat': [
    { id: 'm1', userId: '2', content: 'Just launched my digital planner store today! 🎉 Any tips for getting initial sales?', time: '10:32 AM', reactions: [{ emoji: '👍', count: 2 }] },
    { id: 'm2', userId: '3', content: "Congrats Sophia! I'd recommend focusing on Pinterest + a simple lead magnet.", time: '10:34 AM', reactions: [{ emoji: '👍', count: 6 }] },
  ],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,

      login: async (email, password) => {
        const { profile } = await api.login(email, password);
        set({ isAuthenticated: true, profile });
        await get().hydrateFromApi();
      },

      register: async (email, password, name) => {
        const { profile } = await api.register(email, password, name);
        set({ isAuthenticated: true, profile });
        await get().hydrateFromApi();
      },

      logout: async () => {
        await api.logout();
        set({ isAuthenticated: false, currentUser: null });
      },

      hydrateFromApi: async () => {
        try {
          const data = await api.bootstrap();
          const channelIdByName = Object.fromEntries(data.channels.map((c) => [c.name, c.id]));
          const communityMessages: Record<string, CommunityMessage[]> = {};
          for (const [name, msgs] of Object.entries(data.communityMessages)) {
            communityMessages[name] = msgs.map(messageToCommunity);
          }
          set({
            isAuthenticated: true,
            currentUser: data.user,
            profile: data.profile,
            cart: data.cart,
            wishlist: data.wishlist,
            savedItems: data.savedItems,
            walletBalance: data.walletBalance,
            transactions: data.transactions,
            notifications: data.notifications,
            enrolledCourses: data.enrolledCourses.map((e) => e.courseId),
            courseProgress: Object.fromEntries(
              data.enrolledCourses.map((e) => [e.courseId, e.progress])
            ),
            storeProducts: data.storeProducts,
            channels: data.channels,
            channelIdByName,
            communityMessages,
            aiThreads: data.aiThreads,
            activeAiThreadId: data.aiThreads[0]?.id ?? null,
            revenueData: data.revenueData,
          });
        } catch {
          /* not logged in */
        }
      },

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      toasts: [],
      addToast: (message, type = 'success') => {
        const id = newId();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 4000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      cart: [],
      addToCart: async (productId) => {
        const { addToast, isAuthenticated } = get();
        if (isAuthenticated) {
          try {
            const { cart, alreadyInCart } = await api.addToCart(productId);
            set({ cart });
            addToast(alreadyInCart ? 'Already in your cart' : 'Added to cart', alreadyInCart ? 'info' : 'success');
            return;
          } catch {
            addToast('Failed to add to cart', 'error');
            return;
          }
        }
        if (get().cart.includes(productId)) {
          addToast('Already in your cart', 'info');
          return;
        }
        set({ cart: [...get().cart, productId] });
        addToast('Added to cart');
      },

      removeFromCart: async (productId) => {
        if (get().isAuthenticated) {
          const cart = await api.removeFromCart(productId);
          set({ cart });
          return;
        }
        set((s) => ({ cart: s.cart.filter((id) => id !== productId) }));
      },

      isInCart: (productId) => get().cart.includes(productId),
      cartCount: () => get().cart.length,

      checkout: async (productIds) => {
        const { addToast, isAuthenticated, closeModal } = get();
        if (isAuthenticated) {
          try {
            const result = await api.checkout(productIds);
            set({ cart: result.cart });
            addToast('Order placed successfully!');
            closeModal();
            return;
          } catch {
            addToast('Checkout failed', 'error');
            return;
          }
        }
        addToast('Order placed successfully!');
        closeModal();
      },

      wishlist: [],
      toggleWishlist: async (productId) => {
        const { addToast, isAuthenticated } = get();
        if (isAuthenticated) {
          try {
            const { wishlist, inWishlist } = await api.toggleWishlist(productId);
            set({ wishlist });
            addToast(inWishlist ? 'Saved to wishlist' : 'Removed from wishlist', inWishlist ? 'success' : 'info');
            return;
          } catch {
            addToast('Failed to update wishlist', 'error');
            return;
          }
        }
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
          addToast('Removed from wishlist', 'info');
        } else {
          set({ wishlist: [...wishlist, productId] });
          addToast('Saved to wishlist');
        }
      },

      isInWishlist: (productId) => get().wishlist.includes(productId),

      savedItems: [],
      toggleSavedItem: async (productId) => {
        const { addToast, isAuthenticated } = get();
        if (isAuthenticated) {
          try {
            const savedItems = await api.toggleSaved(productId);
            set({ savedItems });
            addToast(savedItems.includes(productId) ? 'Saved for later' : 'Removed from saved items', 'info');
            return;
          } catch {
            addToast('Failed to update saved items', 'error');
            return;
          }
        }
        const { savedItems } = get();
        if (savedItems.includes(productId)) {
          set({ savedItems: savedItems.filter((id) => id !== productId) });
          addToast('Removed from saved items', 'info');
        } else {
          set({ savedItems: [...savedItems, productId] });
          addToast('Saved for later');
        }
      },

      notifications: [...initialNotifications],
      markNotificationRead: async (id) => {
        if (get().isAuthenticated) await api.markNotificationRead(id);
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      markAllNotificationsRead: async () => {
        if (get().isAuthenticated) await api.markAllNotificationsRead();
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
      },

      unreadNotificationCount: () => get().notifications.filter((n) => !n.read).length,

      activePanel: null,
      setActivePanel: (panel) => set({ activePanel: panel }),

      walletBalance: 2458.3,
      balanceHidden: false,
      toggleBalanceHidden: () => set((s) => ({ balanceHidden: !s.balanceHidden })),
      transactions: [...initialTransactions],

      withdrawFunds: async (amount, method) => {
        const { walletBalance, addToast, isAuthenticated } = get();
        if (amount <= 0 || amount > walletBalance) {
          addToast('Invalid withdrawal amount', 'error');
          return false;
        }
        if (isAuthenticated) {
          try {
            const result = await api.withdraw(amount, method);
            set({
              walletBalance: result.balance,
              transactions: [result.transaction, ...get().transactions],
            });
            addToast(`Withdrawal of $${result.received.toFixed(2)} submitted`);
            return true;
          } catch {
            addToast('Withdrawal failed', 'error');
            return false;
          }
        }
        const fee = amount * 0.02;
        const newBalance = walletBalance - amount;
        const tx: Transaction = {
          id: newId(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: nowTime(),
          description: 'Withdrawal',
          accountMask: method === 'PayPal' ? '•••• 4821' : '•••• 7392',
          type: 'Withdrawal',
          paymentMethod: method as Transaction['paymentMethod'],
          amount: -amount,
          status: 'Completed',
          balance: newBalance,
        };
        set({ walletBalance: newBalance, transactions: [tx, ...get().transactions] });
        addToast(`Withdrawal of $${(amount - fee).toFixed(2)} submitted`);
        return true;
      },

      channels: [],
      channelIdByName: {},
      communityMessages: { ...defaultCommunityMessages },

      sendCommunityMessage: async (channelName, content) => {
        const { channelIdByName, currentUser, isAuthenticated, addToast } = get();
        const channelId = channelIdByName[channelName];
        if (isAuthenticated && channelId) {
          try {
            const { message, channelName: name } = await api.sendChannelMessage(channelId, content);
            const msg = messageToCommunity(message);
            set((s) => ({
              communityMessages: {
                ...s.communityMessages,
                [name]: [...(s.communityMessages[name] || []), msg],
              },
            }));
            return;
          } catch {
            addToast('Failed to send message', 'error');
            return;
          }
        }
        const msg: CommunityMessage = {
          id: newId(),
          userId: currentUser?.id || '1',
          content,
          time: nowTime(),
          reactions: [],
        };
        set((s) => ({
          communityMessages: {
            ...s.communityMessages,
            [channelName]: [...(s.communityMessages[channelName] || []), msg],
          },
        }));
      },

      toggleReaction: async (channelName, messageId, emoji) => {
        const { channelIdByName, isAuthenticated } = get();
        const channelId = channelIdByName[channelName];
        if (isAuthenticated && channelId) {
          try {
            const updated = await api.reactToMessage(channelId, messageId, emoji);
            const msg = messageToCommunity(updated);
            set((s) => ({
              communityMessages: {
                ...s.communityMessages,
                [channelName]: (s.communityMessages[channelName] || []).map((m) =>
                  m.id === messageId ? msg : m
                ),
              },
            }));
            return;
          } catch {
            return;
          }
        }
        set((s) => ({
          communityMessages: {
            ...s.communityMessages,
            [channelName]: (s.communityMessages[channelName] || []).map((m) => {
              if (m.id !== messageId) return m;
              const existing = m.reactions.find((r) => r.emoji === emoji);
              if (existing) {
                return {
                  ...m,
                  reactions: m.reactions.map((r) =>
                    r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                  ),
                };
              }
              return { ...m, reactions: [...m.reactions, { emoji, count: 1 }] };
            }),
          },
        }));
      },

      createChannel: async (name) => {
        const { addToast, isAuthenticated } = get();
        if (isAuthenticated) {
          try {
            const channel = await api.createChannel(name);
            set((s) => ({
              channels: [...s.channels, channel],
              channelIdByName: { ...s.channelIdByName, [channel.name]: channel.id },
              communityMessages: { ...s.communityMessages, [channel.name]: [] },
            }));
            addToast(`Channel #${name} created`);
            return;
          } catch {
            addToast('Failed to create channel', 'error');
            return;
          }
        }
        addToast(`Channel #${name} created (demo)`);
      },

      aiThreads: [{ id: 'default', title: 'New Product Ideas', messages: [], updatedAt: new Date().toISOString() }],
      activeAiThreadId: 'default',

      createAiThread: async (title = 'New Chat') => {
        const { isAuthenticated, addToast } = get();
        if (isAuthenticated) {
          const thread = await api.createAiThread(title);
          const t: AiThread = { id: thread.id, title: thread.title, messages: [], updatedAt: new Date().toISOString() };
          set((s) => ({ aiThreads: [t, ...s.aiThreads], activeAiThreadId: thread.id }));
          addToast('New chat started');
          return thread.id;
        }
        const id = newId();
        const thread: AiThread = { id, title, messages: [], updatedAt: new Date().toISOString() };
        set((s) => ({ aiThreads: [thread, ...s.aiThreads], activeAiThreadId: id }));
        addToast('New chat started');
        return id;
      },

      setActiveAiThread: (id) => set({ activeAiThreadId: id }),

      clearActiveAiThread: async () => {
        const { activeAiThreadId, aiThreads, isAuthenticated, addToast } = get();
        if (!activeAiThreadId) return;
        if (isAuthenticated) await api.clearAiThread(activeAiThreadId);
        set({
          aiThreads: aiThreads.map((t) =>
            t.id === activeAiThreadId ? { ...t, messages: [] } : t
          ),
        });
        addToast('Chat cleared', 'info');
      },

      sendAiMessage: async (content) => {
        const { activeAiThreadId, aiThreads, addToast, isAuthenticated } = get();
        let threadId = activeAiThreadId;
        if (!threadId) threadId = await get().createAiThread();

        if (isAuthenticated) {
          addToast('AI is generating…', 'info');
          try {
            const result = await api.sendAiMessage(threadId, content);
            set({
              aiThreads: aiThreads.map((t) =>
                t.id === threadId
                  ? {
                      ...t,
                      title: result.threadTitle,
                      messages: [
                        ...t.messages,
                        result.userMessage,
                        result.assistantMessage,
                      ],
                      updatedAt: new Date().toISOString(),
                    }
                  : t
              ),
            });
          } catch {
            addToast('AI request failed', 'error');
          }
          return;
        }

        const userMsg: AiMessage = { id: newId(), role: 'user', content, time: nowTime() };
        set({
          aiThreads: aiThreads.map((t) =>
            t.id === threadId
              ? { ...t, messages: [...t.messages, userMsg], updatedAt: new Date().toISOString() }
              : t
          ),
        });
        addToast('AI is generating…', 'info');
      },

      enrolledCourses: ['co1', 'co2'],
      courseProgress: { co1: 65, co2: 30 },

      enrollCourse: async (courseId) => {
        const { enrolledCourses, addToast, isAuthenticated } = get();
        if (enrolledCourses.includes(courseId)) {
          addToast('Already enrolled', 'info');
          return;
        }
        if (isAuthenticated) {
          try {
            await api.enrollCourse(courseId);
            set({
              enrolledCourses: [...enrolledCourses, courseId],
              courseProgress: { ...get().courseProgress, [courseId]: 0 },
            });
            addToast('Enrolled successfully!');
            return;
          } catch {
            addToast('Enrollment failed', 'error');
            return;
          }
        }
        set({ enrolledCourses: [...enrolledCourses, courseId] });
        addToast('Enrolled successfully!');
      },

      isEnrolled: (courseId) => get().enrolledCourses.includes(courseId),
      getCourseProgress: (courseId) => get().courseProgress[courseId],

      storeProducts: [],
      addStoreProduct: async (data) => {
        const { isAuthenticated, addToast } = get();
        if (isAuthenticated) {
          try {
            const product = await api.addStoreProduct(data);
            set((s) => ({ storeProducts: [product, ...s.storeProducts] }));
            addToast('Product added to your store');
            return;
          } catch {
            addToast('Failed to add product', 'error');
            return;
          }
        }
        addToast('Product added (demo)');
      },

      revenueData: [],

      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      profile: {
        name: 'James Carter',
        email: 'james@geotradez.com',
        bio: 'Pro seller building global digital products.',
      },

      updateProfile: async (data) => {
        if (get().isAuthenticated) {
          try {
            const { profile } = await api.updateProfile(data);
            set({ profile });
            get().addToast('Profile updated');
            return;
          } catch {
            get().addToast('Failed to update profile', 'error');
            return;
          }
        }
        set((s) => ({ profile: { ...s.profile, ...data } }));
        get().addToast('Profile updated');
      },

      modal: { type: null },
      openModal: (type, data) => set({ modal: { type, data } }),
      closeModal: () => set({ modal: { type: null } }),

      newsletterEmail: '',
      subscribeNewsletter: async (email) => {
        try {
          await api.newsletter(email);
          set({ newsletterEmail: email });
          get().addToast('Subscribed to newsletter!');
        } catch {
          get().addToast('Invalid email', 'error');
        }
      },
    }),
    {
      name: 'geotradez-store',
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
        balanceHidden: s.balanceHidden,
      }),
    }
  )
);
