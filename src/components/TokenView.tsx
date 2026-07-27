import { useRef, useState } from 'react';
import type { TokenData } from '../lib/types';
import { FONCTIONS } from '../lib/fonctions';
import { NATURES } from '../lib/natures';
import { toPixels } from '../lib/coordinates';

interface Props {
  token: TokenData;
  containerSize: { x: number; y: number };
  selected: boolean;
  showWord: boolean;
  showSymbol: boolean;
  showPicto: boolean;
  tbiMode: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, pixel: { x: number; y: number }, elementSize: { x: number; y: number }) => void;
  onRemove: (id: string) => void;
  onOpenPictoModal: (id: string) => void;
}

export function TokenView({
  token, containerSize, selected, showWord, showSymbol, showPicto, tbiMode,
  onSelect, onMove, onRemove, onOpenPictoModal,
}: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ startPX: number; startPY: number; moved: boolean; curX: number; curY: number } | null>(null);
  const lastPictoPointerDown = useRef(0);
  const [dragging, setDragging] = useState(false);

  const pixel = toPixels({ x: token.normX, y: token.normY }, containerSize);
  const picto = token.customImg
    ? token.customImg
    : token.pictoOptions[token.selectedPictoIdx]?.url ?? null;

  function handlePointerDown(e: React.PointerEvent) {
    const target = e.target as HTMLElement;
    if (target.dataset.closeBtn) return;

    // setPointerCapture below retargets every subsequent event — including the browser's
    // compatibility click/dblclick — to this div, so a native onDoubleClick on the picto
    // <img>/placeholder never fires. Detect the double-tap here instead, from raw pointerdown timing.
    if (target.closest('.token-picto, .token-picto-placeholder')) {
      const now = Date.now();
      if (now - lastPictoPointerDown.current < 350) {
        lastPictoPointerDown.current = 0;
        onOpenPictoModal(token.id);
        return;
      }
      lastPictoPointerDown.current = now;
    }

    elRef.current?.setPointerCapture(e.pointerId);
    dragState.current = { startPX: e.clientX, startPY: e.clientY, moved: false, curX: pixel.x, curY: pixel.y };
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragState.current || !elRef.current) return;
    const dx = e.clientX - dragState.current.startPX;
    const dy = e.clientY - dragState.current.startPY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.current.moved = true;
    const rect = elRef.current.getBoundingClientRect();
    const newPixel = { x: dragState.current.curX + dx, y: dragState.current.curY + dy };
    onMove(token.id, newPixel, { x: rect.width, y: rect.height });
    dragState.current.curX = newPixel.x;
    dragState.current.curY = newPixel.y;
    dragState.current.startPX = e.clientX;
    dragState.current.startPY = e.clientY;
  }

  function handlePointerUp() {
    const moved = dragState.current?.moved ?? false;
    dragState.current = null;
    setDragging(false);
    if (!moved) onSelect(token.id);
  }

  const fonction = token.fonctionId !== null ? FONCTIONS[token.fonctionId] : null;
  const nature = token.natureId !== null ? NATURES[token.natureId] : null;

  return (
    <div
      ref={elRef}
      className={[
        'token',
        selected ? 'token-selected' : '',
        dragging ? 'token-dragging' : '',
        token.effaced ? 'token-effaced' : '',
        tbiMode ? 'token-tbi' : '',
      ].join(' ')}
      style={{ left: pixel.x, top: pixel.y }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { dragState.current = null; setDragging(false); }}
    >
      <button
        type="button"
        className="token-close"
        data-close-btn="true"
        aria-label={`Supprimer « ${token.mot} »`}
        onPointerDown={(e) => { e.stopPropagation(); onRemove(token.id); }}
      >
        ✕
      </button>

      {showPicto && (
        picto ? (
          <img
            className="token-picto"
            src={picto}
            alt={token.mot}
            draggable={false}
          />
        ) : (
          <div
            className="token-picto-placeholder"
            role="button"
            tabIndex={0}
            aria-label={`Choisir un pictogramme pour « ${token.mot} »`}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenPictoModal(token.id); }}
          >
            🖼
          </div>
        )
      )}

      {showSymbol && nature && (
        <div className="token-symbol" dangerouslySetInnerHTML={{ __html: nature.svgHtml }} />
      )}

      {showWord && <div className="token-text">{token.mot}</div>}

      {fonction && (
        <div className="token-assiette" dangerouslySetInnerHTML={{ __html: fonction.svgHtml }} />
      )}
    </div>
  );
}
