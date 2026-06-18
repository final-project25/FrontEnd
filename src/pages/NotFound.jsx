import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Ilustrasi 404 */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-[10rem] font-bold text-blue-100 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-20 h-20 text-cyan-500 opacity-80" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          Periksa kembali URL yang Anda masukkan.
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
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
          >
            <Home size={18} />
            Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
