import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const { reviews, getRestaurant } = useApp();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: tabClearance(insets.bottom) + 20 }}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>My Reviews</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={{ padding: space.screen, gap: 12 }}>
        {reviews.length === 0 ? (
          <Text style={styles.body}>You have not written a review yet. Recommended cards on Home have a Write Review button.</Text>
        ) : null}
        {reviews.map((review) => {
          const restaurant = getRestaurant(review.restaurantId);
          return (
            <View key={review.id} style={styles.card}>
              <Text style={styles.name}>{restaurant?.name ?? 'Restaurant'}</Text>
              <View style={styles.stars}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Icon key={index} name="star.fill" size={14} color={index < review.rating ? colors.star : colors.line} />
                ))}
              </View>
              <Text style={styles.body}>{review.text}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.serifBold, fontSize: 22, color: colors.brown },
  card: { backgroundColor: colors.cream, borderRadius: 18, padding: 14, gap: 6 },
  name: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink },
  stars: { flexDirection: 'row', gap: 3 },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.ink },
});
