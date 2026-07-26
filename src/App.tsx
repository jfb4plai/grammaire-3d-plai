import { useScene } from './hooks/useScene';
import { Header } from './components/Header';
import { Toolbox } from './components/Toolbox';
import { Workspace } from './components/Workspace';
import { BottomBar } from './components/BottomBar';

export default function App() {
  const scene = useScene();

  function handleAddPhrase(phrase: string) {
    const workspaceEl = document.getElementById('workspace');
    const size = workspaceEl
      ? { x: workspaceEl.clientWidth, y: workspaceEl.clientHeight }
      : { x: 1000, y: 600 };
    scene.addTokensFromPhrase(phrase, size);
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
          onManip={() => { /* wired in Task 19 */ }}
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
    </>
  );
}
