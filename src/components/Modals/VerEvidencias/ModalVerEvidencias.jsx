import React, { useState } from 'react';
import { useProjects } from '../../../hook/useProjects';
import ModalVerContenido from '../VerContenido/ModalVerContenido';
import './ModalVerEvidencias.css';

const ModalVerEvidencias = ({ isOpen, onClose, proyecto, onSubirEvidencia }) => {
  const { deleteEvidenciaFromProject } = useProjects();
  const [verContenidoOpen, setVerContenidoOpen] = useState(false);
  const [selectedEvidencia, setSelectedEvidencia] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleDownload = (evidencia) => {
    if (evidencia.contenido) {
      const link = document.createElement('a');
      link.href = evidencia.contenido;
      link.download = evidencia.archivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`La descarga no está disponible para evidencias antiguas.`);
    }
  };

  const handleView = (evidencia) => {
    if (evidencia.contenido) {
      setSelectedEvidencia(evidencia);
      setVerContenidoOpen(true);
    } else {
      alert(`La vista previa no está disponible para evidencias antiguas.`);
    }
  };

  const handleCloseContenido = () => {
    setVerContenidoOpen(false);
    setSelectedEvidencia(null);
  };

  const handleDelete = (evidencia) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la evidencia "${evidencia.archivo}"?`)) {
      deleteEvidenciaFromProject(proyecto.id, evidencia.id);
    }
  };

  return (
    <>
      <div className="modal-ver-evidencias-overlay" onClick={onClose}>
        <div className="modal-ver-evidencias-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-ver-evidencias-header">
            <h2>Evidencias de: {proyecto.nombreProyecto}</h2>
            <button onClick={onClose} className="close-button">&times;</button>
          </div>
          <div className="modal-ver-evidencias-body">
            <div className="evidencias-list">
              {proyecto.evidencias && proyecto.evidencias.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Nombre del Archivo</th>
                      <th>Actividad</th>
                      <th>Subido por</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyecto.evidencias.map((evidencia) => (
                      <tr key={evidencia.id}>
                        <td>{evidencia.archivo}</td>
                        <td>{evidencia.actividad}</td>
                        <td>{evidencia.subidoPor}</td>
                        <td>{evidencia.fecha}</td>
                        <td className="actions-cell">
                          <button
                            className="btn-ver"
                            onClick={() => handleView(evidencia)}
                          >
                            Ver
                          </button>
                          <button
                            className="btn-descargar"
                            onClick={() => handleDownload(evidencia)}
                          >
                            Descargar
                          </button>
                          <button
                            className="btn-eliminar"
                            onClick={() => handleDelete(evidencia)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-evidencias">No hay evidencias para este proyecto.</p>
              )}
            </div>
          </div>
          <div className="modal-ver-evidencias-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button className="btn btn-primary" onClick={onSubirEvidencia}>
              Subir Evidencia
            </button>
          </div>
        </div>
      </div>

      <ModalVerContenido
        isOpen={verContenidoOpen}
        onClose={handleCloseContenido}
        evidencia={selectedEvidencia}
      />
    </>
  );
};

export default ModalVerEvidencias;
