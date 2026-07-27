import { describe, it, expect } from 'vitest';
import { computeGroupBBox, isFullGroupSelected } from './groups';

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

describe('isFullGroupSelected', () => {
  const tokens = [
    { id: 'a', groupId: 'g1' },
    { id: 'b', groupId: 'g1' },
    { id: 'c', groupId: null },
    { id: 'd', groupId: 'g2' },
  ];

  it('returns false when nothing is selected', () => {
    expect(isFullGroupSelected(tokens, new Set())).toBe(false);
  });

  it('returns false when the selected token has no group', () => {
    expect(isFullGroupSelected(tokens, new Set(['c']))).toBe(false);
  });

  it('returns false when only part of a group is selected', () => {
    expect(isFullGroupSelected(tokens, new Set(['a']))).toBe(false);
  });

  it('returns true when exactly all members of a group are selected', () => {
    expect(isFullGroupSelected(tokens, new Set(['a', 'b']))).toBe(true);
  });

  it('returns false when the selection includes a token outside the group', () => {
    expect(isFullGroupSelected(tokens, new Set(['a', 'b', 'd']))).toBe(false);
  });

  it('returns false when the first selected id belongs to a different group than the rest', () => {
    expect(isFullGroupSelected(tokens, new Set(['d', 'a', 'b']))).toBe(false);
  });
});
