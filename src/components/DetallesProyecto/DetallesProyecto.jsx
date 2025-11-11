import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../../hook/useProjects';
import { useAprendices } from '../../hook/useAprendices'; // Importar el hook de aprendices

import './DetallesProyecto.css';

import TarjetaProyecto from '../TarjetaProyecto/TarjetaProyecto';
import TablaAprendices from '../Tables/Aprendices/TablaAprendices';
import TablaInstructores from '../Tables/Instructores/TablaInstructores';
import TablaEvidencias from '../Tables/Evidencias/TablaEvidencias';
import ModalEstructuracion from '../Modals/Estructuracion/ModalEstructuracion';
import ModalCronograma from '../Modals/Cronograma/ModalCronograma';

const DetallesProyecto = () => {
  const { id } = useParams();
  const { allProjects } = useProjects();
  const { aprendices: allAprendices } = useAprendices(); // Obtener la lista global de aprendices
  const [isEstructuracionOpen, setEstructuracionOpen] = useState(false);
  const [isCronogramaOpen, setCronogramaOpen] = useState(false);

  // Encontrar el proyecto actual basado en el ID de la URL
  const project = allProjects.find(p => p.id === parseInt(id));

  // Si el proyecto no se encuentra, mostrar un mensaje
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

  // Usar los datos del proyecto encontrado en lugar de mockProject
  const projectData = {
    ...project,
    // Asegurarse de que los campos que espera TarjetaProyecto existan
    nombre: project.name || 'Sin nombre',
    lineaTecnologica: project.lineaTecnologica || 'No especificada',
    semillero: project.semillero || 'No asignado',
    lider: project.lider || 'No asignado',
    fechaInicio: project.fechaInicio || 'N/A',
    fechaFin: project.fechaFin || 'N/A',
    estado: project.estado || 'desconocido',
  };

  // Mapear los aprendices del proyecto para incluir su estado actual
  const aprendicesConEstadoActualizado = project.aprendices.map(projAprendiz => {
    const aprendizGlobal = allAprendices.find(a => a.id === projAprendiz.id);
    return {
      ...projAprendiz,
      estado: aprendizGlobal ? aprendizGlobal.estado : projAprendiz.estado // Usar el estado global si existe, sino el del proyecto
    };
  });

  return (
    <div className="detalles-proyecto-container">
      <header className="detalles-header">
        <h1>Detalles del proyecto</h1>
      </header>

      <main className="detalles-main-content">
        <TarjetaProyecto proyecto={projectData} />

        <div className="tablas-y-botones">
          <div className="tablas-container">
            <TablaAprendices aprendices={aprendicesConEstadoActualizado} /> {/* Pasar aprendices actualizados */}
          </div>
          <div className="botones-laterales">
            <button onClick={() => setCronogramaOpen(true)}>Ver cronograma del proyecto</button>
            <button onClick={() => setEstructuracionOpen(true)}>Ver estructuración del proyecto</button>
          </div>
        </div>

        <TablaInstructores instructores={project.instructores} />
        <TablaEvidencias />
      </main>



      <ModalEstructuracion 
        isOpen={isEstructuracionOpen} 
        onClose={() => setEstructuracionOpen(false)}
        project={project}
      />
      <ModalCronograma 
        isOpen={isCronogramaOpen} 
        onClose={() => setCronogramaOpen(false)}
        project={project}
      />
    </div>
  );
};

export default DetallesProyecto;
