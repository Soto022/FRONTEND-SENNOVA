import { useState, useEffect } from 'react';
import './ModalAgregarAprendiz.css';

const ModalAgregarAprendiz = ({ isOpen, onClose, onSave, aprendizToEdit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    documento: '',
    programa: '',
    ficha: '',
    fechaInicio: '',
    estado: 'Activo',
    fechaInactivacion: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (aprendizToEdit) {
        setFormData({
          ...aprendizToEdit,
          fechaInactivacion: aprendizToEdit.fechaInactivacion || '',
        });
      } else {
        setFormData({
          nombre: '',
          telefono: '',
          email: '',
          documento: '',
          programa: '',
          ficha: '',
          fechaInicio: '',
          estado: 'Activo',
          fechaInactivacion: '',
        });
      }
      setErrors({}); // Clear errors when modal opens
    }
  }, [aprendizToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'estado' && value === 'Activo') {
        newState.fechaInactivacion = '';
      }
      return newState;
    });
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const requiredError = 'Este campo es requerido.';

    if (!formData.nombre) newErrors.nombre = requiredError;
    if (!formData.email) newErrors.email = requiredError;
    if (!formData.telefono) newErrors.telefono = requiredError;
    if (!formData.documento) newErrors.documento = requiredError;
    if (!formData.programa) newErrors.programa = requiredError;
    if (!formData.ficha) newErrors.ficha = requiredError;
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
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{aprendizToEdit ? 'Editar Aprendiz' : 'Agregar Nuevo Aprendiz'}</h2>
        <div className="modal-body">
          <div className="form-columns">
            {/* Columna Izquierda */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="programa">Programa de formación</label>
                <input type="text" id="programa" name="programa" value={formData.programa} onChange={handleChange} />
                {errors.programa && <span className="error-message">{errors.programa}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="ficha">Ficha</label>
                <input type="text" id="ficha" name="ficha" value={formData.ficha} onChange={handleChange} />
                {errors.ficha && <span className="error-message">{errors.ficha}</span>}
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="documento">Documento de identidad</label>
                <input type="text" id="documento" name="documento" value={formData.documento} onChange={handleChange} />
                {errors.documento && <span className="error-message">{errors.documento}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="fechaInicio">Fecha inicio</label>
                <input type="date" id="fechaInicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
                {errors.fechaInicio && <span className="error-message">{errors.fechaInicio}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <select id="estado" name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              {formData.estado === 'Inactivo' && (
                <div className="form-group">
                  <label htmlFor="fechaInactivacion">Fecha de inactivación</label>
                  <input 
                    type="date" 
                    id="fechaInactivacion" 
                    name="fechaInactivacion" 
                    value={formData.fechaInactivacion} 
                    onChange={handleChange} 
                  />
                  {errors.fechaInactivacion && <span className="error-message">{errors.fechaInactivacion}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
        <hr className="separator" />
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar X</button>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarAprendiz;