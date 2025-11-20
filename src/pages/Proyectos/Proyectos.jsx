// pages/Proyectos/Proyectos.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Proyectos.css';
import ProjectTable from '../../components/Tables/ProjectTable/ProjectTable.jsx';
import Button from '../../components/Button/Button.jsx';
import { useProjects } from '../../hook/useProjects';
import { useEvidencias } from '../../hook/useEvidencias'; // Importar el hook de evidencias
import CrearProyectoModal from '../../components/Modals/CrearProyecto/CrearProyectoModal.jsx';
import UploadEvidenciaModal from '../../components/Modals/UploadEvidencia/UploadEvidenciaModal.jsx';

const Proyectos = () => {
  const {
    projects,
    filters,
    updateFilter,
    createProject,
    updateProject,
    deleteProject,
    getFilterOptions,
    semilleros,
    aprendices,
  } = useProjects();

  const { addEvidencia } = useEvidencias(updateProject); // Inicializar el hook de evidencias

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchParams] = useSearchParams();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);

  useEffect(() => {
    const semilleroParam = searchParams.get('semillero');
    if (semilleroParam) {
      updateFilter('semillero', semilleroParam);
    }
  }, [searchParams, updateFilter]);

  const filterOptions = getFilterOptions();

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      deleteProject(id);
    }
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      const result = createProject(projectData);
      if (result && result.error) {
        alert(result.error);
        return;
      }
    }
    setIsModalOpen(false);
  };

  const handleFilterChange = (filterName, value) => {
    updateFilter(filterName, value);
  };

  const clearFilters = () => {
    updateFilter('nombre', '');
    updateFilter('semillero', 'Todos');
    updateFilter('aprendices', 'Todos');
    updateFilter('estado', 'Todos');
  };

  const openUploadModal = (proyecto) => {
    setSelectedProyecto(proyecto);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedProyecto(null);
  };

  // Lógica para manejar la subida de la evidencia
  const handleUploadEvidencia = (evidenciaData) => {
    addEvidencia(evidenciaData.proyectoId, evidenciaData); // Usar la función correcta
    alert(`Evidencia(s) para la actividad "${evidenciaData.actividad}" subidas con éxito.`);
    closeUploadModal(); // Cerrar el modal después de subir
  };

  return (
    <div className="proyectos">
      <div className="proyectos__header">
        <div className="proyectos__title-section">
          <h1 className="proyectos__title">Gestión de Proyectos</h1>
        </div>
        
        <div className="proyectos__actions">
          <Button 
            variant="primary" 
            size="medium" 
            icon="+"
            onClick={handleCreateProject}
          >
            Crear proyecto
          </Button>
        </div>
      </div>
      
      <div className="proyectos__filters">
        <div className="filter-group">
          <label className="filter-group__label">Nombre del proyecto</label>
          <input
            type="text"
            className="filter-group__input"
            placeholder="Buscar proyecto..."
            value={filters.nombre}
            onChange={(e) => handleFilterChange('nombre', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-group__label">Semillero</label>
          <select
            className="filter-group__select"
            value={filters.semillero}
            onChange={(e) => handleFilterChange('semillero', e.target.value)}
          >
            {filterOptions.semilleros.map(semillero => (
              <option key={semillero} value={semillero}>
                {semillero}
              </option>
            ))}
          </select>
        </div>
      

        <div className="filter-group">
          <label className="filter-group__label">Estado</label>
          <select
            className="filter-group__select"
            value={filters.estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
          >
            {filterOptions.estados.map(estado => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-group__label">&nbsp;</label>
          <Button
            variant="secondary"
            size="medium"
            onClick={clearFilters}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="proyectos__results">
        <p className="results__count">
          Mostrando {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="proyectos__content">
        <ProjectTable 
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onUploadClick={openUploadModal}
        />
      </div>

      <CrearProyectoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        semilleros={semilleros} 
        aprendices={aprendices}
        projectToEdit={editingProject}
      />

      {selectedProyecto && (
        <UploadEvidenciaModal
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
          proyecto={selectedProyecto}
          onUpload={handleUploadEvidencia}
        />
      )}
    </div>
  );
};

export default Proyectos;
