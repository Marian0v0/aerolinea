import { useState } from 'react';

const InicioCheckIn = ({ onVerificarReserva, error }) => {
  const [codigoReserva, setCodigoReserva] = useState('');
  const [apellido, setApellido] = useState('');
  const handleSubmit = (e) => { e.preventDefault();onVerificarReserva(codigoReserva, apellido);};

  return (
    <div className="inicio-checkin">
      <h1>EDY AIRLINES</h1>
      <h2>HAZ TU CHECK-IN ONLINE AHORA</h2>
      <h3>ENCUENTRE SU VIAJE</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código de reserva</label>
          <input type="text" value={codigoReserva}onChange={(e) => setCodigoReserva(e.target.value)}required/>
        </div>
        <div className="form-group">
          <label>Apellidos</label>
          <input type="text" value={apellido}onChange={(e) => setApellido(e.target.value)}required />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn-primary">Empezar check-in</button>
      </form>
    </div>
  );
};

export default InicioCheckIn;