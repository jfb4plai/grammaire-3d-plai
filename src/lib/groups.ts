export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function computeGroupBBox(boxes: Box[], padding: number): Box | null {
  if (boxes.length === 0) return null;
  const minX = Math.min(...boxes.map((b) => b.x));
  const minY = Math.min(...boxes.map((b) => b.y));
  const maxX = Math.max(...boxes.map((b) => b.x + b.width));
  const maxY = Math.max(...boxes.map((b) => b.y + b.height));
  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

export interface SelectableToken {
  id: string;
  groupId: string | null;
}

export function isFullGroupSelected(tokens: SelectableToken[], selectedIds: Set<string>): boolean {
  const ids = Array.from(selectedIds);
  if (!ids.length) return false;
  const groupId = tokens.find((t) => t.id === ids[0])?.groupId ?? null;
  if (!groupId) return false;
  const groupMembers = tokens.filter((t) => t.groupId === groupId);
  return groupMembers.length === ids.length && groupMembers.every((t) => selectedIds.has(t.id));
}
