import { ImageBackground, StatusBar, StyleSheet, Text, ViewProperties } from 'react-native';
import { useIsDark } from '../lib/theme';

type HeaderProps = ViewProperties & { title: string; subtitle: string };

// A store banner behind the screen title, with a translucent status bar on Android.
export function Header({ title, subtitle, ...rest }: HeaderProps) {
  const dark = useIsDark();
  return (
    <ImageBackground
      {...rest}
      source={{ uri: 'https://picsum.photos/seed/store/1200/400' }}
      style={styles.banner}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: 'white' },
  subtitle: { marginTop: 4, color: 'white', opacity: 0.85 },
});
