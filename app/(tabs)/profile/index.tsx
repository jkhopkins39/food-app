import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { ScreenTitle } from '@/components/Chrome';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, tags, reviews, getRestaurant, alertScore, alertRadiusFeet, alertsEnabled } = useApp();
  const mine = reviews.slice(0, 6);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: tabClearance(insets.bottom) + 24 }}
    >
      <ScreenTitle>My Profile</ScreenTitle>
      <View style={styles.identity}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} contentFit="cover" accessibilityLabel="Profile photo" />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.meta}>{profile.pronouns}</Text>
          <Text style={styles.meta}>{profile.city}</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push('/profile/edit')} style={styles.edit}>
            <Text style={styles.editLabel}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.rule} />
      <View style={styles.rowHeader}>
        <Text style={styles.kicker}>Preferences</Text>
        <Pressable accessibilityLabel="Edit preferences" onPress={() => router.push('/profile/preferences')} hitSlop={8}>
          <Icon name="pencil" size={18} color={colors.brown} />
        </Pressable>
      </View>
      <View style={styles.chips}>
        {tags.length === 0 ? <Text style={styles.meta}>Add a few tastes so suggestions have a place to start.</Text> : null}
        {tags.map((tag) => (
          <View key={tag} style={styles.chip}>
            <Text style={styles.chipLabel}>#{tag}</Text>
          </View>
        ))}
      </View>

      <Pressable accessibilityRole="button" onPress={() => router.push('/profile/settings')} style={styles.alertRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>Food alerts</Text>
          <Text style={styles.meta}>
            {alertsEnabled ? `${Math.round(alertScore * 100)}% match · within ${alertRadiusFeet} ft` : 'Off'}
          </Text>
        </View>
        <Icon name="chevron.right" size={16} color={colors.muted} />
      </Pressable>

      <View style={styles.rowHeader}>
        <Text style={styles.kicker}>My Reviews</Text>
        <Pressable accessibilityLabel="All reviews" onPress={() => router.push('/profile/reviews')}>
          <Icon name="chevron.right" size={16} color={colors.muted} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewRow}>
        {mine.length === 0 ? (
          <Text style={[styles.meta, { paddingHorizontal: space.screen }]}>
            Reviews you write teach Savor the words you actually use.
          </Text>
        ) : (
          mine.map((review) => {
            const restaurant = getRestaurant(review.restaurantId);
            return (
              <Pressable
                key={review.id}
                onPress={() => router.push('/profile/reviews')}
                style={styles.reviewCard}
              >
                <Image source={{ uri: restaurant?.image }} style={styles.reviewImage} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName} numberOfLines={1}>
                    {restaurant?.name ?? 'Restaurant'}
                  </Text>
                  <Text style={styles.reviewText} numberOfLines={3}>
                    {review.text}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  identity: { flexDirection: 'row', gap: 16, paddingHorizontal: space.screen, marginTop: 22 },
  avatar: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.orangeSoft },
  name: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.brown },
  meta: { fontFamily: fonts.sans, color: colors.muted, fontSize: 14, marginTop: 2 },
  edit: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: colors.orange,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editLabel: { fontFamily: fonts.sansBold, color: colors.white, fontSize: 14 },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginHorizontal: space.screen, marginTop: 20 },
  rowHeader: {
    marginTop: 18,
    paddingHorizontal: space.screen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kicker: { fontFamily: fonts.sansSemibold, fontSize: 16, color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: space.screen, marginTop: 12 },
  chip: { borderWidth: 1.5, borderColor: colors.orange, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  chipLabel: { fontFamily: fonts.sansMedium, color: colors.brown, fontSize: 14 },
  alertRow: {
    marginTop: 18,
    marginHorizontal: space.screen,
    backgroundColor: colors.cream,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewRow: { paddingHorizontal: space.screen, gap: 12, paddingTop: 12 },
  reviewCard: {
    width: 250,
    minHeight: 96,
    backgroundColor: '#E7E1DA',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
  },
  reviewImage: { width: 54, height: 54, borderRadius: 8, backgroundColor: '#B9B3AC' },
  reviewName: { fontFamily: fonts.sansSemibold, color: colors.ink, fontSize: 14 },
  reviewText: { fontFamily: fonts.sans, color: colors.ink, fontSize: 13, lineHeight: 18, marginTop: 4 },
});
