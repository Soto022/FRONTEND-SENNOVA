import React, { useState } from 'react';
import { useProjects } from '../../hook/useProjects';
import ModalCronograma from '../../components/Modals/Cronograma/ModalCronograma';
import './Cronograma.css';

const Cronograma = () => {
  const { allProjects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const filteredProjects = allProjects.filter(project => {
    const projectName = project.nombreProyecto || project.name || '';
    return projectName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="cronograma-page">
        <div className="cronograma-header">
          <h1 className="cronograma-title">Tabla de cronogramas</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre de proyecto..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="cronograma-table-container">
          <table className="cronograma-table">
            <thead>
              <tr>
                <th>Nombre del proyecto</th>
                <th>Semillero</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <tr key={project.id}>
                    <td data-label="Nombre del proyecto">{project.nombreProyecto || project.name}</td>
                    <td data-label="Semillero">{project.semillero || 'N/A'}</td>
                    <td data-label="Acción">
                      <button 
                        className="btn-ver-cronograma"
                        onClick={() => handleOpenModal(project)}
                      >
                        Ver cronograma
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-results">No se encontraron proyectos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <ModalCronograma
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          project={selectedProject}
        />
      )}
    </>
  );
};

export default Cronograma;
