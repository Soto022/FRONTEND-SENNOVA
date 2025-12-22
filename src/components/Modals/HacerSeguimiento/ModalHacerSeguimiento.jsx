// src/components/Modals/HacerSeguimiento/ModalHacerSeguimiento.jsx
import React from 'react';
import FormularioActa from './FormularioActa';
import './ModalHacerSeguimiento.css';

const ModalHacerSeguimiento = ({ isOpen, onClose, proyecto, onSave, actaToEdit }) => { 
  if (!isOpen) {
    return null;
  }

  const actaTitle = proyecto ? `Acta de Seguimiento - ${proyecto.nombreProyecto}` : 'Acta de Seguimiento';

  return (
    <div className="modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
            <h2>{actaTitle}</h2>
        </div>
        <div className="modal-content">
          {proyecto ? (
            <FormularioActa 
              proyecto={proyecto} 
              onSave={onSave}
              onCancel={onClose}
              title={actaTitle}
              actaToEdit={actaToEdit}
            />
          ) : (
            <p>No se ha seleccionado ningún proyecto.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalHacerSeguimiento;
