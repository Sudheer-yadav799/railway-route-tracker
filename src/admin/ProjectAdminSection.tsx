import { useProjects } from "../hooks/useLayers";

import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal";
import { useDeleteProject } from "../hooks/useUserProjects";
import ProjectDeleteConfirmModal from "./ProjectActions";

const ProjectAdminSection = () => {

  const { data } = useProjects();
  const projects = data?.data || [];

  const deleteMutation = useDeleteProject();

  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

const deleteProject = () => {

  if (!deleteTarget) return;

  deleteMutation.mutate(deleteTarget.id, {
    onSuccess: () => {
      setDeleteTarget(null);
    }
  });

};

  return (

    <div className="project-admin-section">

      <div className="section-header">

        <h3>Project Administration</h3>

        <button
          className="create-project-btn"
          onClick={()=>setShowCreate(true)}
        >
          + Create Project
        </button>

      </div>

      {showCreate && (
        <CreateProjectModal
          onClose={()=>setShowCreate(false)}
        />
      )}

    

    </div>
  );
};

export default ProjectAdminSection;