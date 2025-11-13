import { useState, useEffect, useCallback } from 'react';

export const useAprendices = () => {
  const [aprendices, setAprendices] = useState(() => {
    const savedAprendices = localStorage.getItem('appnova_aprendices');
    return savedAprendices ? JSON.parse(savedAprendices) : [];
  });

  useEffect(() => {
    localStorage.setItem('appnova_aprendices', JSON.stringify(aprendices));
  }, [aprendices]);

  const addAprendiz = useCallback((aprendizData) => {
    const normalizedNewDocumento = aprendizData.documento.trim().toLowerCase();
    setAprendices(prevAprendices => {
      const isDuplicate = prevAprendices.some(a => a.documento.trim().toLowerCase() === normalizedNewDocumento);
      if (isDuplicate) {
        alert('Ya existe un aprendiz con este número de documento.');
        return prevAprendices;
      }
      // Asignar un estado por defecto si no viene en los datos
      return [...prevAprendices, { 
        ...aprendizData, 
        id: Date.now(), 
        estado: aprendizData.estado || 'Activo', 
        proyectoAsignado: aprendizData.proyectoAsignado || '',
        fechaInactivacion: aprendizData.fechaInactivacion || '' // Asegurar inicialización
      }];
    });
  }, []);

  const updateAprendiz = useCallback((id, updatedData) => {
    setAprendices(prev => {
      // Solo verificar duplicados si el documento se está actualizando
      if (updatedData.documento) {
        const normalizedUpdatedDocumento = updatedData.documento.trim().toLowerCase();
        const isDuplicate = prev.some(a => 
          a.id !== id && a.documento.trim().toLowerCase() === normalizedUpdatedDocumento
        );
        if (isDuplicate) {
          alert('Ya existe otro aprendiz con este número de documento.');
          return prev;
        }
      }
      const newAprendices = prev.map(a => a.id === id ? { ...a, ...updatedData } : a);
      return newAprendices;
    });
  }, []);

  const deleteAprendiz = useCallback((id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este aprendiz?')) {
      setAprendices(prev => prev.filter(a => a.id !== id));
      return id; // Return the ID of the deleted apprentice
    }
    return null; // Return null if deletion was cancelled
  }, []);

  return {
    aprendices,
    addAprendiz,
    updateAprendiz,
    deleteAprendiz,
  };
};