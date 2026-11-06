import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Sheet } from '@/components/Chrome';
import { AREAS } from '@/data/catalog';
import { colors, fonts } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export function AreaPicker({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { areaId, setArea, enableDeviceLocation, locationMode } = useApp();
  const [primer, setPrimer] = useState(false);

  return (
    <>
      <Sheet visible={visible && !primer} onClose={onClose}>
        <Text style={styles.title}>Suggestions around</Text>
        <Text style={styles.body}>
          Distance, the map, and food alerts all use this spot. A demo area works in the simulator before you allow location.
        </Text>
        {AREAS.map((area) => {
          const selected = locationMode === 'demo' && area.id === areaId;
          return (
            <Pressable
              key={area.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                setArea(area.id);
                onClose();
              }}
              style={[styles.row, selected && styles.rowOn]}
            >
              <Text style={styles.rowLabel}>{area.label}</Text>
              {selected ? <Text style={styles.mark}>Current</Text> : null}
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          onPress={() => setPrimer(true)}
          style={[styles.row, locationMode === 'device' && styles.rowOn]}
        >
          <Text style={styles.rowLabel}>Use my location</Text>
          {locationMode === 'device' ? <Text style={styles.mark}>On</Text> : null}
        </Pressable>
      </Sheet>
      <Sheet visible={primer} onClose={() => setPrimer(false)}>
        <Text style={styles.title}>Location while you use Savor</Text>
        <Text style={styles.body}>
          Savor measures distance to restaurants and can notice when you are close to a strong match. This demo keeps that
          location on your phone. It is not uploaded. iOS will ask next, and you can say no and keep using a demo area.
        </Text>
        <Pressable
          style={styles.primary}
          onPress={async () => {
            const granted = await enableDeviceLocation();
            setPrimer(false);
            if (granted) onClose();
            else {
              const current = await Location.getForegroundPermissionsAsync();
              if (current.status === 'denied') onClose();
            }
          }}
        >
          <Text style={styles.primaryLabel}>Continue</Text>
        </Pressable>
        <Pressable onPress={() => setPrimer(false)} accessibilityRole="button">
          <Text style={styles.quiet}>Not now</Text>
        </Pressable>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.brown },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.ink },
  row: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cream,
  },
  rowOn: { borderColor: colors.orange, backgroundColor: colors.orangeSoft },
  rowLabel: { fontFamily: fonts.sansMedium, fontSize: 16, color: colors.ink },
  mark: { fontFamily: fonts.sansSemibold, color: colors.orangeDeep, fontSize: 13 },
  primary: {
    backgroundColor: colors.brownDeep,
    borderRadius: 18,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: { color: colors.cream, fontFamily: fonts.sansBold, fontSize: 16 },
  quiet: { textAlign: 'center', fontFamily: fonts.sansMedium, color: colors.muted, padding: 8 },
});
