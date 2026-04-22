import { toast } from "react-toastify";

const baseConfig = {
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

// Untuk error server/network — masih pakai toast, tapi durasi lebih lama
export const showError = (message) => {
  toast.error(message, {
    ...baseConfig,
    autoClose: 4000, // ← dari 1000 jadi 4000 (4 detik)
  });
};

// Untuk sukses login
export const succesError = (message) => {
  toast.success(message, {
    ...baseConfig,
    autoClose: 3000,
  });
};