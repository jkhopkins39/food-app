import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/Chrome';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';

const SECTIONS = [
  {
    title: 'What stays on this phone',
    body: 'Your handle, taste tags, likes, passes, collections, and reviews are stored on the device for this demo. There is no account and no server.',
  },
  {
    title: 'Location',
    body: 'Savor asks for location only while you are using the app, and only after an explanation. It is used to measure distance and to raise a food alert when a strong match is close. This demo does not request Always location, which Apple reviews carefully and which would be required to alert you with the app closed.',
  },
  {
    title: 'Notifications',
    body: 'Food alerts are local notifications you opt into. They are not remote push, and they do not include advertising.',
  },
  {
    title: 'Google',
    body: 'Without an API key, restaurants, photos, and reviews are original sample data. With a Places API key, nearby places and photos can load from Google and must keep Google’s attribution. Review text from Google is not fed into the taste model. Google’s terms limit how that text can be stored and reused, so a production version should embed language you have a right to use: reviews people write in the app, a menu you license, or a partner feed.',
  },
  {
    title: 'Friends',
    body: '“Jeremy and 5+ of your friends” is sample social proof for the design. Savor does not read contacts.',
  },
  {
    title: 'Children',
    body: 'Savor is not directed at children under 13, and this demo does not knowingly collect their information.',
  },
  {
    title: 'Delete',
    body: 'Food alerts settings include Delete taste data and Reset demo. A shipped app would also need a real privacy policy, a retention schedule, and a way to export or delete data if an account exists.',
  },
];

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: tabClearance(insets.bottom) + 24 }}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Privacy</Text>
        <View style={{ width: 44 }} />
      </View>
      <Text style={styles.intro}>
        These are the product rules for the demo. They are not a lawyer’s privacy policy, and a real launch needs one.
      </Text>
      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.block}>
          <Text style={styles.kicker}>{section.title}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.serifBold, fontSize: 22, color: colors.brown },
  intro: { fontFamily: fonts.sans, color: colors.ink, fontSize: 15, lineHeight: 21, paddingHorizontal: space.screen, marginTop: 8 },
  block: { paddingHorizontal: space.screen, marginTop: 18, gap: 6 },
  kicker: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.brown },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.ink },
});
