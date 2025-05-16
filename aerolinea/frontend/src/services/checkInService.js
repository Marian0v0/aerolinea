import api from './api';

export const verificarReserva = async (codigoReserva, apellido) => {
  try {
    const response = await api.post('/pasajero/verificar-reserva', {codigoReserva,apellido
    });return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al verificar reserva';
  }
};

export const obtenerAsientos = async (idVuelo) => {
  try {
    const response = await api.get(`/pasajero/vuelo/${idVuelo}/asientos`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener asientos';
  }
};

export const realizarCheckin = async (checkInData) => {
  try {
    const response = await api.post('/pasajero/checkin', checkInData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al realizar check-in';
  }
};

export const obtenerTarjetaEmbarque = async (idCheckin) => {
  try {
    const response = await api.get(`/pasajero/checkin/${idCheckin}/tarjeta-embarque`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener tarjeta de embarque';
  }
};