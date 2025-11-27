// src/components/Modals/VerActas/ModalDetalleActa.jsx
import React from 'react';
import './ModalDetalleActa.css';

const ModalDetalleActa = ({ isOpen, onClose, acta }) => {
  if (!isOpen || !acta) {
    return null;
  }

  const renderTable = (title, data, columns) => (
    <div className="detalle-section">
      <h3>{title}</h3>
      <table className="detalle-table">
        <thead>
          <tr>
            {columns.map((col, i) => <th key={i}>{col.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => <td key={j}>{row[col.accessor]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container-detalle" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>Detalles del Acta No. {acta.actaNo}</h2>
        </div>
        <div className="modal-content">
          <div className="detalle-grid">
            <div className="detalle-item"><strong>Proyecto:</strong> {acta.proyectoNombre}</div>
            <div className="detalle-item"><strong>Nombre del comité o de la reunión:</strong> {acta.reunion}</div>
            <div className="detalle-item"><strong>Ciudad:</strong> {acta.ciudad}</div>
            <div className="detalle-item"><strong>Centro de Formación:</strong> {acta.centroFormacion}</div>
            <div className="detalle-item"><strong>Fecha:</strong> {acta.fecha}</div>
            <div className="detalle-item"><strong>Hora Inicio:</strong> {acta.horaInicio}</div>
            <div className="detalle-item"><strong>Hora Fin:</strong> {acta.horaFin}</div>
            <div className="detalle-item"><strong>Lugar y/o enlace:</strong> {acta.lugar || 'N/A'}</div>
          </div>

          <div className="detalle-section">
            <h3>Agenda / Puntos a Desarrollar</h3>
            <ul className="detalle-list">
              {acta.agenda.map((punto, i) => <li key={i}>{punto}</li>)}
            </ul>
          </div>
          
          <div className="detalle-section">
            <h3>Objetivo(s) de la reunión</h3>
            <ul className="detalle-list">
              {acta.objetivos.map((objetivo, i) => <li key={i}>{objetivo}</li>)}
            </ul>
          </div>

          <div className="detalle-section">
            <h3>Desarrollo de la reunión</h3>
            <p>{acta.desarrollo}</p>
          </div>

          <div className="detalle-section">
            <h3>Limitantes del proyecto</h3>
            <ul className="detalle-list">
              {acta.limitantes.map((limitante, i) => <li key={i}>{limitante}</li>)}
            </ul>
          </div>

          <div className="detalle-section">
            <h3>Evaluación del impacto y participación de aprendices</h3>
            {acta.impactoAprendices && acta.impactoAprendices.length > 0 ? (
              <table className="detalle-table">
                <thead>
                  <tr>
                    <th>Aprendiz</th>
                    <th>Programa de formación</th>
                    <th>Ficha</th>
                  </tr>
                </thead>
                <tbody>
                  {acta.impactoAprendices.map((row, i) => (
                    <tr key={i}>
                      <td>{row.aprendiz}</td>
                      <td>{row.programa}</td>
                      <td>{row.ficha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se registraron aprendices en esta sección.</p>
            )}
          </div>

          <div className="detalle-section">
            <h3>Presentación de resultados en eventos académicos</h3>
            <ul className="detalle-list">
              {acta.presentacionResultados.map((resultado, i) => <li key={i}>{resultado}</li>)}
            </ul>
          </div>

          <div className="detalle-section">
            <h3>Decisiones y acciones a seguir</h3>
            <ul className="detalle-list">
              {acta.decisiones.map((decision, i) => <li key={i}>{decision}</li>)}
            </ul>
          </div>

          <div className="detalle-section">
            <h3>Conclusiones</h3>
            <ul className="detalle-list">
              {acta.conclusiones.map((conclusion, i) => <li key={i}>{conclusion}</li>)}
            </ul>
          </div>

          <div className="detalle-section">
            <h3>Compromisos</h3>
            {acta.compromisos && acta.compromisos.length > 0 ? (
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
                  {acta.compromisos.map((row, i) => (
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
              <p>No se registraron compromisos en esta sección.</p>
            )}
          </div>
          
          <div className="detalle-section">
            <h3>Asistentes y aprobación de decisiones</h3>
            {acta.asistentes && acta.asistentes.length > 0 ? (
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
                  {acta.asistentes.map((row, i) => (
                    <tr key={i}>
                      <td>{row.nombre}</td>
                      <td>{row.dependencia}</td>
                      <td>{row.aprueba ? 'Sí' : 'No'}</td>
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
              <p>No se registraron asistentes en esta sección.</p>
            )}
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