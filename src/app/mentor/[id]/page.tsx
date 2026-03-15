'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare, Phone, Video, ArrowLeft, Clock,
  Briefcase, Languages, ShieldCheck, Star, CheckCircle, Loader2
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import { expertApi, Expert } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function MentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const expertId = params.id as string;

    async function fetchExpert() {
      try {
        setLoading(true);
        setError(null);
        const response = await expertApi.getExpertById(expertId);
        if (!cancelled) {
          if (response.success && response.data) {
            setExpert(response.data);
          } else {
            setError('Expert not found.');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load expert profile.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (expertId) {
      fetchExpert();
    }

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading expert profile...</p>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-foreground">{error || 'Expert not found'}</h3>
        <p className="text-muted-foreground mt-1">The expert you are looking for could not be loaded.</p>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
          <Button onClick={() => router.push('/explore')}>Browse Experts</Button>
        </div>
      </div>
    );
  }

  const reviews = expert.reviews || [];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back button */}
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Profile Header Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative shrink-0">
              <Avatar name={expert.name} src={expert.imageUrl || ''} size="xl" isOnline={expert.available} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{expert.name}</h1>
                  {(expert.title || expert.company) && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {expert.title}{expert.title && expert.company ? ' at ' : ''}{expert.company}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(expert.specialties || []).map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="text-xl font-bold">{expert.rating}</span>
                  <span className="text-muted-foreground">({expert.orders} orders)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {expert.experience} years experience
                </span>
                <span className="flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  {(expert.languages || []).join(', ')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Usually responds in 5 min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Book a Session</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-primary">₹{expert.pricePerMin}</span>
              <span className="text-muted-foreground">/min</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href={`/chat/chat-${expert.id}`} className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full gap-2" disabled={!expert.available}>
                  <MessageSquare className="w-4 h-4" />
                  Start Chat
                </Button>
              </Link>
              <Link href={`/chat/chat-${expert.id}`} className="flex-1 sm:flex-none">
                <Button className="w-full gap-2" disabled={!expert.available}>
                  <Phone className="w-4 h-4" />
                  Start Call
                </Button>
              </Link>
            </div>
          </div>
          {!expert.available && (
            <p className="text-sm text-muted-foreground mt-3">
              This expert is currently offline. Check back later or browse other available experts.
            </p>
          )}
        </div>

        {/* About Section */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
          <p className="text-muted-foreground leading-relaxed">{expert.bio}</p>
        </div>

        {/* Reviews Section */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Reviews ({reviews.length})
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium text-secondary-foreground">{review.userName.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-foreground">{review.userName}</span>
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
