import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import CheckInPage from './pages/CheckInPage';
import PagoPage from './pages/PagoPage';
import ReservaPage from './pages/ReservaPage';
import HistorialPage from './pages/HistorialPage';
import ReservaCompletada from './pages/ReservaCompletada';
import ReservaDetallePage from './pages/ReservaDetallePage'
import './styles/main.css';
import './styles/theme.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkin" element={<CheckInPage />} />
            <Route path="/pago" element={<PagoPage />} />
            <Route path="/reserva" element={<ReservaPage />} />
            <Route path="/historial" element={<HistorialPage />} />
            <Route path="/reserva-completada" element={<ReservaCompletada />} />
            <Route path="/reserva/:idReserva" element={<ReservaDetallePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;