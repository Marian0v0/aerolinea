import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/HistorialPage.css';
import api from '../services/api';

const HistorialPage = () => {
  const [step, setStep] = useState(1);
  const [documento, setDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerificarCliente = async (e) => {
    e.preventDefault();
    if (!documento || !nombre) {
      setError('Por favor ingresa documento y nombre completo');
      return;
    }
    const [nombreBusqueda, apellidoBusqueda] = nombre.split(' ').filter(Boolean);
    if (!apellidoBusqueda) {
      setError('Por favor ingresa nombre y apellido');
      return;
    }setLoading(true);
    try {
        const response = await api.get('/clientes/verificar', {
          params: {documento,nombre: `${nombreBusqueda} ${apellidoBusqueda}`}
        });
        if (!response.data?.success) {
          throw new Error(response.data?.error || 'Credenciales incorrectas');
        }
        const clienteData = response.data.data;
        const historialResponse = await api.get(`/clientes/historial/${documento}`);
      if (!historialResponse.data?.success) {
        throw new Error(historialResponse.data?.error || 'Error al obtener historial');
      }let historialData = historialResponse.data.data;
      if (clienteData.id_cliente && !historialData.cliente) {
        historialData.cliente = {id_cliente: clienteData.id_cliente,numero_miembro: clienteData.numero_miembro,nivel_membresia: clienteData.nivel_membresia,puntos: clienteData.puntos};
      }
        historialData.reservas = historialData.reservas.sort((a, b) => 
          new Date(b.hora_salida) - new Date(a.hora_salida)
        );
        setHistorial(historialData);
        setStep(2);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Error al verificar credenciales');
      } finally {
        setLoading(false);
      }
    };

  const formatPrecio = (precio) => {
    const precioNum = Number(precio);
    return precioNum.toLocaleString('es-CO', {style: 'currency',currency: 'COP'});
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit'});
  };

  if (step === 1) {
    return (
      <div className="historial-login">
        <h2>Consulta tu Historial</h2>
        <form onSubmit={handleVerificarCliente}>
          <div className="form-group">
            <label>Documento de Identidad</label>
            <input type="text"value={documento}onChange={(e) => setDocumento(e.target.value)}placeholder="Número de documento"required/>
          </div>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input type="text"value={nombre}onChange={(e) => setNombre(e.target.value)}placeholder="Nombre y apellido"required/>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Verificando...' : 'Ingresar'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="historial-page">
      <div className="historial-header">
        <h2>Mi Historial de Viajes</h2>
        <button onClick={() => setStep(1)} className="btn-secundario">Cambiar Usuario</button>
      </div>
      {historial?.cliente && (
        <div className="cliente-frecuente-info">
          <h3>Estado de Cliente Frecuente</h3>
          <div className="cliente-card">
            <p><strong>Número de miembro:</strong> {historial.cliente.numero_miembro}</p>
            <p><strong>Nivel:</strong> <span className={`nivel-${historial.cliente.nivel_membresia}`}>
              {historial.cliente.nivel_membresia}
            </span></p>
            <p><strong>Tipo membresía:</strong> {historial.cliente.nivel_membresia}</p>
            <p><strong>Total reservas:</strong> {historial.reservas.length}</p>
          </div>
        </div>
      )}
      <div className="metodos-pago-section">
        <h3>Métodos de Pago Guardados</h3>
        {historial?.metodos_pago?.length > 0 ? (
          <div className="metodos-grid">
            {historial.metodos_pago.map(metodo => (
              <div key={metodo.id_metodo} className="metodo-card">
                <div className="metodo-header">
                  <span className={`tipo-${metodo.tipo}`}>
                    {metodo.tipo === 'tarjeta_credito' ? 'Crédito' : 'Débito'}
                  </span>
                  {metodo.es_principal && <span className="principal-badge">Principal</span>}
                </div>
                <div className="metodo-numero">•••• •••• •••• {metodo.numero_tarjeta.slice(-4)}</div>
                <div className="metodo-footer">
                  <span>{metodo.nombre_titular}</span>
                  <span>Expira: {metodo.fecha_expiracion}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sin-metodos">
            <p>No tienes métodos de pago guardados</p>
            {historial?.cliente && (
              <button onClick={() => navigate('/pago')}className="btn-primario">Agregar Método de Pago</button>
            )}
          </div>
        )}
      </div>
      <div className="viajes-lista">
        <h3>Historial de Reservas</h3>
        {historial?.reservas?.length === 0 ? (
          <div className="sin-reservas">
            <p>No tienes reservas registradas</p>
            <button onClick={() => navigate('/reserva')} className="btn-primario">Realizar una Reserva</button>
          </div>
        ) : (
          <div className="reservas-grid">
            {historial.reservas.map((reserva) => (
              <div key={reserva.id_reserva} className={`reserva-card ${reserva.estado}`}>
                <div className="reserva-header">
                  <h4>{reserva.origen} → {reserva.destino}</h4>
                  <span className={`estado-${reserva.estado}`}>{reserva.estado}</span>
                </div>
                <div className="reserva-body">
                  <p><strong>Fecha:</strong> {formatFecha(reserva.hora_salida)}</p>
                  <p><strong>Código:</strong> {reserva.codigo_reserva}</p>
                  <p><strong>Clase:</strong> {reserva.clase}</p>
                  <p><strong>Total:</strong> {formatPrecio(reserva.precio_total)}</p>
                </div>
                <div className="reserva-actions">
                  <Link to={`/reserva/${reserva.id_reserva}`} className="btn-detalles" >Ver Detalles</Link>
                  {reserva.estado === 'confirmada' && (
                    <Link to={`/checkin?codigo=${reserva.codigo_reserva}&apellido=${historial.cliente?.apellido || nombre.split(' ')[1]}`}className="btn-checkin">Hacer Check-in</Link>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialPage;