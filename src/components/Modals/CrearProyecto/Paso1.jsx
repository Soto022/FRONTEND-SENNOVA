import PropTypes from 'prop-types';

const Paso1 = ({ data, updateData, semilleros }) => {
  // Un solo manejador para todos los inputs, basado en el atributo 'name'
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Filtrar solo los semilleros activos para mostrar en el select
  const activeSemilleros = semilleros.filter(s => s.estado === 'activo');

  return (
    <form className="form-step">
      <h3 className="step-title">Información principal del Proyecto</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Regional</label>
          <p className="static-info">CALDAS</p>
        </div>
        <div className="form-group">
          <label>Municipio</label>
          <p className="static-info">MANIZALES</p>
        </div>
      </div>
      
      <div className="form-group">
        <label>Centro de Formación</label>
        <p className="static-info">CAI (CENTRO DE AUTOMATIZACION INDUSTRIAL)</p>
      </div>


      <div className="form-group">
        <label htmlFor="nombreProyecto">Título del proyecto</label>
        <input 
          type="text" 
          id="nombreProyecto"
          name="nombreProyecto" // Estandarizado a camelCase
          value={data.nombreProyecto || ''}
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label htmlFor="semillero">Semillero</label>
        <select 
          id="semillero"
          name="semillero" // Estandarizado a camelCase
          value={data.semillero || ''}
          onChange={handleChange}
        >
          <option value="">Seleccionar...</option>
          {activeSemilleros.map(semillero => (
            <option key={semillero.name} value={semillero.name}>
              {semillero.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="lineaInvestigacion">Línea de Investigación Asociada</label>
        <select 
          id="lineaInvestigacion"
          name="lineaInvestigacion" // Estandarizado a camelCase
          value={data.lineaInvestigacion || ''}
          onChange={handleChange}
        >
          <option value="">Seleccionar...</option>
          <option value="Inteligencia Artificial">Inteligencia Artificial</option>
          <option value="Desarrollo de Software">Desarrollo de Software</option>
          <option value="Ciberseguridad">Ciberseguridad</option>
          <option value="Big Data">Big Data</option>
          <option value="Internet de las Cosas (IoT)">Internet de las Cosas (IoT)</option>
          <option value="Robótica">Robótica</option>
          <option value="Realidad Virtual/Aumentada">Realidad Virtual/Aumentada</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fechaInicio">Fecha de inicio</label>
          <input 
            type="date" 
            id="fechaInicio"
            name="fechaInicio" // Estandarizado a camelCase
            value={data.fechaInicio || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaFin">Fecha de fin</label>
          <input 
            type="date" 
            id="fechaFin"
            name="fechaFin" // Estandarizado a camelCase
            value={data.fechaFin || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="liderProyecto">Líder de proyecto</label>
        <input 
          type="text" 
          id="liderProyecto"
          name="liderProyecto" // Estandarizado a camelCase
          value={data.liderProyecto || ''}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

// Buenas prácticas: Añadir PropTypes para validación de tipos
Paso1.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  semilleros: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
  })),
};

// Valor por defecto para semilleros para evitar errores si no se carga
Paso1.defaultProps = {
  semilleros: [],
};

export default Paso1;
