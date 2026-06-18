import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, LogIn } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Ilustrasi 403 */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-[10rem] font-bold text-orange-100 leading-none select-none">
              403
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-20 h-20 text-orange-400 opacity-80" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Akses Ditolak
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Anda tidak memiliki izin untuk mengakses halaman ini.
          Silakan login dengan akun yang memiliki hak akses yang sesuai.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
          >
            <LogIn size={18} />
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
