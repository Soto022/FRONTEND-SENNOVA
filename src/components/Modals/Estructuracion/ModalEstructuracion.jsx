import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
            <div className="markdown-content">
              <ReactMarkdown>{project?.resumen || project?.descripcion || 'No definido.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Planteamiento del problema</h4>
            <div className="markdown-content">
              <ReactMarkdown>{project?.problema || 'No definido.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Objetivo general</h4>
            <div className="markdown-content">
              <ReactMarkdown>{project?.objetivo || 'No definido.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Objetivos específicos</h4>
            <div className="markdown-content">
              {Array.isArray(project?.objetivosEspecificos) && project.objetivosEspecificos.length > 0
                ? <ReactMarkdown>{project.objetivosEspecificos.map(o => `- ${o}`).join('\n')}</ReactMarkdown>
                : <p>No definidos.</p>
              }
            </div>
          </div>
          <div className="modal-card">
            <h4>Justificación</h4>
            <div className="markdown-content">
              <ReactMarkdown>{project?.justificacion || 'No definida.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Metodología</h4> {/* Separated from Impactos */}
            <div className="markdown-content">
              <ReactMarkdown>{project?.metodologia || 'No definida.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Impactos</h4> {/* New field */}
            <div className="markdown-content">
              <ReactMarkdown>{project?.impactos || 'No definidos.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Alcance del proyecto</h4>
            <div className="markdown-content">
              <ReactMarkdown>{project?.alcance || 'No definido.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Palabras Clave</h4> {/* New field */}
            <div className="markdown-content">
              <ReactMarkdown>{project?.palabrasClave || 'No definidas.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Beneficiarios</h4> {/* New field */}
            <div className="markdown-content">
              <ReactMarkdown>{project?.beneficiarios || 'No definidos.'}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-card">
            <h4>Bibliografía</h4> {/* New field */}
            <div className="markdown-content">
              <ReactMarkdown>{project?.bibliografia || 'No definida.'}</ReactMarkdown>
            </div>
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
