import { User, StudentMatch, Connection, Message, Conversation, Opportunity, NotificationItem, DSAProfile } from '../types';

const API_BASE = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('teamup_token') || 'user-anshk') : 'user-anshk';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export const api = {
  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  register: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  getRecommendations: async (): Promise<{ recommendations: StudentMatch[] }> => {
    const res = await fetch(`${API_BASE}/users/recommendations`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  exploreStudents: async (params: Record<string, string> = {}): Promise<{ students: (User & { match: any })[] }> => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/users/explore?${query}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getStudentProfile: async (id: string): Promise<{ student: User; match: any }> => {
    const res = await fetch(`${API_BASE}/users/profile/${id}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  completeOnboarding: async (data: Partial<User>) => {
    const res = await fetch(`${API_BASE}/users/onboarding`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateProfile: async (data: Partial<User>) => {
    const res = await fetch(`${API_BASE}/users/profile`, {
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
    const res = await fetch(`${API_BASE}/connections`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  sendConnectionRequest: async (receiverId: string) => {
    const res = await fetch(`${API_BASE}/connections/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiverId })
    });
    return res.json();
  },

  respondToConnection: async (connectionId: string, action: 'Accept' | 'Decline') => {
    const res = await fetch(`${API_BASE}/connections/respond/${connectionId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action })
    });
    return res.json();
  },

  getConversations: async (): Promise<{ conversations: Conversation[] }> => {
    const res = await fetch(`${API_BASE}/chat/conversations`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getMessages: async (receiverId: string): Promise<{ messages: Message[]; user: User }> => {
    const res = await fetch(`${API_BASE}/chat/messages/${receiverId}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  sendMessage: async (receiverId: string, content: string): Promise<{ message: Message }> => {
    const res = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiverId, content })
    });
    return res.json();
  },

  getOpportunities: async (): Promise<{ opportunities: Opportunity[] }> => {
    const res = await fetch(`${API_BASE}/opportunities`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  createOpportunity: async (data: Partial<Opportunity>): Promise<{ opportunity: Opportunity }> => {
    const res = await fetch(`${API_BASE}/opportunities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  toggleOpportunityInterest: async (opportunityId: string): Promise<{ opportunity: Opportunity }> => {
    const res = await fetch(`${API_BASE}/opportunities/${opportunityId}/interest`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getDSAMatches: async (): Promise<{ matches: any[] }> => {
    const res = await fetch(`${API_BASE}/dsa/matches`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  checkInDSAStreak: async (): Promise<{ message: string; dsaProfile: DSAProfile; user: User }> => {
    const res = await fetch(`${API_BASE}/dsa/checkin`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getNotifications: async (): Promise<{ notifications: NotificationItem[]; unreadCount: number }> => {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  markNotificationRead: async (id: string) => {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  markAllNotificationsRead: async () => {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
