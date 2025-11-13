import { useState } from 'react';
import './home.css';
import SemilleroCard from '../../components/SemilleroCard/SemilleroCard.jsx';
import CrearSemilleroModal from '../../components/Modals/CrearSemillero/CrearSemilleroModal.jsx';
import Button from '../../components/Button/Button.jsx';
import { useProjects } from '../../hook/useProjects';
import '../../components/Modals/ConfirmationModal/ConfirmationModal.css'; // Importar el CSS del modal de confirmación

// Componente Modal de Confirmación simple (se puede mover a un archivo separado si es necesario)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, semillero }) => {
  if (!isOpen) return null;

  const actionText = semillero.estado === 'activo' ? 'inactivar' : 'activar';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Acción</h2>
        <p>¿Estás seguro de que quieres {actionText} el semillero "{semillero.name}"?</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={onConfirm}>{actionText.charAt(0).toUpperCase() + actionText.slice(1)}</Button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const userName = "Diana Carolina"; 
  const { semilleros, createSemillero, toggleSemilleroEstado } = useProjects();
  const [isCrearSemilleroModalOpen, setIsCrearSemilleroModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedSemillero, setSelectedSemillero] = useState(null);

  const handleSaveSemillero = (semilleroName) => {
    createSemillero(semilleroName);
    setIsCrearSemilleroModalOpen(false);
  };

  const handleOpenToggleSemilleroModal = (semillero) => {
    setSelectedSemillero(semillero);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmToggleSemillero = () => {
    if (selectedSemillero) {
      toggleSemilleroEstado(selectedSemillero.name);
      setIsConfirmationModalOpen(false);
      setSelectedSemillero(null);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedSemillero(null);
  };

  return (
    <div className="home-page">
      <div className="home-page__welcome">
        <h1 className="home-page__welcome-title">Bienvenida {userName}</h1>
      </div>

      <div className="home-page__semilleros-section">
        <div className="home-page__semilleros-header">
          <Button variant="primary" onClick={() => setIsCrearSemilleroModalOpen(true)}>
            + Crear semillero
          </Button>
        </div>
        <div className="home-page__semilleros-grid">
          {semilleros.map(semillero => (
            <SemilleroCard 
              key={semillero.name} 
              semillero={semillero} // Pasar el objeto semillero completo
              onToggleEstado={handleOpenToggleSemilleroModal} // Nueva prop para alternar estado
            />
          ))}
        </div>
      </div>

      <CrearSemilleroModal 
        isOpen={isCrearSemilleroModalOpen}
        onClose={() => setIsCrearSemilleroModalOpen(false)}
        onSave={handleSaveSemillero}
      />

      {selectedSemillero && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmToggleSemillero}
          semillero={selectedSemillero}
        />
      )}
    </div>
  );
};

export default Home;