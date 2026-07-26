import type { TokenData, TeacherOptions } from '../lib/types';
import { TokenView } from './TokenView';
import { GroupLayer } from './GroupLayer';
import { useElementSize } from '../hooks/useElementSize';

interface Props {
  tokens: TokenData[];
  selectedIds: Set<string>;
  options: TeacherOptions;
  onSelect: (id: string) => void;
  onMove: (id: string, pixel: { x: number; y: number }, elementSize: { x: number; y: number }, containerSize: { x: number; y: number }) => void;
  onRemove: (id: string) => void;
  onOpenPictoModal: (id: string) => void;
  onDeselectAll: () => void;
}

export function Workspace({ tokens, selectedIds, options, onSelect, onMove, onRemove, onOpenPictoModal, onDeselectAll }: Props) {
  const { ref, size } = useElementSize<HTMLDivElement>();

  return (
    <main
      id="workspace"
      ref={ref}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onDeselectAll(); }}
    >
      <GroupLayer tokens={tokens} containerSize={size} />
      {tokens.map((t) => (
        <TokenView
          key={t.id}
          token={t}
          containerSize={size}
          selected={selectedIds.has(t.id)}
          showWord={options.word || !options.arasaac}
          showSymbol={options.symbol}
          showPicto={options.arasaac}
          tbiMode={options.tbiMode}
          onSelect={onSelect}
          onMove={(id, pixel, elementSize) => onMove(id, pixel, elementSize, size)}
          onRemove={onRemove}
          onOpenPictoModal={onOpenPictoModal}
        />
      ))}
    </main>
  );
}
