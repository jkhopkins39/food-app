import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/Chrome';
import { colors, fonts, space } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useApp();
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [pronouns, setPronouns] = useState(profile.pronouns);
  const [city, setCity] = useState(profile.city);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 4 }]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>
      <Field label="Name" value={name} onChangeText={setName} />
      <Field label="Handle" value={handle} onChangeText={setHandle} autoCapitalize="none" />
      <Field label="Pronouns" value={pronouns} onChangeText={setPronouns} />
      <Field label="City" value={city} onChangeText={setCity} />
      <Text style={styles.note}>The handle is what the home screen says hello with. Your city is separate from the area used for suggestions.</Text>
      <Pressable
        style={styles.save}
        onPress={() => {
          updateProfile({
            name: name.trim() || profile.name,
            handle: handle.trim() || profile.handle,
            pronouns: pronouns.trim(),
            city: city.trim(),
          });
          router.back();
        }}
      >
        <Text style={styles.saveLabel}>Save</Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  autoCapitalize = 'sentences',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} autoCapitalize={autoCapitalize} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.serifBold, fontSize: 22, color: colors.brown },
  field: { paddingHorizontal: space.screen, marginTop: 16 },
  label: { fontFamily: fonts.sansMedium, color: colors.muted, marginBottom: 6 },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cream,
    paddingHorizontal: 14,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
  },
  note: { fontFamily: fonts.sans, color: colors.muted, paddingHorizontal: space.screen, marginTop: 16, lineHeight: 20 },
  save: { margin: space.screen, marginTop: 24, backgroundColor: colors.orange, borderRadius: 18, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  saveLabel: { fontFamily: fonts.sansBold, color: colors.white, fontSize: 16 },
});
