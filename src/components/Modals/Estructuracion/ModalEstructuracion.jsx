import React, { useEffect } from 'react';
import './ModalEstructuracion.css';

const ModalEstructuracion = ({ isOpen, onClose, project }) => {
  // Cierra el modal si se presiona la tecla Escape
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Estructuración del Proyecto</h2>
        </div>
        <div className="modal-body">
          <div className="modal-card">
            <h4>Resumen del proyecto</h4>
            <p>{project?.resumen || project?.descripcion || 'No definido.'}</p>
          </div>
          <div className="modal-card">
            <h4>Planteamiento del problema</h4>
            <p>{project?.problema || 'No definido.'}</p>
          </div>
          <div className="modal-card">
            <h4>Objetivo general</h4>
            <p>{project?.objetivo || 'No definido.'}</p>
          </div>
          <div className="modal-card">
            <h4>Objetivos específicos</h4>
            <p>{project?.objetivosEspecificos || 'No definidos.'}</p>
          </div>
          <div className="modal-card">
            <h4>Justificación</h4>
            <p>{project?.justificacion || 'No definida.'}</p>
          </div>
          <div className="modal-card">
            <h4>Metodología</h4> {/* Separated from Impactos */}
            <p>{project?.metodologia || 'No definida.'}</p>
          </div>
          <div className="modal-card">
            <h4>Impactos</h4> {/* New field */}
            <p>{project?.impactos || 'No definidos.'}</p>
          </div>
          <div className="modal-card">
            <h4>Alcance del proyecto</h4>
            <p>{project?.alcance || 'No definido.'}</p>
          </div>
          <div className="modal-card">
            <h4>Palabras Clave</h4> {/* New field */}
            <p>{project?.palabrasClave || 'No definidas.'}</p>
          </div>
          <div className="modal-card">
            <h4>Beneficiarios</h4> {/* New field */}
            <p>{project?.beneficiarios || 'No definidos.'}</p>
          </div>
          <div className="modal-card">
            <h4>Bibliografía</h4> {/* New field */}
            <p>{project?.bibliografia || 'No definida.'}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-close-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEstructuracion;
