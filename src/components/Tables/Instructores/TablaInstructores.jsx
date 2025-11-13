import React from 'react';
// Se utiliza el mismo CSS que TablaAprendices para mantener la consistencia.
// Si se necesitan estilos específicos, se pueden añadir en TablaInstructores.css.
import '../Aprendices/TablaAprendices.css'; 
import './TablaInstructores.css';

const TablaInstructores = ({ instructores }) => {
  const instructoresData = instructores || [];

  return (
    <div className="tabla-card">
      <h3>Instructores participantes</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Nombre del instructor</th>
            <th>Contacto</th>
            <th>Rol</th>
            <th>Correo electrónico</th>
            <th>Estado</th> {/* Nueva columna */}
            <th>Fecha de inactivación</th> {/* Nueva columna */}
          </tr>
        </thead>
        <tbody>
          {instructoresData.length > 0 ? (
            instructoresData.map((instructor) => (
              <tr key={instructor.id}>
                <td>{instructor.nombre}</td>
                <td>{instructor.contacto}</td>
                <td>{instructor.rol}</td>
                <td>{instructor.email}</td>
                <td>
                  <span className={`estado-aprendiz ${instructor.estado ? instructor.estado.toLowerCase() : 'desconocido'}`}>
                    {instructor.estado || 'Desconocido'}
                  </span>
                </td> {/* Celda para el estado */}
                <td>
                  {instructor.estado === 'Inactivo' && instructor.fechaInactivacion ? (
                    instructor.fechaInactivacion
                  ) : (
                    '-'
                  )}
                </td> {/* Celda para la nueva columna */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No hay instructores vinculados a este proyecto.</td> {/* Colspan ajustado */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaInstructores;
