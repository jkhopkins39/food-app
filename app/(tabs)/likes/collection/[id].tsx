import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function CollectionScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { collections, getRestaurant, likes } = useApp();
  const collection = collections.find((item) => item.id === id);
  const places = (collection?.restaurantIds ?? [])
    .map((restaurantId) => getRestaurant(restaurantId))
    .filter((restaurant) => restaurant !== undefined);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: tabClearance(insets.bottom) + 12 }}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>{collection ? `${collection.name} Collection` : 'Collection'}</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={{ paddingHorizontal: space.screen }}>
        {places.map((restaurant) => (
          <Pressable
            key={restaurant.id}
            onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: restaurant.id } })}
            style={styles.card}
          >
            <Image source={{ uri: restaurant.image }} style={styles.image} contentFit="cover" />
            <View style={styles.body}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{restaurant.name}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
                  <Icon name="star.fill" size={14} color={colors.star} />
                </View>
              </View>
              <Icon name={likes.includes(restaurant.id) ? 'heart.fill' : 'heart'} size={18} color={colors.orangeDeep} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.serifBold, fontSize: 22, color: colors.brown },
  card: { backgroundColor: '#F8ECDE', borderRadius: 22, overflow: 'hidden', marginBottom: 16 },
  image: { width: '100%', height: 180, backgroundColor: colors.orangeSoft },
  body: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  name: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.ink },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { fontFamily: fonts.sansBold, color: colors.brown },
});
