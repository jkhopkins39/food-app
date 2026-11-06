import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { colors, fonts } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export function FoodAlertBanner() {
  const { activeAlert, dismissAlert } = useApp();
  const insets = useSafeAreaInsets();
  if (!activeAlert) return null;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 6 }]}>
      <View style={styles.card}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Food alert. ${activeAlert.body}`}
          onPress={() => {
            const id = activeAlert.restaurantId;
            dismissAlert();
            router.push({ pathname: '/restaurant/[id]', params: { id } });
          }}
          style={styles.copy}
        >
          <Text style={styles.kicker}>FOOD ALERT</Text>
          <Text style={styles.body}>{activeAlert.body}</Text>
        </Pressable>
        <Pressable accessibilityLabel="Dismiss food alert" onPress={dismissAlert} hitSlop={8}>
          <Icon name="xmark" size={16} color={colors.brown} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 40,
  },
  card: {
    backgroundColor: colors.brownDeep,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#3E2918',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  copy: { flex: 1, gap: 2 },
  kicker: {
    fontFamily: fonts.sansBold,
    color: colors.orange,
    letterSpacing: 0.8,
    fontSize: 12,
  },
  body: {
    fontFamily: fonts.sansMedium,
    color: colors.cream,
    fontSize: 15,
    lineHeight: 20,
  },
});
