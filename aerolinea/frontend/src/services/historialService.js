import api from './api';

export const obtenerHistorialPorCliente = async (idCliente) => {
  try {
    const response = await api.get(`/clientes/${idCliente}/historial`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener historial';
  }
};

export const obtenerDetallesPago = async (idPago) => {
  try {
    const response = await api.get(`/pagos/${idPago}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener detalles de pago';
  }
};