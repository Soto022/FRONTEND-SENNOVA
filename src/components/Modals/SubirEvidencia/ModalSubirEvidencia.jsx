import React, { useState, useEffect } from 'react';
import './ModalSubirEvidencia.css';

const ModalSubirEvidencia = ({ isOpen, onClose, proyecto, onUpload, archivos, onFileChange }) => {
  const [actividad, setActividad] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset local state when the modal opens or closes
    if (!isOpen) {
      setActividad('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!actividad.trim()) {
      setError('El campo "Actividad" es obligatorio.');
      return;
    }
    if (archivos.length === 0) {
      setError('Debe seleccionar al menos un archivo.');
      return;
    }

    // The parent now handles the file data, so we just pass up the activity.
    const evidenciaData = {
      actividad,
      proyectoId: proyecto.id,
    };

    onUpload(evidenciaData);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-subir-evidencia-overlay" onClick={onClose}>
      <div className="modal-subir-evidencia-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-subir-evidencia-header">
          <h2>Subir Evidencia para: {proyecto?.nombreProyecto}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-subir-evidencia-body">
          <div className="form-group">
            <label htmlFor="actividad">Actividad *</label>
            <input
              id="actividad"
              type="text"
              value={actividad}
              onChange={(e) => setActividad(e.target.value)}
              placeholder="Ej: Diseño de la interfaz"
            />
          </div>
          <div className="form-group">
            <label htmlFor="archivos">Archivos *</label>
            <input
              id="archivos"
              type="file"
              multiple
              onChange={onFileChange} // Use the handler from props
            />
          </div>
          
          {/* Display the list of selected files */}
          {archivos && archivos.length > 0 && (
            <div className="file-list">
              <h4>Archivos seleccionados:</h4>
              <ul>
                {archivos.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <div className="modal-subir-evidencia-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Subir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSubirEvidencia;
