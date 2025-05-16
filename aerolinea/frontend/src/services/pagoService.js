import api from './api';

export const guardarMetodoPago = async (idCliente, metodoPago) => {
  try {
    const response = await api.post(`/cliente/${idCliente}/metodos-pago`, metodoPago);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al guardar método de pago';
  }
};

export const obtenerMetodosPago = async (idCliente) => {
  try {
    const response = await api.get(`/cliente/${idCliente}/metodos-pago`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener métodos de pago';
  }
};