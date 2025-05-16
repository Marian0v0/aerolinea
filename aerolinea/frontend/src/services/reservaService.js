import api from './api';

export const obtenerVuelosDisponibles = async (origen, destino, fecha) => {
  try {
    const response = await api.get('/vuelos/disponibles', {params: { origen, destino, fecha }
    });return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al buscar vuelos disponibles');
  }
};

export const crearReserva = async (reservaData) => {
  try {
    const response = await api.post('/reservas', {idVuelo: reservaData.id_vuelo,datosReserva: {clase: reservaData.clase,pasajeros: reservaData.pasajeros
      },datosPasajero: {nombre: reservaData.nombre,apellido: reservaData.apellido,documento: reservaData.documento,email: reservaData.email,telefono: reservaData.telefono}
    });return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al crear reserva';
  }
};

export const obtenerReservasPorPasajero = async (documentoIdentidad) => {
  try {
    const response = await api.get(`/pasajeros/${documentoIdentidad}/reservas`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener reservas');
  }
};

export const contarReservasPasajero = async (idPasajero) => {
  try {
    const response = await api.get('/reservas/count', {params: { pasajero: idPasajero }
    });return response.data.total;
  } catch (error) {
    throw error.response?.data?.error || 'Error al contar reservas';
  }
};