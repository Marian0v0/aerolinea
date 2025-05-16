const ResumenCompra = ({ datosVuelo, onContinuar }) => {
  return (
    <div className="resumen-compra">
      <h1>MÉTODOS DE PAGO</h1>
      <div className="tarjeta-info">
        <span>Aventuras Biquilles</span>
        <span>Merger en VISA</span>
      </div>
      <div className="resumen-section">
        <h2>Resumen compra</h2>
        <h3>{datosVuelo.origen} – {datosVuelo.destino}</h3>
        <p className="precio">${datosVuelo.precio.toFixed(2)} USD</p>
        <p>{datosVuelo.fecha} - {datosVuelo.hora}</p>
      </div>
      <div className="aeronave-info">
        <p>{datosVuelo.aeronave}</p>
      </div>
      <button onClick={onContinuar} className="btn-primario">Continuar a pago</button>
    </div>
  );
};

export default ResumenCompra;