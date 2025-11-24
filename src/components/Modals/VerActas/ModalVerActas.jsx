// src/components/Modals/VerActas/ModalVerActas.jsx
import React, { useState, useEffect } from 'react';
import ModalDetalleActa from './ModalDetalleActa'; // Importar el nuevo modal
import './ModalVerActas.css';

const ModalVerActas = ({ isOpen, onClose, proyecto, onEdit }) => {
  const [actas, setActas] = useState([]);
  const [detalleActa, setDetalleActa] = useState(null); // Estado para el modal de detalle

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
  }, [isOpen, proyecto]); // Removed actas from dependency array to fix infinite loop

  const handleDelete = (actaIndex) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el acta No. ${actas[actaIndex].actaNo}?`)) {
      return;
    }

    try {
        const storedActas = localStorage.getItem('sennova_actas');
        const allActas = storedActas ? JSON.parse(storedActas) : {};
        
        const projectActas = allActas[proyecto.id] || [];
        const updatedActas = projectActas.filter((_, index) => index !== actaIndex);
        
        allActas[proyecto.id] = updatedActas;
        
        localStorage.setItem('sennova_actas', JSON.stringify(allActas));
        setActas(updatedActas); // Update state to re-render
        alert('Acta eliminada con éxito.');

    } catch (error) {
        console.error("Error al eliminar el acta:", error);
        alert('Hubo un error al eliminar el acta.');
    }
  };
  
  const handleVerDetalle = (acta) => {
    setDetalleActa(acta);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container-large" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
          <div className="modal-header">
            <h2>Actas de: {proyecto.nombreProyecto}</h2>
          </div>
          <div className="modal-content">
            {actas.length > 0 ? (
              <table className="actas-table">
                  <thead>
                      <tr>
                          <th>Nombre del comité o de la reunión</th>
                          <th>Acta No.</th>
                          <th>Registrado por</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                      </tr>
                  </thead>
                  <tbody>
                      {actas.map((acta, index) => (
                          <tr key={index}>
                              <td>{acta.reunion}</td>
                              <td>{acta.actaNo}</td>
                              <td>Usuario Actual</td>
                              <td>{acta.fecha}</td>
                              <td className="actas-actions">
                                  <button onClick={() => handleVerDetalle(acta)} className="action-btn-ver">Ver</button>
                                  <button onClick={() => onEdit(acta, index)} className="action-btn-editar">Editar</button>
                                  <button onClick={() => handleDelete(index)} className="action-btn-eliminar">Eliminar</button>
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

      {/* Renderizar el modal de detalle */}
      <ModalDetalleActa 
        isOpen={!!detalleActa} 
        onClose={() => setDetalleActa(null)} 
        acta={detalleActa} 
      />
    </>
  );
};

export default ModalVerActas;
