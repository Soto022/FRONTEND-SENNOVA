import { useState, useEffect } from 'react';
import './ModalAgregarInstructor.css';

const ModalAgregarInstructor = ({ isOpen, onClose, onSave, instructorToEdit }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (instructorToEdit) {
      setFormData(instructorToEdit);
    } else {
      setFormData({
        nombre: '',
        contacto: '',
        email: '',
        documento: '',
        rol: '',
        fechaInicio: ''
      });
    }
  }, [instructorToEdit, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="mi-modal-overlay">
      <div className="mi-modal-container">
        <div className="mi-modal-header">
          <h2>{instructorToEdit ? 'Editar' : 'Agregar'} Instructor</h2>
        </div>
        <div className="mi-modal-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input type="text" id="nombre" value={formData.nombre || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="contacto">Teléfono</label>
              <input type="text" id="contacto" value={formData.contacto || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" value={formData.email || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="documento">Documento de identidad</label>
              <input type="text" id="documento" value={formData.documento || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rol">Rol dentro del proyecto</label>
              <select id="rol" value={formData.rol || ''} onChange={handleChange}>
                <option value="">Seleccione un rol</option>
                <option value="Investigador">Investigador</option>
                <option value="Coinvestigador">Coinvestigador</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group form-group-full-width">
              <label htmlFor="fechaInicio">Fecha en que inició</label>
              <div className="date-input-container">
                <input type="date" id="fechaInicio" value={formData.fechaInicio || ''} onChange={handleChange} />
                <span className="calendar-icon">📅</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="mi-modal-divider" />
        <div className="mi-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar X</button>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarInstructor;
