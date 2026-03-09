import React from "react";
import { FaTrash } from "react-icons/fa";

interface Project {
  id: number;
  name: string;
}

interface Props {
  target: Project | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ProjectDeleteConfirmModal: React.FC<Props> = ({
  target,
  isDeleting,
  onConfirm,
  onCancel
}) => {

  if (!target) return null;

  return (

    <div className="modal-overlay" onClick={() => !isDeleting && onCancel()}>

      <div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="delete-icon-wrap">
          <FaTrash />
        </div>

        <h3>Delete Project</h3>

        <p>
          Are you sure you want to delete
          <strong> {target.name}</strong> ?
          <br />
          This action cannot be undone.
        </p>

        <div className="delete-actions">

          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            className="btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProjectDeleteConfirmModal;