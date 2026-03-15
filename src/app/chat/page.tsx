'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MessageSquare, Loader2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getSocket } from '@/lib/socket';

interface ChatEntry {
  id: string;
  mentorName: string;
  menteeName: string;
  mentorId: string;
  userId: string;
  lastMessage: string;
  lastMessageAt: Date;
  isActive: boolean;
  unreadCount?: number;
}

export default function ChatListPage() {
  const { user, userProfile } = useAuth();
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      setLoading(false);
      return;
    }

    // Listen for new chats starting
    const handleChatStarted = (data: {
      chatId: string; expertName: string; userName: string;
      expertId: string; userId: string; pricePerMin: number;
    }) => {
      setChats(prev => {
        if (prev.find(c => c.id === data.chatId)) return prev;
        return [{
          id: data.chatId,
          mentorName: data.expertName,
          menteeName: data.userName,
          mentorId: data.expertId,
          userId: data.userId,
          lastMessage: 'Session started',
          lastMessageAt: new Date(),
          isActive: true,
        }, ...prev];
      });
    };

    const handleNewMessage = (data: { chatId: string; message: string; senderId: string }) => {
      setChats(prev => prev.map(c =>
        c.id === data.chatId
          ? { ...c, lastMessage: data.message, lastMessageAt: new Date(), unreadCount: (c.unreadCount || 0) + 1 }
          : c
      ));
    };

    const handleChatEnded = (data: { chatId: string }) => {
      setChats(prev => prev.map(c =>
        c.id === data.chatId ? { ...c, isActive: false, lastMessage: 'Session ended' } : c
      ));
    };

    socket.on('chat-started', handleChatStarted);
    socket.on('new-message', handleNewMessage);
    socket.on('chat-ended', handleChatEnded);
    setLoading(false);

    return () => {
      socket.off('chat-started', handleChatStarted);
      socket.off('new-message', handleNewMessage);
      socket.off('chat-ended', handleChatEnded);
    };
  }, [user]);

  const filteredChats = chats.filter((chat) => {
    const searchTerm = search.toLowerCase();
    const isMentor = userProfile?.role === 'mentor';
    const name = isMentor ? chat.menteeName : chat.mentorName;
    return name.toLowerCase().includes(searchTerm);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card min-h-[calc(100vh-3.5rem)] border-x border-border">
          <div className="sticky top-14 z-10 bg-card border-b border-border px-4 py-4">
            <h1 className="text-xl font-bold text-foreground mb-3">Chats</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </div>

          <div>
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => {
                const isMentor = userProfile?.role === 'mentor';
                const displayName = isMentor ? chat.menteeName : chat.mentorName;
                return (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition border-b border-border"
                  >
                    <Avatar name={displayName} size="lg" isOnline={chat.isActive} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground text-sm truncate">{displayName}</h3>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {chat.isActive ? 'Active' : 'Ended'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        {chat.unreadCount ? (
                          <span className="ml-2 w-5 h-5 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center shrink-0 font-semibold">
                            {chat.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-muted mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground">No conversations yet</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {userProfile?.role === 'mentor'
                    ? 'Go online from Dashboard to start receiving chat requests!'
                    : 'Find an expert and start chatting!'}
                </p>
                {userProfile?.role !== 'mentor' && (
                  <Link href="/explore" className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition text-sm">Browse Experts</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
