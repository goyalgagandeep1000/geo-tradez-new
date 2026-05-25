type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) throw new Error('error' in json ? json.error : 'Request failed');
  return json.data;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: unknown; profile: { name: string; email: string; bio: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    request<{ user: unknown; profile: { name: string; email: string; bio: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),

  me: () =>
    request<{ user: unknown; profile: { name: string; email: string; bio: string } }>('/api/auth/me'),

  bootstrap: () => request<BootstrapData>('/api/bootstrap'),

  getProducts: (q?: string, category?: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    const qs = params.toString();
    return request<import('@/types').Product[]>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  getProduct: (id: string) => request<import('@/types').Product>(`/api/products/${id}`),

  addToCart: (productId: string) =>
    request<{ cart: string[]; alreadyInCart?: boolean }>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  removeFromCart: (productId: string) =>
    request<string[]>(`/api/cart/${productId}`, { method: 'DELETE' }),

  toggleWishlist: (productId: string) =>
    request<{ wishlist: string[]; inWishlist: boolean }>('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  toggleSaved: (productId: string) =>
    request<string[]>('/api/saved', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  checkout: (productIds?: string[], productId?: string) =>
    request<{ orderTotal: number; cart: string[] }>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ productIds, productId }),
    }),

  withdraw: (amount: number, method: string) =>
    request<{ balance: number; transaction: import('@/types').Transaction; received: number }>(
      '/api/wallet/withdraw',
      { method: 'POST', body: JSON.stringify({ amount, method }) }
    ),

  updateProfile: (data: { name?: string; email?: string; bio?: string }) =>
    request<{ profile: { name: string; email: string; bio: string } }>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  sendChannelMessage: (channelId: string, content: string) =>
    request<{ message: import('@/types').Message; channelName: string }>(
      `/api/channels/${channelId}/messages`,
      { method: 'POST', body: JSON.stringify({ content }) }
    ),

  reactToMessage: (channelId: string, messageId: string, emoji: string) =>
    request<import('@/types').Message>(
      `/api/channels/${channelId}/messages/${messageId}/react`,
      { method: 'POST', body: JSON.stringify({ emoji }) }
    ),

  createChannel: (name: string) =>
    request<import('@/types').Channel>('/api/channels', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  enrollCourse: (courseId: string) =>
    request<{ enrolled: boolean; courseId: string }>(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
    }),

  createAiThread: (title?: string) =>
    request<{ id: string; title: string }>('/api/ai/threads', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  sendAiMessage: (threadId: string, content: string) =>
    request<{
      userMessage: { id: string; role: 'user'; content: string; time: string };
      assistantMessage: { id: string; role: 'assistant'; content: string; time: string };
      threadTitle: string;
    }>(`/api/ai/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  clearAiThread: (threadId: string) =>
    request<{ ok: boolean }>(`/api/ai/threads/${threadId}`, { method: 'DELETE' }),

  addStoreProduct: (data: { title: string; category: string; price: number }) =>
    request<import('@/types').StoreProduct>('/api/store/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  newsletter: (email: string) =>
    request<{ subscribed: boolean }>('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  markNotificationRead: (id: string) =>
    request<{ ok: boolean }>(`/api/notifications/${id}/read`, { method: 'PATCH' }),

  markAllNotificationsRead: () =>
    request<{ ok: boolean }>('/api/notifications/read-all', { method: 'PATCH' }),
};

export interface BootstrapData {
  user: import('@/types').User;
  profile: { name: string; email: string; bio: string };
  cart: string[];
  wishlist: string[];
  savedItems: string[];
  walletBalance: number;
  transactions: import('@/types').Transaction[];
  notifications: import('@/types').Notification[];
  enrolledCourses: { courseId: string; progress: number }[];
  storeProducts: import('@/types').StoreProduct[];
  channels: import('@/types').Channel[];
  communityMessages: Record<string, import('@/types').Message[]>;
  aiThreads: {
    id: string;
    title: string;
    updatedAt: string;
    messages: { id: string; role: 'user' | 'assistant'; content: string; time: string }[];
  }[];
  revenueData: { date: string; revenue: number }[];
}
