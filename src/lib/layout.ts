import { clamp01 } from './coordinates';

export interface Placement {
  mot: string;
  normX: number;
  normY: number;
}

const PADDING = 20;
const GAP = 12;

export function estimateTokenWidth(mot: string, tbi = false): number {
  if (tbi) return Math.max(140, mot.length * 13 + 40);
  return Math.max(70, mot.length * 9 + 24);
}

export function layoutTokensInRow(
  words: string[],
  containerSize: { x: number; y: number },
  startY: number,
  tbi = false
): Placement[] {
  const rowHeight = tbi ? 130 : 90;
  const gap = tbi ? 18 : GAP;
  let x = PADDING;
  let y = startY;
  const placed: Placement[] = [];

  for (const mot of words) {
    const w = estimateTokenWidth(mot, tbi);
    if (x + w > containerSize.x - PADDING && x > PADDING) {
      x = PADDING;
      y += rowHeight;
    }
    placed.push({
      mot,
      normX: clamp01(containerSize.x > 0 ? x / containerSize.x : 0),
      normY: clamp01(containerSize.y > 0 ? y / containerSize.y : 0),
    });
    x += w + gap;
  }

  return placed;
}
