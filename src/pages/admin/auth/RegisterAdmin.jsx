import { useState } from "react";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import api from "../../../services/api";
import { showError, succesError } from "../../../utils/notify";
import InputForm from "../../../components/Elements/Input";
import Button from "../../../components/Elements/Button";

const RegisterAdminPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nama wajib diisi.";
    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!form.password) {
      newErrors.password = "Password wajib diisi.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
    }
    if (!form.password_confirmation) {
      newErrors.password_confirmation = "Konfirmasi password wajib diisi.";
    } else if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Password tidak cocok.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      succesError("Akun admin berhasil dibuat!");
      setForm({ name: "", email: "", password: "", password_confirmation: "" });
      setErrors({});
    } catch (error) {
      const res = error.response;
      if (res?.status === 422 && res.data?.errors) {
        const serverErrors = {};
        Object.entries(res.data.errors).forEach(([key, val]) => {
          serverErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(serverErrors);
      } else {
        showError(res?.data?.message || "Gagal membuat akun admin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
            <UserPlus size={20} className="text-cyan-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Tambah Akun Admin
            </h1>
            <p className="text-sm text-gray-500">Buat akun untuk admin baru</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-1" noValidate>
          <InputForm
            label="Nama Lengkap"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Contoh: Budi Santoso"
            error={errors.name}
            disabled={isLoading}
          />

          <InputForm
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@perusahaan.com"
            autoComplete="username"
            error={errors.email}
            disabled={isLoading}
          />

          <InputForm
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            error={errors.password}
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <InputForm
            label="Konfirmasi Password"
            type={showConfirm ? "text" : "password"}
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Ulangi password"
            autoComplete="new-password"
            error={errors.password_confirmation}
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <div className="pt-2">
            <Button
              variant="bg-cyan-600 hover:bg-cyan-700 w-full rounded-lg"
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                <UserPlus size={16} />
                {isLoading ? "Menyimpan..." : "Buat Akun Admin"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdminPage;
