import React from 'react';
import './ModalVerContenido.css';

const ModalVerContenido = ({ isOpen, onClose, evidencia }) => {
  if (!isOpen || !evidencia || !evidencia.contenido) {
    return null;
  }

  const getMimeType = (dataUrl) => {
    return dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
  };

  const mimeType = getMimeType(evidencia.contenido);

  const renderContent = () => {
    if (mimeType.startsWith('image/')) {
      return <img src={evidencia.contenido} alt={evidencia.archivo} className="preview-content" />;
    }
    if (mimeType === 'application/pdf') {
      return <embed src={evidencia.contenido} type="application/pdf" className="preview-content" />;
    }
    return <p>La vista previa para este tipo de archivo no está disponible.</p>;
  };

  return (
    <div className="modal-ver-contenido-overlay" onClick={onClose}>
      <div className="modal-ver-contenido-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-ver-contenido-header">
          <h2>Vista Previa: {evidencia.archivo}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-ver-contenido-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ModalVerContenido;
