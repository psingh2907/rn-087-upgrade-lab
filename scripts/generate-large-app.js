// Generates a synthetic "large app" (src/generated, git-ignored) so Metro
// can be measured at a realistic scale: MODULES screens, each a small
// component with styles, helpers and strings, all reachable from
// index.large.js. Usage: node scripts/generate-large-app.js [MODULES]
const fs = require('fs');
const path = require('path');

const count = Number(process.argv[2] || 2000);
const dir = path.join(__dirname, '..', 'src', 'generated');
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

for (let i = 0; i < count; i++) {
  fs.writeFileSync(
    path.join(dir, `Screen${i}.tsx`),
    `import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Row = { id: string; label: string; value: number };

function buildRows(seed: number): Row[] {
  return Array.from({ length: 20 }, (_, n) => ({
    id: \`s${i}-\${n}\`,
    label: \`Screen ${i} row \${n} with a reasonably long label for realism\`,
    value: (seed * 31 + n * 7) % 97,
  }));
}

export function formatValue${i}(value: number): string {
  if (value > 90) return \`\${value} (high)\`;
  if (value > 40) return \`\${value} (medium)\`;
  return \`\${value} (low)\`;
}

export function Screen${i}() {
  const [seed, setSeed] = useState(${i});
  const rows = useMemo(() => buildRows(seed), [seed]);
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen ${i}</Text>
      {rows.map(r => (
        <View key={r.id} style={styles.row}>
          <Text style={styles.label}>{r.label}</Text>
          <Text>{formatValue${i}(r.value)}</Text>
        </View>
      ))}
      <Pressable onPress={() => setSeed(s => s + 1)} style={styles.button}>
        <Text>Shuffle (total {total})</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { flex: 1, marginRight: 8 },
  button: { marginTop: 12, padding: 10, borderRadius: 8, borderWidth: 1 },
});
`,
  );
}

const imports = Array.from({ length: count }, (_, i) => `import { Screen${i} } from './Screen${i}';`).join('\n');
fs.writeFileSync(
  path.join(dir, 'index.ts'),
  `${imports}\n\nexport const screens = [${Array.from({ length: count }, (_, i) => `Screen${i}`).join(', ')}];\n`,
);
console.log(`Generated ${count} screens in src/generated`);
