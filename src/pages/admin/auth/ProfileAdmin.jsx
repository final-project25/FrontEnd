import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Trash2 } from "lucide-react";
import api from "../../../services/api";
import { showError, succesError } from "../../../utils/notify";
import InputForm from "../../../components/Elements/Input";
import Button from "../../../components/Elements/Button";

// ─── Ganti Password ───────────────────────────────────────────
const GantiPasswordForm = () => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.current_password)
      err.current_password = "Password saat ini wajib diisi.";
    if (!form.new_password) {
      err.new_password = "Password baru wajib diisi.";
    } else if (form.new_password.length < 8) {
      err.new_password = "Password baru minimal 8 karakter.";
    }
    if (!form.new_password_confirmation) {
      err.new_password_confirmation = "Konfirmasi password wajib diisi.";
    } else if (form.new_password !== form.new_password_confirmation) {
      err.new_password_confirmation = "Password tidak cocok.";
    }
    return err;
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
      await api.post("/ganti-password", form);
      succesError("Password berhasil diubah!");
      setForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setErrors({});
    } catch (error) {
      const res = error.response;
      if (res?.status === 422 && res.data?.errors) {
        const serverErrors = {};
        Object.entries(res.data.errors).forEach(([k, v]) => {
          serverErrors[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(serverErrors);
      } else {
        showError(res?.data?.message || "Gagal mengganti password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "current_password", label: "Password Saat Ini", key: "current" },
    { name: "new_password", label: "Password Baru", key: "new" },
    {
      name: "new_password_confirmation",
      label: "Konfirmasi Password Baru",
      key: "confirm",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-cyan-100 rounded-lg flex items-center justify-center">
          <KeyRound size={18} className="text-cyan-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Ganti Password</h2>
          <p className="text-xs text-gray-500">Perbarui password akun kamu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-1" noValidate>
        {fields.map(({ name, label, key }) => (
          <InputForm
            key={name}
            label={label}
            type={show[key] ? "text" : "password"}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors[name]}
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShow((p) => ({ ...p, [key]: !p[key] }))}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        ))}

        <div className="pt-2">
          <Button
            variant="bg-cyan-600 hover:bg-cyan-700 w-full rounded-lg"
            disabled={isLoading}
          >
            <span className="flex items-center justify-center gap-2">
              <KeyRound size={16} />
              {isLoading ? "Menyimpan..." : "Simpan Password"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

// ─── Hapus Akun ───────────────────────────────────────────────
const HapusAkunForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setErrors({ password: "Password wajib diisi untuk konfirmasi." });
      return;
    }

    // Konfirmasi tambahan sebelum hapus
    const confirm = window.confirm(
      "Akun kamu akan dihapus permanen beserta semua data terkait. Lanjutkan?",
    );
    if (!confirm) return;

    setIsLoading(true);
    try {
      await api.delete("/hapus-akun", {
        data: { password, confirmation: "YA" },
      });

      succesError("Akun berhasil dihapus.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      const res = error.response;
      if (res?.status === 422 && res.data?.errors) {
        const serverErrors = {};
        Object.entries(res.data.errors).forEach(([k, v]) => {
          serverErrors[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(serverErrors);
      } else {
        showError(res?.data?.message || "Gagal menghapus akun.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
          <Trash2 size={18} className="text-red-500" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Hapus Akun</h2>
          <p className="text-xs text-gray-500">
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-red-600">
          Menghapus akun akan menghapus semua data terkait secara permanen.
          Pastikan kamu sudah yakin sebelum melanjutkan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <InputForm
          label="Masukkan Password untuk Konfirmasi"
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({});
          }}
          placeholder="••••••••"
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

        <Button
          variant="bg-red-500 hover:bg-red-600 w-full rounded-lg"
          disabled={isLoading}
        >
          <span className="flex items-center justify-center gap-2">
            <Trash2 size={16} />
            {isLoading ? "Menghapus..." : "Hapus Akun Saya"}
          </span>
        </Button>
      </form>
    </div>
  );
};

// ─── Halaman Utama Profil ──────────────────────────────────────
const ProfileAdmin = () => {
  let user = {};

  try {
    const userData = localStorage.getItem("user");

    if (userData && userData !== "undefined" && userData !== "null") {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error parsing user:", error);
  }
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const displayName = user?.name || user?.username || user?.nama_lengkap || user?.nama || "Admin";

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Info Akun */}
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Profil Akun</h1>
        <p className="text-sm text-gray-500">Kelola keamanan dan akun kamu</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl font-bold">
          {getInitials(displayName)}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{displayName}</p>
          <p className="text-sm text-gray-500">{user?.email || "-"}</p>
          <span className="inline-block mt-1 text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
      </div>

      {/* Form Ganti Password */}
      <GantiPasswordForm />

      {/* Form Hapus Akun */}
      <HapusAkunForm />
    </div>
  );
};

export default ProfileAdmin;
