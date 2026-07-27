import type { ToastItem } from '../hooks/useToast';

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastStack({ toasts, onDismiss }: Props) {
  return (
    <div className="notif-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="notif">
          <span>{t.message}</span>
          {t.actionLabel && t.onAction && (
            <button
              type="button"
              className="notif-action"
              onClick={() => { t.onAction?.(); onDismiss(t.id); }}
            >
              {t.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
