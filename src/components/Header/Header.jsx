// src/components/Header/Header.jsx
import './Header.css';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="header">
      <div className="header__left">
        <button 
          className={`hamburger-btn ${isSidebarOpen ? 'hamburger-btn--open' : ''}`}
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          aria-expanded={isSidebarOpen}
        >
          <span className="hamburger-btn__line"></span>
          <span className="hamburger-btn__line"></span>
          <span className="hamburger-btn__line"></span>
        </button>
        <div className="header__logo">
          <span className="header__logo-text">SENNOVA</span>
        </div>
      </div>
      <button className="header__logout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" y2="12"></line></svg>
        <span>Cerrar sesión</span>
      </button>
    </header>
  );
};

export default Header;
