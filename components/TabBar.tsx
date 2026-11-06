import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SFSymbol } from 'sf-symbols-typescript';

import { Icon } from '@/components/Icon';
import { colors } from '@/constants/theme';

const ICONS: Record<string, { active: SFSymbol; idle: SFSymbol; label: string }> = {
  home: { active: 'house.fill', idle: 'house', label: 'Home' },
  discover: { active: 'sparkles', idle: 'sparkles', label: 'Discover' },
  likes: { active: 'heart.fill', idle: 'heart', label: 'Likes' },
  profile: { active: 'person.fill', idle: 'person', label: 'Profile' },
};

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
};

export function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const icon = ICONS[route.name] ?? ICONS.home;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={icon.label}
            onPress={() => navigateToTab(route.key)}
            style={styles.item}
          >
            {focused ? (
              <View style={styles.active}>
                <Icon name={icon.active} size={26} color={colors.white} />
              </View>
            ) : (
              <Icon name={icon.idle} size={24} color="#F4E7D8" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.nav,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: 'row',
    paddingTop: 14,
    shadowColor: '#3E2918',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  active: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -36,
    shadowColor: colors.orange,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
});

export function tabClearance(bottomInset: number) {
  return 86 + bottomInset;
}
