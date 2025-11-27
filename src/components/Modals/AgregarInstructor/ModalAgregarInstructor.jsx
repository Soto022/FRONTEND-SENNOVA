import { useState, useEffect } from 'react';
import './ModalAgregarInstructor.css';

const ModalAgregarInstructor = ({ isOpen, onClose, onSave, instructorToEdit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    documento: '',
    rol: '',
    fechaInicio: '',
    estado: 'Activo',
    fechaInactivacion: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (instructorToEdit) {
        setFormData({
          ...instructorToEdit,
          estado: instructorToEdit.estado || 'Activo',
          fechaInactivacion: instructorToEdit.fechaInactivacion || ''
        });
      } else {
        setFormData({
          nombre: '',
          contacto: '',
          email: '',
          documento: '',
          rol: '',
          fechaInicio: '',
          estado: 'Activo',
          fechaInactivacion: ''
        });
      }
      setErrors({}); // Clear errors when modal opens
    }
  }, [instructorToEdit, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [id]: value };
      if (id === 'estado' && value === 'Activo') {
        newState.fechaInactivacion = '';
      }
      return newState;
    });
    // Clear error for the field being edited
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const requiredError = 'Este campo es requerido.';

    if (!formData.nombre) newErrors.nombre = requiredError;
    if (!formData.contacto) newErrors.contacto = requiredError;
    if (!formData.email) newErrors.email = requiredError;
    if (!formData.documento) newErrors.documento = requiredError;
    if (!formData.rol) newErrors.rol = requiredError;
    if (!formData.fechaInicio) newErrors.fechaInicio = requiredError;

    if (formData.estado === 'Inactivo' && !formData.fechaInactivacion) {
      newErrors.fechaInactivacion = requiredError;
    }

    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
    onClose(); // Cerrar el modal después de guardar
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
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="contacto">Teléfono</label>
              <input type="text" id="contacto" value={formData.contacto || ''} onChange={handleChange} />
              {errors.contacto && <span className="error-message">{errors.contacto}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" value={formData.email || ''} onChange={handleChange} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="documento">Documento de identidad</label>
              <input type="text" id="documento" value={formData.documento || ''} onChange={handleChange} />
              {errors.documento && <span className="error-message">{errors.documento}</span>}
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
              {errors.rol && <span className="error-message">{errors.rol}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select id="estado" value={formData.estado || ''} onChange={handleChange}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
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
              {errors.fechaInicio && <span className="error-message">{errors.fechaInicio}</span>}
            </div>
          </div>
          {formData.estado === 'Inactivo' && (
            <div className="form-row">
              <div className="form-group form-group-full-width">
                <label htmlFor="fechaInactivacion">Fecha de inactivación</label>
                <input 
                  type="date" 
                  id="fechaInactivacion" 
                  value={formData.fechaInactivacion || ''} 
                  onChange={handleChange} 
                />
                {errors.fechaInactivacion && <span className="error-message">{errors.fechaInactivacion}</span>}
              </div>
            </div>
          )}
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
