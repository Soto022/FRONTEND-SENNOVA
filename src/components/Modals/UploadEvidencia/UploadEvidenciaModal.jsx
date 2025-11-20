import React, { useState, useEffect } from 'react';
import './UploadEvidenciaModal.css';

const UploadEvidenciaModal = ({ isOpen, onClose, proyecto, onUpload }) => {
  const [actividad, setActividad] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setActividad('');
      setArchivos([]);
      setError('');
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const oversizedFiles = files.filter(file => file.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      setError(`Los siguientes archivos son demasiado grandes (máx. 5MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
      e.target.value = ''; // Limpiar el input
      return;
    }
    setError('');

    const filePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            content: event.target.result, // Contenido en Base64
          });
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then(fileData => {
        setArchivos(fileData);
      })
      .catch(err => {
        console.error("Error al leer los archivos:", err);
        setError("Hubo un error al procesar los archivos.");
      });
  };

  const handleRemoveFile = (fileIndex) => {
    setArchivos(archivos.filter((_, index) => index !== fileIndex));
  };

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

    const evidenciaData = {
      actividad,
      archivos,
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
              onChange={handleFileChange}
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
                      onClick={() => handleRemoveFile(index)}
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
