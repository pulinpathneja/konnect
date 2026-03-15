import { io, Socket } from 'socket.io-client';
import { auth } from './firebase';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await user.getIdToken();

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  return new Promise((resolve, reject) => {
    if (!socket) return reject(new Error('Socket not created'));

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
      resolve(socket!);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      reject(err);
    });

    // Auto-reconnect handling
    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });
  });
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Register as expert (mentor) on the socket
export function registerAsExpert(userId: string, name: string) {
  if (!socket?.connected) {
    console.warn('[Socket] Not connected, cannot register');
    return;
  }
  socket.emit('register', { userId, userType: 'expert', name });
}

// Register as user (mentee) on the socket
export function registerAsUser(userId: string, name: string) {
  if (!socket?.connected) {
    console.warn('[Socket] Not connected, cannot register');
    return;
  }
  socket.emit('register', { userId, userType: 'user', name });
}

// Send a chat message
export function sendChatMessage(chatId: string, message: string, senderId: string) {
  socket?.emit('chat-message', { chatId, message, senderId });
}

// End a chat
export function endChat(chatId: string) {
  socket?.emit('end-chat', { chatId });
}

// Request a chat with an expert
export function requestChat(userId: string, userName: string, expertId: string) {
  socket?.emit('request-chat', { userId, userName, expertId });
}

// Call signaling
export function sendCallOffer(chatId: string, offer: unknown, callType: 'voice' | 'video') {
  socket?.emit('call-offer', { chatId, offer, callType });
}

export function sendCallAnswer(chatId: string, answer: unknown) {
  socket?.emit('call-answer', { chatId, answer });
}

export function sendIceCandidate(chatId: string, candidate: unknown) {
  socket?.emit('ice-candidate', { chatId, candidate });
}

export function sendCallEnded(chatId: string, reason?: string) {
  socket?.emit('call-ended', { chatId, reason });
}

export function sendCallRejected(chatId: string) {
  socket?.emit('call-rejected', { chatId });
}
