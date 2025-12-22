// src/components/Tables/SeguimientoTable/SeguimientoTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../Table/Table';
import './SeguimientoTable.css';

const SeguimientoTable = ({ projects, onHacerSeguimiento, onVerActas }) => {
  const headers = [
    'Proyecto',
    'Semillero',
    'Aprendices',
    'Progreso',
    'Estado',
    'Acciones',
  ];

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
        {(() => {
          const count = project.aprendices ? project.aprendices.length : 0;
          return count === 1 ? '1 aprendiz' : `${count} aprendices`;
        })()}
      </td>
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
        <button
          className="action-button action-button--view"
          onClick={() => onVerActas(project)}
          aria-label="Ver actas del proyecto"
        >
          👁️
        </button>
        <button
          className={`action-button action-button--follow-up ${project.progreso >= 100 ? 'action-button--disabled' : ''}`}
          onClick={() => onHacerSeguimiento(project)}
          disabled={project.progreso >= 100}
          aria-label="Hacer seguimiento al proyecto"
        >
          📝
        </button>
      </td>
    </tr>
  );

  return <Table headers={headers} data={projects} renderRow={renderRow} />;
};

export default SeguimientoTable;
