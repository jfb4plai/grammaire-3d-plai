import { useState } from 'react';
import { FONCTIONS } from '../lib/fonctions';
import { NATURES } from '../lib/natures';

interface Props {
  selectedCount: number;
  manipEnabled: boolean;
  onAddPhrase: (phrase: string) => void;
  onDeselectAll: () => void;
  onAssignFonction: (id: number) => void;
  onAssignNature: (id: number) => void;
  onManip: (kind: 'deplacement' | 'effacement' | 'substitution') => void;
}

export function Toolbox({ selectedCount, manipEnabled, onAddPhrase, onDeselectAll, onAssignFonction, onAssignNature, onManip }: Props) {
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
          <span>{selectedCount} mot(s) sélectionné(s)</span>
          <button type="button" className="btn-desel" onClick={onDeselectAll}>Désélectionner</button>
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-section-title">Fonctions (assiettes)</div>
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
