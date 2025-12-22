import React, { useState, useEffect } from 'react';
import './FormularioActa.css';
import TablaCompromisos from '../../Tables/TablaCompromisos';
import TablaAsistentes from '../../Tables/TablaAsistentes';

const initialCompromiso = { actividad: '', fecha: '', responsable: '', firma: '' };
const initialAsistente = { nombre: '', dependencia: '', aprueba: 'Sí', observacion: '', firma: '' };

const initialFormData = {
  actaNo: '',
  reunion: '',
  ciudad: 'Manizales',
  regional: 'Caldas',
  centro: 'Centro de Automatización Industrial',
  fecha: new Date().toISOString().split('T')[0],
  horaInicio: '',
  horaFin: '',
  lugar: '',
  agenda: [''],
  objetivos: [''],
  desarrollo: '',
  conclusiones: '',
  compromisos: [initialCompromiso],
  asistentes: [initialAsistente],
  anexos: '',
  avancePorcentaje: '',
  estadoProyecto: 'en-curso',
};

const FormularioActa = ({ proyecto, onSave, onCancel, actaToEdit }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (actaToEdit) {
      const mergedData = {
        ...initialFormData,
        ...actaToEdit,
        agenda: actaToEdit.agenda && actaToEdit.agenda.length > 0 ? actaToEdit.agenda : [''],
        objetivos: actaToEdit.objetivos && actaToEdit.objetivos.length > 0 ? actaToEdit.objetivos : [''],
        compromisos: actaToEdit.compromisos && actaToEdit.compromisos.length > 0 ? actaToEdit.compromisos : [initialCompromiso],
        asistentes: actaToEdit.asistentes && actaToEdit.asistentes.length > 0 ? actaToEdit.asistentes : [initialAsistente],
        fecha: actaToEdit.fecha ? new Date(actaToEdit.fecha).toISOString().split('T')[0] : initialFormData.fecha,
        regional: actaToEdit.regional || initialFormData.regional,
        centro: actaToEdit.centro || initialFormData.centro,
        conclusiones: actaToEdit.conclusiones || '',
        anexos: actaToEdit.anexos || '',
        avancePorcentaje: actaToEdit.avancePorcentaje || '',
        estadoProyecto: actaToEdit.estadoProyecto || 'en-curso',
      };
      setFormData(mergedData);
    } else {
      setFormData({
        ...initialFormData,
        estadoProyecto: proyecto?.estado || 'en-curso',
        avancePorcentaje: '', 
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
    setFormData(prev => ({ ...prev, [fieldName]: newField.length > 0 ? newField : [''] }));
  };
  
  const handleCompromisosTableChange = (newTableData) => {
    setFormData(prev => ({ ...prev, compromisos: newTableData }));
  };

  const handleAsistentesTableChange = (newTableData) => {
    setFormData(prev => ({ ...prev, asistentes: newTableData }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.actaNo || !formData.reunion || !formData.horaInicio || !formData.horaFin) {
      alert('Por favor, complete los campos obligatorios: ACTA No., Nombre de la reunión, Hora de Inicio y Hora Fin.');
      return;
    }
    if (formData.avancePorcentaje === '' || formData.avancePorcentaje < 0 || formData.avancePorcentaje > 100) {
        alert('Por favor, ingrese un Avance de seguimiento válido (0–100).');
        return;
    }
    if (!formData.estadoProyecto) {
        alert('Por favor, seleccione un Estado del proyecto.');
        return;
    }
    onSave({ ...formData, proyectoId: proyecto.id, proyectoNombre: proyecto.nombreProyecto });
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-acta">
      
      <fieldset className="form-section">
        <legend>Información General</legend>
        
        <div className="form-row">
          <div className="form-group half">
            <label>Acta No. <span className="required">*</span></label>
            <input type="text" name="actaNo" value={formData.actaNo} onChange={handleChange} required />
          </div>
          <div className="form-group half">
            <label>Nombre del comité o reunión <span className="required">*</span></label>
            <input type="text" name="reunion" value={formData.reunion} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group quarter">
            <label>Ciudad y fecha</label>
            <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} readOnly />
          </div>
          <div className="form-group quarter">
            <label>Fecha</label>
            <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
          </div>
          <div className="form-group half">
            <label>Lugar y/o enlace</label>
            <input type="text" name="lugar" value={formData.lugar} onChange={handleChange} placeholder="Oficina, Teams, Meet..." />
          </div>
        </div>

        <div className="form-row">
            <div className="form-group half">
                <label>Hora inicio <span className="required">*</span></label>
                <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
            </div>
            <div className="form-group half">
                <label>Hora fin <span className="required">*</span></label>
                <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group half">
                <label>Dirección / Regional</label>
                <input type="text" name="regional" value={formData.regional} onChange={handleChange} readOnly />
            </div>
            <div className="form-group half">
                <label>Centro</label>
                <input type="text" name="centro" value={formData.centro} onChange={handleChange} readOnly />
            </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Actualización del Proyecto</legend>
        <div className="form-row">
            <div className="form-group half">
                <label>Avance de seguimiento (%) <span className="required">*</span></label>
                <input
                    type="number"
                    name="avancePorcentaje"
                    value={formData.avancePorcentaje}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="Avance para esta acta (0-100)"
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

      <fieldset className="form-section">
        <legend>Agenda o Puntos a Desarrollar</legend>
        {formData.agenda.map((punto, index) => (
          <div key={index} className="dynamic-field-item">
            <span className="item-number">{index + 1}.</span>
            <input
              type="text"
              value={punto}
              onChange={(e) => handleDynamicFieldChange('agenda', index, e.target.value)}
              placeholder="Describa el punto de la agenda"
            />
            {formData.agenda.length > 1 && (
              <button type="button" onClick={() => removeDynamicFieldPoint('agenda', index)} className="btn-remove">
                🗑️
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addDynamicFieldPoint('agenda')} className="btn-add">+ Añadir punto</button>
      </fieldset>

      <fieldset className="form-section">
        <legend>Objetivo(s) de la Reunión</legend>
        {formData.objetivos.map((objetivo, index) => (
          <div key={index} className="dynamic-field-item">
             <span className="item-number">{index + 1}.</span>
            <input
              type="text"
              value={objetivo}
              onChange={(e) => handleDynamicFieldChange('objetivos', index, e.target.value)}
              placeholder="Redactar en infinitivo (Ej: Evaluar, Definir...)"
            />
            {formData.objetivos.length > 1 && (
              <button type="button" onClick={() => removeDynamicFieldPoint('objetivos', index)} className="btn-remove">
                🗑️
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addDynamicFieldPoint('objetivos')} className="btn-add">+ Añadir objetivo</button>
      </fieldset>

      <fieldset className="form-section">
        <legend>Desarrollo de la Reunión</legend>
        <p className="section-description">
            Registre aquí el seguimiento del proyecto, incluyendo avances, revisiones y discusiones relevantes.
        </p>
        <textarea 
            name="desarrollo" 
            value={formData.desarrollo} 
            onChange={handleChange} 
            rows="8"
            placeholder="Describa detalladamente el desarrollo de la reunión..."
        ></textarea>
      </fieldset>

      <fieldset className="form-section">
        <legend>Conclusiones</legend>
        <textarea 
            name="conclusiones" 
            value={formData.conclusiones} 
            onChange={handleChange} 
            rows="5"
            placeholder="Resuma las conclusiones principales..."
        ></textarea>
      </fieldset>

      <fieldset className="form-section">
        <legend>Establecimiento y Aceptación de Compromisos</legend>
        <TablaCompromisos
          value={formData.compromisos}
          onChange={handleCompromisosTableChange}
        />
      </fieldset>

      <fieldset className="form-section">
        <legend>Asistentes y Aprobación de Decisiones</legend>
        <TablaAsistentes
          value={formData.asistentes}
          onChange={handleAsistentesTableChange}
        />
      </fieldset>

      <div className="form-footer">
        <fieldset className="form-section">
            <legend>Protección de Datos Personales</legend>
            <p className="data-protection-text">
              De acuerdo con La Ley 1581 de 2012, Protección de Datos Personales, el Servicio Nacional de Aprendizaje SENA, se compromete a garantizar la seguridad y protección de los datos personales que se encuentran almacenados en este documento, y les dará el tratamiento correspondiente en cumplimiento de lo establecido legalmente.
            </p>
        </fieldset>

        <fieldset className="form-section last-section">
          <legend>Anexos</legend>
          <p className="section-description">
              Describa cualquier documento, enlace o evidencia que se anexe a esta acta.
          </p>
          <textarea
              name="anexos"
              value={formData.anexos}
              onChange={handleChange}
              rows="3"
              placeholder="Ej: Documento de requisitos v1.2, Enlace a la presentación..."
          ></textarea>
        </fieldset>

        <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar Acta</button>
        </div>
      </div>
    </form>
  );
};

export default FormularioActa;
