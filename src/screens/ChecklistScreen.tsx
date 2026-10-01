import { useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Header } from '../components/Header';
import { PhotoModal } from '../components/PhotoModal';
import { checklist, type ChecklistItem } from '../lib/data';
import { measureInWindow } from '../lib/measure';

export function ChecklistScreen() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const notes = useRef<TextInput>(null);
  const banner = useRef<View>(null);

  // Load the long list after the navigation transition finishes.
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => setItems(checklist));
    return () => task.cancel();
  }, []);

  useEffect(() => {
    measureInWindow(banner.current).then(box => box && console.log('banner at', box.y));
  }, []);

  const answer = (id: string, value: 'yes' | 'no') =>
    setItems(prev => prev.map(i => (i.id === id && i.kind === 'question' ? { ...i, answer: value } : i)));

  return (
    <View style={styles.screen}>
      <View ref={banner}>
        <Header title="Store audit" subtitle={`${checklist.length} items`} />
      </View>
      <FlashList
        data={items}
        keyExtractor={item => item.id}
        getItemType={item => item.kind}
        renderItem={({ item }) => {
          if (item.kind === 'header') return <Text style={styles.section}>{item.title}</Text>;
          if (item.kind === 'photo')
            return (
              <Pressable onPress={() => setPhoto(item.uri)} style={styles.row}>
                <Text>{item.title} (tap to view)</Text>
              </Pressable>
            );
          return (
            <View style={styles.row}>
              <Text style={styles.question}>{item.title}</Text>
              {(['yes', 'no'] as const).map(v => (
                <Pressable key={v} onPress={() => answer(item.id, v)} style={[styles.pill, item.answer === v && styles.pillOn]}>
                  <Text>{v}</Text>
                </Pressable>
              ))}
            </View>
          );
        }}
        ListFooterComponent={
          <ScrollView keyboardShouldPersistTaps={true} style={styles.footer}>
            <TextInput ref={notes} placeholder="Notes for the store manager" style={styles.input} multiline />
            <Pressable onPress={() => notes.current?.blur()} style={styles.pill}>
              <Text>Done</Text>
            </Pressable>
          </ScrollView>
        }
      />
      <PhotoModal uri={photo} onClose={() => setPhoto(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  section: { padding: 16, fontWeight: '700', backgroundColor: '#eee' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 },
  question: { flex: 1 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  pillOn: { backgroundColor: '#cde' },
  footer: { padding: 16 },
  input: { minHeight: 80, borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 },
});
