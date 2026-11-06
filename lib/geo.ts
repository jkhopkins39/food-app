export type Coords = {
  latitude: number;
  longitude: number;
};

const EARTH_MILES = 3958.8;

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceMiles(a: Coords, b: Coords) {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_MILES * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function distanceFeet(a: Coords, b: Coords) {
  return distanceMiles(a, b) * 5280;
}

export function offsetNorth(origin: Coords, feet: number): Coords {
  const miles = feet / 5280;
  return {
    latitude: origin.latitude + miles / 69,
    longitude: origin.longitude,
  };
}

export function formatDistance(feet: number) {
  if (feet < 900) return `${Math.max(50, Math.round(feet / 10) * 10)} ft`;
  const miles = feet / 5280;
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export function formatDistanceWords(feet: number) {
  if (feet < 900) return `${Math.round(feet)} feet`;
  const miles = feet / 5280;
  if (miles < 10) return `${miles.toFixed(1)} miles`;
  return `${Math.round(miles)} miles`;
}

export function regionFor(coords: Coords, delta = 0.035) {
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}
