import { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/PagoPage.css';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from './Notificaciones';

const PagoPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({documento: '',nombre: ''});
  const [cliente, setCliente] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState({ message: '', field: '' });
  const [loading, setLoading] = useState(false);
  const [nuevoMetodo, setNuevoMetodo] = useState({tipo: 'tarjeta_credito',numero_tarjeta: '',nombre_titular: '',fecha_expiracion: '',cvv: '',es_principal: false});
  const validarDocumento = (doc) => /^[0-9]{6,12}$/.test(doc);
  const validarNombre = (name) => name.trim().split(' ').filter(Boolean).length >= 2;

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'verificacion') {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (error.field === name) setError({ message: '', field: '' });
    } else {
      setNuevoMetodo(prev => ({ ...prev, [name]: value }));
    }
  };

  const verificarCliente = async () => {
    if (!validarDocumento(formData.documento)) {
      return setError({ message: 'Documento inválido (6-12 dígitos)', field: 'documento' });
    }
    if (!validarNombre(formData.nombre)) {
      return setError({ message: 'Ingrese nombre y apellido', field: 'nombre' });
    }setLoading(true);
    try {
      const [nombre, apellido] = formData.nombre.split(' ');
      const response = await api.get('/clientes/verificar', {params: {documento: formData.documento,nombre: `${nombre} ${apellido || ''}`.trim()}
      });
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Credenciales incorrectas');
      }
      const clienteData = response.data.data;
      setCliente(clienteData);
      setReservas(clienteData.reservas || []);
      const metodosResponse = await api.get(`/clientes/${clienteData.id_cliente}/metodos-pago`);
      setMetodosPago(metodosResponse.data || []);
      setStep(2);
      setError({ message: '', field: '' });
    } catch (err) {
      setError({message: err.response?.data?.error || 'Error al verificar. Verifica tus datos.',field: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const guardarMetodoPago = async () => {
    const validaciones = [
      { field: 'numero_tarjeta', test: /^\d{13,16}$/, msg: 'Tarjeta inválida (13-16 dígitos)' },
      { field: 'nombre_titular', test: /^[a-zA-Z\s]{5,}$/, msg: 'Nombre titular muy corto' },
      { field: 'fecha_expiracion', test: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/, msg: 'Fecha inválida (MM/AA)' },
      { field: 'cvv', test: /^\d{3,4}$/, msg: 'CVV inválido (3-4 dígitos)' }
    ];
    for (const val of validaciones) {
      if (!nuevoMetodo[val.field] || !val.test.test(nuevoMetodo[val.field])) {
        return setError({ message: val.msg, field: val.field });
      }
    }setLoading(true);
    const confirm = await showConfirmDialog(
      'Guardar método de pago',
      '¿Deseas guardar esta tarjeta para futuras compras?',
      'Guardar Tarjeta'
    );
    
    if (!confirm.isConfirmed) return;

    const loadingAlert = await showLoadingAlert('Guardando método de pago...');
    try {
      const response = await api.post(`/clientes/${cliente.id_cliente}/metodos-pago`,nuevoMetodo );
      alert('Método de pago guardado exitosamente');
      const metodosResponse = await api.get(`/clientes/${cliente.id_cliente}/metodos-pago`);
      setMetodosPago(metodosResponse.data || []);
      setNuevoMetodo({tipo: 'tarjeta_credito',numero_tarjeta: '',nombre_titular: '',fecha_expiracion: '',cvv: '',es_principal: false});
      setStep(2);
      loadingAlert.close();
      await showSuccessAlert(
        'Método guardado', 
        'Tu método de pago ha sido guardado exitosamente'
      );
    } catch (err) {
      loadingAlert.close();
      await showErrorAlert(
        'Error al guardar', 
        err.response?.data?.error || 'No se pudo guardar el método de pago. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  const formatearNumeroTarjeta = (numero) => 
    numero?.replace(/\d{4}(?=.)/g, '•••• ');

  const formatearFecha = (fechaString) => {
    try {
      return new Date(fechaString).toLocaleDateString('es-ES', {year: 'numeric',month: 'long',day: 'numeric',hour: '2-digit',minute: '2-digit'});
    } catch {
      return fechaString;
    }
  };

  return (
    <div className="pago-container">
      <div className="pago-header">
        <h1>Métodos de Pago y Historial</h1>
        <p>Gestiona tus métodos de pago y consulta tu historial de reservas</p>
      </div>
      {}
      {step === 1 && (
        <div className="verificacion-cliente">
          <div className="card">
            <h2>Verificación de Cliente</h2>
            <p>Por favor ingresa tus datos para acceder a tu historial</p>
            {error.message && (
              <div className={`alert ${error.field ? 'alert-warning' : 'alert-error'}`}>{error.message}</div>)}
            <div className="form-group">
              <label className="form-label">Documento de Identidad</label>
              <input type="text"name="documento"className={`form-control ${error.field === 'documento' ? 'input-error' : ''}`}value={formData.documento}onChange={(e) => handleChange(e, 'verificacion')}disabled={loading}/>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input type="text"name="nombre"className={`form-control ${error.field === 'nombre' ? 'input-error' : ''}`}value={formData.nombre}onChange={(e) => handleChange(e, 'verificacion')}placeholder="Ej: Emilio Perez (nombre y apellido)"disabled={loading}/>
            </div>
            <button className="btn btn-primary"onClick={verificarCliente}disabled={loading}>{loading ? 'Verificando...' : 'Continuar'}
            </button>
          </div>
        </div>
      )}
      {}
      {step === 2 && cliente && (
        <div className="cliente-content">
          <div className="cliente-info">
            <h2>Bienvenido, {cliente.nombre} {cliente.apellido}</h2>
            <p>Número de cliente: {cliente.numero_miembro}</p>
            <p>Nivel: {cliente.nivel_membresia}</p>
          </div>
          <div className="pago-section">
            <div className="card">
              <div className="card-header">
                <h3>Tus Métodos de Pago</h3>
                <button className="btn btn-outline"onClick={() => setStep(3)}>Agregar Nuevo</button>
                <button onClick={() => navigate('/historial')} className="btn-secundario">Ver Historial</button>
              </div>
              {metodosPago.length === 0 ? (
                <p>No tienes métodos de pago guardados</p>
              ) : (
                <div className="metodos-grid">
                  {metodosPago.map((metodo) => (
                    <div key={metodo.id_metodo} className="metodo-card">
                      <div className="metodo-tipo">
                        {metodo.tipo === 'tarjeta_credito' ? 'Tarjeta de Crédito' : 
                         metodo.tipo === 'tarjeta_debito' ? 'Tarjeta de Débito' : 'PayPal'}
                        {metodo.es_principal && <span className="metodo-principal">Principal</span>}
                      </div>
                      <div className="metodo-numero">{formatearNumeroTarjeta(metodo.numero_tarjeta)}</div>
                      <div className="metodo-titular">{metodo.nombre_titular}</div>
                      <div className="metodo-fecha">Expira: {metodo.fecha_expiracion}</div>
                    </div>
                  ))}
                </div>
              )}</div>
          </div>
        </div>
      )}
      {}
      {step === 3 && (
        <div className="nuevo-metodo">
          <div className="card">
            <div className="card-header">
              <h3>Agregar Nuevo Método de Pago</h3>
              <button className="btn btn-outline"onClick={() => setStep(2)}> Volver</button>
            </div>
            {error.message && <div className="alert alert-error">{error.message}</div>}
            <div className="form-group">
              <label className="form-label">Tipo de Método</label>
              <select className="form-control"value={nuevoMetodo.tipo}onChange={(e) => setNuevoMetodo({...nuevoMetodo, tipo: e.target.value})}>
                <option value="tarjeta_credito">Tarjeta de Crédito</option>
                <option value="tarjeta_debito">Tarjeta de Débito</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Número de Tarjeta</label>
              <input type="text"name="numero_tarjeta"className={`form-control ${error.field === 'numero_tarjeta' ? 'input-error' : ''}`}value={nuevoMetodo.numero_tarjeta}onChange={(e) => handleChange(e, 'metodo')}placeholder="1234 5678 9012 3456"maxLength="16"/>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre del Titular</label>
              <input type="text"name="nombre_titular"className={`form-control ${error.field === 'nombre_titular' ? 'input-error' : ''}`}value={nuevoMetodo.nombre_titular}onChange={(e) => handleChange(e, 'metodo')}placeholder="Como aparece en la tarjeta"/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha de Expiración</label>
                <input type="text"name="fecha_expiracion"className={`form-control ${error.field === 'fecha_expiracion' ? 'input-error' : ''}`}value={nuevoMetodo.fecha_expiracion}onChange={(e) => handleChange(e, 'metodo')}placeholder="MM/AA"maxLength="5"/>
              </div>
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input type="text"name="cvv"className={`form-control ${error.field === 'cvv' ? 'input-error' : ''}`}value={nuevoMetodo.cvv}onChange={(e) => handleChange(e, 'metodo')}placeholder="123"maxLength="4"/>
              </div>
            </div>
            <div className="form-checkbox">
              <input type="checkbox"id="esPrincipal"checked={nuevoMetodo.es_principal}onChange={(e) => setNuevoMetodo({...nuevoMetodo, es_principal: e.target.checked})}/>
              <label htmlFor="esPrincipal">Establecer como método principal</label>
            </div>
            <button className="btn btn-primary"onClick={guardarMetodoPago}disabled={loading}>{loading ? 'Guardando...' : 'Guardar Método'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagoPage;