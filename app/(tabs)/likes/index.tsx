import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { ScreenTitle } from '@/components/Chrome';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function LikesScreen() {
  const insets = useSafeAreaInsets();
  const { collections, likes, restaurants, unlike, getRestaurant } = useApp();
  const liked = likes
    .map((id) => restaurants.find((restaurant) => restaurant.id === id))
    .filter((restaurant) => restaurant !== undefined);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: tabClearance(insets.bottom) + 20 }}
    >
      <ScreenTitle>My Likes</ScreenTitle>
      <View style={styles.collectionHeader}>
        <Text style={styles.kicker}>Collections</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/likes/collections')}>
          <Text style={styles.seeMore}>See More</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.collectionRow}>
        {collections.map((collection) => {
          const covers = collection.restaurantIds
            .map((id) => getRestaurant(id)?.image)
            .filter((uri): uri is string => Boolean(uri))
            .slice(0, 3);
          return (
            <Pressable
              key={collection.id}
              accessibilityRole="button"
              accessibilityLabel={`${collection.name} collection`}
              onPress={() => router.push({ pathname: '/likes/collection/[id]', params: { id: collection.id } })}
              style={styles.collectionCard}
            >
              <View style={styles.collage}>
                <Image source={{ uri: covers[0] }} style={styles.coverMain} contentFit="cover" />
                <View style={styles.coverStack}>
                  <Image source={{ uri: covers[1] ?? covers[0] }} style={styles.coverSmall} contentFit="cover" />
                  <Image source={{ uri: covers[2] ?? covers[0] }} style={styles.coverSmall} contentFit="cover" />
                </View>
              </View>
              <View style={styles.collectionLabel}>
                <Text style={styles.collectionName} numberOfLines={1}>
                  {collection.name}
                </Text>
                <Icon name="chevron.right" size={12} color={colors.muted} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ paddingHorizontal: space.screen, marginTop: 8 }}>
        {liked.length === 0 ? (
          <Text style={styles.empty}>
            Swipe right on Discover and the places you love will land here, ready to sort into a collection.
          </Text>
        ) : (
          liked.map((restaurant) => (
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
                <Pressable
                  accessibilityLabel={`Unlike ${restaurant.name}`}
                  onPress={() => unlike(restaurant.id)}
                  style={styles.heart}
                >
                  <Icon name="heart.fill" size={18} color={colors.orangeDeep} />
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  collectionHeader: {
    marginTop: 22,
    paddingHorizontal: space.screen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kicker: { fontFamily: fonts.sansSemibold, fontSize: 16, color: colors.ink },
  seeMore: { fontFamily: fonts.sansMedium, color: colors.muted, fontSize: 14 },
  collectionRow: { paddingHorizontal: space.screen, gap: 12, paddingTop: 12 },
  collectionCard: { width: 132 },
  collage: { height: 78, borderRadius: 14, overflow: 'hidden', flexDirection: 'row', backgroundColor: colors.orangeSoft },
  coverMain: { flex: 1 },
  coverStack: { width: 42 },
  coverSmall: { flex: 1 },
  collectionLabel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  collectionName: { fontFamily: fonts.sansMedium, color: colors.ink, flex: 1 },
  card: {
    backgroundColor: '#F8ECDE',
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: { width: '100%', height: 190, backgroundColor: colors.orangeSoft },
  body: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 8 },
  name: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.ink },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { fontFamily: fonts.sansBold, color: colors.brown, fontSize: 15 },
  heart: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { fontFamily: fonts.sans, color: colors.muted, fontSize: 16, lineHeight: 22 },
});
