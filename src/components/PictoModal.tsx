import { useRef } from 'react';
import type { TokenData } from '../lib/types';

interface Props {
  token: TokenData;
  allowCustomImg: boolean;
  onSelectPicto: (idx: number) => void;
  onSelectCustomImg: (dataUrl: string) => void;
  onClose: () => void;
}

export function PictoModal({ token, allowCustomImg, onSelectPicto, onSelectCustomImg, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onSelectCustomImg(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div
      className="modal-overlay open"
      onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box" role="dialog" aria-label={`Choisir un pictogramme pour ${token.mot}`}>
        <div className="modal-title">
          <span>Choisir un pictogramme</span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="picto-grid">
          {token.pictoOptions.length ? (
            token.pictoOptions.map((p, idx) => (
              <div
                key={p.id}
                className={`picto-option${idx === token.selectedPictoIdx ? ' selected-opt' : ''}`}
                onClick={() => onSelectPicto(idx)}
              >
                <img src={p.url} alt={p.keywords[0] ?? ''} draggable={false} />
              </div>
            ))
          ) : (
            <div className="picto-empty">Aucun pictogramme ARASAAC disponible pour ce mot.</div>
          )}
        </div>
        {allowCustomImg && (
          <>
            <button type="button" className="btn-custom-img" onClick={() => fileInputRef.current?.click()}>
              📁 Image personnalisée
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </>
        )}
      </div>
    </div>
  );
}
