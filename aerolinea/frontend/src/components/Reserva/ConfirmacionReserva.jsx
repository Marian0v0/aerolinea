import { useState } from 'react';
import './ConfirmacionReserva.css';
import { useNavigate } from 'react-router-dom';

const ConfirmacionReserva = ({ vuelo, datosReserva, onConfirm, onBack, error }) => {
  const [datosPasajero, setDatosPasajero] = useState({nombre: '',apellido: '',documento: '',email: '',telefono: ''});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate=useNavigate;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosPasajero(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!datosPasajero.nombre.trim()) errors.nombre = 'Nombre requerido';
    if (!datosPasajero.apellido.trim()) errors.apellido = 'Apellido requerido';
    if (!/^\d{6,12}$/.test(datosPasajero.documento)) errors.documento = 'Documento inválido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosPasajero.email)) errors.email = 'Email inválido';
    if (!/^\d{7,15}$/.test(datosPasajero.telefono)) errors.telefono = 'Teléfono inválido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm(datosPasajero);
    } catch (err) {
      console.error('Error en reserva:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calcularPrecio = () => {
    const precios = {economica: 200,premium: 350,business: 500,primera: 800
    };return precios[datosReserva.clase] * datosReserva.pasajeros;
  };

  return (
    <div className="confirmacion-reserva">
      <h2>Confirmar Reserva</h2>
      <div className="resumen-vuelo">
        <h3>Detalles del Vuelo</h3>
        <p><strong>Ruta:</strong> {vuelo.origen} → {vuelo.destino}</p>
        <p><strong>Salida:</strong> {new Date(vuelo.hora_salida).toLocaleString()}</p>
        <p><strong>Llegada:</strong> {new Date(vuelo.hora_llegada).toLocaleString()}</p>
        <p><strong>Clase:</strong> {datosReserva.clase}</p>
        <p><strong>Pasajeros:</strong> {datosReserva.pasajeros}</p>
        <p><strong>Total:</strong> ${calcularPrecio().toFixed(2)}</p>
      </div>
      <form onSubmit={handleSubmit} className="formulario-pasajero">
        <h3>Información del Pasajero Principal</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={datosPasajero.nombre}onChange={handleChange}className={formErrors.nombre ? 'error' : ''}required/>{formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" value={datosPasajero.apellido}onChange={handleChange}className={formErrors.apellido ? 'error' : ''}required/>{formErrors.apellido && <span className="error-text">{formErrors.apellido}</span>}
          </div>
        </div>
        <div className="form-group">
          <label>Documento de Identidad</label>
          <input type="text" name="documento" value={datosPasajero.documento}onChange={handleChange}className={formErrors.documento ? 'error' : ''}required/>{formErrors.documento && <span className="error-text">{formErrors.documento}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={datosPasajero.email}onChange={handleChange}className={formErrors.email ? 'error' : ''}required/>{formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" name="telefono" value={datosPasajero.telefono}onChange={handleChange}className={formErrors.telefono ? 'error' : ''}required/>{formErrors.telefono && <span className="error-text">{formErrors.telefono}</span>}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="acciones">
          <button type="button" onClick={onBack} className="btn-secondary"disabled={isSubmitting}> Volver</button>
           <button type="submit" className="btn-primary"disabled={isSubmitting}>{isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}</button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmacionReserva;