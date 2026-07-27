import { pronounsForFonction } from '../lib/pronouns';
import { FONCTIONS } from '../lib/fonctions';

interface Props {
  fonctionId: number | null;
  onPick: (pronoun: string) => void;
  onClose: () => void;
}

export function SubstitutionPanel({ fonctionId, onPick, onClose }: Props) {
  const candidates = pronounsForFonction(fonctionId);
  const fonction = fonctionId !== null ? FONCTIONS.find((f) => f.id === fonctionId) : null;

  return (
    <div className="substitution-panel" role="dialog" aria-label="Choisir un pronom de substitution">
      <div className="substitution-panel-title">Remplacer par…</div>
      {candidates.length ? (
        <>
          <p className="substitution-panel-hint">
            Choisis le pronom qui garde le sens ET la grammaticalité de la phrase — certains proposés ici ne conviennent qu'à certaines phrases.
          </p>
          <div className="substitution-panel-options">
            {candidates.map((p) => (
              <button key={p} type="button" className="btn-pronoun" onClick={() => onPick(p)}>{p}</button>
            ))}
          </div>
        </>
      ) : fonctionId === null ? (
        <p className="substitution-panel-empty">Assigne d'abord une fonction (assiette) à ce mot ou ce groupe avant de le remplacer par un pronom.</p>
      ) : (
        <p className="substitution-panel-empty">La fonction « {fonction?.nom ?? ''} » ne se remplace pas par un pronom.</p>
      )}
      <button type="button" className="btn-desel" onClick={onClose}>Fermer</button>
    </div>
  );
}
