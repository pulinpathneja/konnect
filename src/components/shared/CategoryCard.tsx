'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/explore?category=${category.slug}`}
      className="group cursor-pointer"
    >
      <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
        <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </span>
        <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{category.mentorCount} mentors</p>
      </div>
    </Link>
  );
}
