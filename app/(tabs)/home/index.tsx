import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { formatDistance } from '@/lib/geo';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profile, nearby, recommended, likes, like, unlike, scoreFor, feetFor, search } = useApp();
  const [query, setQuery] = useState('');
  const hits = query.trim() ? search(query) : [];

  const heart = (id: string) => {
    if (likes.includes(id)) {
      unlike(id);
      return;
    }
    like(id);
    router.push({ pathname: '/restaurant/[id]', params: { id, match: '1' } });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: tabClearance(insets.bottom) + 24,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.handle}>{profile.handle}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open map"
          onPress={() => router.push('/home/map')}
          style={styles.mapButton}
        >
          <Icon name="map" size={26} color={colors.brown} />
        </Pressable>
      </View>

      <View style={styles.search}>
        <Icon name="magnifyingglass" size={18} color={colors.brown} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search restaurants, food, locations..."
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCorrect={false}
          accessibilityLabel="Search restaurants, food, and the language in reviews"
          returnKeyType="search"
        />
        {query ? (
          <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}>
            <Icon name="xmark" size={16} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      {query.trim() ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Results</Text>
          {hits.length === 0 ? (
            <Text style={styles.empty}>
              Nothing nearby matches that. Try a taste word from a review, like “sweet spicy” or “tandoori”.
            </Text>
          ) : (
            hits.map((hit) => (
              <Pressable
                key={hit.restaurant.id}
                onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: hit.restaurant.id } })}
                style={styles.result}
              >
                <Image source={{ uri: hit.restaurant.image }} style={styles.resultImage} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{hit.restaurant.name}</Text>
                  <Text style={styles.meta}>
                    {hit.reason === 'reviews' ? 'Matched from review language' : hit.restaurant.cuisine}
                    {' · '}
                    {Math.round(scoreFor(hit.restaurant.id) * 100)}% match
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      ) : (
        <>
          <Text style={[styles.sectionTitle, styles.section]}>Near You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nearRow}>
            {nearby.map((restaurant) => (
              <Pressable
                key={restaurant.id}
                accessibilityRole="button"
                accessibilityLabel={`${restaurant.name}, ${formatDistance(feetFor(restaurant.id))} away`}
                onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: restaurant.id } })}
                style={styles.nearCard}
              >
                <Image source={{ uri: restaurant.image }} style={styles.nearImage} contentFit="cover" />
                <View style={styles.nearBody}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {restaurant.name}
                    </Text>
                    <Text style={styles.meta}>{formatDistance(feetFor(restaurant.id))}</Text>
                  </View>
                  <HeartButton liked={likes.includes(restaurant.id)} onPress={() => heart(restaurant.id)} />
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, styles.section]}>Recommended</Text>
          <View style={styles.section}>
            {recommended.map((restaurant) => (
              <Pressable
                key={restaurant.id}
                onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: restaurant.id } })}
                style={styles.recCard}
              >
                <Image source={{ uri: restaurant.image }} style={styles.recImage} contentFit="cover" />
                <View style={styles.recBody}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {restaurant.name}
                  </Text>
                  <Text style={styles.blurb} numberOfLines={2}>
                    {restaurant.blurb}
                  </Text>
                  <Text style={styles.match}>
                    {Math.round(scoreFor(restaurant.id) * 100)}% match · {formatDistance(feetFor(restaurant.id))}
                  </Text>
                  <View style={styles.recActions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Write a review of ${restaurant.name}`}
                      onPress={() => router.push({ pathname: '/write-review', params: { id: restaurant.id } })}
                      style={styles.reviewButton}
                    >
                      <Text style={styles.reviewLabel}>Write Review</Text>
                    </Pressable>
                    <HeartButton liked={likes.includes(restaurant.id)} onPress={() => heart(restaurant.id)} />
                  </View>
                </View>
              </Pressable>
            ))}
            {recommended.length === 0 ? (
              <Text style={styles.empty}>
                Nothing in your distance. Widen it in Food alerts, or switch the area from Discover.
              </Text>
            ) : null}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function HeartButton({ liked, onPress }: { liked: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={liked ? 'Remove from likes' : 'Like this restaurant'}
      onPress={onPress}
      hitSlop={6}
      style={styles.heart}
    >
      <Icon name={liked ? 'heart.fill' : 'heart'} size={18} color={liked ? colors.orangeDeep : colors.brown} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: space.screen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: { fontFamily: fonts.serifItalic, fontSize: 28, color: colors.welcome },
  handle: { fontFamily: fonts.serifBold, fontSize: 28, color: colors.brown, marginTop: -2 },
  mapButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  search: {
    marginHorizontal: space.screen,
    marginTop: 18,
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#C9A88A',
    backgroundColor: colors.cream,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  input: { flex: 1, fontFamily: fonts.sans, fontSize: 15, color: colors.ink, paddingVertical: 12 },
  section: { paddingHorizontal: space.screen, marginTop: 8 },
  sectionTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    color: colors.brown,
    marginTop: 22,
    marginBottom: 12,
  },
  nearRow: { paddingHorizontal: space.screen, gap: 14 },
  nearCard: {
    width: 176,
    backgroundColor: colors.cream,
    borderRadius: 22,
    padding: 8,
    shadowColor: colors.brown,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  nearImage: { width: '100%', height: 124, borderRadius: 16, backgroundColor: colors.orangeSoft },
  nearBody: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingTop: 10, paddingBottom: 6, gap: 8 },
  cardName: { fontFamily: fonts.serifBold, fontSize: 16, color: colors.ink },
  meta: { fontFamily: fonts.sans, color: colors.muted, fontSize: 13, marginTop: 2 },
  heart: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  recCard: {
    flexDirection: 'row',
    backgroundColor: '#F8ECDE',
    borderRadius: 22,
    padding: 10,
    gap: 12,
    marginBottom: 14,
  },
  recImage: { width: 118, height: 132, borderRadius: 16, backgroundColor: colors.orangeSoft },
  recBody: { flex: 1, paddingVertical: 2 },
  blurb: { fontFamily: fonts.sans, color: colors.ink, fontSize: 13, lineHeight: 18, marginTop: 4 },
  match: { fontFamily: fonts.sansSemibold, color: colors.orangeDeep, fontSize: 12, marginTop: 6 },
  recActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  reviewButton: {
    borderWidth: 1.5,
    borderColor: colors.orange,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  reviewLabel: { fontFamily: fonts.sansMedium, color: colors.brown, fontSize: 13 },
  result: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: 18,
    padding: 8,
    marginBottom: 10,
  },
  resultImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: colors.orangeSoft },
  empty: { fontFamily: fonts.sans, color: colors.muted, fontSize: 15, lineHeight: 21 },
});
