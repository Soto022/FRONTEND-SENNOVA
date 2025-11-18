import React from 'react';
import './TablaProyectosConEvidencias.css';

const TablaProyectosConEvidencias = ({ proyectos, onVerEvidencias }) => {
  return (
    <div className="tabla-proyectos-evidencias-container">
      <table className="tabla-proyectos-evidencias">
        <thead>
          <tr>
            <th>Nombre del Proyecto</th>
            <th>Semillero</th>
            <th>Evidencias</th>
            <th>Subido por</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.length > 0 ? (
            proyectos.map((proyecto) => (
              <tr key={proyecto.id}>
                <td data-label="Nombre del Proyecto">{proyecto.nombreProyecto}</td>
                <td data-label="Semillero">{proyecto.semillero}</td>
                <td data-label="Actividades (Evidencias)">{proyecto.evidencias?.length || 0}</td>
                <td data-label="Subido por">{proyecto.subidoPorUltimaEvidencia}</td>
                <td data-label="Acciones">
                  <button
                    className="btn-ver-evidencias"
                    onClick={() => onVerEvidencias(proyecto)}
                  >
                    Ver Evidencias
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results">
                No hay proyectos con evidencias para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProyectosConEvidencias;
