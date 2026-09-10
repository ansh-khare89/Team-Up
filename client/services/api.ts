import { User, StudentMatch, Connection, Message, Conversation, Opportunity, NotificationItem, DSAProfile } from '../types';

const getApiBase = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// In-memory fast cache to make page transitions, scrolls, and tab switches instant
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 20_000; // 20 seconds cache for snappy UI

function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function clearApiCache(prefix?: string) {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  for (const key of Array.from(memoryCache.keys())) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 12000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  clearCache: clearApiCache,

  login: async (credentials: any) => {
    clearApiCache();
    const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  register: async (data: any) => {
    clearApiCache();
    const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  getMe: async (): Promise<{ user: User }> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
    const cacheKey = `me:${token}`;
    const cached = getCached<{ user: User }>(cacheKey);
    if (cached) return cached;

    const res = await fetchWithTimeout(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    const data = await res.json();
    setCached(cacheKey, data);
    return data;
  },

  getRecommendations: async (): Promise<{ recommendations: StudentMatch[] }> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
    const cacheKey = `recommendations:${token}`;
    const cached = getCached<{ recommendations: StudentMatch[] }>(cacheKey);
    if (cached) return cached;

    const res = await fetchWithTimeout(`${API_BASE}/users/recommendations`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setCached(cacheKey, data);
    return data;
  },

  exploreStudents: async (params: Record<string, string> = {}): Promise<{ students: (User & { match: any })[] }> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
    const query = new URLSearchParams(params).toString();
    const cacheKey = `explore:${token}:${query}`;
    const cached = getCached<{ students: (User & { match: any })[] }>(cacheKey);
    if (cached) return cached;

    const res = await fetchWithTimeout(`${API_BASE}/users/explore?${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setCached(cacheKey, data);
    return data;
  },

  getStudentProfile: async (id: string): Promise<{ student: User; match: any }> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
    const cacheKey = `profile:${token}:${id}`;
    const cached = getCached<{ student: User; match: any }>(cacheKey);
    if (cached) return cached;

    const res = await fetchWithTimeout(`${API_BASE}/users/profile/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setCached(cacheKey, data);
    return data;
  },

  completeOnboarding: async (data: Partial<User>) => {
    clearApiCache();
    const res = await fetchWithTimeout(`${API_BASE}/users/onboarding`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateProfile: async (data: Partial<User>) => {
    clearApiCache();
    const res = await fetchWithTimeout(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getConnections: async (): Promise<{
    pendingRequests: Connection[];
    sentRequests: Connection[];
    acceptedConnections: Connection[];
  }> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
    const cacheKey = `connections:${token}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    const res = await fetchWithTimeout(`${API_BASE}/connections`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setCached(cacheKey, data);
    return data;
  },

  sendConnectionRequest: async (receiverId: string) => {
    clearApiCache('connections');
    clearApiCache('recommendations');
    const res = await fetchWithTimeout(`${API_BASE}/connections/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiverId })
    });
    return res.json();
  },

  respondToConnection: async (connectionId: string, action: 'Accept' | 'Decline') => {
    clearApiCache('connections');
    clearApiCache('notifications');
    const res = await fetchWithTimeout(`${API_BASE}/connections/respond/${connectionId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action })
    });
    return res.json();
  },

  getConversations: async (): Promise<{ conversations: Conversation[] }> => {
    const res = await fetchWithTimeout(`${API_BASE}/chat/conversations`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getMessages: async (receiverId: string): Promise<{ messages: Message[]; user: User }> => {
    const res = await fetchWithTimeout(`${API_BASE}/chat/messages/${receiverId}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  sendMessage: async (receiverId: string, content: string): Promise<{ message: Message }> => {
    const res = await fetchWithTimeout(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiverId, content })
    });
    return res.json();
  },

  getOpportunities: async (): Promise<{ opportunities: Opportunity[] }> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
    const cacheKey = `opportunities:${token}`;
    const cached = getCached<{ opportunities: Opportunity[] }>(cacheKey);
    if (cached) return cached;

    const res = await fetchWithTimeout(`${API_BASE}/opportunities`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setCached(cacheKey, data);
    return data;
  },

  createOpportunity: async (data: Partial<Opportunity>): Promise<{ opportunity: Opportunity }> => {
    clearApiCache('opportunities');
    const res = await fetchWithTimeout(`${API_BASE}/opportunities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  toggleOpportunityInterest: async (opportunityId: string): Promise<{ opportunity: Opportunity }> => {
    clearApiCache('opportunities');
    const res = await fetchWithTimeout(`${API_BASE}/opportunities/${opportunityId}/interest`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getDSAMatches: async (): Promise<{ matches: any[] }> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
    const cacheKey = `dsa:${token}`;
    const cached = getCached<{ matches: any[] }>(cacheKey);
    if (cached) return cached;

    const res = await fetchWithTimeout(`${API_BASE}/dsa/matches`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setCached(cacheKey, data);
    return data;
  },

  checkInDSAStreak: async (): Promise<{ message: string; dsaProfile: DSAProfile; user: User }> => {
    clearApiCache('me');
    clearApiCache('dsa');
    const res = await fetchWithTimeout(`${API_BASE}/dsa/checkin`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getNotifications: async (): Promise<{ notifications: NotificationItem[]; unreadCount: number }> => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
    const cacheKey = `notifications:${token}`;
    const cached = getCached<{ notifications: NotificationItem[]; unreadCount: number }>(cacheKey);
    if (cached) return cached;

    const res = await fetchWithTimeout(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setCached(cacheKey, data);
    return data;
  },

  markNotificationRead: async (id: string) => {
    clearApiCache('notifications');
    const res = await fetchWithTimeout(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  markAllNotificationsRead: async () => {
    clearApiCache('notifications');
    const res = await fetchWithTimeout(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
