import { clamp01 } from './coordinates';

export interface Placement {
  mot: string;
  normX: number;
  normY: number;
}

const PADDING = 20;
const GAP = 12;

export function estimateTokenWidth(mot: string): number {
  return Math.max(70, mot.length * 9 + 24);
}

export function layoutTokensInRow(
  words: string[],
  containerSize: { x: number; y: number },
  startY: number
): Placement[] {
  const rowHeight = 90;
  let x = PADDING;
  let y = startY;
  const placed: Placement[] = [];

  for (const mot of words) {
    const w = estimateTokenWidth(mot);
    if (x + w > containerSize.x - PADDING && x > PADDING) {
      x = PADDING;
      y += rowHeight;
    }
    placed.push({
      mot,
      normX: clamp01(containerSize.x > 0 ? x / containerSize.x : 0),
      normY: clamp01(containerSize.y > 0 ? y / containerSize.y : 0),
    });
    x += w + GAP;
  }

  return placed;
}
