import { useState, useEffect, useCallback } from 'react';

export const useInstructores = () => {
  const [instructores, setInstructores] = useState(() => {
    const savedInstructores = localStorage.getItem('appnova_instructores');
    // Si hay datos guardados, los usamos. Si no, inicializa como array vacío.
    return savedInstructores ? JSON.parse(savedInstructores) : [];
  });

  useEffect(() => {
    localStorage.setItem('appnova_instructores', JSON.stringify(instructores));
  }, [instructores]);

  const addInstructor = useCallback((instructorData) => {
    const normalizedNewEmail = instructorData.email.trim().toLowerCase();
    setInstructores(prev => {
      const isDuplicate = prev.some(i => i.email.trim().toLowerCase() === normalizedNewEmail);
      if (isDuplicate) {
        alert('Ya existe un instructor con este correo electrónico.');
        return prev;
      }
      return [...prev, { 
        ...instructorData, 
        id: Date.now(),
        estado: instructorData.estado || 'Activo', // Inicializar estado
        fechaInactivacion: instructorData.fechaInactivacion || '', // Inicializar fechaInactivacion
        proyectoAsignado: instructorData.proyectoAsignado || '' // Initialize proyectoAsignado
      }];
    });
  }, []);

  const updateInstructor = useCallback((id, updatedData) => {
    setInstructores(prev => {
      if (updatedData.email) {
        const normalizedUpdatedEmail = updatedData.email.trim().toLowerCase();
        const isDuplicate = prev.some(i => 
          i.id !== id && i.email.trim().toLowerCase() === normalizedUpdatedEmail
        );
        if (isDuplicate) {
          alert('Ya existe otro instructor con este correo electrónico.');
          return prev;
        }
      }
      return prev.map(i => i.id === id ? { ...i, ...updatedData } : i);
    });
  }, []);

  const deleteInstructor = useCallback((id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este instructor?')) {
      setInstructores(prev => prev.filter(i => i.id !== id));
      return id; // Return the ID of the deleted instructor
    }
    return null; // Return null if deletion was cancelled
  }, []);

  return {
    instructores,
    addInstructor,
    updateInstructor,
    deleteInstructor,
  };
};
