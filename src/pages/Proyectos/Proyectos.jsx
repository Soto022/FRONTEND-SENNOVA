// pages/Proyectos/Proyectos.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Proyectos.css';
import ProjectTable from '../../components/Tables/ProjectTable/ProjectTable.jsx';
import Button from '../../components/Button/Button.jsx';
import { useProjects } from '../../hook/useProjects';
import CrearProyectoModal from '../../components/Modals/CrearProyecto/CrearProyectoModal.jsx';

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
    aprendices
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const semilleroParam = searchParams.get('semillero');
    if (semilleroParam) {
      updateFilter('semillero', semilleroParam);
    }
  }, [searchParams, updateFilter]);

  const filterOptions = getFilterOptions();

  // Transforma la lista de semilleros (strings) a un formato de objeto para el modal
  const semillerosForModal = semilleros.map((nombre, index) => ({
    id: index + 1, // Se usa el índice como ID para el key
    nombre: nombre
  }));

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
        alert(result.error); // Mostrar el error al usuario
        return; // No cerrar el modal si hay un error
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
      
      {/* Filtros funcionales */}
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

      {/* Contador de resultados */}
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
        />
      </div>

      {/* Renderizar el modal */}
      <CrearProyectoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        semilleros={semillerosForModal}
        aprendices={aprendices}
        projectToEdit={editingProject}
      />
    </div>
  );
};

export default Proyectos;
