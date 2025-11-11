import React from 'react';
import '../VerAprendiz/ModalVerAprendiz.css'; // Reutilizar estilos del modal de aprendiz

const ModalVerProyecto = ({ project, onClose }) => {
  if (!project) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="modal-ver-overlay">
      <div className="modal-ver-container modal-container--sm">
        <h2 className="modal-ver-title">Detalles del Proyecto</h2>
        <div className="modal-body">
          <div className="detail-group">
            <span className="detail-label">Nombre del Proyecto:</span>
            <span className="detail-value">{project.name}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Semillero:</span>
            <span className="detail-value">{project.semillero}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Líder:</span>
            <span className="detail-value">{project.lider}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Fecha de Inicio:</span>
            <span className="detail-value">{formatDate(project.fechaInicio)}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Fecha de Fin:</span>
            <span className="detail-value">{formatDate(project.fechaFin)}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Progreso:</span>
            <span className="detail-value">{project.progreso}%</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Estado:</span>
            <span className="detail-value">{project.estado}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Palabras Clave:</span>
            <span className="detail-value">{project['palabras-clave']}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Línea Tecnológica:</span>
            <span className="detail-value">{project['linea-tecnologica']}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Resumen:</span>
            <span className="detail-value">{project.resumen}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Planteamiento del Problema:</span>
            <span className="detail-value">{project.problema}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Objetivo:</span>
            <span className="detail-value">{project.objetivo}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Aprendices Asignados:</span>
            <span className="detail-value">
              {project.aprendices && project.aprendices.length > 0
                ? project.aprendices.map(a => a.nombre).join(', ')
                : 'Ninguno'}
            </span>
          </div>
          {project.descripcion && (
            <div className="detail-group">
              <span className="detail-label">Descripción:</span>
              <span className="detail-value">{project.descripcion}</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerProyecto;