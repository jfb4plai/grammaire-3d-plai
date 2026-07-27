import { useState } from 'react';
import type { TeacherOptions, SceneRecord } from '../lib/types';
import { useAuth } from '../hooks/useAuth';
import { SceneLibrary } from './SceneLibrary';
import { RISS_NOTES } from '../lib/riss';

interface Props {
  open: boolean;
  onClose: () => void;
  options: TeacherOptions;
  onOptionsChange: (options: TeacherOptions) => void;
  onArasaacToggle: (enabled: boolean) => void;
  onSaveScene: (titre: string) => Promise<void>;
  onLoadScene: (scene: SceneRecord) => void;
  sceneLibraryRefreshToken: number;
}

export function TeacherPanel({ open, onClose, options, onOptionsChange, onArasaacToggle, onSaveScene, onLoadScene, sceneLibraryRefreshToken }: Props) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdErr, setNewPwdErr] = useState('');
  const [sceneTitle, setSceneTitle] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  async function handleLogin() {
    if (!email || !password) return;
    await auth.signIn(email, password);
  }

  async function handleSendReset() {
    if (!resetEmail) { setResetMsg('Entre ton email d\'abord.'); return; }
    const err = await auth.sendPasswordReset(resetEmail);
    setResetMsg(err ?? 'Email envoyé ! Vérifie ta boîte mail.');
  }

  async function handleSaveNewPwd() {
    if (newPwd.length < 6) { setNewPwdErr('6 caractères minimum.'); return; }
    const err = await auth.updatePassword(newPwd);
    if (err) setNewPwdErr(err);
  }

  async function handleSaveScene() {
    if (!sceneTitle.trim()) { setSaveMsg('Donne un titre à la scène.'); return; }
    await onSaveScene(sceneTitle.trim());
    setSaveMsg('Scène enregistrée.');
    setSceneTitle('');
  }

  return (
    <aside className={`teacher-panel${open ? ' open' : ''}`}>
      <div className="tp-header">
        <span>🎓 Mode Enseignant</span>
        <button type="button" className="tp-close" onClick={onClose} aria-label="Fermer le panneau enseignant">✕</button>
      </div>
      <div className="tp-body">
        {!auth.session ? (
          auth.passwordRecovery ? (
            <div className="tp-login">
              <p className="tp-hint">Choisis un nouveau mot de passe.</p>
              <input className="tp-input" type="password" placeholder="Nouveau mot de passe (6 car. min.)" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
              <div className="tp-error">{newPwdErr}</div>
              <button type="button" className="btn-login" onClick={handleSaveNewPwd}>Enregistrer</button>
            </div>
          ) : resetMode ? (
            <div className="tp-login">
              <p className="tp-hint">Entre ton email pour recevoir un lien de réinitialisation.</p>
              <input className="tp-input" type="email" placeholder="Email enseignant" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
              <div className="tp-status">{resetMsg}</div>
              <button type="button" className="btn-login" onClick={handleSendReset}>Envoyer le lien</button>
              <button type="button" className="btn-cancel" onClick={() => setResetMode(false)}>Annuler</button>
            </div>
          ) : (
            <div className="tp-login">
              <div className="tool-section-title">Connexion</div>
              <input className="tp-input" type="email" placeholder="Email enseignant" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="tp-input" type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }} />
              <button type="button" className="btn-login" onClick={handleLogin}>Se connecter</button>
              <div className="tp-error">{auth.error}</div>
              <button type="button" className="tp-link" onClick={() => { setResetEmail(email); setResetMode(true); }}>Mot de passe oublié ?</button>
            </div>
          )
        ) : (
          <>
            <div className="tp-status">✓ Connecté</div>

            <div className="tool-section-title" style={{ marginTop: 10 }}>Options d'affichage</div>
            <div className="tp-options">
              <label className="tp-option">
                <input type="checkbox" checked={options.arasaac} onChange={(e) => onArasaacToggle(e.target.checked)} />
                Afficher pictogrammes ARASAAC
              </label>
              <label className="tp-option">
                <input type="checkbox" checked={options.word} onChange={(e) => onOptionsChange({ ...options, word: e.target.checked })} />
                Afficher le mot sous le pictogramme
              </label>
              <label className="tp-option">
                <input type="checkbox" checked={options.symbol} onChange={(e) => onOptionsChange({ ...options, symbol: e.target.checked })} />
                Afficher les symboles de nature
              </label>
              <label className="tp-option">
                <input type="checkbox" checked={options.manip} onChange={(e) => onOptionsChange({ ...options, manip: e.target.checked })} />
                Activer les manipulations 3D
              </label>
              <label className="tp-option">
                <input type="checkbox" checked={options.customImg} onChange={(e) => onOptionsChange({ ...options, customImg: e.target.checked })} />
                Autoriser images personnalisées
              </label>
              <label className="tp-option">
                <input type="checkbox" checked={options.tbiMode} onChange={(e) => onOptionsChange({ ...options, tbiMode: e.target.checked })} />
                Mode TBI (tokens et boutons agrandis)
              </label>
            </div>

            <div className="tool-section-title" style={{ marginTop: 10 }}>Enregistrer la scène</div>
            <div className="tp-login">
              <input className="tp-input" type="text" placeholder="Ex : Phrase simple — sujet/verbe" value={sceneTitle} onChange={(e) => setSceneTitle(e.target.value)} />
              <button type="button" className="btn-login" onClick={handleSaveScene}>Enregistrer</button>
              <div className="tp-status">{saveMsg}</div>
            </div>

            <div className="tool-section-title" style={{ marginTop: 10 }}>Mes scènes</div>
            <SceneLibrary onLoad={onLoadScene} refreshToken={sceneLibraryRefreshToken} />

            <button type="button" className="btn-cancel" style={{ marginTop: 10 }} onClick={() => auth.signOut()}>Se déconnecter</button>
          </>
        )}

        <div style={{ marginTop: 14 }}>
          <div className="riss-section-title">📚 Ancrage scientifique (RISS)</div>
          {RISS_NOTES.map((n) => (
            <div key={n.citation} className="riss-note">
              <strong>{n.citation}</strong>
              <p>« {n.content} »</p>
            </div>
          ))}
          <p className="tp-hint" style={{ marginTop: 8 }}>
            Cet outil initie ou corrige la manipulation syntaxique au TBI — il ne remplace pas la manipulation physique par les élèves en classe.
          </p>
        </div>
      </div>
    </aside>
  );
}
