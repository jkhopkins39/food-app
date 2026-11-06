import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: true }} />
      <View style={styles.screen}>
        <Text style={styles.title}>This screen is not on the menu.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontFamily: fonts.serifBold, fontSize: 24, color: colors.brown, textAlign: 'center' },
  link: { marginTop: 16 },
  linkText: { fontFamily: fonts.sansBold, color: colors.orangeDeep, fontSize: 16 },
});
