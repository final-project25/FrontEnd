import { useNavigate } from "react-router-dom";
import { Home, RefreshCw, ServerCrash } from "lucide-react";

const ServerErrorPage = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Ilustrasi 500 */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-[10rem] font-bold text-red-100 leading-none select-none">
              500
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <ServerCrash className="w-20 h-20 text-red-400 opacity-80" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Terjadi Kesalahan Server
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Sepertinya ada masalah di server kami. Kami sedang bekerja untuk
          memperbaikinya. Coba muat ulang halaman atau kembali beberapa saat lagi.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={18} />
            Muat Ulang
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

export default ServerErrorPage;
