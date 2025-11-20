// src/hooks/useProjects.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAprendices } from './useAprendices';

const mockAprendicesOptions = ["1-2 aprendices", "3-4 aprendices", "5+ aprendices"];
const mockEstados = ["Todos", "En curso", "Completado", "Pendiente"];

// Normalizar strings
const normalizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const useProjects = () => {
  // === PROYECTOS ===
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('sennova_projects');
    console.log('HOOK INICIALIZADO: Proyectos leídos de localStorage:', savedProjects ? JSON.parse(savedProjects) : 'Nada.');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  // === SEMILLEROS ===
  const [semilleros, setSemilleros] = useState(() => {
    const saved = localStorage.getItem('sennova_semilleros');
    if (!saved) return [];
    const parsed = JSON.parse(saved);

    return parsed.map(s => ({
      id: s.id ?? Date.now() + Math.random(), 
      nombre: String(s.nombre ?? s.name ?? 'Semillero sin nombre').trim(),
      estado: s.estado ?? 'activo'
    }));
  });

  const { aprendices } = useAprendices();

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    nombre: '',
    semillero: 'Todos',
    aprendices: 'Todos',
    estado: 'Todos'
  });

  // Guardar
  useEffect(() => {
    try {
      localStorage.setItem('sennova_projects', JSON.stringify(projects));
    } catch (e) {
      console.error("Error guardando en localStorage:", e);
      alert("No se pudieron guardar los cambios. El almacenamiento local podría estar lleno.");
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('sennova_semilleros', JSON.stringify(semilleros));
  }, [semilleros]);

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // === FILTROS ===
  useEffect(() => {
    let result = projects;

    if (filters.nombre) {
      result = result.filter(project =>
        normalizeString(project.nombreProyecto).includes(normalizeString(filters.nombre))
      );
    }

    if (filters.semillero !== 'Todos') {
      result = result.filter(project =>
        normalizeString(project.semillero) === normalizeString(filters.semillero)
      );
    }

    result = result.filter(project => {
      const s = semilleros.find(
        sem => normalizeString(sem.nombre) === normalizeString(project.semillero)
      );
      return !s || s.estado === "activo";
    });

    if (filters.estado !== 'Todos') {
      const estadoMap = {
        'En curso': 'en-curso',
        'Completado': 'completado',
        'Pendiente': 'pendiente'
      };
      result = result.filter(p => p.estado === estadoMap[filters.estado]);
    }

    setFilteredProjects(result);
  }, [projects, filters, semilleros]);

  // === ACTUALIZAR FILTRO ===
  const updateFilter = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  // === CREAR SEMILLERO ===
  const createSemillero = useCallback((nombre) => {
    if (!nombre) return;
    const normalized = normalizeString(nombre);
    setSemilleros(prev => {
      if (prev.some(s => normalizeString(s.nombre) === normalized)) return prev;
      return [...prev, { id: Date.now(), nombre, estado: "activo" }];
    });
  }, []);

  // === ACTIVAR / INACTIVAR SEMILLERO ===
  const toggleSemilleroEstado = useCallback((nombre) => {
    setSemilleros(prev =>
      prev.map(s =>
        normalizeString(s.nombre) === normalizeString(nombre)
          ? { ...s, estado: s.estado === 'activo' ? 'inactivo' : 'activo' }
          : s
      )
    );
  }, []);

  // === CRUD PROYECTOS ===
  const createProject = useCallback((data) => {
    const normalized = normalizeString(data.nombreProyecto);
    let newProject;
    setProjects(prev => {
      if (prev.some(p => normalizeString(p.nombreProyecto) === normalized)) {
        return prev;
      }
      newProject = {
        id: Date.now(),
        ...data,
        progreso: 0,
        estado: "en-curso",
        evidencias: [],
      };
      return [...prev, newProject];
    });
    return newProject;
  }, []);

  const updateProject = useCallback((id, updatedData) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          // Si updatedData es una función, la llamamos con el proyecto actual
          return typeof updatedData === 'function' ? updatedData(p) : { ...p, ...updatedData };
        }
        return p;
      })
    );
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  // === OPCIONES DE FILTROS ===
  const getFilterOptions = useCallback(() => ({
    semilleros: ["Todos", ...semilleros.filter(s => s.estado === 'activo').map(s => s.nombre)],
    aprendices: ["Todos", ...mockAprendicesOptions],
    estados: mockEstados // Incluir los estados aquí
  }), [semilleros]);

  const projectsWithUpdatedAprendices = useMemo(() => {
    return filteredProjects.map(project => {
      if (!project.aprendices || project.aprendices.length === 0) {
        return project;
      }
      const updatedProjectAprendices = project.aprendices.map(pa => {
        const currentAprendiz = aprendices.find(a => a.id === pa.id);
        // Si el aprendiz global existe, actualiza el estado del aprendiz en el proyecto
        // De lo contrario, mantiene el estado existente en el proyecto
        return currentAprendiz ? { ...pa, estado: currentAprendiz.estado } : pa;
      });
      return { ...project, aprendices: updatedProjectAprendices };
    });
  }, [filteredProjects, aprendices]); // Depende de filteredProjects y del estado global de aprendices

  return {
    projects: projectsWithUpdatedAprendices, // Devolver los proyectos actualizados
    allProjects: projects,
    semilleros,
    aprendices,
    filters,
    updateFilter,
    createProject,
    updateProject,
    deleteProject,
    getFilterOptions,
    createSemillero,
    toggleSemilleroEstado,
  };
};

