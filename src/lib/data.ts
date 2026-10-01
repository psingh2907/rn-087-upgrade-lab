export type ChecklistItem =
  | { id: string; kind: 'header'; title: string }
  | { id: string; kind: 'question'; title: string; answer?: 'yes' | 'no' }
  | { id: string; kind: 'photo'; title: string; uri: string };

// A store audit: sections of yes/no questions with photo evidence,
// long enough to make list performance matter.
export const checklist: ChecklistItem[] = Array.from({ length: 40 }, (_, s) => [
  { id: `h${s}`, kind: 'header' as const, title: `Section ${s + 1}` },
  ...Array.from({ length: 8 }, (_unused, q) => ({
    id: `q${s}-${q}`,
    kind: 'question' as const,
    title: `Is check ${q + 1} in section ${s + 1} complete?`,
  })),
  {
    id: `p${s}`,
    kind: 'photo' as const,
    title: `Photo evidence ${s + 1}`,
    uri: `https://picsum.photos/seed/${s}/600/400`,
  },
]).flat();
