import { useCallback, useState } from 'react';
import type { TokenData, TeacherOptions } from '../lib/types';
import { DEFAULT_OPTIONS } from '../lib/types';
import { tokenizePhrase } from '../lib/tokenizer';
import { layoutTokensInRow } from '../lib/layout';
import { clampToContainer, toNormalized, toPixels } from '../lib/coordinates';
import { FONCTIONS } from '../lib/fonctions';
import { searchPictograms } from '../lib/arasaac';

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

  const fetchMissingPictos = useCallback((ids: string[]) => {
    setTokens((currentTokens) => {
      const targets = currentTokens.filter((t) => ids.includes(t.id) && t.pictoOptions.length === 0);
      targets.forEach((t) => {
        searchPictograms(t.mot).then((results) => {
          setTokens((prev) => prev.map((x) => (x.id === t.id ? { ...x, pictoOptions: results } : x)));
        }).catch(() => { /* leave pictoOptions empty; placeholder stays visible */ });
      });
      return currentTokens;
    });
  }, []);

  const addTokensFromPhrase = useCallback((phrase: string, containerSize: { x: number; y: number }) => {
    const words = tokenizePhrase(phrase);
    if (!words.length) return;
    setTokens((prev) => {
      const rowHeight = options.tbiMode ? 130 : 90;
      const baseY = prev.length
        ? Math.max(...prev.map((t) => t.normY * containerSize.y)) + rowHeight
        : 80;
      const placements = layoutTokensInRow(words, containerSize, baseY, options.tbiMode);
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
      if (options.arasaac) {
        fetchMissingPictos(newTokens.map((t) => t.id));
      }
      return [...prev, ...newTokens];
    });
  }, [options.arasaac, options.tbiMode, fetchMissingPictos]);

  const enableArasaac = useCallback((enabled: boolean) => {
    setOptions((prev) => ({ ...prev, arasaac: enabled }));
    if (enabled) {
      setTokens((currentTokens) => {
        fetchMissingPictos(currentTokens.map((t) => t.id));
        return currentTokens;
      });
    }
  }, [fetchMissingPictos]);

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

  const doDeplacement = useCallback((containerSize: { x: number; y: number }) => {
    let moved = 0;
    setTokens((prev) => {
      const targets = prev.filter((t) => t.fonctionId === 4);
      if (!targets.length) return prev;
      moved = targets.length;

      const groupDeltaX = new Map<string, number>();
      targets.forEach((t) => {
        if (!t.groupId || groupDeltaX.has(t.groupId)) return;
        const members = targets.filter((m) => m.groupId === t.groupId);
        const anchorX = Math.min(...members.map((m) => toPixels({ x: m.normX, y: m.normY }, containerSize).x));
        groupDeltaX.set(t.groupId, 20 - anchorX);
      });

      return prev.map((t) => {
        if (t.fonctionId !== 4) return t;
        const pixel = toPixels({ x: t.normX, y: t.normY }, containerSize);
        const deltaX = t.groupId ? groupDeltaX.get(t.groupId)! : 20 - pixel.x;
        const target = toNormalized({ x: pixel.x + deltaX, y: pixel.y }, containerSize);
        return { ...t, normX: target.x, normY: target.y };
      });
    });
    return moved;
  }, []);

  const doEffacement = useCallback(() => {
    setSelectedIds((currentSelection) => {
      if (!currentSelection.size) return currentSelection;
      const ids = Array.from(currentSelection);
      setTokens((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, effaced: true } : t)));
      setTimeout(() => {
        setTokens((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, effaced: false } : t)));
      }, 3000);
      return currentSelection;
    });
  }, []);

  const doSubstitution = useCallback((pronoun: string): string[] => {
    let affectedIds: string[] = [];
    setSelectedIds((currentSelection) => {
      if (!currentSelection.size) return currentSelection;
      const ids = Array.from(currentSelection);
      affectedIds = ids;
      setTokens((prev) => {
        const [firstId, ...restIds] = ids;
        return prev.map((t) => {
          if (t.id === firstId) return { ...t, mot: pronoun, originalMot: t.originalMot ?? t.mot };
          if (restIds.includes(t.id)) return { ...t, effaced: true };
          return t;
        });
      });
      return currentSelection;
    });
    return affectedIds;
  }, []);

  const undoSubstitution = useCallback((ids: string[]) => {
    setTokens((prev) =>
      prev.map((t) =>
        ids.includes(t.id) ? { ...t, mot: t.originalMot ?? t.mot, originalMot: null, effaced: false } : t
      )
    );
  }, []);

  const selectPicto = useCallback((id: string, idx: number) => {
    setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, selectedPictoIdx: idx, customImg: null } : t)));
  }, []);

  const selectCustomImg = useCallback((id: string, dataUrl: string) => {
    setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, customImg: dataUrl } : t)));
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
    doDeplacement,
    doEffacement,
    doSubstitution,
    undoSubstitution,
    selectPicto,
    selectCustomImg,
    enableArasaac,
    clearAll,
    loadScene,
  };
}
