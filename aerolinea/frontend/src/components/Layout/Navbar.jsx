import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navItems = [{ path: '/', label: 'Inicio' },{ path: '/reserva', label: 'Reservar Vuelo' },{ path: '/checkin', label: 'Check-in' },{ path: '/historial', label: 'Mis Viajes' }];
  const toggleMobileMenu = () => {setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="logo-text">EDY</span>
          <span className="logo-airlines">Airlines</span>
        </Link>
        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>{navItems.map((item) => (
            <Link key={item.path}to={item.path}className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>))}
        </div>
        <button className="navbar-toggle"onClick={toggleMobileMenu}aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>{mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}</button>
      </div>
    </nav>
  );
};

export default Navbar;