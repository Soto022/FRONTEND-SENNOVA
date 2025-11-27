import { Link } from 'react-router-dom';
import './SemilleroCard.css';

const SemilleroCard = ({ semillero, onToggleEstado, onEdit, onDelete }) => {
  const { id, nombre, estado } = semillero;
  const isActivo = estado === 'activo';

  const handleToggle = () => {
    onToggleEstado(semillero);
  };

  const handleEdit = () => {
    const newName = prompt('Ingresa el nuevo nombre para el semillero:', nombre);
    if (newName && newName.trim() !== '' && newName !== nombre) {
      onEdit(id, newName);
    }
  };

  const handleDelete = () => {
    const confirmation = prompt(`Para confirmar la eliminación del semillero "${nombre}", escribe su nombre exacto a continuación:`);
    if (confirmation === nombre) {
      if (window.confirm('¿Estás seguro de eliminar este semillero? Esta acción no se puede deshacer.')) {
        onDelete(id);
      }
    } else {
      alert('El nombre ingresado no coincide. La eliminación ha sido cancelada.');
    }
  };

  return (
    <div className={`semillero-card ${!isActivo ? 'semillero-card--desactivado' : ''}`}>
      <div className="semillero-card__header">
        <h3 className="semillero-card__nombre">{nombre}</h3>
        <div className="semillero-card__icon-actions">
          <button onClick={handleEdit} className="semillero-card__icon-btn" aria-label="Editar semillero">✏️</button>
          <button onClick={handleDelete} className="semillero-card__icon-btn" aria-label="Eliminar semillero">🗑️</button>
        </div>
      </div>
      <p className="semillero-card__estado">Estado: {isActivo ? 'Activo' : 'desactivado'}</p>

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
          className={`semillero-card__btn semillero-card__btn--${isActivo ? 'desactivar' : 'activar'}`}>
          {isActivo ? 'desactivar' : 'Activar'}
        </button>
      </div>
    </div>
  );
};

export default SemilleroCard;