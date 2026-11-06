import { Modal, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';

import { Icon } from '@/components/Icon';
import { colors, fonts } from '@/constants/theme';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export function Sheet({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduce = useReduceMotion();
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View entering={reduce ? undefined : SlideInDown.springify().damping(18).stiffness(180)}>
          <View onStartShouldSetResponder={() => true} style={styles.sheet}>
            {children}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function BackButton({ style }: { style?: StyleProp<ViewStyle> }) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => router.back()}
      hitSlop={10}
      style={[styles.back, style]}
    >
      <Icon name="chevron.left" size={22} color={colors.brown} />
    </Pressable>
  );
}

export function ScreenTitle({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 36,
    gap: 12,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    color: colors.brown,
    textAlign: 'center',
  },
});
