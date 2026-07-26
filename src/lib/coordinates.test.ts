import { describe, it, expect } from 'vitest';
import { clamp01, toNormalized, toPixels, clampToContainer } from './coordinates';

describe('clamp01', () => {
  it('clamps below 0 to 0', () => expect(clamp01(-0.5)).toBe(0));
  it('clamps above 1 to 1', () => expect(clamp01(1.5)).toBe(1));
  it('passes through in-range values', () => expect(clamp01(0.42)).toBe(0.42));
});

describe('toNormalized / toPixels', () => {
  it('round-trips a pixel position through a container size', () => {
    const container = { x: 1000, y: 500 };
    const normalized = toNormalized({ x: 250, y: 100 }, container);
    expect(normalized).toEqual({ x: 0.25, y: 0.2 });
    expect(toPixels(normalized, container)).toEqual({ x: 250, y: 100 });
  });

  it('clamps normalized output to [0,1] for out-of-bounds pixels', () => {
    const container = { x: 1000, y: 500 };
    expect(toNormalized({ x: -50, y: 900 }, container)).toEqual({ x: 0, y: 1 });
  });

  it('returns origin when container size is zero (not yet measured)', () => {
    expect(toNormalized({ x: 100, y: 100 }, { x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
  });
});

describe('clampToContainer', () => {
  it('keeps an element fully inside the container', () => {
    const result = clampToContainer(
      { x: 980, y: 480 },
      { x: 80, y: 60 },
      { x: 1000, y: 500 }
    );
    expect(result).toEqual({ x: 920, y: 440 });
  });

  it('does not push negative positions further negative', () => {
    const result = clampToContainer(
      { x: -40, y: -10 },
      { x: 80, y: 60 },
      { x: 1000, y: 500 }
    );
    expect(result).toEqual({ x: 0, y: 0 });
  });
});
