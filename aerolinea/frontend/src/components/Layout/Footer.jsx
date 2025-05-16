import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>EDY Airlines</h3>
          <a href="#" className="footer-link">Sobre nosotros</a>
          <a href="#" className="footer-link">Carreras</a>
          <a href="#" className="footer-link">Prensa</a>
        </div>
        <div className="footer-section">
          <h3>Ayuda</h3>
          <a href="#" className="footer-link">Centro de ayuda</a>
          <a href="#" className="footer-link">Contáctanos</a>
          <a href="#" className="footer-link">Preguntas frecuentes</a>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <a href="#" className="footer-link">Términos y condiciones</a>
          <a href="#" className="footer-link">Política de privacidad</a>
          <a href="#" className="footer-link">Aviso legal</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Edy Airlines. Todos los derechos reservados.</p>
        <p>German Alejandro Marcillo Martínez - Juan David Moncayo López - Marian Alejandra Pabón Caicedo</p>
      </div>
    </footer>
  );
};

export default Footer;