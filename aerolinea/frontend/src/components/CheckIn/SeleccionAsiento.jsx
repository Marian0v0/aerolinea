import { useEffect, useState } from 'react';
import './SeleccionAsiento.css';

const SeleccionAsiento = ({  asientos,asientoSeleccionado, onSeleccionarAsiento, onConfirmar, onBack,error,loading 
}) => {
  const [asientosPorFila, setAsientosPorFila] = useState({});
  useEffect(() => {
    const agrupados = {};
    asientos.forEach(asiento => {const fila = asiento.match(/\d+/)[0];
      if (!agrupados[fila]) { agrupados[fila] = [];}
      agrupados[fila].push(asiento);
    });setAsientosPorFila(agrupados);
  }, [asientos]);

  return (
    <div className="seleccion-asiento-container">
      <h2>Selecciona tu asiento</h2>{error && (
        <div className="error-message">{error}</div>
      )}
      <div className="mapa-avion">
        <div className="cabina">
          <div className="cabina-frontal">Cabina</div>
          <div className="leyenda">
            <div className="leyenda-item">
              <div className="asiento disponible"></div>
              <span>Disponible</span>
            </div>
            <div className="leyenda-item">
              <div className="asiento seleccionado"></div>
              <span>Seleccionado</span>
            </div>
            <div className="leyenda-item">
              <div className="asiento ocupado"></div>
              <span>Ocupado</span>
            </div>
          </div>
        </div>
        {Object.entries(asientosPorFila).map(([fila, asientosFila]) => (
          <div key={fila} className="fila-asientos">
            <span className="numero-fila">{fila}</span>
            <div className="asientos-fila">
              {['A', 'B', 'C', 'D', 'E', 'F'].map(letra => {
                const asiento = `${letra}${fila}`;
                const disponible = asientos.includes(asiento);
                return (
                  <button key={asiento}className={`asiento ${ !disponible ? 'ocupado' : asientoSeleccionado === asiento ? 'seleccionado' : 'disponible'}`}onClick={() => disponible && onSeleccionarAsiento(asiento)}disabled={!disponible || loading}aria-label={`Asiento ${asiento}`} > {letra}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="acciones">
        <button onClick={onBack}className="btn btn-outline"disabled={loading} >Volver</button>
        <button onClick={onConfirmar}className="btn btn-primary"disabled={!asientoSeleccionado || loading}> {loading ? (<><span className="spinner"></span>Procesando...</>) : 'Confirmar Asiento'}</button>
      </div>
    </div>
  );
};

export default SeleccionAsiento;