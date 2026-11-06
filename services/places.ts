import type { Restaurant } from '@/data/catalog';
import type { Coords } from '@/lib/geo';

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  location?: { latitude?: number; longitude?: number };
  formattedAddress?: string;
  types?: string[];
  photos?: { name?: string }[];
  primaryTypeDisplayName?: { text?: string };
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80';

export function googlePlacesKey() {
  return process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY?.trim() || '';
}

function photoUrl(name: string | undefined, key: string) {
  if (!name) return FALLBACK_IMAGE;
  return `https://places.googleapis.com/v1/${name}/media?maxHeightPx=1200&key=${key}`;
}

function mapPlace(place: GooglePlace, key: string): Restaurant | null {
  if (!place.id || !place.location?.latitude || !place.location.longitude) return null;
  const types = place.types ?? [];
  const cuisine = place.primaryTypeDisplayName?.text || 'Restaurant';
  return {
    id: `g_${place.id}`,
    name: place.displayName?.text || 'Restaurant',
    cuisine,
    rating: place.rating ?? 0,
    latitude: place.location.latitude,
    longitude: place.location.longitude,
    address: place.formattedAddress || '',
    image: photoUrl(place.photos?.[0]?.name, key),
    blurb: `${cuisine} listed on Google. The taste match uses the place type, not the review text.`,
    about:
      'This place was loaded from Google Places. Photos and the pin are Google data. Review sentences are not copied into the taste model, because Google’s terms restrict how that text can be reused. In-app reviews you write yourself do update your taste profile.',
    tags: [cuisine],
    reviews: [],
    source: 'google',
  };
}

export async function searchNearbyRestaurants(coords: Coords, radiusMeters: number): Promise<Restaurant[] | null> {
  const key = googlePlacesKey();
  if (!key) return null;
  const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.rating,places.location,places.formattedAddress,places.types,places.photos,places.primaryTypeDisplayName',
    },
    body: JSON.stringify({
      includedPrimaryTypes: ['restaurant'],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: { latitude: coords.latitude, longitude: coords.longitude },
          radius: Math.min(Math.max(radiusMeters, 500), 50000),
        },
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`Places search failed (${response.status})`);
  }
  const json = (await response.json()) as { places?: GooglePlace[] };
  return (json.places ?? [])
    .map((place) => mapPlace(place, key))
    .filter((place): place is Restaurant => place !== null);
}
