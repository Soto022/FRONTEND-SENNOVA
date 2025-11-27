import React, { useState, useMemo } from 'react';
// --- INICIO MODIFICACIÓN: Importar 'updateProject' desde el hook ---
import { useProjects } from '../../hook/useProjects';
// --- FIN MODIFICACIÓN ---
import SeguimientoTable from '../../components/Tables/SeguimientoTable/SeguimientoTable';
import ModalHacerSeguimiento from '../../components/Modals/HacerSeguimiento/ModalHacerSeguimiento';
import ModalVerActas from '../../components/Modals/VerActas/ModalVerActas';
import './Seguimiento.css';

const Seguimiento = () => {
  // --- INICIO MODIFICACIÓN: Obtener 'updateProject' del hook ---
  const { projects, updateProject } = useProjects();
  // --- FIN MODIFICACIÓN ---
  const [isHacerSeguimientoModalOpen, setIsHacerSeguimientoModalOpen] = useState(false);
  const [isVerActasModalOpen, setIsVerActasModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingActa, setEditingActa] = useState(null); // Will store {acta, index}
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = useMemo(() => {
    if (!searchTerm) {
      return projects;
    }
    return projects.filter(project =>
      project.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleOpenCreateModal = (proyecto) => {
    setSelectedProject(proyecto);
    setEditingActa(null); // Ensure we are in "create" mode
    setIsHacerSeguimientoModalOpen(true);
  };

  const handleOpenEditModal = (acta, index) => {
    // Find the project associated with the acta
    const project = projects.find(p => p.id === acta.proyectoId);
    setSelectedProject(project);
    setEditingActa({ acta, index });
    setIsHacerSeguimientoModalOpen(true);
    setIsVerActasModalOpen(false); // Close the "Ver Actas" modal
  };

  const handleOpenVerActasModal = (proyecto) => {
    setSelectedProject(proyecto);
    setIsVerActasModalOpen(true);
  };

  const handleCloseModals = () => {
    setSelectedProject(null);
    setEditingActa(null);
    setIsHacerSeguimientoModalOpen(false);
    setIsVerActasModalOpen(false);
  };

  // --- INICIO MODIFICACIÓN: Lógica de guardado de acta y actualización de proyecto ---
  const handleSaveActa = (actaData) => {
    console.log('Guardando acta:', actaData);

    try {
      // Paso 1: Guardar el acta en localStorage (lógica existente)
      const storedActas = localStorage.getItem('sennova_actas');
      const actas = storedActas ? JSON.parse(storedActas) : {};

      const projectId = actaData.proyectoId;
      if (!actas[projectId]) {
        actas[projectId] = [];
      }

      if (editingActa !== null) {
        // Update existing acta
        actas[projectId][editingActa.index] = actaData;
        alert('Acta actualizada con éxito.');
      } else {
        // Add new acta
        actas[projectId].push(actaData);
        alert('Acta guardada con éxito.');
      }

      localStorage.setItem('sennova_actas', JSON.stringify(actas));

      // Paso 2: Actualizar el proyecto correspondiente (nueva lógica)
      // Se extraen los valores del formulario de acta
      const { avancePorcentaje, estadoProyecto } = actaData;
      
      // Se llama a la función del hook para actualizar el proyecto
      updateProject(projectId, {
        progreso: avancePorcentaje,
        estado: estadoProyecto
      });
      console.log(`Proyecto ${projectId} actualizado con: Progreso ${avancePorcentaje}%, Estado ${estadoProyecto}`);


    } catch (error) {
      console.error('Error guardando el acta o actualizando el proyecto:', error);
      alert('Hubo un error al guardar los datos.');
    }

    handleCloseModals();
  };
  // --- FIN MODIFICACIÓN ---

  return (
    <div className="page-container seguimiento-page">
      <div className="seguimiento-header">
        <h1 className="page-title">Seguimiento de Proyectos</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre del proyecto..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="seguimiento-results">
        <p className="results-count">
          Mostrando {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} en total.
        </p>
      </div>

      <div className="seguimiento-content">
        <SeguimientoTable
          projects={filteredProjects}
          onHacerSeguimiento={handleOpenCreateModal}
          onVerActas={handleOpenVerActasModal}
        />
      </div>

      {isHacerSeguimientoModalOpen && (
        <ModalHacerSeguimiento
          isOpen={isHacerSeguimientoModalOpen}
          onClose={handleCloseModals}
          proyecto={selectedProject}
          onSave={handleSaveActa}
          actaToEdit={editingActa ? editingActa.acta : null}
        />
      )}

      {isVerActasModalOpen && (
        <ModalVerActas
          isOpen={isVerActasModalOpen}
          onClose={handleCloseModals}
          proyecto={selectedProject}
          onEdit={handleOpenEditModal}
        />
      )}
    </div>
  );
};

export default Seguimiento;