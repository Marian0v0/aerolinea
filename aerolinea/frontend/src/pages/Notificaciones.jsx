// utils/alerts.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showSuccessAlert = (title, html) => {
  return MySwal.fire({
    title,
    html,
    icon: 'success',
    confirmButtonColor: '#003580',
    background: '#ffffff',
    backdrop: `
      rgba(0, 53, 128, 0.1)
      url("/assets/confetti.gif")
      center top
      no-repeat
    `,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

export const showErrorAlert = (title, html) => {
  return MySwal.fire({
    title,
    html,
    icon: 'error',
    confirmButtonColor: '#dc3545',
    background: '#ffffff',
    showClass: {
      popup: 'animate__animated animate__headShake'
    }
  });
};

export const showConfirmDialog = (title, html, confirmButtonText = 'Confirmar') => {
  return MySwal.fire({
    title,
    html,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#003580',
    cancelButtonColor: '#6c757d',
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    background: '#ffffff',
    showClass: {
      popup: 'animate__animated animate__fadeIn'
    }
  });
};

export const showLoadingAlert = (title) => {
  return MySwal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
    background: '#ffffff'
  });
};