import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
}

// --- Expert / Mentor APIs ---

export interface OnboardingData {
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  appliedAt?: string;
  adminNotes?: string;
  rejectionReason?: string;
}

export interface Expert {
  id: string;
  name: string;
  email?: string;
  title: string;
  company: string;
  bio: string;
  imageUrl: string;
  rating: number;
  orders: number;
  experience: number;
  pricePerMin: number;
  specialties: string[];
  languages: string[];
  available: boolean;
  mentorStatus?: string;
  onboardingData?: OnboardingData;
  firebaseUid?: string;
  reviews?: Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export const expertApi = {
  getExperts: (params?: {
    available?: boolean;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    specialty?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.available !== undefined) query.set('available', String(params.available));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params?.specialty) query.set('specialty', params.specialty);
    return fetchApi<{ success: boolean; data: Expert[] }>(`/api/experts?${query}`);
  },

  getExpertById: (id: string) =>
    fetchApi<{ success: boolean; data: Expert }>(`/api/experts/${id}`),

  updateProfile: (id: string, data: Partial<Expert>) =>
    fetchApi<{ success: boolean; data: Expert }>(`/api/experts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getMyProfile: () =>
    fetchApi<{ success: boolean; data: Expert }>('/api/experts/me'),

  register: (data: {
    name: string; title?: string; company?: string; experience?: number;
    bio?: string; specialties?: string[]; languages?: string[]; pricePerMin?: number;
    phone?: string; linkedinUrl?: string; portfolioUrl?: string;
  }) =>
    fetchApi<{ success: boolean; data: Expert; message: string }>('/api/experts/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateResumeUrl: (resumeUrl: string) =>
    fetchApi<{ success: boolean; data: Expert }>('/api/experts/me/resume', {
      method: 'PUT',
      body: JSON.stringify({ resumeUrl }),
    }),
};

// --- Wallet APIs ---

export interface WalletData {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface TransactionData {
  id: string;
  walletId: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
}

export const walletApi = {
  getWallet: () =>
    fetchApi<{ success: boolean; data: WalletData }>('/api/wallet'),

  deposit: (amount: number, description?: string) =>
    fetchApi<{ success: boolean; data: { wallet: WalletData; transaction: TransactionData } }>(
      '/api/wallet/deposit',
      { method: 'POST', body: JSON.stringify({ amount, description: description || 'Wallet deposit' }) }
    ),

  withdraw: (amount: number, description?: string) =>
    fetchApi<{ success: boolean; data: { wallet: WalletData; transaction: TransactionData } }>(
      '/api/wallet/withdraw',
      { method: 'POST', body: JSON.stringify({ amount, description: description || 'Withdrawal' }) }
    ),

  getTransactions: (params?: { page?: number; limit?: number; type?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.type) query.set('type', params.type);
    return fetchApi<{
      success: boolean;
      data: TransactionData[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/api/wallet/transactions?${query}`);
  },
};

// --- Session APIs ---

export interface SessionData {
  id: string;
  userId: string;
  expertId: string;
  type: string;
  status: string;
  duration: number;
  totalAmount: number;
  scheduledAt?: string;
  createdAt: string;
}

export const sessionApi = {
  getSessions: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    return fetchApi<{
      success: boolean;
      data: SessionData[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/api/sessions?${query}`);
  },

  getExpertSessions: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    return fetchApi<{
      success: boolean;
      data: SessionData[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/api/sessions/expert?${query}`);
  },
};

// --- Auth verify ---

export const authApi = {
  verify: () =>
    fetchApi<{ success: boolean; data: { uid: string; role: string; email: string } }>(
      '/api/auth/verify',
      { method: 'POST' }
    ),
};
