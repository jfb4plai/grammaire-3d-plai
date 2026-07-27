import { useState } from 'react';
import { FONCTIONS } from '../lib/fonctions';
import { NATURES } from '../lib/natures';

interface Props {
  selectedCount: number;
  manipEnabled: boolean;
  showUngroup: boolean;
  onAddPhrase: (phrase: string) => void;
  onDeselectAll: () => void;
  onAssignFonction: (id: number) => void;
  onAssignNature: (id: number) => void;
  onManip: (kind: 'deplacement' | 'effacement' | 'substitution') => void;
  onUngroup: () => void;
}

export function Toolbox({ selectedCount, manipEnabled, showUngroup, onAddPhrase, onDeselectAll, onAssignFonction, onAssignNature, onManip, onUngroup }: Props) {
  const [phrase, setPhrase] = useState('');

  function submitPhrase() {
    const value = phrase.trim();
    if (!value) return;
    onAddPhrase(value);
    setPhrase('');
  }

  return (
    <aside className="toolbox">
      <div className="tool-section">
        <div className="tool-section-title">Phrase ou mot(s)</div>
        <textarea
          className="phrase-input"
          placeholder={'Ex : Le chat dort.\n(Entrée = ajouter)'}
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitPhrase(); } }}
        />
        <button type="button" className="btn-add" onClick={submitPhrase}>➕ Ajouter</button>
        <p className="field-help">
          Chaque mot devient une étiquette à déplacer ; la ponctuation forme aussi ses propres étiquettes.
        </p>
      </div>

      <div className="tool-section">
        <div className="sel-indicator">
          <span aria-live="polite">{selectedCount} mot(s) sélectionné(s)</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {showUngroup && (
              <button type="button" className="btn-ungroup" onClick={onUngroup}>
                Dégrouper
              </button>
            )}
            <button type="button" className="btn-desel" onClick={onDeselectAll}>Désélectionner</button>
          </div>
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-section-title">Fonctions (assiettes)</div>
        <p className="field-help">
          Assigner une fonction désélectionne automatiquement les mots (pour éviter d'enchaîner par erreur sur la même sélection). Assigner une nature garde la sélection, pour pouvoir ensuite lui donner une fonction sans re-sélectionner.
        </p>
        <div className="fonctions-list">
          {FONCTIONS.map((f) => (
            <button key={f.id} type="button" className="btn-fonction" onClick={() => onAssignFonction(f.id)}>
              <span dangerouslySetInnerHTML={{ __html: f.svgHtml }} />
              <span>{f.nom}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-section-title">Nature des mots</div>
        <div className="natures-grid">
          {NATURES.map((n) => (
            <button key={n.id} type="button" className="btn-nature" onClick={() => onAssignNature(n.id)}>
              <span dangerouslySetInnerHTML={{ __html: n.svgHtml }} />
              <span>{n.nom}</span>
            </button>
          ))}
        </div>
      </div>

      {manipEnabled && (
        <div className="tool-section">
          <div className="tool-section-title">Manipulations 3D</div>
          <div className="manip-list">
            <button type="button" className="btn-manip" onClick={() => onManip('deplacement')}>🏄 Déplacement</button>
            <button type="button" className="btn-manip" onClick={() => onManip('effacement')}>✂️ Effacement</button>
            <button type="button" className="btn-manip" onClick={() => onManip('substitution')}>🔄 Substitution</button>
          </div>
        </div>
      )}
    </aside>
  );
}
