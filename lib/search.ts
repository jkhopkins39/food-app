import type { Restaurant } from '@/data/catalog';
import type { Vector } from '@/lib/taste';
import { cosine, embedText } from '@/lib/taste';

export type SearchHit = {
  restaurant: Restaurant;
  reason: 'name' | 'reviews';
};

export function searchRestaurants(
  query: string,
  restaurants: Restaurant[],
  vectors: Record<string, Vector>,
): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const embedded = embedText(q);
  const signal = embedded.some((value) => value > 0);
  return restaurants
    .map((restaurant) => {
      const nameBlob = `${restaurant.name} ${restaurant.cuisine} ${restaurant.tags.join(' ')}`.toLowerCase();
      const reviewBlob = `${restaurant.about} ${restaurant.reviews.map((review) => review.text).join(' ')}`.toLowerCase();
      const nameHit = nameBlob.includes(q);
      const reviewHit = reviewBlob.includes(q);
      const semantic = signal ? cosine(embedded, vectors[restaurant.id] ?? []) : 0;
      const score = (nameHit ? 2 : 0) + (reviewHit ? 1 : 0) + semantic;
      const matched = nameHit || reviewHit || semantic >= 0.45;
      return {
        restaurant,
        reason: nameHit ? ('name' as const) : ('reviews' as const),
        score,
        matched,
      };
    })
    .filter((hit) => hit.matched)
    .sort((a, b) => b.score - a.score)
    .map(({ restaurant, reason }) => ({ restaurant, reason }));
}
