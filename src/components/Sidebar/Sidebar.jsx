// src/components/Sidebar/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isItemActive = (path) => location.pathname === path;

  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__profile">
          <div className="sidebar__profile-avatar">DC</div>
          <div className="sidebar__profile-info">
            <p className="sidebar__profile-name">Diana Carolina</p>
            <p className="sidebar__profile-role">Admin</p>
          </div>
        </div>
        
        <nav className="sidebar__nav" aria-label="Navegación principal">
          <ul className="sidebar__list">
            <li className={`sidebar__item ${isItemActive('/') ? 'sidebar__item--active' : ''}`}>
              <Link to="/" onClick={onClose}>
                <span className="sidebar__icon"></span>
                <span className="sidebar__text">Inicio</span>
              </Link>
            </li>
            <li className={`sidebar__item ${isItemActive('/proyectos') ? 'sidebar__item--active' : ''}`}>
              <Link to="/proyectos" onClick={onClose}>
                <span className="sidebar__icon"></span>
                <span className="sidebar__text">Proyectos</span>
              </Link>
            </li>
            <li className={`sidebar__item ${isItemActive('/aprendices') ? 'sidebar__item--active' : ''}`}>
              <Link to="/aprendices" onClick={onClose}>
                <span className="sidebar__icon"></span>
                <span className="sidebar__text">Aprendices</span>
              </Link>
            </li>
            <li className={`sidebar__item ${isItemActive('/instructores') ? 'sidebar__item--active' : ''}`}>
              <Link to="/instructores" onClick={onClose}>
                <span className="sidebar__icon"></span>
                <span className="sidebar__text">Instructores</span>
              </Link>
            </li>
            <li className={`sidebar__item ${isItemActive('/cronograma') ? 'sidebar__item--active' : ''}`}>
              <Link to="/cronograma" onClick={onClose}>
                <span className="sidebar__icon"></span>
                <span className="sidebar__text">Cronogramas</span>
              </Link>
            </li>
            <li className={`sidebar__item ${isItemActive('/evidencias') ? 'sidebar__item--active' : ''}`}>
              <Link to="/evidencias" onClick={onClose}>
                <span className="sidebar__icon"></span>
                <span className="sidebar__text">Evidencias</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar__footer">
          <div className={`sidebar__item sidebar__item--logout ${isItemActive('/logout') ? 'sidebar__item--active' : ''}`}>
             <Link to="#" onClick={onClose}>


                <span className="sidebar__icon"></span>
                <span className="sidebar__text">Cerrar sesión</span>
              </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;