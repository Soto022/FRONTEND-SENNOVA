// src/hook/useEvidencias.js
import { useCallback } from 'react';

export const useEvidencias = (updateProject) => { // Recibe updateProject de useProjects
  const addEvidencia = useCallback((projectId, evidenciaData) => {
    updateProject(projectId, (prevProject) => {
      const nuevasEvidencias = evidenciaData.archivos.map(archivo => ({
        id: Date.now() + Math.random(),
        archivo: archivo.name,
        contenido: archivo.content, // Guardar el contenido Base64
        actividad: evidenciaData.actividad,
        proyecto: prevProject.nombreProyecto,
        semillero: prevProject.semillero,
        subidoPor: 'Usuario Actual', // Esto podría venir de un contexto de usuario
        fecha: new Date().toISOString().split('T')[0],
      }));
      return {
        ...prevProject,
        evidencias: [...(prevProject.evidencias || []), ...nuevasEvidencias],
      };
    });
  }, [updateProject]);

  const deleteEvidencia = useCallback((projectId, evidenciaId) => {
    updateProject(projectId, (prevProject) => {
      return {
        ...prevProject,
        evidencias: (prevProject.evidencias || []).filter(e => e.id !== evidenciaId),
      };
    });
  }, [updateProject]);

  return {
    addEvidencia,
    deleteEvidencia,
  };
};
1