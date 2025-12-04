import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../../hook/useProjects';
import { useInstructores } from '../../hook/useInstructores';
import ModalVerContenido from '../Modals/VerContenido/ModalVerContenido'; // Importar el modal de contenido

import './DetallesProyecto.css';

import TarjetaProyecto from '../TarjetaProyecto/TarjetaProyecto';
import TablaAprendices from '../Tables/Aprendices/TablaAprendices';
import TablaInstructores from '../Tables/Instructores/TablaInstructores';
import TablaEvidencias from '../Tables/Evidencias/TablaEvidencias';
import ModalEstructuracion from '../Modals/Estructuracion/ModalEstructuracion';
import ModalCronograma from '../Modals/Cronograma/ModalCronograma';

const DetallesProyecto = () => {
  const { id } = useParams();
  const { allProjects, aprendices: allAprendices, semilleros } = useProjects(); 
  const { instructores: allInstructores } = useInstructores();
  const [isEstructuracionOpen, setEstructuracionOpen] = useState(false);
  const [isCronogramaOpen, setCronogramaOpen] = useState(false);

  const [verContenidoOpen, setVerContenidoOpen] = useState(false); // Estado para el modal de contenido
  const [selectedEvidencia, setSelectedEvidencia] = useState(null); // Evidencia seleccionada para ver

  const project = allProjects.find(p => p.id === parseInt(id));

  if (!project) {
    return (
      <div className="detalles-proyecto-container">
        <header className="detalles-header">
          <h1>Error</h1>
        </header>
        <main className="detalles-main-content">
          <h2>Proyecto no encontrado</h2>
          <p>El proyecto que buscas no existe o ha sido eliminado.</p>
        </main>
      </div>
    );
  }

  // Find the current semillero name from the global state
  const currentSemillero = semilleros.find(s => s.nombre === project.semillero || s.id === project.semillero);
  const semilleroNombre = currentSemillero ? currentSemillero.nombre : project.semillero;

  const projectData = {
    ...project,
    nombre: project.nombreProyecto || 'Sin nombre',
    lineaTecnologica: project.lineaTecnologica || 'No especificada',
    semillero: semilleroNombre, // Use the resolved, up-to-date name
    lider: project.lider || 'No asignado',
    fechaInicio: project.fechaInicio || 'N/A',
    fechaFin: project.fechaFin || 'N/A',
    estado: project.estado || 'desconocido',
  };

  const aprendicesConEstadoActualizado = (project.aprendices || []).map(projAprendiz => {
    const aprendizGlobal = allAprendices.find(a => a.id === projAprendiz.id);
    // If the global apprentice is found, merge its data.
    // The global data (with an updated name, etc.) will overwrite the older data from projAprendiz.
    if (aprendizGlobal) {
      return { ...projAprendiz, ...aprendizGlobal };
    }
    // If for some reason the apprentice isn't in the global list, return the original data.
    return projAprendiz;
  });

  const instructoresConEstadoActualizado = (project.instructores || []).map(projInstructor => {
    const instructorGlobal = allInstructores.find(i => i.id === projInstructor.id);
    // If the global instructor is found, merge its data.
    // The global data (with an updated name, etc.) will overwrite the older data from projInstructor.
    if (instructorGlobal) {
      return { ...projInstructor, ...instructorGlobal };
    }
    // If for some reason the instructor isn't in the global list, return the original data.
    return projInstructor;
  });

  const evidenciasEnriquecidas = (project.evidencias || []).map(evidencia => ({
    ...evidencia,
    proyecto: evidencia.proyecto || project.nombreProyecto,
    semillero: projectData.semillero, // ALWAYS use the updated semillero name from projectData
  }));

  const handleViewEvidencia = (evidencia) => {
    if (evidencia.contenido) {
      setSelectedEvidencia(evidencia);
      setVerContenidoOpen(true);
    } else {
      alert(`La vista previa no está disponible para evidencias antiguas.`);
    }
  };

  const handleDownloadEvidencia = (evidencia) => {
    if (evidencia.contenido) {
      const link = document.createElement('a');
      link.href = evidencia.contenido;
      link.download = evidencia.archivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`La descarga no está disponible para evidencias antiguas.`);
    }
  };

  const handleCloseContenido = () => {
    setVerContenidoOpen(false);
    setSelectedEvidencia(null);
  };

  return (
    <>
      <div className="detalles-proyecto-container">
        <header className="detalles-header">
          <h1>Detalles del proyecto</h1>
        </header>

        <main className="detalles-main-content">
          <TarjetaProyecto proyecto={projectData} />

          <div className="tablas-y-botones">
            <div className="tablas-container">
              <TablaAprendices aprendices={aprendicesConEstadoActualizado} />
            </div>
            <div className="botones-laterales">
              <button 
                onClick={() => setCronogramaOpen(true)}
                disabled={!project.cronogramaFile}
                title={!project.cronogramaFile ? "Este proyecto no tiene un cronograma adjunto" : "Ver cronograma del proyecto"}
              >
                Ver cronograma del proyecto
              </button>
              <button onClick={() => setEstructuracionOpen(true)}>Ver estructuración del proyecto</button>
            </div>
          </div>

          <TablaInstructores instructores={instructoresConEstadoActualizado} />
          <TablaEvidencias 
            evidencias={evidenciasEnriquecidas} 
            onView={handleViewEvidencia} // Pasar la función de vista
            onDownload={handleDownloadEvidencia} // Pasar la función de descarga
          />
        </main>

        <ModalEstructuracion 
          isOpen={isEstructuracionOpen} 
          onClose={() => setEstructuracionOpen(false)}
          project={project}
        />
        <ModalCronograma 
          isOpen={isCronogramaOpen} 
          onClose={() => setCronogramaOpen(false)}
          cronogramaFile={project.cronogramaFile}
        />
      </div>

      {/* Modal para ver el contenido de la evidencia */}
      <ModalVerContenido
        isOpen={verContenidoOpen}
        onClose={handleCloseContenido}
        evidencia={selectedEvidencia}
      />
    </>
  );
};

export default DetallesProyecto;
