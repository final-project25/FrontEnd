import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input";
import api from "../../services/api";
import { succesError } from "../../utils/notify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const FormLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData]     = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [authError, setAuthError]   = useState("");
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = "Email tidak boleh kosong";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Format email tidak valid";
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = "Password tidak boleh kosong";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password minimal 8 karakter";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setAuthError("");
        succesError(res.data.message || "Login berhasil");
        setFormData({ email: "", password: "" });

        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setAuthError("Token tidak ditemukan, coba lagi.");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setAuthError("Email atau password salah");
        setFormData({ email: "", password: "" }); 
      } else if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          setFieldErrors({
            email: errors.email?.[0] || "",
            password: errors.password?.[0] || "",
          });
        } else {
          setAuthError(error.response.data?.message || "Validasi gagal");
        }
      } else if (error.response?.status === 500) {
        setAuthError("Terjadi kesalahan server, coba beberapa saat lagi.");
      } else if (error.request) {
        setAuthError("Tidak dapat terhubung ke server.");
      } else {
        setAuthError("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-600 text-sm text-center">{authError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <InputForm
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          name="email"
          value={formData.email}
          autoComplete="username"
          onChange={handleChange}
          error={fieldErrors.email}
        />

        <InputForm
          label="Password"
          type="password"
          placeholder="Masukkan password Anda"
          name="password"
          value={formData.password}
          autoComplete="current-password"
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <Button variant="bg-blue-600 w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <ClipLoader color="white" loading={true} size={10} />
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </>
  );
};

export default FormLogin;