import { IconTrash } from "@tabler/icons-react";

interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-desc">{description}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={isLoading}>
            <IconTrash size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
