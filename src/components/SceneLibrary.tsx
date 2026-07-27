import { useEffect, useState } from 'react';
import type { SceneRecord } from '../lib/types';
import { listScenes, deleteScene } from '../lib/scenes';

interface Props {
  onLoad: (scene: SceneRecord) => void;
  refreshToken: number;
}

export function SceneLibrary({ onLoad, refreshToken }: Props) {
  const [scenes, setScenes] = useState<SceneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listScenes()
      .then(setScenes)
      .catch((e) => setErrorMsg(e.message))
      .finally(() => setLoading(false));
  }, [refreshToken]);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette scène enregistrée ?')) return;
    await deleteScene(id);
    setScenes((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) return <p className="scene-library-status">Chargement…</p>;
  if (errorMsg) return <p className="scene-library-status scene-library-error">{errorMsg}</p>;
  if (!scenes.length) return <p className="scene-library-status">Aucune scène enregistrée pour l'instant.</p>;

  return (
    <ul className="scene-library-list">
      {scenes.map((s) => (
        <li key={s.id} className="scene-library-item">
          <button type="button" className="scene-library-load" onClick={() => onLoad(s)}>
            {s.titre}
            <span className="scene-library-date">{new Date(s.updatedAt).toLocaleDateString('fr-BE')}</span>
          </button>
          <button type="button" className="scene-library-delete" onClick={() => handleDelete(s.id)} aria-label={`Supprimer ${s.titre}`}>✕</button>
        </li>
      ))}
    </ul>
  );
}
