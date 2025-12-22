// src/components/Modals/VerActas/ModalDetalleActa.jsx
import React from 'react';
import './ModalDetalleActa.css';

const ModalDetalleActa = ({ isOpen, onClose, acta, proyecto }) => {
  if (!isOpen || !acta || !proyecto) {
    return null;
  }

  const getStatusBadge = (estado) => {
    const statusConfig = {
      'en-curso': { class: 'status--in-progress', text: 'En curso' },
      'completado': { class: 'status--completed', text: 'Completado' },
      'pendiente': { class: 'status--pending', text: 'Pendiente' },
      'pausado': { class: 'status--paused', text: 'Pausado' },
    };

    const config = statusConfig[estado] || statusConfig['pendiente'];
    return <span className={`status ${config.class}`}>{config.text}</span>;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container-detalle" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>Detalles del Acta No. {acta.actaNo}</h2>
          <span>Proyecto: {proyecto.nombreProyecto}</span>
        </div>
        <div className="modal-content">

          <div className="detalle-section project-summary">
            <h3>Resumen del Proyecto</h3>
            <div className="detalle-grid">
                <div className="detalle-item">
                    <strong>Progreso Total:</strong>
                    <div className="progress">
                      <div className="progress__bar">
                        <div
                          className="progress__fill"
                          style={{ width: `${proyecto.progreso || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress__text">{proyecto.progreso || 0}%</span>
                    </div>
                </div>
                <div className="detalle-item">
                    <strong>Estado Actual:</strong> {getStatusBadge(proyecto.estado)}
                </div>
            </div>
          </div>
        
          <div className="detalle-grid">
            <div className="detalle-item"><strong>Reunión:</strong> {acta.reunion}</div>
            <div className="detalle-item"><strong>Fecha:</strong> {new Date(acta.fecha).toLocaleDateString('es-CO', { timeZone: 'UTC' })}</div>
            <div className="detalle-item"><strong>Hora:</strong> {acta.horaInicio} - {acta.horaFin}</div>
            <div className="detalle-item"><strong>Lugar/Enlace:</strong> {acta.lugar || 'N/A'}</div>
            <div className="detalle-item"><strong>Avance de esta acta:</strong> {acta.avancePorcentaje}%</div>
            <div className="detalle-item"><strong>Estado reportado en acta:</strong> {getStatusBadge(acta.estadoProyecto)}</div>
          </div>

          <div className="detalle-section">
            <h3>Agenda / Puntos a Desarrollar</h3>
            <ul className="detalle-list">
              {(acta.agenda || []).map((punto, i) => <li key={i}>{punto}</li>)}
            </ul>
          </div>
          
          <div className="detalle-section">
            <h3>Objetivo(s) de la reunión</h3>
            <ul className="detalle-list">
              {(acta.objetivos || []).map((objetivo, i) => <li key={i}>{objetivo}</li>)}
            </ul>
          </div>

          <div className="detalle-section">
            <h3>Desarrollo de la reunión</h3>
            <p>{acta.desarrollo || 'No se proporcionó desarrollo.'}</p>
          </div>

          <div className="detalle-section">
            <h3>Conclusiones</h3>
            <p>{acta.conclusiones || 'No se proporcionaron conclusiones.'}</p>
          </div>

          <div className="detalle-section">
            <h3>Compromisos</h3>
            {(acta.compromisos || []).length > 0 ? (
              <table className="detalle-table">
                <thead>
                  <tr>
                    <th>Actividad / Decisión</th>
                    <th>Fecha</th>
                    <th>Responsable</th>
                    <th>Firma o participación virtual</th>
                  </tr>
                </thead>
                <tbody>
                  {(acta.compromisos).map((row, i) => (
                    <tr key={i}>
                      <td>{row.actividad}</td>
                      <td>{row.fecha}</td>
                      <td>{row.responsable}</td>
                      <td style={{ whiteSpace: 'pre-wrap' }}>
                        {row.firma && row.firma.startsWith('data:image/') ? (
                          <img src={row.firma} alt="Firma digital" className="firma-image-preview-detalle" />
                        ) : (
                          row.firma
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se registraron compromisos.</p>
            )}
          </div>
          
          <div className="detalle-section">
            <h3>Asistentes y aprobación de decisiones</h3>
            {(acta.asistentes || []).length > 0 ? (
              <table className="detalle-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Dependencia / Empresa</th>
                    <th>Aprueba</th>
                    <th>Observación</th>
                    <th>Firma o participación virtual</th>
                  </tr>
                </thead>
                <tbody>
                  {(acta.asistentes).map((row, i) => (
                    <tr key={i}>
                      <td>{row.nombre}</td>
                      <td>{row.dependencia}</td>
                      <td>{row.aprueba}</td>
                      <td>{row.observacion}</td>
                      <td style={{ whiteSpace: 'pre-wrap' }}>
                        {row.firma && row.firma.startsWith('data:image/') ? (
                          <img src={row.firma} alt="Firma digital" className="firma-image-preview-detalle" />
                        ) : (
                          row.firma
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se registraron asistentes.</p>
            )}
          </div>

          <div className="detalle-section">
            <h3>Anexos</h3>
            <p>{acta.anexos || 'No se adjuntaron anexos.'}</p>
          </div>
          
          <div className="modal-footer">
            <button onClick={onClose} className="btn-cerrar">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleActa;