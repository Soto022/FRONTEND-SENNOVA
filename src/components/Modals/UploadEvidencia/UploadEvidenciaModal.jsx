import React, { useState, useEffect } from 'react';
import './UploadEvidenciaModal.css';

const UploadEvidenciaModal = ({
  isOpen,
  onClose,
  proyecto,
  onUpload,
  archivos,
  onFileChange,
  onRemoveFile,
  error: parentError,
}) => {
  const [actividad, setActividad] = useState('');
  const [localError, setLocalError] = useState('');

  const error = parentError || localError;

  useEffect(() => {
    if (!isOpen) {
      setActividad('');
      setLocalError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLocalError('');
    if (!actividad.trim()) {
      setLocalError('El campo "Actividad" es obligatorio.');
      return;
    }
    if (archivos.length === 0) {
      setLocalError('Debe seleccionar al menos un archivo.');
      return;
    }

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Subir Evidencias para: {proyecto?.nombreProyecto}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
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
            <label htmlFor="archivos">Archivos (Máx. 5MB por archivo) *</label>
            <input
              id="archivos"
              type="file"
              multiple
              onChange={onFileChange}
            />
          </div>

          {archivos.length > 0 && (
            <div className="file-preview-list">
              <p>Archivos seleccionados:</p>
              <ul>
                {archivos.map((file, index) => (
                  <li key={index}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => onRemoveFile(index)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {error && <p className="error-message">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Subir {archivos.length || 0} {archivos.length === 1 ? 'Evidencia' : 'Evidencias'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadEvidenciaModal;
