// src/hooks/useProjects.js
import { useState, useEffect, useCallback } from 'react';
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
      estado: s.estado ?? 'activo'    // ✔ CORREGIDO: respetar estado real
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
    localStorage.setItem('sennova_projects', JSON.stringify(projects));
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

    // Por nombre
    if (filters.nombre) {
      result = result.filter(project =>
        normalizeString(project.nombreProyecto).includes(normalizeString(filters.nombre))
      );
    }

    // Por semillero
    if (filters.semillero !== 'Todos') {
      result = result.filter(project =>
        normalizeString(project.semillero) === normalizeString(filters.semillero)
      );
    }

    // Ocultar proyectos de semilleros inactivos
    result = result.filter(project => {
      const s = semilleros.find(
        sem => normalizeString(sem.nombre) === normalizeString(project.semillero)
      );
      return !s || s.estado === "activo";
    });

    // Por estado
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

      return [
        ...prev,
        {
          id: Date.now(),
          nombre,
          estado: "activo"
        }
      ];
    });
  }, []);

  // === ACTIVAR / INACTIVAR SEMILLERO ===
  const toggleSemilleroEstado = useCallback((nombre) => {
    console.log('toggleSemilleroEstado - Nombre recibido:', nombre);
    setSemilleros(prev => {
      console.log('toggleSemilleroEstado - Estado previo:', prev);
      const next = prev.map(s =>
        normalizeString(s.nombre) === normalizeString(nombre)
          ? { ...s, estado: s.estado === 'activo' ? 'inactivo' : 'activo' }
          : s
      );
      console.log('toggleSemilleroEstado - Estado siguiente:', next);
      return next;
    });
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
        estado: "en-curso"
      };

      return [...prev, newProject];
    });

    return newProject;
  }, []);

  const updateProject = useCallback((id, updatedData) => {
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, ...updatedData } : p)
    );
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  // === OPCIONES DE FILTROS ===
  const getFilterOptions = useCallback(() => ({
    semilleros: ["Todos", ...semilleros.map(s => s.nombre)],
    aprendices: ["Todos", ...mockAprendicesOptions],
    estados: mockEstados
  }), [semilleros]);

  return {
    projects: filteredProjects,
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
