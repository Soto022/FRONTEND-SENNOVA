// src/components/Modals/VerActas/ModalVerActas.jsx
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ModalDetalleActa from './ModalDetalleActa';
import './ModalVerActas.css';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import PlantillaActaHTML from './PlantillaActaHTML';

const ModalVerActas = ({ isOpen, onClose, proyecto, onEdit, onDelete }) => {
  const [actas, setActas] = useState([]);
  const [detalleActa, setDetalleActa] = useState(null);

  useEffect(() => {
    if (isOpen && proyecto) {
      try {
        const storedActas = localStorage.getItem('sennova_actas');
        const allActas = storedActas ? JSON.parse(storedActas) : {};
        const projectActas = allActas[proyecto.id] || [];
        setActas(projectActas);
      } catch (error) {
        console.error("Error al leer las actas desde localStorage:", error);
        setActas([]);
      }
    }
  }, [isOpen, proyecto]);

  const handleConfirmDelete = (actaIndex) => {
    const acta = actas[actaIndex];
    if (window.confirm(`¿Estás seguro de que quieres eliminar el acta No. ${acta.actaNo}?`)) {
      onDelete(proyecto.id, actaIndex);
    }
  };
  
  const handleVerDetalle = (acta) => {
    setDetalleActa(acta);
  };

  const generarPDF = (acta) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px'; // Hide it off-screen
    container.style.width = '180mm'; // A4 width (210mm) - 2*15mm margin
    document.body.appendChild(container);
    
    const root = createRoot(container);
    
    const onRendered = () => {
        const pdfElement = container.querySelector('#acta-pdf-content');
        if (!pdfElement) {
            console.error("PDF content element not found!");
            root.unmount();
            document.body.removeChild(container);
            return;
        }

        const opt = {
            margin: 15,
            filename: `Acta_${acta.actaNo}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(pdfElement).set(opt).save().then(() => {
            root.unmount();
            document.body.removeChild(container);
        });
    };
    
    root.render(
      <React.StrictMode>
        <PlantillaActaHTML acta={acta} proyecto={proyecto} onRendered={onRendered} />
      </React.StrictMode>
    );
  };

  const handleDescargarSeguimiento = (acta) => {
    if (!acta) return;
    generarPDF(acta);
  };

  if (!isOpen) { return null; }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container-large" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
          <div className="modal-header">
            <h2>Actas de: {proyecto?.nombreProyecto}</h2>
          </div>
          <div className="modal-content">
            {actas.length > 0 ? (
              <table className="actas-table">
                  <thead>
                      <tr>
                          <th>Reunión</th>
                          <th>Acta No.</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                      </tr>
                  </thead>
                  <tbody>
                      {actas.map((acta, index) => (
                          <tr key={index}>
                              <td>{acta.reunion}</td>
                              <td>{acta.actaNo}</td>
                              <td>{new Date(acta.fecha).toLocaleDateString('es-CO', { timeZone: 'UTC' })}</td>
                              <td className="actas-actions">
                                  <button onClick={() => handleVerDetalle(acta)} className="action-btn-ver">Ver</button>
                                  <button onClick={() => onEdit(acta, index)} className="action-btn-editar">Editar</button>
                                  <button onClick={() => handleConfirmDelete(index)} className="action-btn-eliminar">Eliminar</button>
                                  <button onClick={() => handleDescargarSeguimiento(acta)} className="action-btn-descargar">Descargar PDF</button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            ) : (
              <p>No hay actas registradas para este proyecto.</p>
            )}
            <div className="modal-footer">
                  <button onClick={onClose} className="btn-cerrar">Cerrar</button>
              </div>
          </div>
        </div>
      </div>

      <ModalDetalleActa 
        isOpen={!!detalleActa} 
        onClose={() => setDetalleActa(null)} 
        acta={detalleActa} 
        proyecto={proyecto}
      />
    </>
  );
};

export default ModalVerActas;