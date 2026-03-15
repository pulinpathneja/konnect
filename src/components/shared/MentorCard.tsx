'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import { MessageSquare, Phone } from 'lucide-react';
import { MentorProfile } from '@/lib/types';

interface MentorCardProps {
  mentor: MentorProfile & { name: string; avatar: string };
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const router = useRouter();

  return (
    <div
      className="bg-card rounded-2xl p-4 border border-border hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => router.push(`/mentor/${mentor.uid}`)}
    >
      <div className="flex gap-4">
        {/* Avatar with status */}
        <div className="relative shrink-0">
          <Avatar name={mentor.name} src={mentor.avatar} size="lg" isOnline={mentor.isOnline} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{mentor.name}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <StarRating rating={mentor.rating} size="sm" />
              <span className="font-medium text-sm">{mentor.rating}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-1">{mentor.reviewCount} orders</p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {mentor.expertise.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{mentor.expertise.length - 2}
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Speaks: {mentor.languages.join(', ')}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">₹{mentor.pricePerMin}/min</span>
          <span className="text-sm text-muted-foreground">{mentor.totalSessions} sessions</span>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Link href={`/chat/chat-${mentor.uid}`}>
            <Button variant="outline" size="sm" className="gap-1.5 border-border" disabled={!mentor.isOnline}>
              <MessageSquare className="w-4 h-4" />
              Chat
            </Button>
          </Link>
          <Link href={`/chat/chat-${mentor.uid}`}>
            <Button size="sm" className="gap-1.5" disabled={!mentor.isOnline}>
              <Phone className="w-4 h-4" />
              Call
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
