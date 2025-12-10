import Swal from "sweetalert2";
import todoServices from "../../services/todo.services";
import AuthServices from "../../services/auth.services";
// Cấu hình chung (tùy chỉnh màu, icon, button...)

const authServices = new AuthServices();

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  Toast.fire({
    icon,
    title
  });
};

export const showConfirm = (
  title: string,
  text: string,
  onConfirm: () => void,
  confirmText: string = 'Xác nhận',
  cancelText: string = 'Hủy'
) => {
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  Swal.fire(title, text, icon).then(async () => {
    // Optional callback after alert is closed
     var token = localStorage.getItem('token');
      if (token) {
        try {
          await todoServices.getTodosByUser(token);
          await authServices.getUserInfo(token);
        } catch (error) {
          console.error('Error fetching todos after alert:', error);
        }
      }
  });
};

// Export default nếu muốn dùng trực tiếp
export default Swal;