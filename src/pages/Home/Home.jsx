import { useState } from 'react';
import './home.css';
import SemilleroCard from '../../components/SemilleroCard/SemilleroCard.jsx';
import CrearSemilleroModal from '../../components/Modals/CrearSemillero/CrearSemilleroModal.jsx';
import Button from '../../components/Button/Button.jsx';
import { useProjects } from '../../hook/useProjects';
import '../../components/Modals/ConfirmationModal/ConfirmationModal.css';

// Modal de Confirmación
const ConfirmationModal = ({ isOpen, onClose, onConfirm, semillero, actionText }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Acción</h2>
        <p>¿Estás seguro de que quieres {actionText} el semillero "{semillero.nombre}"?</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={onConfirm}>
            {actionText.charAt(0).toUpperCase() + actionText.slice(1)}
          </Button>
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
  const [confirmationActionText, setConfirmationActionText] = useState('');

  const handleSaveSemillero = (semilleroName) => {
    createSemillero(semilleroName);
    setIsCrearSemilleroModalOpen(false);
  };

  const handleOpenToggleSemilleroModal = (semillero) => {
    setSelectedSemillero(semillero);

    setConfirmationActionText(
      semillero.estado === 'activo' ? 'inactivar' : 'activar'
    );

    setIsConfirmationModalOpen(true);
  };

  const handleConfirmToggleSemillero = () => {
    if (selectedSemillero) {
      console.log('handleConfirmToggleSemillero - selectedSemillero.id:', selectedSemillero.id);
      // Buscar el semillero actualizado del array global 'semilleros'
      const currentSemillero = semilleros.find(s => s.id === selectedSemillero.id);
      console.log('handleConfirmToggleSemillero - currentSemillero:', currentSemillero);

      if (currentSemillero) {
        toggleSemilleroEstado(currentSemillero.nombre); // Usar el nombre del semillero actualizado
      }
      setIsConfirmationModalOpen(false);
      setSelectedSemillero(null);
      setConfirmationActionText(''); // Limpiar actionText
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedSemillero(null);
    setConfirmationActionText('');
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
          {semilleros.map((semillero, index) => (
            <SemilleroCard 
              key={`${semillero.id}-${index}`}
              semillero={semillero}
              onToggleEstado={handleOpenToggleSemilleroModal}
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
          actionText={confirmationActionText}
        />
      )}
    </div>
  );
};

export default Home;
