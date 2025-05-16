import { useState } from 'react';7

const FormularioPago = ({ onGuardar, onCancelar }) => {
  const [datosPago, setDatosPago] = useState({tipo: 'tarjeta_credito',numero_tarjeta: '',nombre_titular: '',fecha_expiracion: '',cvv: '',es_principal: false});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDatosPago(prev => ({...prev,[name]: type === 'checkbox' ? checked : value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!datosPago.numero_tarjeta || !/^\d{13,16}$/.test(datosPago.numero_tarjeta)) {
      setError('Número de tarjeta inválido');
      return;
    }
    if (!datosPago.nombre_titular || datosPago.nombre_titular.length < 5) {
      setError('Nombre del titular inválido');
      return;
    }onGuardar(datosPago);
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-pago">
      <h3>Guardar método de pago</h3>{error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label>Tipo de tarjeta</label>
        <select name="tipo"value={datosPago.tipo}onChange={handleChange}>
          <option value="tarjeta_credito">Tarjeta de crédito</option>
          <option value="tarjeta_debito">Tarjeta de débito</option>
        </select>
      </div>
      <div className="form-group">
        <label>Número de tarjeta</label>
        <input type="text"name="numero_tarjeta"value={datosPago.numero_tarjeta}onChange={handleChange}placeholder="1234 5678 9012 3456"/>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Fecha expiración (MM/AA)</label>
          <input type="text"name="fecha_expiracion"value={datosPago.fecha_expiracion}onChange={handleChange}placeholder="MM/AA"/>
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input type="text"name="cvv"value={datosPago.cvv}onChange={handleChange}placeholder="123"/>
        </div>
      </div>
      <div className="form-group">
        <label>Nombre del titular</label>
        <input type="text"name="nombre_titular"value={datosPago.nombre_titular}onChange={handleChange}placeholder="Como aparece en la tarjeta"/>
      </div>
      <div className="form-checkbox">
        <input type="checkbox"id="esPrincipal"name="es_principal"checked={datosPago.es_principal}onChange={handleChange}/>
        <label htmlFor="esPrincipal">Establecer como método principal</label>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancelar} className="btn-secundario">Cancelar</button>
        <button type="submit" className="btn-primario">Guardar</button>
      </div>
    </form>
  );
};

export default FormularioPago;