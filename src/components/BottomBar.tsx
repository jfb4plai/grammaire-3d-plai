interface Props {
  onExport: () => void;
  onClear: () => void;
  onFullscreen: () => void;
}

export function BottomBar({ onExport, onClear, onFullscreen }: Props) {
  return (
    <div className="btm-toolbar">
      <button type="button" className="btm-btn" onClick={onExport}>🖨 Imprimer</button>
      <button type="button" className="btm-btn danger" onClick={onClear}>🗑 Effacer tout</button>
      <button type="button" className="btm-btn" onClick={onFullscreen}>⛶ Plein écran</button>
    </div>
  );
}
