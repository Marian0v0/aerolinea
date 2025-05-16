import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormularioPago from '../components/Pago/FormularioPago';
import './ReservaDetallePage.css';

const ReservaDetallePage = () => {
  const { idReserva } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [mostrarFormPago, setMostrarFormPago] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const { data: reservaData } = await api.get(`/reservas/${idReserva}`);
          if (!reservaData.success || !reservaData.data) {
            throw new Error(reservaData.error || 'Datos de reserva no disponibles');
          }
      const reservaFormateada = {...reservaData.data,
        hora_salida: reservaData.data.hora_salida ? new Date(reservaData.data.hora_salida) : null,
        hora_llegada: reservaData.data.hora_llegada ? new Date(reservaData.data.hora_llegada) : null
        };setReserva(reservaFormateada);
        try {
          const { data: clienteData } = await api.get(`/clientes/por-reserva/${idReserva}`);
          if (clienteData?.success && clienteData.data) {
            setCliente(clienteData.data);
            const { data: metodosData } = await api.get(`/clientes/${clienteData.data.id_cliente}/metodos-pago`);
            setMetodosPago(metodosData.data || []);
          }
          if (!clienteData.success) {
          throw new Error(clienteData.error || 'Error al obtener cliente');
          }
          if (!clienteData.data.id_cliente) {
          setShowRegistroCliente(true);
          return;
          }setCliente(clienteData.data);
        } catch (err) {
          console.log('Cliente frecuente no encontrado o sin métodos de pago');
        }
        } catch (err) {
          setError(err.message || 'Error al cargar los detalles');
          console.error('Error completo:', err);
        } finally {
          setLoading(false);
        }
      };cargarDatos();
    }, [idReserva]);

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return 'Fecha inválida';
          const options = { year: 'numeric',  month: 'long',  day: 'numeric', hour: '2-digit', minute: '2-digit' };
          return date.toLocaleDateString('es-ES', options);
        } catch {
          return 'No disponible';
        }
    };

    const handleGuardarMetodoPago = async (datosPago) => {
      try {
        setLoading(true);
        setError('');
        if (!cliente?.id_cliente) {
          throw new Error('Debe ser cliente frecuente para guardar métodos de pago. Regístrese primero.');
        }
        if (!datosPago.numero_tarjeta || !/^\d{13,16}$/.test(datosPago.numero_tarjeta)) {
        throw new Error('Número de tarjeta inválido');
        }
        const response = await api.post(`/clientes/${cliente.id_cliente}/metodos-pago`,datosPago);
        if (!response.data.success) {
        throw new Error(response.data.error || 'Error al guardar');
      }
      const {data} = await api.get(`/clientes/${cliente.id_cliente}/metodos-pago`);
      setMetodosPago(data.data || []);
      setMostrarFormPago(false);
      alert('Método de pago guardado exitosamente');
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Error al guardar método de pago');
      } finally {
        setLoading(false);
      }
    };
  if (loading) return <div className="loading">Cargando detalles...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!reserva) return <div>No se encontró la reserva</div>;

  return (
    <div className="reserva-detalle-container">
      <h1>Detalles de la Reserva #{reserva.codigo_reserva}</h1>
      <div className="reserva-info">
        <h2>Vuelo: {reserva?.origen || 'N/A'} → {reserva?.destino || 'N/A'}</h2>
        <p><strong>Fecha:</strong> {formatDate(reserva?.hora_salida)}</p>
        <p><strong>Hora de salida:</strong> {formatDate(reserva?.hora_salida)}</p>
        <p><strong>Clase:</strong> {reserva?.clase || 'No especificada'}</p>
        <p><strong>Estado:</strong> {reserva?.estado || 'Desconocido'}</p>
        <p><strong>Precio:</strong> ${Number(reserva?.precio_total || 0).toFixed(2)}</p>
        </div>
      {}
      {cliente && (
        <div className="metodos-pago-section">
          <h3>Métodos de Pago Guardados</h3>
          {metodosPago.length > 0 ? (
            <div className="metodos-grid">
              {metodosPago.map(metodo => (
                <div key={metodo.id_metodo} className="metodo-card">
                  <div className="metodo-tipo">
                    {metodo.tipo === 'tarjeta_credito' ? 'Tarjeta Crédito' : 'Tarjeta Débito'}
                  </div>
                  <div className="metodo-numero"> •••• •••• •••• {metodo.numero_tarjeta.slice(-4)}</div>
                  <div className="metodo-titular">{metodo.nombre_titular}</div>
                </div>
              ))}
            </div>
          ) : (<p>No tienes métodos de pago guardados</p>
          )}
          <button onClick={() => setMostrarFormPago(!mostrarFormPago)}className="btn-agregar-metodo">{mostrarFormPago ? 'Cancelar' : 'Agregar Método de Pago'}</button>
          {mostrarFormPago && (
            <div className="formulario-pago-container">
              <FormularioPago precio={Number(reserva?.precio_total) || 0} onRealizarPago={handleGuardarMetodoPago}onGuardarMetodoChange={(guardar) => console.log('Guardar método:', guardar)}error={error}loading={loading}/>
            </div>
          )} </div>
      )}
      <button onClick={() => navigate(-1)} className="btn-volver">Volver al historial</button>
    </div>
  );
};

export default ReservaDetallePage;