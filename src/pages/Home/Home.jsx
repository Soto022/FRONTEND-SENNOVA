import { useState } from 'react';
import './home.css';
import SemilleroCard from '../../components/SemilleroCard/SemilleroCard.jsx';
import CrearSemilleroModal from '../../components/Modals/CrearSemillero/CrearSemilleroModal.jsx';
import Button from '../../components/Button/Button.jsx';
import { useProjects } from '../../hook/useProjects';

const Home = () => {
  const userName = "Diana Carolina"; 
  const { semilleros, createSemillero, deleteSemillero } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveSemillero = (semilleroName) => {
    createSemillero(semilleroName);
    setIsModalOpen(false);
  };

  const handleDeleteSemillero = (semilleroName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el semillero "${semilleroName}"?`)) {
      const confirmation = window.prompt(`Para confirmar, escribe el nombre del semillero: "${semilleroName}"`);
      if (confirmation === semilleroName) {
        deleteSemillero(semilleroName);
      } else {
        alert('El nombre del semillero no coincide. Eliminación cancelada.');
      }
    }
  };

  return (
    <div className="home-page">
      <div className="home-page__welcome">
        <h1 className="home-page__welcome-title">Bienvenida {userName}</h1>
      </div>

      <div className="home-page__semilleros-section">
        <div className="home-page__semilleros-header">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Crear semillero
          </Button>
        </div>
        <div className="home-page__semilleros-grid">
          {semilleros.map(nombre => (
            <SemilleroCard 
              key={nombre} 
              nombre={nombre} 
              onDelete={handleDeleteSemillero}
            />
          ))}
        </div>
      </div>

      <CrearSemilleroModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSemillero}
      />
    </div>
  );
};

export default Home;