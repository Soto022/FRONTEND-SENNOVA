// src/App.jsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Proyectos from './pages/Proyectos/Proyectos.jsx';
import Aprendices from './pages/Aprendices/Aprendices.jsx';
import Instructores from './pages/Instructores/Instructores.jsx';
import Cronograma from './pages/Cronograma/Cronograma.jsx';
import Evidencias from './pages/Evidencias/Evidencias.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import DetallesProyecto from './components/DetallesProyecto/DetallesProyecto.jsx';
// import ProjectsProvider from './context/ProjectsContext.jsx'; // Importar el proveedor - ELIMINADO
import './styles/index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    // <ProjectsProvider> {/* Envolver con el proveedor - ELIMINADO */}
      <div className={`app ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <div className="app-content-wrapper">
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
    // </ProjectsProvider> // ELIMINADO
  );
}

export default App;
