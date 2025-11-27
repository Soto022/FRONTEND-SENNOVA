// src/components/Modals/HacerSeguimiento/FormularioActa.jsx
import React, { useState, useEffect } from 'react';
import './FormularioActa.css';
import TablaImpactoAprendices from '../../Tables/TablaImpactoAprendices';
import TablaCompromisos from '../../Tables/TablaCompromisos';
import TablaAsistentes from '../../Tables/TablaAsistentes';

const initialCompromiso = { actividad: '', fecha: '', responsable: '', firma: '' };
const initialAsistente = { nombre: '', dependencia: '', aprueba: false, observacion: '', firma: '' };

// --- INICIO MODIFICACIÓN: Estado inicial con nuevos campos ---
const initialFormData = {
  actaNo: '',
  reunion: '',
  ciudad: 'Manizales',
  centroFormacion: 'Centro de Automatizacion Industrial',
  fecha: new Date().toISOString().split('T')[0],
  horaInicio: '',
  horaFin: '',
  lugar: '',
  agenda: [''],
  objetivos: [''],
  desarrollo: '',
  limitantes: [''],
  impactoAprendices: [{ aprendiz: '', programa: '', ficha: '' }],
  presentacionResultados: [''],
  decisiones: [''],
  conclusiones: [''],
  compromisos: [initialCompromiso],
  asistentes: [initialAsistente],
  // Nuevos campos para el seguimiento del proyecto
  avancePorcentaje: '',
  estadoProyecto: 'pendiente', // Valor por defecto
};
// --- FIN MODIFICACIÓN ---

const FormularioActa = ({ proyecto, onSave, onCancel, actaToEdit }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (actaToEdit) {
      const mergedData = {
        ...initialFormData,
        ...actaToEdit,
        agenda: actaToEdit.agenda && actaToEdit.agenda.length > 0 ? actaToEdit.agenda : [''],
        objetivos: actaToEdit.objetivos && actaToEdit.objetivos.length > 0 ? actaToEdit.objetivos : [''],
        limitantes: actaToEdit.limitantes && actaToEdit.limitantes.length > 0 ? actaToEdit.limitantes : [''],
        impactoAprendices: actaToEdit.impactoAprendices && actaToEdit.impactoAprendices.length > 0 ? actaToEdit.impactoAprendices : [{ aprendiz: '', programa: '', ficha: '' }],
        presentacionResultados: actaToEdit.presentacionResultados && actaToEdit.presentacionResultados.length > 0 ? actaToEdit.presentacionResultados : [''],
        decisiones: actaToEdit.decisiones && actaToEdit.decisiones.length > 0 ? actaToEdit.decisiones : [''],
        conclusiones: actaToEdit.conclusiones && actaToEdit.conclusiones.length > 0 ? actaToEdit.conclusiones : [''],
        compromisos: actaToEdit.compromisos && actaToEdit.compromisos.length > 0 ? actaToEdit.compromisos : [initialCompromiso],
        asistentes: actaToEdit.asistentes && actaToEdit.asistentes.length > 0 ? actaToEdit.asistentes : [initialAsistente],
        fecha: actaToEdit.fecha ? new Date(actaToEdit.fecha).toISOString().split('T')[0] : initialFormData.fecha,
        centroFormacion: actaToEdit.centroFormacion || initialFormData.centroFormacion,
        // Cargar los nuevos campos si existen en el acta a editar
        avancePorcentaje: actaToEdit.avancePorcentaje || '',
        estadoProyecto: actaToEdit.estadoProyecto || 'pendiente',
      };
      setFormData(mergedData);
    } else {
      // Al crear un nuevo seguimiento, usar el estado y progreso actual del proyecto como valor inicial
      setFormData({
        ...initialFormData,
        avancePorcentaje: proyecto?.progreso || '',
        estadoProyecto: proyecto?.estado || 'pendiente',
      });
    }
  }, [actaToEdit, proyecto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDynamicFieldChange = (fieldName, index, value) => {
    const newField = [...formData[fieldName]];
    newField[index] = value;
    setFormData(prev => ({ ...prev, [fieldName]: newField }));
  };

  const addDynamicFieldPoint = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: [...prev[fieldName], ''] }));
  };

  const removeDynamicFieldPoint = (fieldName, index) => {
    const newField = formData[fieldName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [fieldName]: newField }));
  };

  const handleImpactoAprendicesTableChange = (newTableData) => {
    setFormData(prev => ({ ...prev, impactoAprendices: newTableData }));
  };

  const handleCompromisosTableChange = (newTableData) => {
    setFormData(prev => ({ ...prev, compromisos: newTableData }));
  };

  const handleAsistentesTableChange = (newTableData) => {
    setFormData(prev => ({ ...prev, asistentes: newTableData }));
  };

  // --- INICIO MODIFICACIÓN: Lógica de envío con validación de nuevos campos ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.actaNo || !formData.reunion || !formData.horaInicio || !formData.horaFin) {
      alert('Por favor, complete los campos obligatorios: ACTA No., Nombre de la reunión, Hora de Inicio y Hora Fin.');
      return;
    }
    // Validación para los nuevos campos
    if (formData.avancePorcentaje === '' || formData.avancePorcentaje < 0 || formData.avancePorcentaje > 100) {
        alert('Por favor, ingrese un Avance de proyecto válido (0–100).');
        return;
    }
    if (!formData.estadoProyecto) {
        alert('Por favor, seleccione un Estado del proyecto.');
        return;
    }
    onSave({ ...formData, proyectoId: proyecto.id, proyectoNombre: proyecto.nombreProyecto });
  };
  // --- FIN MODIFICACIÓN ---

  return (
    <form onSubmit={handleSubmit} className="formulario-acta">

      <div className="form-row">
        <div className="form-group half">
          <label>ACTA No. <span className="required">*</span></label>
          <input type="text" name="actaNo" value={formData.actaNo} onChange={handleChange} required />
        </div>
        <div className="form-group half">
          <label>Nombre del comité o reunión <span className="required">*</span></label>
          <input type="text" name="reunion" value={formData.reunion} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group quarter">
          <label>Ciudad</label>
          <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} readOnly />
        </div>
        <div className="form-group quarter">
          <label>Centro de Formación</label>
          <input type="text" name="centroFormacion" value={formData.centroFormacion} onChange={handleChange} readOnly />
        </div>
        <div className="form-group quarter">
          <label>Fecha</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
        </div>
        <div className="form-group quarter">
          <label>Lugar o Enlace</label>
          <input type="text" name="lugar" value={formData.lugar} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label>Hora Inicio <span className="required">*</span></label>
          <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
        </div>
        <div className="form-group half">
          <label>Hora Fin <span className="required">*</span></label>
          <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
        </div>
      </div>

      {/* --- INICIO MODIFICACIÓN: Nuevos campos de formulario --- */}
      <fieldset className="form-fieldset">
        <legend>Actualización del Proyecto</legend>
        <div className="form-row">
            <div className="form-group half">
                <label>Avance del proyecto (%) <span className="required">*</span></label>
                <input
                    type="number"
                    name="avancePorcentaje"
                    value={formData.avancePorcentaje}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="0-100"
                    required
                />
            </div>
            <div className="form-group half">
                <label>Estado del proyecto <span className="required">*</span></label>
                <select
                    name="estadoProyecto"
                    value={formData.estadoProyecto}
                    onChange={handleChange}
                    required
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="en-curso">En Curso</option>
                    <option value="completado">Completado</option>
                    <option value="pausado">Pausado</option>
                </select>
            </div>
        </div>
      </fieldset>
      {/* --- FIN MODIFICACIÓN --- */}

      <div className="form-group">
        <label>Agenda o puntos a desarrollar</label>
        {formData.agenda.map((punto, index) => (
          <div key={index} className="agenda-item dynamic-field-item">
            <input
              type="text"
              value={punto}
              onChange={(e) => handleDynamicFieldChange('agenda', index, e.target.value)}
              placeholder={`Punto ${index + 1}`}
            />
            {formData.agenda.length > 1 && (
              <button type="button" onClick={() => removeDynamicFieldPoint('agenda', index)} className="btn-remove">
                🗑️
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addDynamicFieldPoint('agenda')} className="btn-add-point">+ Añadir punto</button>
      </div>


      <div className="form-group">
        <label>Objetivo(s) de la reunión</label>
        {formData.objetivos.map((objetivo, index) => (
          <div key={index} className="agenda-item dynamic-field-item">
            <input
              type="text"
              value={objetivo}
              onChange={(e) => handleDynamicFieldChange('objetivos', index, e.target.value)}
              placeholder={`Objetivo ${index + 1}`}
            />
            {formData.objetivos.length > 1 && (
              <button type="button" onClick={() => removeDynamicFieldPoint('objetivos', index)} className="btn-remove">
                🗑️
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addDynamicFieldPoint('objetivos')} className="btn-add-point">+ Añadir Objetivo</button>
      </div>

      <div className="form-group">
        <label>Desarrollo de la reunión</label>
        <textarea name="desarrollo" value={formData.desarrollo} onChange={handleChange} rows="5"></textarea>
      </div>

      <div className="form-group">
        <label>Limitantes del proyecto</label>
        {formData.limitantes.map((limitante, index) => (
          <div key={index} className="agenda-item dynamic-field-item">
            <input
              type="text"
              value={limitante}
              onChange={(e) => handleDynamicFieldChange('limitantes', index, e.target.value)}
              placeholder={`Limitante ${index + 1}`}
            />
            {formData.limitantes.length > 1 && (
              <button type="button" onClick={() => removeDynamicFieldPoint('limitantes', index)} className="btn-remove">
                🗑️
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addDynamicFieldPoint('limitantes')} className="btn-add-point">+ Añadir Limitante</button>
      </div>

      <div className="form-group">
        <label>Evaluación del impacto y participación de aprendices</label>
        <TablaImpactoAprendices
          value={formData.impactoAprendices}
          onChange={handleImpactoAprendicesTableChange}
        />
      </div>

      <div className="form-group">
        <label>Presentación de resultados en eventos académicos</label>
        {formData.presentacionResultados.map((resultado, index) => (
          <div key={index} className="agenda-item dynamic-field-item">
            <input
              type="text"
              value={resultado}
              onChange={(e) => handleDynamicFieldChange('presentacionResultados', index, e.target.value)}
              placeholder={`Resultado ${index + 1}`}
            />
            {formData.presentacionResultados.length > 1 && (
              <button type="button" onClick={() => removeDynamicFieldPoint('presentacionResultados', index)} className="btn-remove">
                🗑️
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addDynamicFieldPoint('presentacionResultados')} className="btn-add-point">+ Añadir Resultado</button>
      </div>

      <div className="form-group">
        <label>Decisiones y acciones a seguir</label>
        {formData.decisiones.map((decision, index) => (
          <div key={index} className="agenda-item dynamic-field-item">
            <input
              type="text"
              value={decision}
              onChange={(e) => handleDynamicFieldChange('decisiones', index, e.target.value)}
              placeholder={`Decisión ${index + 1}`}
            />
            {formData.decisiones.length > 1 && (
              <button type="button" onClick={() => removeDynamicFieldPoint('decisiones', index)} className="btn-remove">
                🗑️
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addDynamicFieldPoint('decisiones')} className="btn-add-point">+ Añadir Decisión</button>
      </div>

      <div className="form-group">
        <label>Establecimiento y aceptación de compromisos</label>
        <TablaCompromisos
          value={formData.compromisos}
          onChange={handleCompromisosTableChange}
        />
      </div>

      <div className="form-group">
        <label>Asistentes y aprobación de decisiones</label>
        <TablaAsistentes
          value={formData.asistentes}
          onChange={handleAsistentesTableChange}
        />
      </div>

      <div className="form-group">
        <label>Conclusiones</label>
        {formData.conclusiones.map((conclusion, index) => (
          <div key={index} className="agenda-item dynamic-field-item">
            <input
              type="text"
              value={conclusion}
              onChange={(e) => handleDynamicFieldChange('conclusiones', index, e.target.value)}
              placeholder={`Conclusión ${index + 1}`}
            />
            {formData.conclusiones.length > 1 && (
              <button type="button" onClick={() => removeDynamicFieldPoint('conclusiones', index)} className="btn-remove">
                🗑️
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addDynamicFieldPoint('conclusiones')} className="btn-add-point">+ Añadir Conclusión</button>
      </div>

      <div className="form-footer">
        <p className="data-protection-text">
          "En mi calidad de titular de la información, actuando libre y voluntariamente, autorizo de manera previa, explícita e inequívoca al SENA para el tratamiento de mis datos personales aquí consignados, principalmente para fines académicos, de caracterización de la población objeto de la entidad y seguimiento a mis compromisos. Soy consciente de que el tratamiento de mis datos incluye la recolección, almacenamiento, uso, circulación y supresión de los mismos, conforme a la Política de Tratamiento de Datos Personales del SENA, la cual declaro conocer y que puedo consultar en cualquier momento. Declaro que la información aquí suministrada es veraz y que he sido informado sobre el derecho a conocer, actualizar y rectificar mis datos personales, así como los demás derechos establecidos en la Ley 1581 de 2012."
        </p>
        <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar Acta</button>
        </div>
      </div>
    </form>
  );
};

export default FormularioActa;