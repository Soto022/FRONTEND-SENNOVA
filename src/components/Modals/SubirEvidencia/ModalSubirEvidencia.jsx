import React, { useState, useEffect } from 'react';
import './ModalSubirEvidencia.css';

const ModalSubirEvidencia = ({ isOpen, onClose, proyecto, onUpload }) => {
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
      archivos, // Ahora contiene nombre y contenido
      proyectoId: proyecto.id,
    };

    onUpload(evidenciaData);
    onClose();
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
              onChange={handleFileChange}
            />
          </div>
          
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
