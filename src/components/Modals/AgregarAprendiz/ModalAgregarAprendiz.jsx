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
    // proyectoAsignado: '', // Removed
  });

  useEffect(() => {
    if (aprendizToEdit) {
      setFormData(aprendizToEdit);
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
        // proyectoAsignado: '', // Removed
      });
    }
  }, [aprendizToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
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
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="programa">Programa de formación</label>
                <input type="text" id="programa" name="programa" value={formData.programa} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="ficha">Ficha</label>
                <input type="text" id="ficha" name="ficha" value={formData.ficha} onChange={handleChange} />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="documento">Documento de identidad</label>
                <input type="text" id="documento" name="documento" value={formData.documento} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="fechaInicio">Fecha inicio</label>
                <input type="date" id="fechaInicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <select id="estado" name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              {/* Removed Proyecto asignado select */}
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