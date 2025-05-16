import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import './ReservaCompletada.css';
import FormularioPago from '../components/Pago/FormularioPago';

const ReservaCompletada = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { reserva } = state || {};
  const [mostrarFormPago, setMostrarFormPago] = useState(false);
  const [esClienteFrecuente, setEsClienteFrecuente] = useState(reserva?.es_cliente_frecuente || false);
  const [idCliente, setIdCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verificarClienteFrecuente = async () => {
      if (reserva?.id_pasajero && !reserva.es_cliente_frecuente) {
        try {
          setLoading(true);
          const response = await api.get(`/reservas/count?pasajero=${reserva.id_pasajero}`);
          if (response.data.total >= 3) {
            const clienteResponse = await api.post('/clientes/registrar', {
              id_pasajero: reserva.id_pasajero,
              numero_miembro: `CF${Date.now().toString().slice(-6)}`
            });
            setEsClienteFrecuente(true);
            setIdCliente(clienteResponse.data.id_cliente);
          }
          } catch (error) {
            console.error('Error al verificar cliente frecuente:', error);
          } finally {
            setLoading(false);
          }
        } else if (reserva?.es_cliente_frecuente) {
          setIdCliente(reserva.id_cliente);
        }
      };verificarClienteFrecuente();
    }, [reserva]);

    const handleGuardarMetodoPago = async (datosPago) => {
      try {
        setLoading(true);
        setError('');
        if (!idCliente) {
          throw new Error('No se pudo identificar como cliente frecuente');
        }
        await api.post(`/clientes/${idCliente}/metodos-pago`, datosPago);
        setMostrarFormPago(false);
        alert('Método de pago guardado exitosamente!');
      } catch (error) {
        setError(error.response?.data?.error || error.message || 'Error al guardar método de pago');
      } finally {
        setLoading(false);
      }
    };
    if (!reserva) {
      return (
        <div className="reserva-completada">
          <div className="error-message">
            <h2>No se encontraron datos de la reserva</h2>
            <button onClick={() => navigate('/')} className="btn-primario">Volver al Inicio</button>
          </div>
        </div>
      );
    }

    const formatFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES', {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',hour: '2-digit',minute: '2-digit'});
    };

  return (
    <div className="reserva-completada">
      <div className="reserva-header">
        <h1>¡Reserva Confirmada!</h1>
         <p className="codigo-reserva">Código: {reserva.codigo_reserva}</p>
        {esClienteFrecuente && <p className="cliente-frecuente-badge">Cliente Frecuente</p>}
      </div>
      <div className="reserva-detalles">
        <div className="detalle-vuelo">
          <h2>Detalles del Vuelo</h2>
          <p><strong>Ruta:</strong> {reserva.vuelo.origen} → {reserva.vuelo.destino}</p>
          <p><strong>Salida:</strong> {formatFecha(reserva.vuelo.hora_salida)}</p>
          <p><strong>Llegada:</strong> {formatFecha(reserva.vuelo.hora_llegada)}</p>
          <p><strong>Clase:</strong> {reserva.clase}</p>
        </div>
        <div className="detalle-pasajero">
          <h2>Información del Pasajero</h2>
          <p><strong>Nombre:</strong> {reserva.nombre} {reserva.apellido}</p>
          <p><strong>Documento:</strong> {reserva.documento}</p>
          <p><strong>Email:</strong> {reserva.email}</p>
        </div>
        <div className="detalle-pago">
          <h2>Detalles de Pago</h2>
          <p><strong>Total Pagado:</strong> ${reserva.precio_total.toFixed(2)}</p>
          <p><strong>Estado:</strong> Confirmado</p>
        </div>
      </div>
      {}
       {esClienteFrecuente && (
        <div className="seccion-cliente-frecuente">
          <h3>Felicitaciones! Ahora eres cliente Frecuente</h3>
           {idCliente ? (
              <p>Número de miembro: CF{idCliente.toString().padStart(6, '0')}</p>
            ) : (<p>Número de miembro: Generando...</p>)}
          {!mostrarFormPago ? (
            <div className="acciones-cliente">
              <p>Ahora puedes guardar métodos de pago para agilizar futuras reservas</p>
              <button onClick={() => setMostrarFormPago(true)}className="btn-primario"disabled={loading || !idCliente}>{loading ? 'Cargando...' : 'Agregar Método de Pago'}</button>
            </div>
          ) : (
            <div className="formulario-metodo-container">
              <FormularioPago onGuardar={handleGuardarMetodoPago} onCancelar={() => setMostrarFormPago(false)}/>
              {error && <div className="error-message">{error}</div>}
            </div>
          )}
        </div>
      )}
      <div className="reserva-acciones">
        <button onClick={() => navigate('/historial')} className="btn-secundario">Ver Historial</button>
        <button onClick={() => navigate('/')} className="btn-primary">Volver al Inicio</button>
      </div>
    </div>
  );
};

export default ReservaCompletada;