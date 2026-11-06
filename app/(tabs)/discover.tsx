import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AreaPicker } from '@/components/AreaPicker';
import { Icon } from '@/components/Icon';
import { tabClearance } from '@/components/TabBar';
import { colors, fonts } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { deck, areaLabel, like, pass, scoreFor } = useApp();
  const [areasOpen, setAreasOpen] = useState(false);
  const reduce = useReduceMotion();
  const card = deck[0];
  const next = deck[1];
  const tx = useSharedValue(0);
  const cardId = useRef<string | null>(null);
  cardId.current = card?.id ?? null;

  const finish = (direction: number) => {
    const id = cardId.current;
    tx.value = 0;
    if (!id) return;
    if (direction > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      like(id);
      router.push({ pathname: '/restaurant/[id]', params: { id, match: '1' } });
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      pass(id);
    }
  };

  const flingRef = useRef<(direction: 1 | -1) => void>(() => undefined);
  flingRef.current = (direction) => {
    if (!cardId.current) return;
    if (reduce) {
      finish(direction);
      return;
    }
    tx.value = withSpring(direction * 560, { damping: 18, stiffness: 170 }, (finished) => {
      if (finished) runOnJS(finish)(direction);
    });
  };

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_, gesture) => {
        tx.value = gesture.dx;
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 110) flingRef.current(1);
        else if (gesture.dx < -110) flingRef.current(-1);
        else tx.value = withSpring(0, { damping: 16, stiffness: 180 });
      },
      onPanResponderTerminate: () => {
        tx.value = withSpring(0, { damping: 16, stiffness: 180 });
      },
    }),
  ).current;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { rotate: `${tx.value / 22}deg` }],
  }));
  const likeStamp = useAnimatedStyle(() => ({ opacity: Math.min(Math.max(tx.value / 110, 0), 1) }));
  const passStamp = useAnimatedStyle(() => ({ opacity: Math.min(Math.max(-tx.value / 110, 0), 1) }));

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 6, paddingBottom: tabClearance(insets.bottom) }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Browsing ${areaLabel}. Change area`}
        onPress={() => setAreasOpen(true)}
        style={styles.location}
      >
        <Text style={styles.locationLabel}>{areaLabel}</Text>
        <Icon name="chevron.down" size={14} color={colors.brown} />
      </Pressable>
      <View style={styles.rule} />

      {card ? (
        <View style={styles.stack}>
          <View style={[styles.stage, { height: height * 0.42 }]}>
            {next ? (
              <View style={styles.under} pointerEvents="none">
                <Image source={{ uri: next.image }} style={styles.photo} contentFit="cover" />
              </View>
            ) : null}
            <Animated.View style={[styles.under, cardStyle]} {...pan.panHandlers} accessibilityHint="Swipe right to like, left to pass">
              <Image
                source={{ uri: card.image }}
                style={styles.photo}
                contentFit="cover"
                accessibilityLabel={`${card.name} photo`}
              />
              <Animated.View style={[styles.stamp, styles.likeStamp, likeStamp]}>
                <Text style={styles.stampText}>LIKE</Text>
              </Animated.View>
              <Animated.View style={[styles.stamp, styles.passStamp, passStamp]}>
                <Text style={[styles.stampText, { color: colors.danger }]}>NOPE</Text>
              </Animated.View>
            </Animated.View>
          </View>

          <View style={styles.info}>
            <View style={styles.nameRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{card.name}</Text>
                <Text style={styles.cuisine}>{card.cuisine}</Text>
              </View>
              <View style={styles.rating}>
                <Text style={styles.ratingValue}>{card.rating.toFixed(1)}</Text>
                <Icon name="star.fill" size={16} color={colors.star} />
              </View>
            </View>
            <Text style={styles.match}>{Math.round(scoreFor(card.id) * 100)}% match for your taste</Text>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pass"
                onPress={() => flingRef.current(-1)}
                style={styles.circle}
              >
                <Icon name="xmark" size={28} color={colors.brown} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open restaurant details"
                onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: card.id } })}
                style={styles.swipeHint}
              >
                <Text style={styles.swipeLabel}>Swipe</Text>
                <Icon name="chevron.down" size={16} color={colors.muted} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Like"
                onPress={() => flingRef.current(1)}
                style={styles.circle}
              >
                <Icon name="heart" size={28} color={colors.brown} />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.name}>You’re caught up</Text>
          <Text style={styles.cuisine}>
            Every place inside your distance has been liked or passed. Widen the distance in Food alerts, or reset the demo
            from Settings.
          </Text>
        </View>
      )}
      <AreaPicker visible={areasOpen} onClose={() => setAreasOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  location: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44 },
  locationLabel: { fontFamily: fonts.sansSemibold, fontSize: 16, color: colors.brown },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginTop: 6 },
  stack: { flex: 1 },
  stage: { marginTop: 8 },
  under: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  photo: { width: '100%', height: '100%', backgroundColor: colors.orangeSoft },
  stamp: {
    position: 'absolute',
    top: 24,
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  likeStamp: { left: 20, borderColor: colors.orangeDeep, transform: [{ rotate: '-12deg' }] },
  passStamp: { right: 20, borderColor: colors.danger, transform: [{ rotate: '12deg' }] },
  stampText: { fontFamily: fonts.sansBold, fontSize: 22, color: colors.orangeDeep, letterSpacing: 1 },
  info: { paddingHorizontal: 22, paddingTop: 18, gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  name: { fontFamily: fonts.serifBold, fontSize: 30, color: colors.ink },
  cuisine: { fontFamily: fonts.sans, fontSize: 15, color: colors.muted, marginTop: 2, lineHeight: 21 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  ratingValue: { fontFamily: fonts.sansBold, fontSize: 18, color: colors.brown },
  match: { fontFamily: fonts.sansSemibold, color: colors.orangeDeep, fontSize: 14 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  circle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#F6E6D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeHint: { alignItems: 'center', minWidth: 64, minHeight: 44, justifyContent: 'center' },
  swipeLabel: { fontFamily: fonts.sansMedium, color: colors.muted, fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', paddingHorizontal: 28, gap: 8 },
});
