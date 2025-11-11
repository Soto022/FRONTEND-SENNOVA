// src/hooks/useProjects.js
import { useState, useEffect } from 'react';
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
     // Si hay datos guardados, los usamos. Si no, inicializa como array vacío.
    return savedSemilleros ? JSON.parse(savedSemilleros) : [];
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

    // Cargar proyectos iniciales
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
  }, [projects, filters]);

  // Actualizar filtros
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Crear semillero
  const createSemillero = (semilleroName) => {
    if (semilleroName && !semilleros.find(s => normalizeString(s) === normalizeString(semilleroName))) {
      setSemilleros(prev => [...prev, semilleroName]);
    }
  };

  // Eliminar semillero
  const deleteSemillero = (semilleroName) => {
    setSemilleros(prev => prev.filter(s => normalizeString(s) !== normalizeString(semilleroName)));
  };

  // Crear proyecto
  const createProject = (projectData) => {
    // Validar si ya existe un proyecto con el mismo nombre
    const normalizedNewProjectName = normalizeString(projectData.nombreProyecto);
    const isDuplicate = projects.some(project => normalizeString(project.nombreProyecto || project.name) === normalizedNewProjectName);

    if (isDuplicate) {
      console.warn('Intento de crear un proyecto duplicado:', projectData.nombreProyecto);
      return { error: 'Ya existe un proyecto con este nombre.' };
    }

    const newProject = {
      id: Date.now(),
      ...projectData,
      progreso: 0,
      estado: 'en-curso'
    };
    
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  // Editar proyecto
  const updateProject = (id, updatedData) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id ? { ...project, ...updatedData } : project
      )
    );
  };

  // Eliminar proyecto
  const deleteProject = (id) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  // Obtener opciones para filtros
  const getFilterOptions = () => ({
    semilleros: ['Todos', ...semilleros],
    aprendices: ['Todos', ...mockAprendicesOptions],
    estados: mockEstados
  });

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
    deleteSemillero,
  };
};