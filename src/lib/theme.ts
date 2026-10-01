import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';

export type ThemeSetting = 'light' | 'dark' | 'system';

// "System" hands control back to the OS.
export function applyThemeSetting(setting: ThemeSetting) {
  Appearance.setColorScheme(setting === 'system' ? 'unspecified' : setting);
}

export function useIsDark() {
  const scheme: ColorSchemeName = useColorScheme();
  return scheme === 'dark';
}

export function describeScheme(scheme: ColorSchemeName) {
  if (scheme === 'unspecified') return 'Following the system';
  return scheme === 'dark' ? 'Dark' : 'Light';
}
