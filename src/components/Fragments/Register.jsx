import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input";
import api from "../../services/api";
import { showError, succesError } from "../../utils/notify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const FormRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      showError("Semua field harus diisi");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showError("Password tidak sama");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      showError("Password minimal 8 karakter");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
      });

      succesError(res.data.message || "Registrasi berhasil");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);

      if (error.response?.status === 422) {
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
        label="Full Name"
        type="text"
        placeholder="Masukkan nama Anda"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

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
        placeholder="Minimal 8 karakter"
        name="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <InputForm
        label="Confirm Password"
        type="password"
        placeholder="Masukkan password yang sama"
        name="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button variant="bg-blue-600 w-full" disabled={loading}>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <ClipLoader color="white" loading={true} size={10} />
          </div>
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
};

export default FormRegister;
