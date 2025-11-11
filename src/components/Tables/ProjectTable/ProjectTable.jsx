import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../Table/Table';

const ProjectTable = ({ projects, onEdit, onDelete }) => {
  const headers = [
    'Proyecto',
    'Semillero',
    'Aprendices',
    'Fecha inicio',
    'Progreso',
    'Estado',
    'Acciones',
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      'en-curso': { class: 'status--in-progress', text: 'En curso' },
      'completado': { class: 'status--completed', text: 'Completado' },
      'pendiente': { class: 'status--pending', text: 'Pendiente' },
    };

    const config = statusConfig[estado] || statusConfig['pendiente'];

    return <span className={`status ${config.class}`}>{config.text}</span>;
  };

  const renderRow = (project) => (
    <tr key={project.id} className="table__row">
      <td className="table__cell">{project.nombreProyecto || project.name}</td>
      <td className="table__cell">{project.semillero}</td>
      <td className="table__cell">
        {project.aprendices && project.aprendices.length > 0
          ? project.aprendices.map(a => a.nombre).join(', ')
          : 'N/A'}
      </td>
      <td className="table__cell">{formatDate(project.fechaInicio)}</td>
      <td className="table__cell">
        <div className="progress">
          <div className="progress__bar">
            <div
              className="progress__fill"
              style={{ width: `${project.progreso}%` }}
            ></div>
          </div>
          <span className="progress__text">{project.progreso}%</span>
        </div>
      </td>
      <td className="table__cell">{getStatusBadge(project.estado)}</td>
      <td className="table__cell">
        <Link
          to={`/detalles-proyecto/${project.id}`}
          className="action-button action-button--view"
          aria-label="Ver detalles del proyecto"
        >
          👁️
        </Link>
        <button
          className="action-button action-button--edit"
          onClick={() => onEdit(project)}
          aria-label="Editar proyecto"
        >
          ✏️
        </button>
        <button
          className="action-button action-button--delete"
          onClick={() => onDelete(project.id)}
          aria-label="Eliminar proyecto"
        >
          🗑️
        </button>
      </td>
    </tr>
  );

  return <Table headers={headers} data={projects} renderRow={renderRow} />;
};

export default ProjectTable;