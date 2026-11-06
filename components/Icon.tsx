import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';

export function Icon({
  name,
  size = 22,
  color,
}: {
  name: SFSymbol;
  size?: number;
  color?: string;
}) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}
