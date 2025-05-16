import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Stepper from '../components/Common/Stepper';
import InicioCheckIn from '../components/CheckIn/InicioCheckIn';
import DetallesVuelo from '../components/CheckIn/DetallesVuelo';
import SeleccionAsiento from '../components/CheckIn/SeleccionAsiento';
import TarjetaEmbarque from '../components/CheckIn/TarjetaEmbarque';
import '../styles/CheckInPage.css';
import { showSuccessAlert, showErrorAlert, showLoadingAlert } from './Notificaciones';


const steps = [{ id: 1, title: 'Verificar Reserva' },{ id: 2, title: 'Detalles del Vuelo' },{ id: 3, title: 'Seleccionar Asiento' },{ id: 4, title: 'Tarjeta de Embarque' }];

const CheckInPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reserva, setReserva] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null);
  const [tarjetaEmbarque, setTarjetaEmbarque] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerificarReserva = async (codigoReserva, apellido) => {
    if (!codigoReserva || !apellido) {
      await showErrorAlert('Por favor completa todos los campos');
      return; 
    };
    try {
      const response = await api.post('/pasajeros/verificar-reserva', {codigoReserva,apellido});
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Reserva no encontrada');
      }setReserva(response.data.data);
      setCurrentStep(2);
      loadingAlert.close();
      await showSuccessAlert('Reserva encontrada', '¡Todo listo para continuar con tu check-in!');
    } catch (err) {
      loadingAlert.close();
      await showErrorAlert(
        'Reserva no encontrada', err.response?.data?.error || 'Verifica los datos e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinuarCheckIn = async () => {;
    try {
      const response = await api.get(`/pasajeros/vuelo/${reserva.id_vuelo}/asientos`);
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Error al obtener asientos');
      }setAsientos(response.data.data || []);
      setCurrentStep(3);
      loadingAlert.close();
       await showSuccessAlert('¡Check-in completado!',  `Tu asiento ${asientoSeleccionado} ha sido reservado con éxito.`);
    } catch (err) {
      loadingAlert.close();
      await showErrorAlert('Error en check-in', err.response?.data?.error || 'No se pudo completar el check-in. Intenta nuevamente.'
    );
    }
  };

  const handleConfirmarCheckIn = async () => {
    if (!asientoSeleccionado) {setError('Por favor selecciona un asiento');
      return;
    }setLoading(true);
    try {
      const response = await api.post('/pasajeros/checkin', {idReserva: reserva.id_reserva,asiento: asientoSeleccionado});
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Error al realizar check-in');
      }
      const tarjetaResponse = await api.get(`/pasajeros/checkin/${response.data.data.idCheckin}/tarjeta-embarque`);
      setTarjetaEmbarque(tarjetaResponse.data.data);
      setCurrentStep(4);
    } catch (err) {
      console.error('Error en check-in:', {error: err,response: err.response});
      setError(err.response?.data?.error || 'Error al realizar el check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-page">
      <div className="container">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="checkin-content">
          {currentStep === 1 && (
            <InicioCheckIn onVerificarReserva={handleVerificarReserva} error={error}loading={loading}/>
          )}
          {currentStep === 2 && reserva && (
            <DetallesVuelo reserva={reserva} onContinuar={handleContinuarCheckIn}onBack={() => setCurrentStep(1)}loading={loading}/>
          )}
          {currentStep === 3 && (
            <SeleccionAsiento asientos={asientos}asientoSeleccionado={asientoSeleccionado}onSeleccionarAsiento={setAsientoSeleccionado}onConfirmar={handleConfirmarCheckIn}onBack={() => setCurrentStep(2)}error={error}loading={loading}/>
          )}
          {currentStep === 4 && tarjetaEmbarque && (
            <TarjetaEmbarque tarjeta={tarjetaEmbarque}onFinalizar={() => navigate('/')}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;