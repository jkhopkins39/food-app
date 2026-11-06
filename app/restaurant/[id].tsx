import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Sheet } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { FRIEND_AVATARS } from '@/data/catalog';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function RestaurantScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string; match?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const openedAsMatch = (Array.isArray(params.match) ? params.match[0] : params.match) === '1';
  const { getRestaurant, likes, like, pass, scoreFor, reviews, collections, addToCollection, createCollection } = useApp();
  const restaurant = id ? getRestaurant(id) : undefined;
  const [showMatch, setShowMatch] = useState(openedAsMatch);
  const [picking, setPicking] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (!restaurant) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.name}>That place is not in the deck.</Text>
        <Pressable onPress={() => router.back()}><Text style={styles.link}>Go back</Text></Pressable>
      </View>
    );
  }

  const liked = likes.includes(restaurant.id);
  const written = reviews.filter((review) => review.restaurantId === restaurant.id);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <Image source={{ uri: restaurant.image }} style={styles.hero} contentFit="cover" accessibilityLabel={`${restaurant.name} photo`} />
        <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={[styles.back, { top: insets.top + 8 }]}>
          <Icon name="chevron.left" size={22} color={colors.white} />
        </Pressable>
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            </View>
            <View style={styles.rating}>
              <Text style={styles.ratingValue}>{restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}</Text>
              <Icon name="star.fill" size={16} color={colors.star} />
            </View>
          </View>
          <Text style={styles.match}>{Math.round(scoreFor(restaurant.id) * 100)}% match · {restaurant.address}</Text>
          <Text style={styles.aboutLabel}>About</Text>
          <Text style={styles.about}>{restaurant.about}</Text>
          <View style={styles.tags}>
            {restaurant.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagLabel}>{tag}</Text>
              </View>
            ))}
          </View>
          {[...restaurant.reviews, ...written.map((review) => ({ author: 'You', rating: review.rating, text: review.text, avatar: undefined }))].map((review, index) => (
            <View key={`${review.author}-${index}`} style={styles.review}>
              <View style={styles.reviewHead}>
                {review.avatar ? (
                  <Image source={{ uri: review.avatar }} style={styles.avatar} contentFit="cover" />
                ) : (
                  <View style={styles.avatar} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.author}>{review.author}</Text>
                  <View style={styles.stars}>
                    {Array.from({ length: 5 }, (_, star) => (
                      <Icon key={star} name="star.fill" size={12} color={star < review.rating ? colors.star : colors.line} />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
          <Text style={styles.source}>
            {restaurant.source === 'google'
              ? 'Place data © Google. Taste match uses the place type, not Google review text.'
              : 'Sample reviews stand in for a licensed review feed. They are not copied from Google.'}
          </Text>
        </View>
      </ScrollView>

      {showMatch ? (
        <View style={[styles.matchWrap, { bottom: insets.bottom + 12 }]}>
          <View style={styles.matchCard}>
            <Text style={styles.matchScript}>
              It’s a match! <Text style={styles.matchHeart}>♥</Text>
            </Text>
            <Text style={styles.saved}>Saved to your likes</Text>
            {added ? (
              <Text style={styles.added}>Added to {added}</Text>
            ) : (
              <Pressable style={styles.collect} onPress={() => setPicking(true)}>
                <Text style={styles.collectLabel}>Add to a collection</Text>
              </Pressable>
            )}
            <View style={styles.friends}>
              <View style={styles.friendStack}>
                {FRIEND_AVATARS.map((uri, index) => (
                  <Image key={uri} source={{ uri }} style={[styles.friend, { marginLeft: index === 0 ? 0 : -12 }]} contentFit="cover" />
                ))}
              </View>
              <Text style={styles.friendCopy}>Jeremy and 5+ of your friends liked {restaurant.name}!</Text>
            </View>
            <Text style={styles.demoNote}>Sample friends, for the demo.</Text>
            <Pressable
              onPress={() =>
                Share.share({
                  message: `Come eat with me at ${restaurant.name}. ${restaurant.address}`,
                })
              }
            >
              <Text style={styles.invite}>invite your group  ➤</Text>
            </Pressable>
            <Pressable accessibilityLabel="Keep browsing" onPress={() => setShowMatch(false)}>
              <Text style={styles.keep}>Keep browsing</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={[styles.actions, { bottom: insets.bottom + 16 }]}>
          <Pressable
            accessibilityLabel="Pass"
            style={styles.circle}
            onPress={() => {
              pass(restaurant.id);
              router.back();
            }}
          >
            <Icon name="xmark" size={28} color={colors.brown} />
          </Pressable>
          <Pressable
            accessibilityLabel={liked ? 'Already liked' : 'Like'}
            style={styles.circle}
            onPress={() => {
              if (!liked) {
                like(restaurant.id);
                setShowMatch(true);
              }
            }}
          >
            <Icon name={liked ? 'heart.fill' : 'heart'} size={28} color={colors.brown} />
          </Pressable>
        </View>
      )}

      <Sheet visible={picking} onClose={() => setPicking(false)}>
        <Text style={styles.sheetTitle}>Add to a collection</Text>
        {collections.map((collection) => (
          <Pressable
            key={collection.id}
            style={styles.collectionRow}
            onPress={() => {
              addToCollection(collection.id, restaurant.id);
              setAdded(collection.name);
              setPicking(false);
            }}
          >
            <Text style={styles.collectionName}>{collection.name}</Text>
            <Text style={styles.collectionMeta}>
              {collection.restaurantIds.includes(restaurant.id) ? 'Saved' : 'Add'}
            </Text>
          </Pressable>
        ))}
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="New collection"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Pressable
          style={styles.collect}
          onPress={() => {
            const name = draft.trim();
            if (!name) return;
            createCollection(name, restaurant.id);
            setAdded(name);
            setDraft('');
            setPicking(false);
          }}
        >
          <Text style={styles.collectLabel}>Create collection</Text>
        </Pressable>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: { width: '100%', height: 300, backgroundColor: colors.orangeSoft },
  back: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(62, 41, 24, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: space.screen, gap: 8 },
  nameRow: { flexDirection: 'row', gap: 12 },
  name: { fontFamily: fonts.serifBold, fontSize: 30, color: colors.ink },
  cuisine: { fontFamily: fonts.sans, color: colors.muted, fontSize: 15, marginTop: 2 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  ratingValue: { fontFamily: fonts.sansBold, fontSize: 18, color: colors.brown },
  match: { fontFamily: fonts.sans, color: colors.muted, fontSize: 13, lineHeight: 18 },
  aboutLabel: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.orangeDeep, marginTop: 8 },
  about: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.ink },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tag: { borderWidth: 1.5, borderColor: colors.orange, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  tagLabel: { fontFamily: fonts.sansSemibold, color: colors.brown },
  review: { marginTop: 12, backgroundColor: colors.cream, borderRadius: 18, padding: 12, gap: 8 },
  reviewHead: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.orangeSoft },
  author: { fontFamily: fonts.sansBold, color: colors.ink },
  stars: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewText: { fontFamily: fonts.sans, color: colors.ink, fontSize: 14, lineHeight: 20 },
  source: { fontFamily: fonts.sans, color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 8 },
  actions: { position: 'absolute', left: 28, right: 28, flexDirection: 'row', justifyContent: 'space-between' },
  circle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#F6E6D4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brown,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  matchWrap: { position: 'absolute', left: 16, right: 16 },
  matchCard: {
    backgroundColor: '#F8F1E6',
    borderRadius: 28,
    padding: 18,
    gap: 8,
    shadowColor: colors.brown,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  matchScript: { fontFamily: fonts.script, fontSize: 40, color: colors.brown, textAlign: 'center' },
  matchHeart: { color: colors.orangeDeep },
  saved: { fontFamily: fonts.sansMedium, textAlign: 'center', textDecorationLine: 'underline', color: colors.ink },
  collect: { backgroundColor: colors.brownDeep, borderRadius: 22, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  collectLabel: { color: colors.cream, fontFamily: fonts.sansBold, fontSize: 16 },
  friends: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 6 },
  friendStack: { flexDirection: 'row' },
  friend: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.cream, backgroundColor: '#C8C2BC' },
  friendCopy: { flex: 1, fontFamily: fonts.sansMedium, color: colors.ink, fontSize: 13, lineHeight: 18 },
  demoNote: { fontFamily: fonts.sans, color: colors.muted, fontSize: 11 },
  invite: { fontFamily: fonts.script, fontSize: 26, color: colors.brown, textAlign: 'center' },
  keep: { textAlign: 'center', fontFamily: fonts.sansMedium, color: colors.muted, padding: 4 },
  added: { textAlign: 'center', fontFamily: fonts.sansSemibold, color: colors.orangeDeep },
  sheetTitle: { fontFamily: fonts.serifBold, fontSize: 24, color: colors.brown },
  collectionRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  collectionName: { fontFamily: fonts.sansMedium, fontSize: 16, color: colors.ink },
  collectionMeta: { fontFamily: fonts.sans, color: colors.muted },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    fontFamily: fonts.sans,
    color: colors.ink,
  },
  missing: { flex: 1, backgroundColor: colors.background, padding: 24, gap: 12 },
  link: { fontFamily: fonts.sansBold, color: colors.brown },
});
