interface Props {
  onOpenTeacherPanel: () => void;
}

export function Header({ onOpenTeacherPanel }: Props) {
  return (
    <header>
      <img className="logo" src="/PLAI.jpg" alt="Logo PLAI" />
      <h1>Grammaire 3D Interactive</h1>
      <button type="button" className="btn-teacher" onClick={onOpenTeacherPanel}>Mode Enseignant</button>
    </header>
  );
}
