import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/Chrome';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { PREFERENCE_TAGS, topDimensions } from '@/lib/taste';

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const { tags, setTags, vector } = useApp();
  const bars = topDimensions(vector, 6);
  const peak = bars[0]?.weight || 1;

  const toggle = (tag: string) => {
    setTags(tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: tabClearance(insets.bottom) + 20 }}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Preferences</Text>
        <View style={{ width: 44 }} />
      </View>
      <Text style={styles.body}>
        These tags are the starting taste. Swipes and reviews move it. The bars are the mix Savor is using right now.
      </Text>
      <View style={styles.chips}>
        {PREFERENCE_TAGS.map((tag) => {
          const on = tags.includes(tag);
          return (
            <Pressable key={tag} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => toggle(tag)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={styles.chipLabel}>#{tag}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.kicker}>Taste profile</Text>
      <View style={{ paddingHorizontal: space.screen, gap: 10, marginTop: 8 }}>
        {bars.length === 0 ? <Text style={styles.body}>Like a few places and the profile will take a shape.</Text> : null}
        {bars.map((bar) => (
          <View key={bar.id}>
            <View style={styles.barLabel}>
              <Text style={styles.barName}>{bar.label}</Text>
              <Text style={styles.barShare}>{Math.round(bar.share * 100)}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.round((bar.weight / peak) * 100)}%` }]} />
            </View>
          </View>
        ))}
      </View>
      <Pressable style={styles.done} onPress={() => router.back()}>
        <Text style={styles.doneLabel}>Done</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.serifBold, fontSize: 22, color: colors.brown },
  body: { fontFamily: fonts.sans, color: colors.ink, fontSize: 15, lineHeight: 21, paddingHorizontal: space.screen, marginTop: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: space.screen, marginTop: 16 },
  chip: { borderWidth: 1.5, borderColor: colors.line, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  chipOn: { borderColor: colors.orange, backgroundColor: colors.orangeSoft },
  chipLabel: { fontFamily: fonts.sansMedium, color: colors.brown },
  kicker: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.brown, paddingHorizontal: space.screen, marginTop: 28 },
  barLabel: { flexDirection: 'row', justifyContent: 'space-between' },
  barName: { fontFamily: fonts.sansMedium, color: colors.ink },
  barShare: { fontFamily: fonts.sans, color: colors.muted },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.line, marginTop: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.orange, borderRadius: 4 },
  done: { margin: space.screen, marginTop: 28, backgroundColor: colors.brownDeep, borderRadius: 18, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  doneLabel: { color: colors.cream, fontFamily: fonts.sansBold, fontSize: 16 },
});
