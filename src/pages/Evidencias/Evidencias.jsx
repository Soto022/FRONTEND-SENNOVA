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
  const { allProjects, updateProject, semilleros } = useProjects(); // ADD semilleros here
  const { addEvidencia, deleteEvidencia } = useEvidencias(updateProject); // Obtener deleteEvidencia

  const [modalVerEvidenciasOpen, setModalVerEvidenciasOpen] = useState(false);
  const [modalSubirEvidenciaOpen, setModalSubirEvidenciaOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filesToUpload, setFilesToUpload] = useState([]); // State for files

  console.log('%c[Evidencias Render] filesToUpload:', 'color: orange;', filesToUpload);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFileChange = (e) => {
    console.log('%c[handleFileChange] Triggered', 'color: blue;', e.target.files);
    const newFiles = Array.from(e.target.files);
    console.log('[handleFileChange] New files selected:', newFiles);

    const filePromises = newFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            content: event.target.result, // Contenido en Base64
          });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(processedFiles => {
      console.log('[handleFileChange] Files processed:', processedFiles);
      setFilesToUpload(currentFiles => {
        console.log('%c[setFilesToUpload] currentFiles:', 'color: red;', currentFiles);
        const updatedFiles = [...currentFiles, ...processedFiles];
        console.log('%c[setFilesToUpload] updatedFiles:', 'color: green;', updatedFiles);
        return updatedFiles;
      });
    });

    e.target.value = null;
  };

  const proyectosConEvidencias = useMemo(() => {
    return allProjects
      .filter(p => p.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(proyecto => {
        const latestEvidence = (proyecto.evidencias || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        
        // Find the semillero object by its name/ID (assuming proyecto.semillero stores the name or ID)
        // Adjust this logic if proyecto.semillero stores an ID and semilleros are objects with {id, nombre}
        const currentSemillero = semilleros.find(s => s.nombre === proyecto.semillero || s.id === proyecto.semillero);
        const semilleroNombre = currentSemillero ? currentSemillero.nombre : proyecto.semillero;

        return {
          ...proyecto,
          semillero: semilleroNombre, // OVERWRITE with the updated name
          subidoPorUltimaEvidencia: latestEvidence ? latestEvidence.subidoPor : 'N/A',
        };
      });
  }, [allProjects, searchTerm, semilleros]); // ADD semilleros to dependency array

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
    setModalVerEvidenciasOpen(false); // Cierra el modal de ver evidencias
    setModalSubirEvidenciaOpen(true); // Abre el modal de subir evidencias
  };

  const handleCloseSubirEvidencia = () => {
    setModalSubirEvidenciaOpen(false);
    setSelectedProjectId(null); // Limpia el proyecto seleccionado
    setFilesToUpload([]); // Clear the files when closing the modal
  };

  const handleUpload = (evidenciaData) => {
    addEvidencia(evidenciaData.proyectoId, { ...evidenciaData, archivos: filesToUpload });
    alert('Evidencia subida con éxito');
    handleCloseSubirEvidencia();
  };

  const handleDeleteEvidencia = (proyectoId, evidenciaId) => {
    deleteEvidencia(proyectoId, evidenciaId);
    alert('Evidencia eliminada con éxito');
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
          onDeleteEvidencia={handleDeleteEvidencia}
        />
      )}

      {selectedProject && (
        <ModalSubirEvidencia
          isOpen={modalSubirEvidenciaOpen}
          onClose={handleCloseSubirEvidencia}
          proyecto={selectedProject}
          onUpload={handleUpload}
          archivos={filesToUpload}
          onFileChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default Evidencias;