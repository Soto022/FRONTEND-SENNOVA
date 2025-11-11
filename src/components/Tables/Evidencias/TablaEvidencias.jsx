import React from 'react';
import '../Aprendices/TablaAprendices.css'; // Reusing styles
import './TablaEvidencias.css';

const evidenciasData = [
  { id: 1, archivo: 'documento_fase1.pdf', actividad: 'Fase de análisis', subidoPor: 'Juan Martinez', fecha: '2025-03-15' },
  { id: 2, archivo: 'prototipo_v1.fig', actividad: 'Diseño de prototipo', subidoPor: 'Angelica Rodriguez', fecha: '2025-04-22' },
  { id: 3, archivo: 'codigo_fuente_sprint1.zip', actividad: 'Desarrollo Sprint 1', subidoPor: 'Carlos Perez', fecha: '2025-05-30' },
];

const TablaEvidencias = () => {
  return (
    <div className="tabla-card">
      <h3>Evidencias del proyecto</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Actividad</th>
            <th>Subido por</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {evidenciasData.map((evidencia) => (
            <tr key={evidencia.id}>
              <td>{evidencia.archivo}</td>
              <td>{evidencia.actividad}</td>
              <td>{evidencia.subidoPor}</td>
              <td>{evidencia.fecha}</td>
              <td>
                <button className="button-ver">Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEvidencias;
