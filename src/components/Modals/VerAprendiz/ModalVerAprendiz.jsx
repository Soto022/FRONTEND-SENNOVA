import React from 'react';
import './ModalVerAprendiz.css';

const ModalVerAprendiz = ({ isOpen, onClose, aprendiz }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-ver-overlay">
      <div className="modal-ver-container">
        <h2 className="modal-ver-title">INFORMACIÓN DEL APRENDIZ</h2>
        <div className="aprendiz-card">
          <div className="aprendiz-card-body">
            <div className="aprendiz-info-item">
              <span className="label">NOMBRE COMPLETO:</span>
              <span className="value">{aprendiz.nombre}</span>
            </div>
            <div className="aprendiz-info-item">
              <span className="label">Documento:</span>
              <span className="value">{aprendiz.documento}</span>
            </div>
            <div className="aprendiz-info-item">
              <span className="label">NÚMERO DE FICHA:</span>
              <span className="value">{aprendiz.ficha}</span>
            </div>
            <div className="aprendiz-info-item">
              <span className="label">ESTADO:</span>
              <span className={`status-capsule ${aprendiz.estado === 'Activo' ? 'active' : 'inactive'}`}>
                {aprendiz.estado}
              </span>
            </div>
            <div className="aprendiz-info-item">
              <span className="label">CORREO ELECTRÓNICO:</span>
              <span className="value">{aprendiz.email}</span>
            </div>
             <div className="aprendiz-info-item">
              <span className="label">Programa:</span>
              <span className="value">{aprendiz.programa}</span>
            </div>
            <div className="aprendiz-info-item">
              <span className="label">CONTACTO:</span>
              <span className="value">{aprendiz.telefono}</span>
            </div>
            <div className="aprendiz-info-item"> {/* Re-added Proyecto Asignado */}
              <span className="label">PROYECTO ASIGNADO:</span>
              <span className="value">{aprendiz.proyectoAsignado || 'No asignado'}</span>
            </div>
            <hr className="card-separator" />
            <div className="aprendiz-dates">
              <div className="date-item">
                <span>🗓️</span>
                <span className="label">FECHA DE INGRESO:</span>
                <span className="value">{aprendiz.fechaInicio}</span>
              </div>
              <div className="date-item">
                <span>🗓️</span>
                <span className="label">FECHA DE RETIRO:</span>
                <span className="value">{aprendiz.fechaRetiro || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalVerAprendiz;
