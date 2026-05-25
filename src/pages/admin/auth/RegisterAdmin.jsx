import { useState } from "react";
import { UserPlus, Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "../../../services/api";
import { showError, succesError } from "../../../utils/notify";

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

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
    }`;

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
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              className={inputClass("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@perusahaan.com"
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                className={inputClass("password") + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Ulangi password"
                className={inputClass("password_confirmation") + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Buat Akun Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdminPage;
