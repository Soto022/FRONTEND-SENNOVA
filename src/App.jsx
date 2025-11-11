// src/App.jsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Proyectos from './pages/Proyectos/Proyectos.jsx';
import Aprendices from './pages/Aprendices/Aprendices.jsx';
import Instructores from './pages/Instructores/Instructores.jsx';
import Cronograma from './pages/Cronograma/Cronograma.jsx'; // Importar el nuevo componente
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import DetallesProyecto from './components/DetallesProyecto/DetallesProyecto.jsx';
import './styles/index.css';

// --- Componentes de marcador de posición ---
const Evidencias = () => <div style={{ padding: '2rem' }}><h1>Evidencias</h1><p>Aquí se mostrarán las evidencias de los proyectos.</p></div>;
// Se elimina el componente temporal de Cronograma
// -----------------------------------------

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app">
      {/* Botón Hamburguesa y Overlay se mantienen igual */}
      <button 
        className={`hamburger-btn ${isSidebarOpen ? 'hamburger-btn--open' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
        aria-expanded={isSidebarOpen}
      >
        <span className="hamburger-btn__line"></span>
        <span className="hamburger-btn__line"></span>
        <span className="hamburger-btn__line"></span>
      </button>
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Nuevo contenedor para Header, Main y Footer */}
      <div className="app-content-wrapper">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/aprendices" element={<Aprendices />} />
            <Route path="/instructores" element={<Instructores />} />
            <Route path="/evidencias" element={<Evidencias />} />
            <Route path="/cronograma" element={<Cronograma />} />
            <Route path="/detalles-proyecto/:id" element={<DetallesProyecto />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;