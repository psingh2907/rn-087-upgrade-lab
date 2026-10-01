import type { NativeMethods } from 'react-native';
// Deep import: the props type for a host View, a common pattern in older code.
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

export type Box = { x: number; y: number; width: number; height: number };

// Where an element is on screen, e.g. to anchor a tooltip.
export function measureInWindow(node: NativeMethods | null): Promise<Box | null> {
  return new Promise(resolve => {
    if (!node) return resolve(null);
    node.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
  });
}

export type AnchorProps = ViewProps & { tooltip?: string };
