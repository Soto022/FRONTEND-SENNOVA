// src/hooks/useProjects.js
import { useState, useEffect, useCallback } from 'react';
import { useAprendices } from './useAprendices';

// Opciones para los filtros, se mantienen para la funcionalidad de la UI.
const mockAprendicesOptions = ["1-2 aprendices", "3-4 aprendices", "5+ aprendices"];
const mockEstados = ["Todos", "En curso", "Completado", "Pendiente"];

// Función de utilidad para normalizar strings (ignora acentos, mayúsculas y espacios)
const normalizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const useProjects = () => {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('sennova_projects');
    // Si hay datos guardados, los usamos. Si no, inicializa como array vacío.
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [semilleros, setSemilleros] = useState(() => {
    const savedSemilleros = localStorage.getItem('sennova_semilleros');
    if (savedSemilleros) {
      const parsedSemilleros = JSON.parse(savedSemilleros);
      // Asegurarse de que los semilleros sean objetos con name y estado
      return parsedSemilleros.map(s => 
        typeof s === 'string' ? { name: s, estado: 'activo' } : { ...s, estado: s.estado || 'activo' }
      );
    }
    return [];
  });

  const { aprendices } = useAprendices();

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    nombre: '',
    semillero: 'Todos',
    aprendices: 'Todos',
    estado: 'Todos'
  });

  // Guardar proyectos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('sennova_projects', JSON.stringify(projects));
  }, [projects]);

  // Guardar semilleros en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('sennova_semilleros', JSON.stringify(semilleros));
  }, [semilleros]);

    // Cargar proye
    // ctos iniciales
    useEffect(() => {
        setFilteredProjects(projects);
      }, [projects]);

  // Aplicar filtros
  useEffect(() => {
    let result = projects;

    // Filtrar por nombre (compatible con 'name' y 'nombreProyecto')
    if (filters.nombre) {
      result = result.filter(project =>
        normalizeString(project.nombreProyecto || project.name).includes(normalizeString(filters.nombre))
      );
    }

    // Filtrar por semillero
    if (filters.semillero !== 'Todos') {
      result = result.filter(project =>
        normalizeString(project.semillero) === normalizeString(filters.semillero)
      );
    };

    // Filtrar por estado de semillero (si el semillero está inactivo, no mostrar sus proyectos)
    result = result.filter(project => {
      const associatedSemillero = semilleros.find(s => normalizeString(s.name) === normalizeString(project.semillero));
      return !associatedSemillero || associatedSemillero.estado === 'activo';
    });

    // Filtrar por aprendices
    

    // Filtrar por estado
    if (filters.estado !== 'Todos') {
      const estadoMap = {
        'En curso': 'en-curso',
        'Completado': 'completado',
        'Pendiente': 'pendiente'
      };
      result = result.filter(project =>
        project.estado === estadoMap[filters.estado]
      );
    }

    setFilteredProjects(result);
  }, [projects, filters, semilleros]);

  // Actualizar filtros
  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  // Crear semillero
  const createSemillero = useCallback((semilleroName) => {
    if (semilleroName) {
      setSemilleros(prev => {
        const normalizedNewSemilleroName = normalizeString(semilleroName);
        if (!prev.find(s => normalizeString(s.name) === normalizedNewSemilleroName)) {
          return [...prev, { name: semilleroName, estado: 'activo' }];
        }
        return prev;
      });
    }
  }, []);

  // Alternar estado de semillero (activo/inactivo)
  const toggleSemilleroEstado = useCallback((semilleroName) => {
    try {
      setSemilleros(prev => 
        prev.map(s => {
          if (normalizeString(s.name) === normalizeString(semilleroName)) {
            return { ...s, estado: s.estado === 'activo' ? 'inactivo' : 'activo' };
          }
          return s;
        })
      );
    } catch (error) {
      console.error("Error al alternar el estado del semillero:", error);
    }
  }, []);

  // Crear proyecto
  const createProject = useCallback((projectData) => {
    const normalizedNewProjectName = normalizeString(projectData.nombreProyecto);
    let newProject;

    setProjects(prev => {
      const isDuplicate = prev.some(project => normalizeString(project.nombreProyecto || project.name) === normalizedNewProjectName);
      if (isDuplicate) {
        console.warn('Intento de crear un proyecto duplicado:', projectData.nombreProyecto);
        return prev;
      }
      
      newProject = {
        id: Date.now(),
        ...projectData,
        progreso: 0,
        estado: 'en-curso'
      };
      
      return [...prev, newProject];
    });

    if (newProject) {
      return newProject;
    } else {
      return { error: 'Ya existe un proyecto con este nombre.' };
    }
  }, []);

  // Editar proyecto
  const updateProject = useCallback((id, updatedData) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id ? { ...project, ...updatedData } : project
      )
    );
  }, []);

  // Eliminar proyecto
  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  }, []);

  // Obtener opciones para filtros
  const getFilterOptions = useCallback(() => ({
    semilleros: ['Todos', ...semilleros.map(s => s.name)],
    aprendices: ['Todos', ...mockAprendicesOptions],
    estados: mockEstados
  }), [semilleros]);

  return {
    projects: filteredProjects,
    allProjects: projects,
    semilleros, // Exportar semilleros
    aprendices, // Exportar aprendices
    filters,
    updateFilter,
    createProject,
    updateProject,
    deleteProject,
    getFilterOptions,
    createSemillero, // Exportar nueva función
    toggleSemilleroEstado,
  };
};