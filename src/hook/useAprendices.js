import { useState, useEffect } from 'react';

export const useAprendices = () => {
  const [aprendices, setAprendices] = useState(() => {
    const savedAprendices = localStorage.getItem('appnova_aprendices');
    return savedAprendices ? JSON.parse(savedAprendices) : [];
  });

  useEffect(() => {
    localStorage.setItem('appnova_aprendices', JSON.stringify(aprendices));
  }, [aprendices]);

  const addAprendiz = (aprendizData) => {
    const normalizedNewDocumento = aprendizData.documento.trim().toLowerCase();
    const isDuplicate = aprendices.some(a => a.documento.trim().toLowerCase() === normalizedNewDocumento);
    if (isDuplicate) {
      alert('Ya existe un aprendiz con este número de documento.');
      return;
    }
    // Asignar un estado por defecto si no viene en los datos
    setAprendices(prevAprendices => [...prevAprendices, { ...aprendizData, id: Date.now(), estado: aprendizData.estado || 'Activo', proyectoAsignado: aprendizData.proyectoAsignado || '' }]);
  };

  const updateAprendiz = (id, updatedData) => {
    const normalizedUpdatedDocumento = updatedData.documento.trim().toLowerCase();
    const isDuplicate = aprendices.some(a => 
      a.id !== id && a.documento.trim().toLowerCase() === normalizedUpdatedDocumento
    );
    if (isDuplicate) {
      alert('Ya existe otro aprendiz con este número de documento.');
      return;
    }
    setAprendices(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteAprendiz = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este aprendiz?')) {
      setAprendices(prev => prev.filter(a => a.id !== id));
      return id; // Return the ID of the deleted apprentice
    }
    return null; // Return null if deletion was cancelled
  };

  return {
    aprendices,
    addAprendiz,
    updateAprendiz,
    deleteAprendiz,
  };
};