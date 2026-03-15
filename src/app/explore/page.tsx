'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Volume2, Loader2 } from 'lucide-react';
import MentorCard from '@/components/shared/MentorCard';
import Button from '@/components/ui/Button';
import { categories } from '@/lib/mock-data';
import { MentorProfile } from '@/lib/types';
import { expertApi, Expert } from '@/lib/api';

type SortOption = 'rating' | 'price-low' | 'price-high' | 'sessions' | 'newest';

type MentorFromApi = MentorProfile & { name: string; avatar: string };

function mapExpertToMentor(expert: Expert): MentorFromApi {
  return {
    uid: expert.id,
    name: expert.name,
    avatar: expert.imageUrl || '',
    bio: expert.bio,
    expertise: expert.specialties || [],
    categories: [],
    pricePerMin: expert.pricePerMin,
    rating: expert.rating,
    reviewCount: expert.orders,
    isOnline: expert.available,
    isVerified: true,
    totalSessions: expert.orders,
    languages: expert.languages || [],
  };
}

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const [experts, setExperts] = useState<MentorFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchExperts() {
      try {
        setLoading(true);
        setError(null);
        const response = await expertApi.getExperts({
          available: true,
          limit: 50,
          sortBy: 'rating',
          sortOrder: 'desc',
        });
        if (!cancelled) {
          if (response.success && response.data) {
            setExperts(response.data.map(mapExpertToMentor));
          } else {
            setError('Failed to load experts. Please try again.');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load experts. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchExperts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filterTabs = ['All', 'Career', 'Finance', 'Life Coach', 'Legal', 'Education', 'Creative'];

  const filteredMentors = useMemo(() => {
    let results = experts;

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.expertise.some((e) => e.toLowerCase().includes(q)) ||
          m.bio.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      results = results.filter((m) => m.categories.includes(selectedCategory));
    }

    results = results.filter(
      (m) => m.pricePerMin >= priceRange[0] && m.pricePerMin <= priceRange[1]
    );

    if (minRating > 0) {
      results = results.filter((m) => m.rating >= minRating);
    }

    if (onlineOnly) {
      results = results.filter((m) => m.isOnline);
    }

    switch (sortBy) {
      case 'rating': results = [...results].sort((a, b) => b.rating - a.rating); break;
      case 'price-low': results = [...results].sort((a, b) => a.pricePerMin - b.pricePerMin); break;
      case 'price-high': results = [...results].sort((a, b) => b.pricePerMin - a.pricePerMin); break;
      case 'sessions': results = [...results].sort((a, b) => b.totalSessions - a.totalSessions); break;
    }

    return results;
  }, [experts, search, selectedCategory, priceRange, minRating, onlineOnly, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 100]);
    setMinRating(0);
    setOnlineOnly(false);
    setSortBy('rating');
    setSearch('');
    setActiveFilter('All');
  };

  const hasActiveFilters = selectedCategory || minRating > 0 || onlineOnly || priceRange[0] > 0 || priceRange[1] < 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {filterTabs.map((tab) => (
              <Button
                key={tab}
                size="sm"
                variant={activeFilter === tab ? 'primary' : 'ghost'}
                className={activeFilter === tab ? '' : 'text-muted-foreground'}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Available Experts
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredMentors.length} expert{filteredMentors.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search experts..."
                className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-sm"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="hidden sm:block px-3 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="sessions">Most Sessions</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden p-2.5 bg-card border border-border rounded-xl hover:bg-secondary"
            >
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden'
            } sm:block sm:relative sm:inset-auto sm:z-auto sm:bg-transparent sm:p-0 w-full sm:w-64 shrink-0`}
          >
            <div className="sm:sticky sm:top-28">
              <div className="flex items-center justify-between mb-4 sm:hidden">
                <h3 className="font-semibold text-lg text-foreground">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="w-6 h-6" /></button>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5 space-y-6">
                {/* Category */}
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-3">Category</h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        !selectedCategory ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          selectedCategory === cat.slug
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-3">
                    Price (₹{priceRange[0]} - ₹{priceRange[1]}/min)
                  </h4>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-3">Minimum Rating</h4>
                  <div className="flex gap-2">
                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          minRating === r
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-muted'
                        }`}
                      >
                        {r === 0 ? 'Any' : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Online toggle */}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground text-sm">Online Now</h4>
                  <button
                    onClick={() => setOnlineOnly(!onlineOnly)}
                    className={`w-11 h-6 rounded-full transition-colors ${onlineOnly ? 'bg-success' : 'bg-muted'}`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${onlineOnly ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-destructive font-semibold hover:bg-destructive/5 rounded-lg transition"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Mentor Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading experts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
                <p className="text-muted-foreground mt-1">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
              </div>
            ) : filteredMentors.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.uid} mentor={mentor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground">No experts found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} className="mt-4">Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
