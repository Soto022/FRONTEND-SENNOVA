// src/pages/Evidencias/Evidencias.jsx
import React, { useState, useMemo } from 'react';
import { useProjects } from '../../hook/useProjects';
import TablaProyectosConEvidencias from '../../components/Tables/ProyectosConEvidencias/TablaProyectosConEvidencias';
import ModalVerEvidencias from '../../components/Modals/VerEvidencias/ModalVerEvidencias';
import ModalSubirEvidencia from '../../components/Modals/SubirEvidencia/ModalSubirEvidencia';
import { useEvidencias } from '../../hook/useEvidencias'; // Importar el nuevo hook
import './Evidencias.css';

const Evidencias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { allProjects, updateProject } = useProjects();
  const { addEvidencia } = useEvidencias(updateProject); // Inicializar useEvidencias con updateProject

  const [modalVerEvidenciasOpen, setModalVerEvidenciasOpen] = useState(false);
  const [modalSubirEvidenciaOpen, setModalSubirEvidenciaOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const proyectosConEvidencias = useMemo(() => {
    return allProjects
      .filter(p => p.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(proyecto => {
        // Encontrar la evidencia más reciente para obtener el "Subido por"
        const latestEvidence = (proyecto.evidencias || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        return {
          ...proyecto,
          subidoPorUltimaEvidencia: latestEvidence ? latestEvidence.subidoPor : 'N/A',
        };
      });
  }, [allProjects, searchTerm]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return allProjects.find(p => p.id === selectedProjectId);
  }, [allProjects, selectedProjectId]);

  const handleVerEvidencias = (proyecto) => {
    setSelectedProjectId(proyecto.id);
    setModalVerEvidenciasOpen(true);
  };

  const handleCloseVerEvidencias = () => {
    setModalVerEvidenciasOpen(false);
    setSelectedProjectId(null);
  };

  const handleOpenSubirEvidencia = () => {
    setModalSubirEvidenciaOpen(true);
  };

  const handleCloseSubirEvidencia = () => {
    setModalSubirEvidenciaOpen(false);
  };

  const handleUpload = (evidenciaData) => {
    addEvidencia(evidenciaData.proyectoId, evidenciaData); // Usar la función del nuevo hook
    alert('Evidencia subida con éxito');
  };

  return (
    <div className="evidencias-page">
      <div className="evidencias-header">
        <div>
          <h1 className="evidencias-title">Gestión de Evidencias</h1>
          <p className="evidencias-subtitle">
            Busca un proyecto y visualiza sus evidencias.
          </p>
        </div>
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
      
      <TablaProyectosConEvidencias
        proyectos={proyectosConEvidencias}
        onVerEvidencias={handleVerEvidencias}
      />

      {selectedProject && (
        <ModalVerEvidencias
          isOpen={modalVerEvidenciasOpen}
          onClose={handleCloseVerEvidencias}
          proyecto={selectedProject}
          onSubirEvidencia={handleOpenSubirEvidencia}
        />
      )}

      {selectedProject && (
        <ModalSubirEvidencia
          isOpen={modalSubirEvidenciaOpen}
          onClose={handleCloseSubirEvidencia}
          proyecto={selectedProject}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default Evidencias;