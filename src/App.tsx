import { useState } from 'react';
import { useScene } from './hooks/useScene';
import { useToast } from './hooks/useToast';
import { Header } from './components/Header';
import { Toolbox } from './components/Toolbox';
import { Workspace } from './components/Workspace';
import { BottomBar } from './components/BottomBar';
import { SubstitutionPanel } from './components/SubstitutionPanel';
import { ToastStack } from './components/ToastStack';

export default function App() {
  const scene = useScene();
  const { toasts, showToast, dismissToast } = useToast();
  const [substitutionOpen, setSubstitutionOpen] = useState(false);

  function handleAddPhrase(phrase: string) {
    const workspaceEl = document.getElementById('workspace');
    const size = workspaceEl
      ? { x: workspaceEl.clientWidth, y: workspaceEl.clientHeight }
      : { x: 1000, y: 600 };
    scene.addTokensFromPhrase(phrase, size);
  }

  function handleManip(kind: 'deplacement' | 'effacement' | 'substitution') {
    const workspaceEl = document.getElementById('workspace');
    const size = workspaceEl ? { x: workspaceEl.clientWidth, y: workspaceEl.clientHeight } : { x: 1000, y: 600 };

    if (kind === 'deplacement') {
      const moved = scene.doDeplacement(size);
      showToast(moved > 0 ? 'Déplacé en tête de phrase — la phrase reste correcte !' : 'Assignez d\'abord la fonction "Compl. de phrase" à un groupe.');
      return;
    }
    if (kind === 'effacement') {
      if (!scene.selectedIds.size) { showToast('Sélectionnez des mots à effacer.'); return; }
      scene.doEffacement();
      showToast('La phrase reste correcte sans ce groupe !');
      return;
    }
    if (!scene.selectedIds.size) { showToast('Sélectionnez des mots à substituer.'); return; }
    setSubstitutionOpen(true);
  }

  function handlePronounPick(pronoun: string) {
    const affectedIds = scene.doSubstitution(pronoun);
    setSubstitutionOpen(false);
    showToast('Remplacé par un pronom — même fonction, même sens.', 'Restaurer', () => scene.undoSubstitution(affectedIds));
  }

  function handleClear() {
    if (!scene.tokens.length) return;
    if (!confirm('Effacer tous les tokens du workspace ?')) return;
    scene.clearAll();
  }

  function handleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }

  const firstSelectedId = Array.from(scene.selectedIds)[0];
  const firstSelectedFonctionId = firstSelectedId
    ? scene.tokens.find((t) => t.id === firstSelectedId)?.fonctionId ?? null
    : null;

  return (
    <>
      <Header onOpenTeacherPanel={() => { /* wired in Task 34 */ }} />
      <div className="app-body">
        <Toolbox
          selectedCount={scene.selectedIds.size}
          manipEnabled={scene.options.manip}
          onAddPhrase={handleAddPhrase}
          onDeselectAll={scene.deselectAll}
          onAssignFonction={scene.assignFonction}
          onAssignNature={scene.assignNature}
          onManip={handleManip}
        />
        <Workspace
          tokens={scene.tokens}
          selectedIds={scene.selectedIds}
          options={scene.options}
          onSelect={scene.toggleSelection}
          onMove={scene.moveToken}
          onRemove={scene.removeToken}
          onOpenPictoModal={() => { /* wired in Task 24 */ }}
          onDeselectAll={scene.deselectAll}
        />
      </div>
      <BottomBar
        onExport={() => window.print()}
        onClear={handleClear}
        onFullscreen={handleFullscreen}
      />
      {substitutionOpen && (
        <SubstitutionPanel
          fonctionId={firstSelectedFonctionId}
          onPick={handlePronounPick}
          onClose={() => setSubstitutionOpen(false)}
        />
      )}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
