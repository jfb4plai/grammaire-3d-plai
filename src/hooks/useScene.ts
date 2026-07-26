import { useCallback, useState } from 'react';
import type { TokenData, TeacherOptions } from '../lib/types';
import { DEFAULT_OPTIONS } from '../lib/types';
import { tokenizePhrase } from '../lib/tokenizer';
import { layoutTokensInRow } from '../lib/layout';
import { clampToContainer, toNormalized, toPixels } from '../lib/coordinates';
import { FONCTIONS } from '../lib/fonctions';

function pruneOrphanGroups(tokens: TokenData[]): TokenData[] {
  const counts = new Map<string, number>();
  tokens.forEach((t) => {
    if (t.groupId) counts.set(t.groupId, (counts.get(t.groupId) ?? 0) + 1);
  });
  return tokens.map((t) =>
    t.groupId && (counts.get(t.groupId) ?? 0) < 2 ? { ...t, groupId: null } : t
  );
}

export function useScene() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [options, setOptions] = useState<TeacherOptions>(DEFAULT_OPTIONS);

  const addTokensFromPhrase = useCallback((phrase: string, containerSize: { x: number; y: number }) => {
    const words = tokenizePhrase(phrase);
    if (!words.length) return;
    setTokens((prev) => {
      const baseY = prev.length
        ? Math.max(...prev.map((t) => t.normY * containerSize.y)) + 90
        : 80;
      const placements = layoutTokensInRow(words, containerSize, baseY);
      const newTokens: TokenData[] = placements.map((p) => ({
        id: crypto.randomUUID(),
        mot: p.mot,
        originalMot: null,
        normX: p.normX,
        normY: p.normY,
        fonctionId: null,
        natureId: null,
        groupId: null,
        pictoOptions: [],
        selectedPictoIdx: 0,
        customImg: null,
        effaced: false,
      }));
      return [...prev, ...newTokens];
    });
  }, []);

  const moveToken = useCallback((id: string, pixel: { x: number; y: number }, elementSize: { x: number; y: number }, containerSize: { x: number; y: number }) => {
    const clamped = clampToContainer(pixel, elementSize, containerSize);
    const normalized = toNormalized(clamped, containerSize);
    setTokens((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;
      if (target.groupId) {
        const before = toPixels({ x: target.normX, y: target.normY }, containerSize);
        const deltaX = clamped.x - before.x;
        const deltaY = clamped.y - before.y;
        return prev.map((t) => {
          if (t.groupId !== target.groupId) return t;
          const p = toPixels({ x: t.normX, y: t.normY }, containerSize);
          const moved = { x: p.x + deltaX, y: p.y + deltaY };
          const n = toNormalized(moved, containerSize);
          return { ...t, normX: n.x, normY: n.y };
        });
      }
      return prev.map((t) => (t.id === id ? { ...t, normX: normalized.x, normY: normalized.y } : t));
    });
  }, []);

  const removeToken = useCallback((id: string) => {
    setTokens((prev) => pruneOrphanGroups(prev.filter((t) => t.id !== id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const deselectAll = useCallback(() => setSelectedIds(new Set()), []);

  const assignFonction = useCallback((fonctionId: number) => {
    setSelectedIds((currentSelection) => {
      if (!currentSelection.size) return currentSelection;
      const fonction = FONCTIONS.find((f) => f.id === fonctionId);
      const ids = Array.from(currentSelection);
      const newGroupId = fonction?.isGroupType && ids.length > 1 ? crypto.randomUUID() : null;
      setTokens((prev) =>
        pruneOrphanGroups(prev.map((t) => (ids.includes(t.id) ? { ...t, fonctionId, groupId: newGroupId } : t)))
      );
      return currentSelection;
    });
  }, []);

  const assignNature = useCallback((natureId: number) => {
    setSelectedIds((currentSelection) => {
      if (!currentSelection.size) return currentSelection;
      const ids = Array.from(currentSelection);
      setTokens((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, natureId } : t)));
      return currentSelection;
    });
  }, []);

  const clearAll = useCallback(() => {
    setTokens([]);
    setSelectedIds(new Set());
  }, []);

  const loadScene = useCallback((sceneTokens: TokenData[], sceneOptions: TeacherOptions) => {
    setTokens(sceneTokens);
    setOptions(sceneOptions);
    setSelectedIds(new Set());
  }, []);

  return {
    tokens,
    setTokens,
    selectedIds,
    options,
    setOptions,
    addTokensFromPhrase,
    moveToken,
    removeToken,
    toggleSelection,
    deselectAll,
    assignFonction,
    assignNature,
    clearAll,
    loadScene,
  };
}
