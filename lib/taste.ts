import { formatDistanceWords } from '@/lib/geo';

export const DIMENSIONS = [
  'spicy',
  'sweet',
  'savory',
  'fresh',
  'rich',
  'japanese',
  'mexican',
  'american',
  'indian',
  'seafood',
  'healthy',
  'comfort',
  'vegetarian',
  'dessert',
  'shareable',
  'affordable',
] as const;

export type Dimension = (typeof DIMENSIONS)[number];
export type Vector = number[];
export type Bias = Partial<Record<Dimension, number>>;

export const DIMENSION_LABELS: Record<Dimension, string> = {
  spicy: 'Spicy',
  sweet: 'Sweet',
  savory: 'Savory',
  fresh: 'Fresh',
  rich: 'Rich',
  japanese: 'Japanese',
  mexican: 'Mexican',
  american: 'American',
  indian: 'Indian',
  seafood: 'Seafood',
  healthy: 'Healthy',
  comfort: 'Comfort',
  vegetarian: 'Vegetarian',
  dessert: 'Dessert',
  shareable: 'Shareable',
  affordable: 'Affordable',
};

export const PREFERENCE_TAGS = [
  'Sushi',
  'Indian',
  'Healthy',
  'Sweets',
  'Mexican',
  'Comfort',
  'Seafood',
  'Spicy',
  'Vegetarian',
  'Dessert',
] as const;

export const TAG_BIAS: Record<string, Bias> = {
  Sushi: { japanese: 1, seafood: 0.85, fresh: 0.55 },
  Indian: { indian: 1, spicy: 0.75, savory: 0.35 },
  Healthy: { healthy: 1, fresh: 0.7, vegetarian: 0.25 },
  Sweets: { sweet: 1, dessert: 0.85 },
  Mexican: { mexican: 1, spicy: 0.45, savory: 0.35 },
  Comfort: { comfort: 1, rich: 0.55, american: 0.3 },
  Seafood: { seafood: 1, fresh: 0.4 },
  Spicy: { spicy: 1 },
  Vegetarian: { vegetarian: 1, healthy: 0.5, fresh: 0.25 },
  Dessert: { dessert: 1, sweet: 0.8 },
};

const PHRASES: { pattern: string; weights: Bias }[] = [
  { pattern: 'sweet spicy', weights: { sweet: 1.3, spicy: 1.3 } },
  { pattern: 'sweet-spicy', weights: { sweet: 1.3, spicy: 1.3 } },
  { pattern: 'spicy mayo', weights: { spicy: 0.8, rich: 0.35, japanese: 0.25 } },
  { pattern: 'all you can eat', weights: { shareable: 1, affordable: 0.7 } },
  { pattern: 'hand-made', weights: { fresh: 0.45 } },
  { pattern: 'handmade', weights: { fresh: 0.45 } },
  { pattern: 'sushi', weights: { japanese: 1, seafood: 0.55, fresh: 0.35 } },
  { pattern: 'sashimi', weights: { japanese: 0.8, seafood: 0.75, fresh: 0.5 } },
  { pattern: 'hibachi', weights: { japanese: 0.9, shareable: 0.45, savory: 0.35 } },
  { pattern: 'japanese', weights: { japanese: 1 } },
  { pattern: 'ramen', weights: { japanese: 0.7, rich: 0.45, comfort: 0.55 } },
  { pattern: 'miso', weights: { japanese: 0.4, savory: 0.3 } },
  { pattern: 'taco', weights: { mexican: 0.9, savory: 0.2 } },
  { pattern: 'mexican', weights: { mexican: 1 } },
  { pattern: 'salsa', weights: { mexican: 0.45, fresh: 0.25, spicy: 0.2 } },
  { pattern: 'burrito', weights: { mexican: 0.7, comfort: 0.3 } },
  { pattern: 'burger', weights: { american: 0.9, comfort: 0.55, rich: 0.25 } },
  { pattern: 'fries', weights: { american: 0.4, comfort: 0.45 } },
  { pattern: 'fast food', weights: { american: 0.45, affordable: 0.7, comfort: 0.3 } },
  { pattern: 'indian', weights: { indian: 1 } },
  { pattern: 'curry', weights: { indian: 0.85, spicy: 0.45, savory: 0.3 } },
  { pattern: 'masala', weights: { indian: 0.7, spicy: 0.25 } },
  { pattern: 'naan', weights: { indian: 0.7, comfort: 0.2 } },
  { pattern: 'tandoori', weights: { indian: 0.8, spicy: 0.55 } },
  { pattern: 'seafood', weights: { seafood: 1, fresh: 0.25 } },
  { pattern: 'shrimp', weights: { seafood: 0.7 } },
  { pattern: 'salmon', weights: { seafood: 0.65, fresh: 0.2 } },
  { pattern: 'tuna', weights: { seafood: 0.6 } },
  { pattern: 'fish', weights: { seafood: 0.45 } },
  { pattern: 'healthy', weights: { healthy: 1, fresh: 0.3 } },
  { pattern: 'salad', weights: { healthy: 0.7, fresh: 0.55, vegetarian: 0.35 } },
  { pattern: 'grain', weights: { healthy: 0.45 } },
  { pattern: 'grilled', weights: { healthy: 0.25, savory: 0.2 } },
  { pattern: 'vegetarian', weights: { vegetarian: 1, healthy: 0.3 } },
  { pattern: 'vegan', weights: { vegetarian: 0.8, healthy: 0.4 } },
  { pattern: 'veggie', weights: { vegetarian: 0.55, fresh: 0.2 } },
  { pattern: 'dessert', weights: { dessert: 1, sweet: 0.6 } },
  { pattern: 'ice cream', weights: { dessert: 0.9, sweet: 0.7 } },
  { pattern: 'cookie', weights: { dessert: 0.7, sweet: 0.65 } },
  { pattern: 'pastry', weights: { dessert: 0.7, sweet: 0.5 } },
  { pattern: 'sweet', weights: { sweet: 0.85 } },
  { pattern: 'spicy', weights: { spicy: 0.9 } },
  { pattern: 'savory', weights: { savory: 0.8 } },
  { pattern: 'umami', weights: { savory: 0.7 } },
  { pattern: 'fresh', weights: { fresh: 0.8 } },
  { pattern: 'crisp', weights: { fresh: 0.35 } },
  { pattern: 'creamy', weights: { rich: 0.55 } },
  { pattern: 'fried', weights: { rich: 0.45, comfort: 0.35 } },
  { pattern: 'cheesy', weights: { rich: 0.4, comfort: 0.45 } },
  { pattern: 'comfort', weights: { comfort: 0.8 } },
  { pattern: 'avocado', weights: { fresh: 0.35, healthy: 0.2 } },
  { pattern: 'platter', weights: { shareable: 0.7 } },
  { pattern: 'share', weights: { shareable: 0.45 } },
  { pattern: 'group', weights: { shareable: 0.25 } },
  { pattern: 'affordable', weights: { affordable: 0.8 } },
  { pattern: 'cheap', weights: { affordable: 0.55 } },
  { pattern: 'value', weights: { affordable: 0.35 } },
  { pattern: 'quick', weights: { affordable: 0.25 } },
];

export function zeroVector(): Vector {
  return DIMENSIONS.map(() => 0);
}

function indexOf(dimension: Dimension) {
  return DIMENSIONS.indexOf(dimension);
}

function applyBias(vector: Vector, bias: Bias | undefined, scale: number) {
  if (!bias) return;
  for (const key of Object.keys(bias) as Dimension[]) {
    vector[indexOf(key)] += (bias[key] ?? 0) * scale;
  }
}

export function normalize(vector: Vector): Vector {
  let sum = 0;
  for (const value of vector) sum += value * value;
  if (sum <= 0) return zeroVector();
  const magnitude = Math.sqrt(sum);
  return vector.map((value) => value / magnitude);
}

export function embedText(text: string, bias?: Bias): Vector {
  const vector = zeroVector();
  const haystack = text.toLowerCase();
  for (const phrase of PHRASES) {
    let count = 0;
    let from = 0;
    while (count < 4) {
      const found = haystack.indexOf(phrase.pattern, from);
      if (found < 0) break;
      count += 1;
      from = found + phrase.pattern.length;
    }
    if (count > 0) applyBias(vector, phrase.weights, count);
  }
  applyBias(vector, bias, 1.4);
  return normalize(vector);
}

export function cosine(a: Vector, b: Vector) {
  let dot = 0;
  let aSum = 0;
  let bSum = 0;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i += 1) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    aSum += av * av;
    bSum += bv * bv;
  }
  if (aSum === 0 || bSum === 0) return 0;
  return dot / Math.sqrt(aSum * bSum);
}

export function buildUserVector(tags: string[], liked: Vector[], passed: Vector[]) {
  const vector = zeroVector();
  for (const tag of tags) applyBias(vector, TAG_BIAS[tag], 0.55);
  for (const likedVector of liked) {
    for (let i = 0; i < vector.length; i += 1) vector[i] += (likedVector[i] ?? 0) * 6;
  }
  for (const passedVector of passed) {
    for (let i = 0; i < vector.length; i += 1) vector[i] -= (passedVector[i] ?? 0) * 1.1;
  }
  for (let i = 0; i < vector.length; i += 1) vector[i] = Math.max(0, vector[i]);
  return normalize(vector);
}

export function topDimensions(vector: Vector, count = 5) {
  const total = vector.reduce((sum, value) => sum + value, 0) || 1;
  return DIMENSIONS.map((id, index) => ({
    id,
    label: DIMENSION_LABELS[id],
    weight: vector[index] ?? 0,
    share: (vector[index] ?? 0) / total,
  }))
    .filter((item) => item.weight > 0.02)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, count);
}

export function detectedDimensions(text: string) {
  return topDimensions(embedText(text), 4);
}

export function restaurantVector(input: {
  cuisine: string;
  about: string;
  tags: string[];
  reviews: { text: string }[];
  bias?: Bias;
  extraTexts?: string[];
}) {
  const text = [
    input.cuisine,
    input.about,
    input.tags.join(' '),
    ...input.reviews.map((review) => review.text),
    ...(input.extraTexts ?? []),
  ].join('\n');
  return embedText(text, input.bias);
}

export function alertCopy(name: string, feet: number, score: number) {
  const distance = formatDistanceWords(feet);
  const percent = Math.round(score * 100);
  if (percent >= 95) {
    return `${name} is your food soulmate and it's only ${distance} away`;
  }
  return `${name} is a ${percent}% match for your taste and it's only ${distance} away`;
}

export function vectorFromPlaceTypes(types: string[]) {
  const blob = types.join(' ').replace(/_/g, ' ');
  const bias: Bias = {};
  if (blob.includes('japanese') || blob.includes('sushi') || blob.includes('ramen')) {
    bias.japanese = 1;
    bias.seafood = 0.4;
    bias.fresh = 0.3;
  }
  if (blob.includes('mexican') || blob.includes('taco')) bias.mexican = 1;
  if (blob.includes('indian')) {
    bias.indian = 1;
    bias.spicy = 0.4;
  }
  if (blob.includes('american') || blob.includes('hamburger') || blob.includes('burger')) {
    bias.american = 1;
    bias.comfort = 0.5;
  }
  if (blob.includes('seafood')) bias.seafood = 1;
  if (blob.includes('vegetarian') || blob.includes('vegan')) {
    bias.vegetarian = 1;
    bias.healthy = 0.6;
  }
  if (blob.includes('dessert') || blob.includes('bakery') || blob.includes('ice cream')) {
    bias.dessert = 1;
    bias.sweet = 0.8;
  }
  if (blob.includes('meal takeaway') || blob.includes('fast food')) bias.affordable = 0.6;
  return embedText(blob, bias);
}
