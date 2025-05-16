import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import heroImage from '../assets/avion.jpg';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a EDY AIRLINES</h1>
          <p>Descubre el mundo con nuestras increíbles ofertas</p>
          <Link to="/reserva" className="btn-primary">Reservar Vuelo</Link>
        </div>
        <img src={heroImage} alt="Avión volando" className="hero-image" />
      </section>
      <section className="info-section">
        <h2>¿Por qué volar con nosotros?</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>Seguridad</h3>
            <p>La seguridad de nuestros pasajeros es nuestra máxima prioridad.</p>
          </div>
          <div className="info-card">
            <h3>Comodidad</h3>
            <p>Asientos ergonómicos y servicio de primera clase.</p>
          </div>
          <div className="info-card">
            <h3>Destinos</h3>
            <p>Más de 100 destinos en todo el mundo.</p>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <h2>¿Ya tienes un vuelo reservado?</h2>
        <Link to="/checkin" className="btn-secondary">Haz Check-in Online</Link>
      </section>
    </div>
  );
};

export default HomePage;