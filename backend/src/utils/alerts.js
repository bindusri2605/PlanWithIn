import Swal from 'sweetalert2';

export const toast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#2C3E50', 
    color: '#fff',
    iconColor: '#B2C5B2', // 👈 Forces the success checkmark to Sage Green
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({ icon, title });
};

export const showModal = (title, text, icon = 'info') => {
  Swal.fire({
    title,
    text,
    icon,
    iconColor: icon === 'success' ? '#B2C5B2' : undefined, // 👈 Only colors it green if it's a success modal
    background: '#2C3E50',
    color: '#fff',
    confirmButtonColor: '#B2C5B2', 
    padding: '2rem',
    borderRadius: '24px',
    // Adding a custom class to match your login card's border
    customClass: {
      popup: 'border border-white/10 backdrop-blur-xl'
    }
  });
};