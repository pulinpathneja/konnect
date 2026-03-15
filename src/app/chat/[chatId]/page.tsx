'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Phone, Video, SendHorizontal,
  ImageIcon, MoreVertical, PhoneOff, Mic, MicOff, VideoOff
} from 'lucide-react';
import { Check } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import WalletPill from '@/components/shared/WalletPill';
import ReviewModal from '@/components/shared/ReviewModal';
import { useAuth } from '@/contexts/AuthContext';
import { walletApi } from '@/lib/api';
import {
  getSocket, sendChatMessage, endChat as socketEndChat,
} from '@/lib/socket';
import { useCall } from '@/hooks/useCall';
import { Message } from '@/lib/types';
import { format } from 'date-fns';

interface ChatInfo {
  chatId: string;
  expertName: string;
  userName: string;
  expertId: string;
  userId: string;
  pricePerMin: number;
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [balance, setBalance] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const call = useCall(chatId);

  const currentUserId = user?.uid || 'user-demo';
  const isMentor = userProfile?.role === 'mentor';
  const displayName = chatInfo
    ? (isMentor ? chatInfo.userName : chatInfo.expertName)
    : 'Loading...';
  const pricePerMin = chatInfo?.pricePerMin || 15;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Fetch wallet balance
  useEffect(() => {
    walletApi.getWallet()
      .then(res => setBalance(res.data?.balance || 0))
      .catch(() => {});
  }, []);

  // Socket.IO event listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleChatStarted = (data: ChatInfo) => {
      if (data.chatId === chatId) {
        setChatInfo(data);
        setMessages(prev => [...prev, {
          id: `msg-system-${Date.now()}`,
          senderId: 'system',
          text: `Session started with ${isMentor ? data.userName : data.expertName} • ₹${data.pricePerMin}/min`,
          type: 'system',
          timestamp: new Date(),
          read: true,
        }]);
      }
    };

    const handleNewMessage = (data: { chatId: string; message: string; senderId: string; timestamp: string }) => {
      if (data.chatId === chatId) {
        setMessages(prev => {
          if (prev.find(m => m.id === `msg-${data.timestamp}`)) return prev;
          return [...prev, {
            id: `msg-${data.timestamp}`,
            senderId: data.senderId,
            text: data.message,
            type: 'text',
            timestamp: new Date(data.timestamp),
            read: false,
          }];
        });
      }
    };

    const handleBillingUpdate = (data: { chatId: string; charged: number; totalCharged: number; balance: number }) => {
      if (data.chatId === chatId) {
        setBalance(data.balance);
      }
    };

    const handleChatWarning = (data: { chatId: string; type: string; message: string }) => {
      if (data.chatId === chatId) {
        setMessages(prev => [...prev, {
          id: `msg-warn-${Date.now()}`,
          senderId: 'system',
          text: data.message,
          type: 'system',
          timestamp: new Date(),
          read: true,
        }]);
      }
    };

    const handleChatEnded = (data: { chatId: string; reason: string; duration: number; totalCharged: number }) => {
      if (data.chatId === chatId) {
        setIsSessionActive(false);
        setMessages(prev => [...prev, {
          id: `msg-end-${Date.now()}`,
          senderId: 'system',
          text: `Session ended. Duration: ${formatDuration(data.duration)}. Total: ₹${data.totalCharged.toFixed(0)}`,
          type: 'system',
          timestamp: new Date(),
          read: true,
        }]);
        setTimeout(() => setShowReviewModal(true), 500);
      }
    };

    socket.on('chat-started', handleChatStarted);
    socket.on('new-message', handleNewMessage);
    socket.on('billing-update', handleBillingUpdate);
    socket.on('chat-warning', handleChatWarning);
    socket.on('chat-ended', handleChatEnded);

    return () => {
      socket.off('chat-started', handleChatStarted);
      socket.off('new-message', handleNewMessage);
      socket.off('billing-update', handleBillingUpdate);
      socket.off('chat-warning', handleChatWarning);
      socket.off('chat-ended', handleChatEnded);
    };
  }, [chatId, isMentor]);

  // Session timer
  useEffect(() => {
    if (!isSessionActive) return;
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const sendMessage = () => {
    if (!newMessage.trim() || !isSessionActive) return;
    sendChatMessage(chatId, newMessage.trim(), currentUserId);
    setNewMessage('');
  };

  const handleEndSession = () => {
    socketEndChat(chatId);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    call.startCall(type);
    setMessages(prev => [...prev, {
      id: `msg-call-${Date.now()}`,
      senderId: 'system',
      text: `${type === 'video' ? 'Video' : 'Voice'} call started.`,
      type: 'call',
      timestamp: new Date(),
      read: true,
    }]);
  };

  const handleEndCall = () => {
    setMessages(prev => [...prev, {
      id: `msg-callend-${Date.now()}`,
      senderId: 'system',
      text: `Call ended. Duration: ${call.formattedDuration}`,
      type: 'call',
      timestamp: new Date(),
      read: true,
    }]);
    call.endCall();
  };

  const handleAcceptCall = () => {
    call.acceptCall();
    setMessages(prev => [...prev, {
      id: `msg-call-${Date.now()}`,
      senderId: 'system',
      text: `${call.type === 'video' ? 'Video' : 'Voice'} call accepted.`,
      type: 'call',
      timestamp: new Date(),
      read: true,
    }]);
  };

  const handleRejectCall = () => {
    call.rejectCall();
    setMessages(prev => [...prev, {
      id: `msg-callrej-${Date.now()}`,
      senderId: 'system',
      text: 'Call declined.',
      type: 'call',
      timestamp: new Date(),
      read: true,
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background">
      {/* Call UI Overlay */}
      {call.status !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white">
          <Avatar name={displayName} size="xl" />
          <h2 className="text-2xl font-bold mt-4">{displayName}</h2>
          <p className="text-gray-400 mt-1">
            {call.status === 'ringing' ? `Incoming ${call.type === 'video' ? 'Video' : 'Voice'} Call...` :
             call.status === 'calling' ? `Calling...` :
             call.status === 'ended' ? 'Call ended' :
             `${call.type === 'video' ? 'Video' : 'Voice'} Call`}
          </p>
          {call.status === 'active' && (
            <>
              <p className="text-3xl font-mono mt-4">{call.formattedDuration}</p>
              <p className="text-sm text-gray-400 mt-2">₹{pricePerMin}/min from wallet</p>
            </>
          )}
          {call.status === 'calling' && (
            <p className="text-sm text-gray-400 mt-4 animate-pulse">Waiting for answer...</p>
          )}

          <div className="flex items-center gap-6 mt-12">
            {/* Incoming call: Accept / Reject */}
            {call.status === 'ringing' && (
              <>
                <button onClick={handleRejectCall} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition" title="Decline">
                  <PhoneOff className="w-8 h-8" />
                </button>
                <button onClick={handleAcceptCall} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition" title="Accept">
                  <Phone className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Active / Calling: Mute, End, Video toggle */}
            {(call.status === 'active' || call.status === 'calling') && (
              <>
                <button onClick={call.toggleMute} className={`w-14 h-14 rounded-full flex items-center justify-center transition ${call.isMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`} title={call.isMuted ? 'Unmute' : 'Mute'}>
                  {call.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button onClick={handleEndCall} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition" title="End Call">
                  <PhoneOff className="w-8 h-8" />
                </button>
                {call.type === 'video' && (
                  <button onClick={call.toggleVideo} className={`w-14 h-14 rounded-full flex items-center justify-center transition ${call.isVideoOff ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`} title={call.isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
                    {call.isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/chat" className="sm:hidden p-1 hover:bg-secondary rounded-lg">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Avatar name={displayName} size="md" isOnline={isSessionActive} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-foreground truncate">{displayName}</h2>
            </div>
            {isSessionActive && (
              <p className="text-xs text-muted-foreground">Session: {formatDuration(sessionDuration)} | ₹{pricePerMin}/min</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <WalletPill />
            <button onClick={() => handleStartCall('voice')} className="p-2 hover:bg-secondary rounded-lg transition" title="Voice Call"><Phone className="w-5 h-5 text-primary" /></button>
            <button onClick={() => handleStartCall('video')} className="p-2 hover:bg-secondary rounded-lg transition" title="Video Call"><Video className="w-5 h-5 text-primary" /></button>
            <div className="relative group">
              <button className="p-2 hover:bg-secondary rounded-lg transition"><MoreVertical className="w-5 h-5 text-muted-foreground" /></button>
              <div className="hidden group-hover:block absolute right-0 mt-1 w-48 bg-card rounded-xl shadow-lg border border-border py-1 z-20">
                {isSessionActive ? (
                  <button onClick={handleEndSession} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/5">End Session</button>
                ) : (
                  <button onClick={() => setShowReviewModal(true)} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary">Rate Session</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Billing Bar */}
      {isSessionActive && (
        <div className="bg-primary/5 border-b border-primary/10 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-primary">
              <span className="w-2 h-2 bg-success rounded-full online-dot" />
              <span className="font-medium">Session Active</span>
              <span className="text-primary/60">|</span>
              <span>{formatDuration(sessionDuration)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                Balance: ₹{balance.toFixed(0)}
                <span className="text-muted-foreground/60 ml-1">(~{Math.floor(balance / pricePerMin)} min)</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-1">
          {messages.map((msg) => {
            const isSent = msg.senderId === currentUserId;
            const isSystem = msg.type === 'system' || msg.type === 'call';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-3 message-enter">
                  <span className="px-4 py-1.5 bg-chat-system text-muted-foreground rounded-full text-xs font-medium">{msg.text}</span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'} message-enter`}>
                <div className={`max-w-[75%] sm:max-w-[60%] px-4 py-2 rounded-2xl ${isSent ? 'bg-chat-sent rounded-br-md' : 'bg-chat-received border border-border rounded-bl-md'}`}>
                  <p className="text-sm text-foreground whitespace-pre-wrap break-words">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : ''}`}>
                    <span className="text-[10px] text-muted-foreground">{format(msg.timestamp, 'h:mm a')}</span>
                    {isSent && (
                      <div className="flex -space-x-1">
                        <Check className={`w-3 h-3 ${msg.read ? 'text-primary' : 'text-muted-foreground'}`} />
                        <Check className={`w-3 h-3 ${msg.read ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <button className="p-2.5 hover:bg-secondary rounded-xl transition shrink-0"><ImageIcon className="w-5 h-5 text-muted-foreground" /></button>
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={isSessionActive ? 'Type a message...' : 'Session ended. Start a new session to chat.'}
              disabled={!isSessionActive}
              rows={1}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-2xl outline-none focus:ring-2 focus:ring-ring text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button onClick={sendMessage} disabled={!newMessage.trim() || !isSessionActive} className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} mentorName={displayName} onSubmit={(rating, comment) => { console.log('Review submitted:', { rating, comment, chatId }); }} />
    </div>
  );
}
