import type { HostInstance, ViewProps } from 'react-native';

export type Box = { x: number; y: number; width: number; height: number };

// Where an element is on screen, e.g. to anchor a tooltip.
export function measureInWindow(node: HostInstance | null): Promise<Box | null> {
  return new Promise(resolve => {
    if (!node) return resolve(null);
    node.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
  });
}

export type AnchorProps = ViewProps & { tooltip?: string };
