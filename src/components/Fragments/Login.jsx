import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input";
import api from "../../services/api";
import { showError, succesError } from "../../utils/notify";
import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";

const FormLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      showError("Email dan password harus diisi");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        succesError(res.data.message || "Login berhasil");

        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        showError("Token tidak ditemukan");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        showError("Email atau password salah");
      } else if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          const firstError = Object.values(errors)[0][0];
          showError(firstError);
        } else {
          showError(error.response.data?.message || "Validasi gagal");
        }
      } else if (error.response?.status === 500) {
        showError("Terjadi kesalahan server");
      } else if (error.request) {
        showError("Tidak dapat terhubung ke server");
      } else {
        showError("Terjadi kesalahan yang tidak terduga");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputForm
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        name="email"
        value={email}
        autoComplete="username"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <InputForm
        label="Password"
        type="password"
        placeholder="Masukkan password Anda"
        name="password"
        value={password}
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
        required
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
  );
};

export default FormLogin;
