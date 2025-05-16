const TarjetaEmbarque = ({ tarjeta, onFinalizar }) => {
    const formatHora = (hora) => {
    if (!hora) return '--:--';
      try {
        return new Date(hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: true });
      } catch (error) {
        console.error('Error formateando hora:', error);
        return hora; 
      }
  };

  return (
    <div className="tarjeta-embarque">
      <h1>EDY AIRLINES</h1>
      <div className="tarjeta-header">
        <span>Boarding Pass</span>
        <span className="estado">Check-in Completado</span>
      </div>
      <div className="tarjeta-info">
        <div className="info-row">
          <span>Fecha</span>
          <span>Vuelo</span>
          <span>{new Date(tarjeta.hora_salida).toLocaleDateString()}</span>
          <span>{tarjeta.codigo_vuelo}</span>
        </div>
        <div className="info-section">
          <h3>Pasajero</h3>
          <p>{tarjeta.nombre} {tarjeta.apellido}</p>
        </div>
        <div className="info-section ruta">
          <h3>{tarjeta.origen} → {tarjeta.destino}</h3>
          <p>Origen - Destino</p>
        </div>
        <div className="info-grid">
          <div>
            <span>Embarque</span>
            <span>{formatHora(tarjeta.hora_salida)}</span>
          </div>
          <div>
            <span>Salida</span>
            <span>{formatHora(tarjeta.hora_salida)}</span>
          </div>
          <div>
            <span>Llegada</span>
            <span>{formatHora(tarjeta.hora_llegada)}</span>
          </div>
          <div>
            <span>Terminal</span>
            <span>1S</span>
          </div>
          <div>
            <span>Puerta</span>
            <span>B2</span>
          </div>
          <div>
            <span>Grupo</span>
            <span>1</span>
          </div>
          <div>
            <span>Asiento</span>
            <span>{tarjeta.asiento}</span>
          </div>
          <div>
            <span>Clase</span>
            <span>Primera clase</span>
          </div>
        </div>
        <div className="info-section">
          <h3>Aeronave</h3>
          <p>BOEING 787 MAX</p>
        </div>
        <div className="info-nota">
          <p>Presentarse en puerta de embarque 40 minutos antes.</p>
        </div>
      </div>
      <div className="tarjeta-actions">
        <button className="btn-primario" onClick={onFinalizar}>Finalizar</button>
      </div>
    </div>
  );
};

export default TarjetaEmbarque;