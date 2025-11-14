import { Link } from 'react-router-dom';
import './SemilleroCard.css';

const SemilleroCard = ({ semillero, onToggleEstado }) => {

  const { _id, nombre, estado } = semillero;
  const isActivo = estado === 'activo';

  const handleToggle = () => {
    // Enviar el semillero COMPLETO, no solo el nombre
    onToggleEstado(semillero);
  };

  return (
    <div className={`semillero-card ${!isActivo ? 'semillero-card--inactivo' : ''}`}>
      <h3 className="semillero-card__nombre">{nombre}</h3>
      <p className="semillero-card__estado">Estado: {isActivo ? 'Activo' : 'Inactivo'}</p>

      <div className="semillero-card__actions">
        {isActivo ? (
          <Link 
            to={`/proyectos?semillero=${encodeURIComponent(nombre)}`} 
            className="semillero-card__btn">
            Ver proyectos
          </Link>
        ) : (
          <span className="semillero-card__btn semillero-card__btn--disabled">
            Ver proyectos
          </span>
        )}

        <button 
          onClick={handleToggle}
          className={`semillero-card__btn semillero-card__btn--${isActivo ? 'inactivar' : 'activar'}`}>
          {isActivo ? 'Inactivar' : 'Activar'}
        </button>
      </div>
    </div>
  );
};

export default SemilleroCard;
