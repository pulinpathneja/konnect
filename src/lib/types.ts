export type UserRole = 'mentee' | 'mentor' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  createdAt: Date;
}

export interface MentorProfile {
  uid: string;
  bio: string;
  expertise: string[];
  categories: string[];
  pricePerMin: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  isVerified: boolean;
  totalSessions: number;
  languages: string[];
  name?: string;
  avatar?: string;
  email?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  description: string;
  mentorCount: number;
}

export interface Chat {
  id: string;
  participants: string[];
  mentorId: string;
  menteeId: string;
  mentorName: string;
  menteeName: string;
  mentorAvatar: string;
  menteeAvatar: string;
  lastMessage: string;
  lastMessageAt: Date;
  status: 'active' | 'ended';
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  type: 'text' | 'image' | 'system' | 'call';
  timestamp: Date;
  read: boolean;
}

export interface Wallet {
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'recharge' | 'debit' | 'refund';
  description: string;
  paymentId?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  rating: number;
  comment: string;
  chatId: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  chatId: string;
  mentorId: string;
  menteeId: string;
  type: 'chat' | 'voice' | 'video';
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  costPerMin: number;
  totalCost: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface CallState {
  isIncoming: boolean;
  isOutgoing: boolean;
  isActive: boolean;
  callType: 'voice' | 'video';
  remoteUserId: string;
  remoteUserName: string;
  remoteUserAvatar: string;
  duration: number;
}
