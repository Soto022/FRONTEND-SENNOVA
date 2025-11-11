// src/components/Modals/CrearProyecto/Paso2.jsx
const Paso2 = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="form-step">
      <h3 className="step-title">Estructuración del proyecto</h3>
      <div className="form-group">
        <label htmlFor="resumen">Resumen del proyecto</label>
        <textarea 
          id="resumen"
          name="resumen"
          rows="3" 
          value={data.resumen || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="problema">Planteamiento del problema</label>
        <textarea 
          id="problema"
          name="problema"
          rows="3" 
          value={data.problema || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="objetivo">Objetivo General</label>
        <textarea 
          id="objetivo"
          name="objetivo"
          rows="3" 
          value={data.objetivo || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="objetivosEspecificos">Objetivos Específicos</label>
        <textarea 
          id="objetivosEspecificos"
          name="objetivosEspecificos"
          rows="3" 
          value={data.objetivosEspecificos || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="justificacion">Justificación</label>
        <textarea 
          id="justificacion"
          name="justificacion"
          rows="3" 
          value={data.justificacion || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="metodologia">Metodología</label> {/* Changed label */}
        <textarea 
          id="metodologia"
          name="metodologia"
          rows="3" 
          value={data.metodologia || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="impactos">Impactos</label> {/* New field */}
        <textarea 
          id="impactos"
          name="impactos"
          rows="3" 
          value={data.impactos || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="alcance">Alcance del Proyecto</label>
        <textarea 
          id="alcance"
          name="alcance"
          rows="3" 
          value={data.alcance || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="palabrasClave">Palabras Clave</label> {/* New field */}
        <textarea 
          id="palabrasClave"
          name="palabrasClave"
          rows="3" 
          value={data.palabrasClave || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="beneficiarios">Beneficiarios</label> {/* New field */}
        <textarea 
          id="beneficiarios"
          name="beneficiarios"
          rows="3" 
          value={data.beneficiarios || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="bibliografia">Bibliografía</label> {/* New field */}
        <textarea 
          id="bibliografia"
          name="bibliografia"
          rows="3" 
          value={data.bibliografia || ''}
          onChange={handleChange}
        ></textarea>
      </div>
    </form>
  );
};
export default Paso2;
