import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AreaPicker } from '@/components/AreaPicker';
import { BackButton } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { regionFor } from '@/lib/geo';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { coords, restaurants, feetFor, maxDistanceMiles } = useApp();
  const mapRef = useRef<MapView>(null);
  const [areasOpen, setAreasOpen] = useState(false);
  const pins = restaurants.filter((restaurant) => feetFor(restaurant.id) <= Math.max(maxDistanceMiles, 3) * 5280);

  useEffect(() => {
    mapRef.current?.animateToRegion(regionFor(coords), 450);
  }, [coords]);

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={regionFor(coords)}
        showsCompass={false}
        showsPointsOfInterests={false}
        rotateEnabled={false}
        userInterfaceStyle="light"
      >
        <Circle center={coords} radius={90} fillColor={colors.halo} strokeColor="transparent" />
        <Marker coordinate={coords} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.meOuter}>
            <View style={styles.me} />
          </View>
        </Marker>
        {pins.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
            onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: restaurant.id } })}
            tracksViewChanges
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.pin} accessibilityLabel={restaurant.name}>
              <Icon name="fork.knife" size={14} color={colors.white} />
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={[styles.top, { top: insets.top + 6 }]}>
        <BackButton style={styles.float} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change area or recenter"
          onPress={() => setAreasOpen(true)}
          style={styles.float}
        >
          <Icon name="map" size={22} color={colors.orangeDeep} />
        </Pressable>
      </View>
      <AreaPicker visible={areasOpen} onClose={() => setAreasOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: {
    position: 'absolute',
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  float: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(251, 247, 241, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  meOuter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.halo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  me: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.orange,
    borderWidth: 3,
    borderColor: colors.white,
  },
});
