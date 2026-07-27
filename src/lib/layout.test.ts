import { describe, it, expect } from 'vitest';
import { layoutTokensInRow, estimateTokenWidth } from './layout';

describe('estimateTokenWidth', () => {
  it('grows with word length and has a floor', () => {
    expect(estimateTokenWidth('a')).toBeGreaterThanOrEqual(70);
    expect(estimateTokenWidth('anticonstitutionnellement')).toBeGreaterThan(estimateTokenWidth('a'));
  });

  it('estimates wider tokens in TBI mode, matching the larger .token-tbi CSS footprint', () => {
    expect(estimateTokenWidth('a', true)).toBeGreaterThan(estimateTokenWidth('a', false));
    expect(estimateTokenWidth('a', true)).toBeGreaterThanOrEqual(120);
  });
});

describe('layoutTokensInRow', () => {
  it('places short words left to right on one row', () => {
    const placed = layoutTokensInRow(['Le', 'chat', 'dort'], { x: 2000, y: 1000 }, 80);
    expect(placed).toHaveLength(3);
    expect(placed[0].normY).toBe(placed[1].normY);
    expect(placed[1].normX).toBeGreaterThan(placed[0].normX);
  });

  it('wraps to a new row when a word would overflow the container width', () => {
    const words = Array.from({ length: 20 }, (_, i) => `mot${i}`);
    const placed = layoutTokensInRow(words, { x: 600, y: 2000 }, 80);
    const rows = new Set(placed.map((p) => p.normY));
    expect(rows.size).toBeGreaterThan(1);
  });

  it('keeps every placement within [0,1] on both axes', () => {
    const words = Array.from({ length: 30 }, (_, i) => `mot-assez-long-${i}`);
    const placed = layoutTokensInRow(words, { x: 500, y: 400 }, 80);
    for (const p of placed) {
      expect(p.normX).toBeGreaterThanOrEqual(0);
      expect(p.normX).toBeLessThanOrEqual(1);
      expect(p.normY).toBeGreaterThanOrEqual(0);
      expect(p.normY).toBeLessThanOrEqual(1);
    }
  });

  it('never wraps or loops forever on a single word wider than the container', () => {
    const longWord = 'unmotextremementlongquidepasselelargeurentiereduconteneur';
    const placed = layoutTokensInRow([longWord], { x: 100, y: 200 }, 80);
    expect(placed).toHaveLength(1);
    expect(placed[0].normX).toBeGreaterThanOrEqual(0);
    expect(placed[0].normX).toBeLessThanOrEqual(1);
    expect(placed[0].normY).toBeGreaterThanOrEqual(0);
    expect(placed[0].normY).toBeLessThanOrEqual(1);
  });

  it('spaces tokens further apart in TBI mode so the larger rendered footprint does not overlap', () => {
    const normal = layoutTokensInRow(['le', 'chat', 'dort'], { x: 2000, y: 1000 }, 80);
    const tbi = layoutTokensInRow(['le', 'chat', 'dort'], { x: 2000, y: 1000 }, 80, true);
    expect(tbi[1].normX).toBeGreaterThan(normal[1].normX);
    expect(tbi[2].normX).toBeGreaterThan(normal[2].normX);
  });
});
