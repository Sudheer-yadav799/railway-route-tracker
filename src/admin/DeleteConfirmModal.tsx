// ─── DeleteConfirmModal.tsx ───────────────────────────────────────────────────
import React from "react";
import { FaTrash } from "react-icons/fa";
import { Layer } from "./LayerForm";

interface DeleteConfirmModalProps {
  target:       Layer | null;
  isDeleting:   boolean;
  isError:      boolean;
  errorMessage: string | undefined;
  onConfirm:    () => void;
  onCancel:     () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  target,
  isDeleting,
  isError,
  errorMessage,
  onConfirm,
  onCancel,
}) => {
  if (!target) return null;


   console.log("target",target)
  return (
    <div className="modal-overlay" onClick={() => { if (!isDeleting) onCancel(); }}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>

        <div className="delete-icon-wrap"><FaTrash /></div>
        <h3>Delete Layer</h3>
        <p>
          Are you sure you want to delete <strong>{target.name}</strong>?
          This action cannot be undone.
        </p>

        {isError && (
          <p className="form-error">
            {errorMessage ?? "Delete failed. Please try again."}
          </p>
        )}

        <div className="delete-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;