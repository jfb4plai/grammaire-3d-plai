import { useEffect, useState } from 'react';
import { useScene } from './hooks/useScene';
import { useToast } from './hooks/useToast';
import { Header } from './components/Header';
import { Toolbox } from './components/Toolbox';
import { Workspace } from './components/Workspace';
import { BottomBar } from './components/BottomBar';
import { SubstitutionPanel } from './components/SubstitutionPanel';
import { ToastStack } from './components/ToastStack';
import { PictoModal } from './components/PictoModal';
import { TeacherPanel } from './components/TeacherPanel';
import { saveScene } from './lib/scenes';
import { isFullGroupSelected } from './lib/groups';
import type { SceneRecord } from './lib/types';

export default function App() {
  const scene = useScene();
  const { toasts, showToast, dismissToast } = useToast();
  const [substitutionOpen, setSubstitutionOpen] = useState(false);
  const [pictoModalTokenId, setPictoModalTokenId] = useState<string | null>(null);
  const pictoModalToken = pictoModalTokenId ? scene.tokens.find((t) => t.id === pictoModalTokenId) ?? null : null;
  const [teacherPanelOpen, setTeacherPanelOpen] = useState(false);
  const [sceneLibraryRefreshToken, setSceneLibraryRefreshToken] = useState(0);

  useEffect(() => {
    document.body.classList.toggle('tbi-mode', scene.options.tbiMode);
  }, [scene.options.tbiMode]);

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

  async function handleSaveScene(titre: string) {
    await saveScene(titre, { tokens: scene.tokens, options: scene.options });
    setSceneLibraryRefreshToken((n) => n + 1);
  }

  function handleLoadScene(record: SceneRecord) {
    scene.loadScene(record.data.tokens, record.data.options);
    setTeacherPanelOpen(false);
  }

  const firstSelectedId = Array.from(scene.selectedIds)[0];
  const firstSelectedFonctionId = firstSelectedId
    ? scene.tokens.find((t) => t.id === firstSelectedId)?.fonctionId ?? null
    : null;
  const showUngroup = isFullGroupSelected(scene.tokens, scene.selectedIds);

  return (
    <>
      <Header onOpenTeacherPanel={() => setTeacherPanelOpen(true)} />
      <div className="app-body">
        <Toolbox
          selectedCount={scene.selectedIds.size}
          manipEnabled={scene.options.manip}
          showUngroup={showUngroup}
          onAddPhrase={handleAddPhrase}
          onDeselectAll={scene.deselectAll}
          onAssignFonction={scene.assignFonction}
          onAssignNature={scene.assignNature}
          onManip={handleManip}
          onUngroup={scene.ungroupSelection}
        />
        <Workspace
          tokens={scene.tokens}
          selectedIds={scene.selectedIds}
          options={scene.options}
          onSelect={scene.toggleSelection}
          onMove={scene.moveToken}
          onRemove={scene.removeToken}
          onOpenPictoModal={setPictoModalTokenId}
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
      {pictoModalToken && (
        <PictoModal
          token={pictoModalToken}
          allowCustomImg={scene.options.customImg}
          onSelectPicto={(idx) => scene.selectPicto(pictoModalToken.id, idx)}
          onSelectCustomImg={(dataUrl) => scene.selectCustomImg(pictoModalToken.id, dataUrl)}
          onClose={() => setPictoModalTokenId(null)}
        />
      )}
      <TeacherPanel
        open={teacherPanelOpen}
        onClose={() => setTeacherPanelOpen(false)}
        options={scene.options}
        onOptionsChange={(next) => scene.setOptions(next)}
        onArasaacToggle={scene.enableArasaac}
        onSaveScene={handleSaveScene}
        onLoadScene={handleLoadScene}
        sceneLibraryRefreshToken={sceneLibraryRefreshToken}
      />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
