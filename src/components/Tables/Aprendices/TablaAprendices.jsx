import React from 'react';
import './TablaAprendices.css';

const TablaAprendices = ({ aprendices }) => {
  const aprendicesData = aprendices || [];

  return (
    <div className="tabla-card">
      <h3>Aprendices vinculados</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Nombre del aprendiz</th>
            <th>Email</th>
            <th>Ficha</th>
            <th>Estado</th>
            <th>Fecha de inactivación</th>
          </tr>
        </thead>
        <tbody>
          {aprendicesData.length > 0 ? (
            aprendicesData.map((aprendiz) => (
              <tr key={aprendiz.id}>
                <td>{aprendiz.nombre}</td>
                <td>{aprendiz.email}</td>
                <td>{aprendiz.ficha}</td>
                <td>
                  <span className={`estado-aprendiz ${aprendiz.estado ? aprendiz.estado.toLowerCase() : 'desconocido'}`}>
                    {aprendiz.estado || 'Desconocido'}
                  </span>
                </td>
                <td>
                  {aprendiz.estado === 'Inactivo' && aprendiz.fechaInactivacion ? (aprendiz.fechaInactivacion) : ('-')}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay aprendices vinculados a este proyecto.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAprendices;
