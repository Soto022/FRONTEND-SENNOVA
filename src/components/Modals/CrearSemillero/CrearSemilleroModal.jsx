// src/components/Modal/CrearSemilleroModal.jsx
import { useState } from 'react';
import './CrearSemilleroModal.css';

const CrearSemilleroModal = ({ isOpen, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (nombre.trim()) {
      onSave(nombre.trim());
      onClose(); // Cierra el modal después de guardar
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container small-modal">
        <div className="modal-header">
          <h2>Crear Nuevo Semillero</h2>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="semillero-nombre">Nombre del Semillero</label>
            <input 
              type="text" 
              id="semillero-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Innovación en Redes"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default CrearSemilleroModal;
