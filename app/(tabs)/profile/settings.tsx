import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AreaPicker } from '@/components/AreaPicker';
import { BackButton } from '@/components/Chrome';
import { Sheet } from '@/components/Chrome';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { ensureNotificationPermission } from '@/services/alerts';

const DISTANCES = [1, 3, 5, 10, 25];
const RADII = [300, 500, 1000, 2640];
const SCORES = [0.85, 0.9, 0.95, 0.98];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const app = useApp();
  const [primer, setPrimer] = useState(false);
  const [areas, setAreas] = useState(false);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: tabClearance(insets.bottom) + 28 }}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Food alerts</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={styles.block}>
        <Text style={styles.kicker}>How far suggestions can be</Text>
        <Text style={styles.body}>Near You, Recommended, and the swipe deck stay inside this distance.</Text>
        <View style={styles.pills}>
          {DISTANCES.map((miles) => (
            <Pill key={miles} label={`${miles} mi`} selected={app.maxDistanceMiles === miles} onPress={() => app.setMaxDistanceMiles(miles)} />
          ))}
        </View>
      </View>
      <View style={styles.block}>
        <Text style={styles.kicker}>Food alert</Text>
        <Text style={styles.body}>
          While Savor is open, a place inside the radius that clears your match bar raises a FOOD ALERT. Alerts after you
          leave the app would need Always location, which this demo does not ask for.
        </Text>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: app.alertsEnabled }}
          onPress={() => app.setAlertsEnabled(!app.alertsEnabled)}
          style={styles.toggle}
        >
          <Text style={styles.toggleLabel}>{app.alertsEnabled ? 'Alerts on' : 'Alerts off'}</Text>
        </Pressable>
        <Text style={styles.label}>Within</Text>
        <View style={styles.pills}>
          {RADII.map((feet) => (
            <Pill
              key={feet}
              label={feet >= 2640 ? '0.5 mi' : `${feet} ft`}
              selected={app.alertRadiusFeet === feet}
              onPress={() => app.setAlertRadiusFeet(feet)}
            />
          ))}
        </View>
        <Text style={styles.label}>Match at least</Text>
        <View style={styles.pills}>
          {SCORES.map((score) => (
            <Pill
              key={score}
              label={`${Math.round(score * 100)}%`}
              selected={app.alertScore === score}
              onPress={() => app.setAlertScore(score)}
            />
          ))}
        </View>
        <Pressable style={styles.primary} onPress={() => setPrimer(true)}>
          <Text style={styles.primaryLabel}>Preview a food alert</Text>
        </Pressable>
      </View>
      <View style={styles.block}>
        <Text style={styles.kicker}>Where you are</Text>
        <Text style={styles.body}>
          Now using {app.areaLabel}. {app.locationMode === 'device' ? 'This is your device location.' : 'This is a demo area, so the simulator does not have to be standing in Georgia.'}
        </Text>
        <Pressable style={styles.secondary} onPress={() => setAreas(true)}>
          <Text style={styles.secondaryLabel}>Change area</Text>
        </Pressable>
      </View>
      <View style={styles.block}>
        <Text style={styles.kicker}>Your data</Text>
        <Pressable onPress={() => router.push('/profile/privacy')}>
          <Text style={styles.link}>Privacy notes</Text>
        </Pressable>
        <Pressable onPress={() => Alert.alert('Reset the demo?', 'Likes, passes, reviews, and taste tags go back to the sample profile.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: app.resetDemo },
        ])}>
          <Text style={styles.link}>Reset demo</Text>
        </Pressable>
        <Pressable onPress={() => Alert.alert('Delete taste data?', 'Tags, likes, passes, reviews, and collections are cleared on this phone.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: app.deleteTasteData },
        ])}>
          <Text style={styles.link}>Delete taste data</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openSettings()}>
          <Text style={styles.link}>iOS Settings</Text>
        </Pressable>
        {app.googleNote ? <Text style={styles.body}>Google Places: {app.googleNote}</Text> : null}
        {app.usingGoogle ? <Text style={styles.body}>Live Google places are mixed into the deck.</Text> : null}
      </View>
      <Sheet visible={primer} onClose={() => setPrimer(false)}>
        <Text style={styles.sheetTitle}>Preview the alert</Text>
        <Text style={styles.body}>
          Savor will drop you 300 feet from your closest taste match and show the alert. If you allow notifications, iOS
          will also present it. You can change that later.
        </Text>
        <Pressable
          style={styles.primary}
          onPress={async () => {
            setPrimer(false);
            await ensureNotificationPermission().catch(() => false);
            app.previewSoulmateAlert();
          }}
        >
          <Text style={styles.primaryLabel}>Show the alert</Text>
        </Pressable>
      </Sheet>
      <AreaPicker visible={areas} onClose={() => setAreas(false)} />
    </ScrollView>
  );
}

function Pill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.pill, selected && styles.pillOn]}>
      <Text style={[styles.pillLabel, selected && styles.pillLabelOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.serifBold, fontSize: 22, color: colors.brown },
  block: { paddingHorizontal: space.screen, marginTop: 18, gap: 8 },
  kicker: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.brown },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.ink },
  label: { fontFamily: fonts.sansSemibold, color: colors.muted, marginTop: 6 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1.5, borderColor: colors.line, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.cream },
  pillOn: { borderColor: colors.orange, backgroundColor: colors.orangeSoft },
  pillLabel: { fontFamily: fonts.sansMedium, color: colors.brown },
  pillLabelOn: { fontFamily: fonts.sansBold },
  toggle: { alignSelf: 'flex-start', backgroundColor: colors.brownDeep, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  toggleLabel: { color: colors.cream, fontFamily: fonts.sansBold },
  primary: { backgroundColor: colors.orange, borderRadius: 18, minHeight: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryLabel: { fontFamily: fonts.sansBold, color: colors.white, fontSize: 16 },
  secondary: { borderWidth: 1.5, borderColor: colors.orange, borderRadius: 18, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  secondaryLabel: { fontFamily: fonts.sansBold, color: colors.brown },
  link: { fontFamily: fonts.sansSemibold, color: colors.brown, fontSize: 16, paddingVertical: 6 },
  sheetTitle: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.brown },
});
