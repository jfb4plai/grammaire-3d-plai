import { describe, it, expect } from 'vitest';
import { computeGroupBBox } from './groups';

describe('computeGroupBBox', () => {
  it('returns null for an empty list', () => {
    expect(computeGroupBBox([], 10)).toBeNull();
  });

  it('wraps a single box with padding', () => {
    const bbox = computeGroupBBox([{ x: 100, y: 100, width: 50, height: 30 }], 10);
    expect(bbox).toEqual({ x: 90, y: 90, width: 70, height: 50 });
  });

  it('wraps the union of multiple boxes with padding', () => {
    const bbox = computeGroupBBox(
      [
        { x: 0, y: 0, width: 40, height: 40 },
        { x: 200, y: 20, width: 40, height: 40 },
      ],
      10
    );
    expect(bbox).toEqual({ x: -10, y: -10, width: 260, height: 80 });
  });
});
