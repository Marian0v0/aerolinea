import { useState } from 'react';
import './FormularioReserva.css';

const FormularioReserva = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({origen: '',destino: '',fechaIda: '',fechaVuelta: '',pasajeros: 1,clase: 'economica'});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-reserva">
      <h2>Reserva tu vuelo</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="form-row">
        <div className="form-group">
          <label>Origen</label>
          <select name="origen" value={formData.origen}onChange={handleChange}required>
            <option value="">Seleccionar</option>
            <option value="Bogotá">Bogotá</option>
            <option value="Medellín">Medellín</option>
            <option value="Cali">Cali</option>
            <option value="Leticia">Leticia</option>
            <option value="New York">New York (JFK)</option>
            <option value="San Andrés">San Andrés</option>
            <option value="Miami">Miami (MIA)</option>
            <option value="Ciudad de México">Ciudad de México</option>
            <option value="Cartagena">Cartagena </option>
            <option value="Madrid">Madrid</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="Panamá">Panamá</option>
          </select>
        </div>
        <div className="form-group">
          <label>Destino</label>
          <select name="destino" value={formData.destino}onChange={handleChange}required >
            <option value="">Seleccionar</option>
            <option value="Bogotá">Bogotá</option>
            <option value="Medellín">Medellín</option>
            <option value="Cali">Cali</option>
            <option value="Leticia">Leticia</option>
            <option value="New York">New York (JFK)</option>
            <option value="San Andrés">San Andrés</option>
            <option value="Miami">Miami (MIA)</option>
            <option value="Ciudad de México">Ciudad de México</option>
            <option value="Cartagena">Cartagena </option>
            <option value="Madrid">Madrid</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="Panamá">Panamá</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Fecha de ida</label>
          <input type="date" name="fechaIda" value={formData.fechaIda}onChange={handleChange}min={new Date().toISOString().split('T')[0]}required/>
        </div>
        <div className="form-group">
          <label>Fecha de vuelta (opcional)</label>
          <input type="date" name="fechaVuelta" value={formData.fechaVuelta}onChange={handleChange}min={formData.fechaIda || new Date().toISOString().split('T')[0]}disabled={!formData.fechaIda}/>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Pasajeros</label>
          <input type="number" name="pasajeros" value={formData.pasajeros}onChange={handleChange}min="1"max="10"required/>
        </div>
        <div className="form-group">
          <label>Clase</label>
          <select name="clase" value={formData.clase}onChange={handleChange}required>
            <option value="economica">Económica</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="primera">Primera Clase</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn-primary">Buscar Vuelos</button>
    </form>
  );
};

export default FormularioReserva;