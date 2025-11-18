import React from 'react';
import './TablaEvidencias.css'; // Asegúrate de que este CSS exista y sea relevante

const TablaEvidencias = ({ searchTerm = '', evidencias = [], onView, onDownload }) => {

  const filteredEvidencias = evidencias.filter((evidencia) =>
    (evidencia.archivo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="evidencias-table-container">
      <table className="evidencias-table">
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Actividad</th>
            <th>Proyecto</th>
            <th>Semillero</th>
            <th>Subido por</th>
            <th>Fecha de subida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvidencias.length > 0 ? (
            filteredEvidencias.map((evidencia, index) => (
              <tr key={evidencia.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td data-label="Archivo">{evidencia.archivo}</td>
                <td data-label="Actividad">{evidencia.actividad}</td>
                <td data-label="Proyecto">{evidencia.proyecto}</td>
                <td data-label="Semillero">{evidencia.semillero}</td>
                <td data-label="Subido por">{evidencia.subidoPor}</td>
                <td data-label="Fecha de subida">{evidencia.fecha}</td>
                <td data-label="Acciones" className="actions-cell">
                  <button
                    className="btn-ver"
                    onClick={() => onView(evidencia)}
                  >
                    Ver
                  </button>
                  <button
                    className="btn-descargar"
                    onClick={() => onDownload(evidencia)}
                  >
                    Descargar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-results">No se encontraron evidencias.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEvidencias;