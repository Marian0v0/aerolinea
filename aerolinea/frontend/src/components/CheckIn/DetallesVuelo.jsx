const DetallesVuelo = ({ reserva, onContinuar }) => {
  return (
    <div className="detalles-vuelo">
      <h1>EDY AIRLINES</h1>
      <h2>CHECK - IN</h2>
      
      <div className="vuelo-info">
        <h3>Detalles del vuelo</h3>
        <p>Fecha: {new Date(reserva.hora_salida).toLocaleDateString()}</p>
        <p>Origen: {reserva.origen}</p>
        <p>Destino: {reserva.destino}</p>
        <p>Hora salida: {new Date(reserva.hora_salida).toLocaleTimeString()}</p>
        <p>Aeronave: BOEING 787 - MAX</p>
      </div>
      
      <div className="pasajero-info">
        <h3>Pasajero</h3>
        <p>Nombre: {reserva.nombre_pasajero}</p>
        <p>Apellido: {reserva.apellido_pasajero}</p>
        <p>Confirmación: {reserva.codigo_reserva}</p>
      </div>
      <button onClick={onContinuar} className="btn-primary">Continuar Check-in</button>
    </div>
  );
};

export default DetallesVuelo;