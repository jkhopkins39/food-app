import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  AREAS,
  PROFILE_AVATAR,
  RESTAURANTS,
  STARTER_COLLECTIONS,
  type Collection,
  type Restaurant,
  type UserReview,
} from '@/data/catalog';
import { distanceFeet, offsetNorth, type Coords } from '@/lib/geo';
import { searchRestaurants, type SearchHit } from '@/lib/search';
import { alertCopy, buildUserVector, cosine, restaurantVector, type Vector } from '@/lib/taste';
import { sendFoodAlert, sendFoodAlertIfAllowed } from '@/services/alerts';
import { googlePlacesKey, searchNearbyRestaurants } from '@/services/places';

const STORAGE_KEY = 'savor.demo.v1';
const ALERT_COOLDOWN_MS = 1000 * 60 * 60 * 4;

export type Profile = {
  name: string;
  handle: string;
  pronouns: string;
  city: string;
  avatar: string;
};

type Persisted = {
  profile: Profile;
  tags: string[];
  likes: string[];
  passes: string[];
  collections: Collection[];
  reviews: UserReview[];
  maxDistanceMiles: number;
  alertRadiusFeet: number;
  alertScore: number;
  alertsEnabled: boolean;
  areaId: string;
  useDeviceLocation: boolean;
  alerted: Record<string, number>;
};

export type FoodAlert = {
  restaurantId: string;
  feet: number;
  score: number;
  body: string;
};

type LocationMode = 'demo' | 'device' | 'simulated';

type AppValue = {
  ready: boolean;
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  likes: string[];
  passes: string[];
  collections: Collection[];
  reviews: UserReview[];
  addReview: (restaurantId: string, rating: number, text: string) => void;
  addToCollection: (collectionId: string, restaurantId: string) => void;
  createCollection: (name: string, restaurantId?: string) => void;
  maxDistanceMiles: number;
  setMaxDistanceMiles: (miles: number) => void;
  alertRadiusFeet: number;
  setAlertRadiusFeet: (feet: number) => void;
  alertScore: number;
  setAlertScore: (score: number) => void;
  alertsEnabled: boolean;
  setAlertsEnabled: (enabled: boolean) => void;
  areaId: string;
  areaLabel: string;
  coords: Coords;
  locationMode: LocationMode;
  setArea: (areaId: string) => void;
  enableDeviceLocation: () => Promise<boolean>;
  restaurants: Restaurant[];
  usingGoogle: boolean;
  googleNote: string | null;
  vector: Vector;
  scoreFor: (id: string) => number;
  feetFor: (id: string) => number;
  nearby: Restaurant[];
  recommended: Restaurant[];
  deck: Restaurant[];
  like: (id: string) => void;
  pass: (id: string) => void;
  unlike: (id: string) => void;
  activeAlert: FoodAlert | null;
  dismissAlert: () => void;
  previewSoulmateAlert: () => FoodAlert | null;
  resetDemo: () => void;
  deleteTasteData: () => void;
  getRestaurant: (id: string) => Restaurant | undefined;
  search: (query: string) => SearchHit[];
};

const AppContext = createContext<AppValue | null>(null);

function seed(): Persisted {
  return {
    profile: {
      name: 'JuicyPeachh',
      handle: 'beeflover12',
      pronouns: 'she/her',
      city: 'Atlanta, Georgia',
      avatar: PROFILE_AVATAR,
    },
    tags: ['Sushi', 'Indian', 'Healthy', 'Sweets'],
    likes: ['sushi-bros', 'roll-theory'],
    passes: [],
    collections: STARTER_COLLECTIONS,
    reviews: [
      {
        id: 'review-sushi',
        restaurantId: 'sushi-bros',
        rating: 5,
        text: 'The sweet spicy roll ruined other sushi for me. Fresh, quick, and we stayed for the all you can eat.',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
      },
      {
        id: 'review-naan',
        restaurantId: 'naan-clay',
        rating: 5,
        text: 'Spicy, fragrant, and the naan was still warm. This is the indian place I keep suggesting.',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
      },
    ],
    maxDistanceMiles: 10,
    alertRadiusFeet: 500,
    alertScore: 0.95,
    alertsEnabled: true,
    areaId: 'acworth',
    useDeviceLocation: false,
    alerted: {},
  };
}

function vectorsFor(list: Restaurant[], reviews: UserReview[]) {
  const map: Record<string, Vector> = {};
  for (const restaurant of list) {
    map[restaurant.id] = restaurantVector({
      ...restaurant,
      extraTexts: reviews.filter((review) => review.restaurantId === restaurant.id).map((review) => review.text),
    });
  }
  return map;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<Persisted>(seed);
  const [live, setLive] = useState<Restaurant[]>([]);
  const [googleNote, setGoogleNote] = useState<string | null>(null);
  const [deviceCoords, setDeviceCoords] = useState<Coords | null>(null);
  const [deviceLabel, setDeviceLabel] = useState<string | null>(null);
  const [sessionCoords, setSessionCoords] = useState<Coords | null>(null);
  const [sessionLabel, setSessionLabel] = useState<string | null>(null);
  const [spotlightDone, setSpotlightDone] = useState(false);
  const [activeAlert, setActiveAlert] = useState<FoodAlert | null>(null);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        const parsed = JSON.parse(raw) as Persisted;
        if (parsed?.profile?.handle) setData({ ...seed(), ...parsed });
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => undefined);
  }, [data, ready]);

  const area = AREAS.find((item) => item.id === data.areaId) ?? AREAS[0];
  const demoCoords = useMemo(
    () => ({ latitude: area.latitude, longitude: area.longitude }),
    [area.latitude, area.longitude],
  );
  const coords = sessionCoords ?? deviceCoords ?? demoCoords;
  const locationMode: LocationMode = sessionCoords ? 'simulated' : deviceCoords ? 'device' : 'demo';
  const areaLabel = sessionLabel ?? deviceLabel ?? area.label;

  useEffect(() => {
    if (!data.useDeviceLocation) {
      setDeviceCoords(null);
      setDeviceLabel(null);
      return;
    }
    let sub: Location.LocationSubscription | null = null;
    let cancelled = false;
    (async () => {
      const permission = await Location.getForegroundPermissionsAsync();
      if (permission.status !== 'granted' || cancelled) return;
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (cancelled) return;
      setDeviceCoords({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      const places = await Location.reverseGeocodeAsync(current.coords);
      const place = places[0];
      if (place && !cancelled) {
        const city = place.city || place.subregion || 'Current location';
        setDeviceLabel(place.region ? `${city}, ${place.region}` : city);
      }
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 40 },
        (update) => {
          setDeviceCoords({
            latitude: update.coords.latitude,
            longitude: update.coords.longitude,
          });
        },
      );
    })().catch(() => undefined);
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [data.useDeviceLocation]);

  useEffect(() => {
    if (!ready || !googlePlacesKey()) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      searchNearbyRestaurants(coords, data.maxDistanceMiles * 1609.34)
        .then((list) => {
          if (cancelled || !list) return;
          setLive(list);
          setGoogleNote(null);
        })
        .catch((error: Error) => {
          if (!cancelled) setGoogleNote(error.message);
        });
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ready, coords.latitude, coords.longitude, data.maxDistanceMiles]);

  const restaurants = useMemo(() => {
    const ids = new Set(RESTAURANTS.map((restaurant) => restaurant.name.toLowerCase()));
    const extra = live.filter((restaurant) => !ids.has(restaurant.name.toLowerCase()));
    return [...RESTAURANTS, ...extra];
  }, [live]);

  const vectors = useMemo(() => vectorsFor(restaurants, data.reviews), [restaurants, data.reviews]);

  const vector = useMemo(() => {
    const liked = data.likes.map((id) => vectors[id]).filter(Boolean);
    const passed = data.passes.map((id) => vectors[id]).filter(Boolean);
    return buildUserVector(data.tags, liked, passed);
  }, [data.likes, data.passes, data.tags, vectors]);

  const scoreFor = useCallback(
    (id: string) => cosine(vector, vectors[id] ?? []),
    [vector, vectors],
  );

  const feetFor = useCallback(
    (id: string) => {
      const restaurant = restaurants.find((item) => item.id === id);
      if (!restaurant) return Number.POSITIVE_INFINITY;
      return distanceFeet(coords, restaurant);
    },
    [coords, restaurants],
  );

  const inRange = useMemo(
    () => restaurants.filter((restaurant) => feetFor(restaurant.id) <= data.maxDistanceMiles * 5280),
    [data.maxDistanceMiles, feetFor, restaurants],
  );

  const nearby = useMemo(
    () => [...inRange].sort((a, b) => feetFor(a.id) - feetFor(b.id)).slice(0, 8),
    [feetFor, inRange],
  );

  const recommended = useMemo(
    () =>
      [...inRange]
        .filter((restaurant) => !data.passes.includes(restaurant.id))
        .sort((a, b) => scoreFor(b.id) - scoreFor(a.id))
        .slice(0, 8),
    [data.passes, inRange, scoreFor],
  );

  const deck = useMemo(() => {
    const fresh = inRange.filter(
      (restaurant) => !data.passes.includes(restaurant.id) && !data.likes.includes(restaurant.id),
    );
    fresh.sort((a, b) => scoreFor(b.id) - scoreFor(a.id));
    if (!spotlightDone && !data.passes.includes('sushi-bros')) {
      const hero = inRange.find((restaurant) => restaurant.id === 'sushi-bros');
      if (hero) return [hero, ...fresh.filter((restaurant) => restaurant.id !== hero.id)];
    }
    return fresh;
  }, [data.likes, data.passes, inRange, scoreFor, spotlightDone]);

  const alerting = useRef(new Set<string>());

  const publishAlert = useCallback((restaurant: Restaurant, feet: number, score: number) => {
    if (alerting.current.has(restaurant.id)) return null;
    alerting.current.add(restaurant.id);
    const body = alertCopy(restaurant.name, feet, score);
    const next: FoodAlert = { restaurantId: restaurant.id, feet, score, body };
    setActiveAlert(next);
    setData((current) => ({
      ...current,
      alerted: { ...current.alerted, [restaurant.id]: Date.now() },
    }));
    void sendFoodAlertIfAllowed(restaurant.id, body).catch(() => false);
    return next;
  }, []);

  useEffect(() => {
    if (!ready || !data.alertsEnabled || sessionCoords) return;
    const hit = restaurants
      .map((restaurant) => ({
        restaurant,
        feet: distanceFeet(coords, restaurant),
        score: cosine(vector, vectors[restaurant.id] ?? []),
      }))
      .filter((item) => !data.passes.includes(item.restaurant.id))
      .filter((item) => item.feet <= data.alertRadiusFeet && item.score >= data.alertScore)
      .filter((item) => Date.now() - (data.alerted[item.restaurant.id] ?? 0) > ALERT_COOLDOWN_MS)
      .sort((a, b) => b.score - a.score)[0];
    if (!hit) return;
    void publishAlert(hit.restaurant, hit.feet, hit.score);
  }, [
    coords,
    data.alertRadiusFeet,
    data.alertScore,
    data.alerted,
    data.alertsEnabled,
    data.passes,
    publishAlert,
    ready,
    restaurants,
    sessionCoords,
    vector,
    vectors,
  ]);

  const previewSoulmateAlert = useCallback(() => {
    const ranked = [...restaurants]
      .filter((restaurant) => !data.passes.includes(restaurant.id))
      .map((restaurant) => ({ restaurant, score: cosine(vector, vectors[restaurant.id] ?? []) }))
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (!best) return null;
    const feet = 300;
    const nextCoords = offsetNorth(best.restaurant, feet);
    setSessionCoords(nextCoords);
    setSessionLabel(`Near ${best.restaurant.name}`);
    const body = alertCopy(best.restaurant.name, feet, best.score);
    const alert: FoodAlert = {
      restaurantId: best.restaurant.id,
      feet,
      score: best.score,
      body,
    };
    setActiveAlert(alert);
    void sendFoodAlert(best.restaurant.id, body).catch(() => false);
    return alert;
  }, [data.passes, restaurants, vector, vectors]);

  const enableDeviceLocation = useCallback(async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') return false;
    setSessionCoords(null);
    setSessionLabel(null);
    setData((current) => ({ ...current, useDeviceLocation: true }));
    return true;
  }, []);

  const value: AppValue = {
    ready,
    profile: data.profile,
    updateProfile: (patch) => setData((current) => ({ ...current, profile: { ...current.profile, ...patch } })),
    tags: data.tags,
    setTags: (tags) => setData((current) => ({ ...current, tags })),
    likes: data.likes,
    passes: data.passes,
    collections: data.collections,
    reviews: data.reviews,
    addReview: (restaurantId, rating, text) =>
      setData((current) => ({
        ...current,
        reviews: [
          { id: `review-${Date.now()}`, restaurantId, rating, text, createdAt: Date.now() },
          ...current.reviews,
        ],
        likes: rating >= 4 && !current.likes.includes(restaurantId) ? [...current.likes, restaurantId] : current.likes,
      })),
    addToCollection: (collectionId, restaurantId) =>
      setData((current) => ({
        ...current,
        collections: current.collections.map((collection) =>
          collection.id === collectionId && !collection.restaurantIds.includes(restaurantId)
            ? { ...collection, restaurantIds: [...collection.restaurantIds, restaurantId] }
            : collection,
        ),
      })),
    createCollection: (name, restaurantId) =>
      setData((current) => ({
        ...current,
        collections: [
          ...current.collections,
          {
            id: `col-${Date.now()}`,
            name: name.trim(),
            restaurantIds: restaurantId ? [restaurantId] : [],
          },
        ],
      })),
    maxDistanceMiles: data.maxDistanceMiles,
    setMaxDistanceMiles: (maxDistanceMiles) => setData((current) => ({ ...current, maxDistanceMiles })),
    alertRadiusFeet: data.alertRadiusFeet,
    setAlertRadiusFeet: (alertRadiusFeet) => setData((current) => ({ ...current, alertRadiusFeet })),
    alertScore: data.alertScore,
    setAlertScore: (alertScore) => setData((current) => ({ ...current, alertScore })),
    alertsEnabled: data.alertsEnabled,
    setAlertsEnabled: (alertsEnabled) => setData((current) => ({ ...current, alertsEnabled })),
    areaId: data.areaId,
    areaLabel,
    coords,
    locationMode,
    setArea: (areaId) => {
      setSessionCoords(null);
      setSessionLabel(null);
      setDeviceCoords(null);
      setDeviceLabel(null);
      setData((current) => ({ ...current, areaId, useDeviceLocation: false }));
    },
    enableDeviceLocation,
    restaurants,
    usingGoogle: live.length > 0,
    googleNote,
    vector,
    scoreFor,
    feetFor,
    nearby,
    recommended,
    deck,
    like: (id) => {
      if (id === 'sushi-bros') setSpotlightDone(true);
      setData((current) => ({
        ...current,
        passes: current.passes.filter((item) => item !== id),
        likes: current.likes.includes(id) ? current.likes : [...current.likes, id],
      }));
    },
    pass: (id) => {
      if (id === 'sushi-bros') setSpotlightDone(true);
      setData((current) => ({
        ...current,
        likes: current.likes.filter((item) => item !== id),
        passes: current.passes.includes(id) ? current.passes : [...current.passes, id],
      }));
    },
    unlike: (id) =>
      setData((current) => ({ ...current, likes: current.likes.filter((item) => item !== id) })),
    activeAlert,
    dismissAlert: () => setActiveAlert(null),
    previewSoulmateAlert,
    resetDemo: () => {
      setLive([]);
      setSessionCoords(null);
      setSessionLabel(null);
      setDeviceCoords(null);
      setSpotlightDone(false);
      setActiveAlert(null);
      setData(seed());
    },
    deleteTasteData: () =>
      setData((current) => ({
        ...current,
        tags: [],
        likes: [],
        passes: [],
        reviews: [],
        collections: [],
        alerted: {},
      })),
    getRestaurant: (id) => restaurants.find((restaurant) => restaurant.id === id),
    search: (query) => searchRestaurants(query, restaurants, vectors),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used within AppProvider');
  return value;
}
