import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { detectedDimensions } from '@/lib/taste';

export default function WriteReviewScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getRestaurant, addReview } = useApp();
  const restaurant = id ? getRestaurant(id) : undefined;
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const detected = detectedDimensions(text);

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingTop: insets.top + 4, flex: 1 }}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Write Review</Text>
          <View style={{ width: 44 }} />
        </View>
        <Text style={styles.place}>{restaurant?.name ?? 'Restaurant'}</Text>
        <View style={styles.stars}>
          {Array.from({ length: 5 }, (_, index) => (
            <Pressable key={index} accessibilityLabel={`${index + 1} stars`} onPress={() => setRating(index + 1)}>
              <Icon name="star.fill" size={28} color={index < rating ? colors.star : colors.line} />
            </Pressable>
          ))}
        </View>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="What did it taste like? Sweet, spicy, fresh..."
          placeholderTextColor={colors.muted}
          multiline
          style={styles.input}
        />
        <Text style={styles.hint}>
          {detected.length
            ? `Taste words noticed: ${detected.map((item) => item.label.toLowerCase()).join(', ')}.`
            : 'Mention a taste or a cuisine and it will show up here before you post.'}
        </Text>
        <Text style={styles.note}>
          A rating of 4 or 5 also saves the place to your likes. The words update your taste profile on this phone.
        </Text>
        <Pressable
          style={[styles.post, text.trim().length < 8 && styles.postOff]}
          disabled={text.trim().length < 8}
          onPress={() => {
            if (!id) return;
            addReview(id, rating, text.trim());
            router.back();
          }}
        >
          <Text style={styles.postLabel}>Post review</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.serifBold, fontSize: 22, color: colors.brown },
  place: { fontFamily: fonts.sansSemibold, fontSize: 16, color: colors.ink, paddingHorizontal: space.screen, marginTop: 8 },
  stars: { flexDirection: 'row', gap: 8, paddingHorizontal: space.screen, marginTop: 12 },
  input: {
    margin: space.screen,
    minHeight: 140,
    borderRadius: 16,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  hint: { fontFamily: fonts.sansMedium, color: colors.orangeDeep, paddingHorizontal: space.screen },
  note: { fontFamily: fonts.sans, color: colors.muted, paddingHorizontal: space.screen, marginTop: 8, lineHeight: 20 },
  post: { margin: space.screen, backgroundColor: colors.brownDeep, borderRadius: 18, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  postOff: { opacity: 0.45 },
  postLabel: { color: colors.cream, fontFamily: fonts.sansBold, fontSize: 16 },
});
