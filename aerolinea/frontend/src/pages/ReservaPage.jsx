import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormularioReserva from '../components/Reserva/FormularioReserva';
import ConfirmacionReserva from '../components/Reserva/ConfirmacionReserva';
import { obtenerVuelosDisponibles} from '../services/reservaService';
import '../styles/ReservaPage.css';
import { showSuccessAlert, showErrorAlert, showConfirmDialog} from './Notificaciones'

const ReservaPage = () => {
  const [step, setStep] = useState(1);
  const [reservaData, setReservaData] = useState(null);
  const [vuelosDisponibles, setVuelosDisponibles] = useState([]);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleBuscarVuelos = async (datosBusqueda) => {
    try {
      setError('');
      const vuelos = await obtenerVuelosDisponibles( datosBusqueda.origen,datosBusqueda.destino,datosBusqueda.fechaIda);
      if (vuelos.length === 0) {
        setError('No hay vuelos disponibles para los criterios seleccionados');
        return;
      }setReservaData(datosBusqueda);
      setVuelosDisponibles(vuelos);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Error al buscar vuelos');
    }
  };

  const handleSeleccionarVuelo = (vuelo) => {
    setVueloSeleccionado(vuelo);
    setStep(3);
  };

  const calcularPrecioTotal = (clase, pasajeros,precioBase) => {
    const multiplicadoresClase = {economica: 1.0,premium: 1.5,business: 2.0,primera: 3.0
    };return (precioBase * multiplicadoresClase[clase]) * pasajeros;
  };

  const handleConfirmarReserva = async (datosPasajero) => {
     const confirm = await showConfirmDialog(
      'Confirmar reserva',
      `¿Estás seguro de reservar el vuelo ${vueloSeleccionado.codigo_vuelo}?`,
      'Confirmar Reserva'
    );
    
    if (!confirm.isConfirmed) return;

    const loadingAlert = await showLoadingAlert('Procesando reserva...');
    
    try {
      const precioTotal = calcularPrecioTotal(reservaData.clase, reservaData.pasajeros);
      const response = await api.post('/reservas', {idVuelo: vueloSeleccionado.id_vuelo,datosReserva: {clase: reservaData.clase,pasajeros: reservaData.pasajeros,precio_total: precioTotal},datosPasajero: {nombre: datosPasajero.nombre,apellido: datosPasajero.apellido,documento: datosPasajero.documento,email: datosPasajero.email,telefono: datosPasajero.telefono}
    });
      const reservaConfirmada = {id_reserva: response.data.id_reserva,codigo_reserva: response.data.codigo_reserva,vuelo: vueloSeleccionado,clase: reservaData.clase,precio_total: precioTotal,nombre: datosPasajero.nombre,apellido: datosPasajero.apellido,documento: datosPasajero.documento,email: datosPasajero.email,es_cliente_frecuente: response.data.es_cliente_frecuente || false,id_cliente: response.data.id_cliente || null,id_pasajero: response.data.id_pasajero
    };loadingAlert.close();
      await showSuccessAlert(
        '¡Reserva confirmada!', 
        `Tu código de reserva es: <strong>${response.data.codigo_reserva}</strong>`
      );
    navigate('/reserva-completada', { state: { reserva: reservaConfirmada} });
    } catch (err) {
      loadingAlert.close();
      await showErrorAlert(
        'Error al confirmar', 
        err.message || 'No se pudo completar la reserva. Por favor intenta nuevamente.'
    );
    }
  };

  return (
    <div className="reserva-page">
      {step === 1 && (
        <FormularioReserva onSubmit={handleBuscarVuelos} error={error}/>
      )}
      {step === 2 && (
        <div className="lista-vuelos">
          <h2>Vuelos Disponibles</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="vuelos-container">
            {vuelosDisponibles.map(vuelo => (
              <div key={vuelo.id_vuelo} className="vuelo-card">
                <div className="vuelo-info">
                  <h3>{vuelo.origen} → {vuelo.destino}</h3>
                  <p>Salida: {new Date(vuelo.hora_salida).toLocaleString()}</p>
                  <p>Llegada: {new Date(vuelo.hora_llegada).toLocaleString()}</p>
                  <p>Precio:${calcularPrecioTotal(reservaData.clase, 1, vuelo.precio_base).toFixed(2)}</p>
                  <p>Total ({reservaData.pasajeros} pasajeros): ${calcularPrecioTotal(reservaData.clase, reservaData.pasajeros, vuelo.precio_base).toFixed(2)}</p>
                </div>
                <button onClick={() => handleSeleccionarVuelo(vuelo)}className="btn-seleccionar">Seleccionar</button></div>))}
          </div>
        </div>
      )}
      {step === 3 && vueloSeleccionado && (
        <ConfirmacionReserva vuelo={vueloSeleccionado}datosReserva={reservaData}onConfirm={handleConfirmarReserva}onBack={() => setStep(2)}error={error}/>
      )}
    </div>
  );
};

export default ReservaPage;