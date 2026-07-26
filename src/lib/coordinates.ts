export interface Point {
  x: number;
  y: number;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function toNormalized(pixel: Point, containerSize: Point): Point {
  if (containerSize.x <= 0 || containerSize.y <= 0) return { x: 0, y: 0 };
  return {
    x: clamp01(pixel.x / containerSize.x),
    y: clamp01(pixel.y / containerSize.y),
  };
}

export function toPixels(normalized: Point, containerSize: Point): Point {
  return {
    x: normalized.x * containerSize.x,
    y: normalized.y * containerSize.y,
  };
}

export function clampToContainer(pixel: Point, elementSize: Point, containerSize: Point): Point {
  const maxX = Math.max(0, containerSize.x - elementSize.x);
  const maxY = Math.max(0, containerSize.y - elementSize.y);
  return {
    x: Math.min(maxX, Math.max(0, pixel.x)),
    y: Math.min(maxY, Math.max(0, pixel.y)),
  };
}
