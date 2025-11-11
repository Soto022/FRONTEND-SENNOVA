import { Link } from 'react-router-dom';
import './SemilleroCard.css';

const SemilleroCard = ({ nombre, onDelete }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(nombre);
    }
  };

  return (
    <div className="semillero-card">
      <h3 className="semillero-card__nombre">{nombre}</h3>
      <div className="semillero-card__actions">
        <Link to={`/proyectos?semillero=${encodeURIComponent(nombre)}`} className="semillero-card__btn">
          Ver proyectos
        </Link>
        <button onClick={handleDelete} className="semillero-card__btn semillero-card__btn--delete">
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default SemilleroCard;
