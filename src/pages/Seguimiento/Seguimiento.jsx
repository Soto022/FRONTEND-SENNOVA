import React, { useState, useMemo } from 'react';
import { useProjects } from '../../hook/useProjects';
import SeguimientoTable from '../../components/Tables/SeguimientoTable/SeguimientoTable';
import ModalHacerSeguimiento from '../../components/Modals/HacerSeguimiento/ModalHacerSeguimiento';
import ModalVerActas from '../../components/Modals/VerActas/ModalVerActas';
import './Seguimiento.css';

const Seguimiento = () => {
  const { projects, updateProject } = useProjects();
  const [isHacerSeguimientoModalOpen, setIsHacerSeguimientoModalOpen] = useState(false);
  const [isVerActasModalOpen, setIsVerActasModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingActa, setEditingActa] = useState(null);
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
    setEditingActa(null);
    setIsHacerSeguimientoModalOpen(true);
  };

  const handleOpenEditModal = (acta, index) => {
    const project = projects.find(p => p.id === acta.proyectoId);
    setSelectedProject(project);
    setEditingActa({ acta, index });
    setIsHacerSeguimientoModalOpen(true);
    setIsVerActasModalOpen(false);
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

  const handleSaveActa = (actaData) => {
    try {
      const storedActas = localStorage.getItem('sennova_actas');
      const allActas = storedActas ? JSON.parse(storedActas) : {};
      const projectId = actaData.proyectoId;

      let projectActas = allActas[projectId] || [];

      if (editingActa !== null) {
        projectActas[editingActa.index] = actaData;
      } else {
        projectActas.push(actaData);
      }

      let nuevoProgresoTotal = projectActas.reduce((total, acta) => {
        return total + (parseFloat(acta.avancePorcentaje) || 0);
      }, 0);

      if (nuevoProgresoTotal > 100) {
        nuevoProgresoTotal = 100;
      }

      let estadoFinal = actaData.estadoProyecto;
      if (nuevoProgresoTotal >= 100) {
        estadoFinal = 'completado';
      }
      
      updateProject(projectId, {
        progreso: nuevoProgresoTotal,
        estado: estadoFinal
      });

      allActas[projectId] = projectActas;
      localStorage.setItem('sennova_actas', JSON.stringify(allActas));

      alert(editingActa ? 'Acta actualizada con éxito.' : 'Acta guardada con éxito.');

    } catch (error) {
      console.error('Error guardando el acta o actualizando el proyecto:', error);
      alert('Hubo un error al guardar los datos.');
    }

    handleCloseModals();
  };

  // --- INICIO MODIFICACIÓN: Lógica para eliminar acta y recalcular progreso ---
  const handleDeleteActa = (projectId, actaIndex) => {
    try {
        const storedActas = localStorage.getItem('sennova_actas');
        const allActas = storedActas ? JSON.parse(storedActas) : {};
        
        let projectActas = allActas[projectId] || [];
        const actaEliminada = projectActas[actaIndex];
        
        // Filtrar para eliminar el acta
        const updatedActas = projectActas.filter((_, index) => index !== actaIndex);

        // Recalcular el progreso total con las actas restantes
        let nuevoProgresoTotal = updatedActas.reduce((total, acta) => {
            return total + (parseFloat(acta.avancePorcentaje) || 0);
        }, 0);
        
        if (nuevoProgresoTotal > 100) {
            nuevoProgresoTotal = 100;
        }

        // Determinar el nuevo estado
        // Si el progreso baja de 100, el estado NO debe ser 'completado'
        let estadoFinal = projects.find(p => p.id === projectId)?.estado;
        if (nuevoProgresoTotal < 100 && estadoFinal === 'completado') {
            // Revertir a 'en-curso' o al estado del último acta si existe
            estadoFinal = updatedActas.length > 0 ? updatedActas[updatedActas.length - 1].estadoProyecto : 'en-curso';
        }

        // Actualizar el estado del proyecto
        updateProject(projectId, {
            progreso: nuevoProgresoTotal,
            estado: estadoFinal
        });

        // Actualizar localStorage
        allActas[projectId] = updatedActas;
        localStorage.setItem('sennova_actas', JSON.stringify(allActas));

        alert(`Acta No. ${actaEliminada.actaNo} eliminada con éxito.`);
        
        // Forzar un cierre y reapertura del modal para reflejar los cambios,
        // o simplemente cerrar si no quedan más actas.
        if (updatedActas.length === 0) {
            handleCloseModals();
        } else {
            // Esto es un truco para forzar la recarga de datos en el modal
            setIsVerActasModalOpen(false);
            setTimeout(() => setIsVerActasModalOpen(true), 50);
        }

    } catch (error) {
        console.error("Error al eliminar el acta:", error);
        alert('Hubo un error al eliminar el acta.');
    }
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
          onDelete={handleDeleteActa} // <-- Prop 'onDelete' pasada al modal
        />
      )}
    </div>
  );
};

export default Seguimiento;