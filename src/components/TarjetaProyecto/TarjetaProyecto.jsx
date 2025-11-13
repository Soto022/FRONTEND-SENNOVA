import React from 'react';
import PropTypes from 'prop-types';
import './TarjetaProyecto.css';

// Componente para mostrar un campo de detalle, evitando repetición de código
const DetalleItem = ({ label, value }) => (
  <div className="tarjeta-proyecto-item">
    <span className="tarjeta-proyecto-label">{label}</span>
    <span className="tarjeta-proyecto-value">{value ?? 'No especificado'}</span>
  </div>
);

DetalleItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const TarjetaProyecto = ({ proyecto }) => {
  // Normaliza el estado para usarlo como clase CSS
  const estadoClass = (proyecto.estado || 'desconocido').toLowerCase().replace(' ', '-');

  return (
    <div className="tarjeta-proyecto-card">
      <h2 className="tarjeta-proyecto-titulo">
        {proyecto.nombreProyecto || proyecto.name || 'Proyecto sin título'}
      </h2>
      
      <div className="tarjeta-proyecto-grid">
        {/* Información Fija */}
        <DetalleItem label="Regional" value="CALDAS" />
        <DetalleItem label="Municipio" value="MANIZALES" />
        <DetalleItem label="Centro de Formación" value="CAI - Centro de Automatización Industrial" />

        {/* Información Dinámica */}
    
        <DetalleItem label="Línea de Investigación" value={proyecto.lineaInvestigacion} />
        <DetalleItem label="Semillero" value={proyecto.semillero} />
        <DetalleItem label="Líder del Proyecto" value={proyecto.liderProyecto || proyecto.lider} />
        <DetalleItem label="Fecha de Inicio" value={proyecto.fechaInicio} />
        <DetalleItem label="Fecha de Fin" value={proyecto.fechaFin} />

        {/* Estado con estilo especial */}
        <div className="tarjeta-proyecto-item">
          <span className="tarjeta-proyecto-label">Estado</span>
          <span className="tarjeta-proyecto-value">
            <span className={`estado-proyecto ${estadoClass}`}>
              {proyecto.estado ?? 'No especificado'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

TarjetaProyecto.propTypes = {
  proyecto: PropTypes.shape({
    nombreProyecto: PropTypes.string,
    programaFormacion: PropTypes.string,
    lineaInvestigacion: PropTypes.string,
    semillero: PropTypes.string,
    liderProyecto: PropTypes.string,
    fechaInicio: PropTypes.string,
    fechaFin: PropTypes.string,
    estado: PropTypes.string,
  }).isRequired,
};

export default TarjetaProyecto;
