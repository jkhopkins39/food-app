import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton, ScreenTitle } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function CollectionsScreen() {
  const insets = useSafeAreaInsets();
  const { collections, getRestaurant } = useApp();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: tabClearance(insets.bottom) }}
    >
      <BackButton />
      <ScreenTitle>Collections</ScreenTitle>
      <View style={{ padding: space.screen, gap: 12 }}>
        {collections.map((collection) => {
          const cover = getRestaurant(collection.restaurantIds[0])?.image;
          return (
            <Pressable
              key={collection.id}
              onPress={() => router.push({ pathname: '/likes/collection/[id]', params: { id: collection.id } })}
              style={styles.row}
            >
              <Image source={{ uri: cover }} style={styles.image} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{collection.name}</Text>
                <Text style={styles.meta}>{collection.restaurantIds.length} places</Text>
              </View>
              <Icon name="chevron.right" size={16} color={colors.muted} />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: 16,
    padding: 8,
  },
  image: { width: 64, height: 64, borderRadius: 12, backgroundColor: colors.orangeSoft },
  name: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink },
  meta: { fontFamily: fonts.sans, color: colors.muted, marginTop: 2 },
});
