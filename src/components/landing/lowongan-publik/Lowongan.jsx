import {
  MapPin,
  Briefcase,
  ChevronRight,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../../layouts/Navbar";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const LowonganPublikPage = () => {
  const [lowonganData, setLowonganData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showCekStatusModal, setShowCekStatusModal] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [loadingCekStatus, setLoadingCekStatus] = useState(false);
  const [errorCekStatus, setErrorCekStatus] = useState("");
  const [lamaran, setLamaran] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    getAllLowonganPublik();
  }, []);

  const getAllLowonganPublik = async () => {
    try {
      setLoading(true);
      const response = await api.get("/lowongan-kerja");
      setLowonganData(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: Clock,
        label: "Pending",
        badge: "bg-yellow-100",
        title: "Lamaran Sedang Diproses",
        description: "Lamaran Anda sedang dalam proses review oleh tim HRD",
      },
      diterima: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: CheckCircle,
        label: "Diterima",
        badge: "bg-green-100",
        title: "Selamat! Lamaran Diterima",
        description:
          "Lamaran Anda telah diterima. Tim HRD akan menghubungi Anda segera",
      },
      ditolak: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: XCircle,
        label: "Ditolak",
        badge: "bg-red-100",
        title: "Lamaran Belum Berhasil",
        description:
          "Mohon maaf, lamaran Anda belum dapat kami terima saat ini",
      },
    };

    return configs[status] || configs.pending;
  };

  const handleCekStatus = async (e) => {
    e.preventDefault();

    if (!tokenInput.trim()) {
      setErrorCekStatus("Mohon masukkan kode lamaran");
      return;
    }

    setLoadingCekStatus(true);
    setErrorCekStatus("");

    console.log({
      token: tokenInput,
    });

    try {
      const response = await api.post("/rekruitmen/cek", {
        token: tokenInput,
      });

      console.log(response.data);

      if (response.data.success && response.data.data) {
        setLamaran(response.data.data);
        setShowResult(true);
        setErrorCekStatus("");
      } else {
        setErrorCekStatus("Kode lamaran tidak ditemukan");
      }
    } catch (error) {
      console.error(error);
      console.error(error.response?.data);

      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setErrorCekStatus(errorMessages.join(", "));
      } else {
        setErrorCekStatus(
          error.response?.data?.message ||
            "Kode lamaran tidak ditemukan. Pastikan Anda memasukkan kode yang benar.",
        );
      }
    } finally {
      setLoadingCekStatus(false);
    }
  };
  const handleBackToSearch = () => {
    setShowResult(false);
    setLamaran(null);
    setTokenInput("");
    setErrorCekStatus("");
  };

  const handleCloseModal = () => {
    setShowCekStatusModal(false);
    setShowResult(false);
    setLamaran(null);
    setTokenInput("");
    setErrorCekStatus("");
    setLoadingCekStatus(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const renderModalContent = () => {
    if (!showResult) {
      return (
        <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="mb-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-cyan-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cek Status Lamaran
            </h2>
            <p className="text-gray-600">
              Masukkan kode lamaran Anda untuk melihat status terkini
            </p>
          </div>

          <form onSubmit={handleCekStatus} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Lamaran <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Masukkan kode lamaran"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  disabled={loadingCekStatus}
                  autoFocus
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {errorCekStatus && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorCekStatus}</span>
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle
                  className="text-blue-600 shrink-0 mt-0.5"
                  size={16}
                />
                <div>
                  <p className="text-xs text-blue-900 font-medium mb-1">
                    Belum punya kode lamaran?
                  </p>
                  <p className="text-xs text-blue-700">
                    Kode diberikan setelah Anda mengirim lamaran melalui form
                    aplikasi
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loadingCekStatus}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loadingCekStatus || !tokenInput.trim()}
                className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-cyan-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {loadingCekStatus ? (
                  <>
                    <ClipLoader color="#ffffff" size={16} />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Cek Status</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      );
    }

    const statusConfig = getStatusConfig(lamaran.status_terima);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white rounded-lg max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-lg">
          <button
            onClick={handleBackToSearch}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Cari Lagi</span>
          </button>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div
            className={`rounded-lg border-2 p-6 ${statusConfig.bg} ${statusConfig.border}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${statusConfig.badge}`}>
                <StatusIcon className={statusConfig.text} size={32} />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 ${statusConfig.text}`}>
                  {statusConfig.title}
                </h2>
                <p className={`text-sm ${statusConfig.text}`}>
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Kode Lamaran Anda</p>
            <p className="text-lg font-bold text-cyan-700 break-all">
              {lamaran.token_pendaftaran}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <User size={18} className="text-cyan-600" />
              Informasi Pelamar
            </h3>
            <div className="space-y-3 pl-7">
              <div>
                <p className="text-xs text-gray-500">Nama Lengkap</p>
                <p className="font-medium text-gray-900">
                  {lamaran.nama_lengkap}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status Lamaran</p>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.badge} ${statusConfig.text}`}
                >
                  <StatusIcon size={14} />
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {lamaran.catatan && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle size={18} className="text-yellow-600" />
                Catatan dari HRD
              </h3>
              <p className="text-sm text-gray-700 pl-7">{lamaran.catatan}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-900 font-medium mb-2">
              💡 Informasi Penting
            </p>
            <ul className="text-xs text-blue-700 space-y-1 pl-4 list-disc">
              <li>Simpan kode lamaran Anda dengan baik</li>
              <li>
                Tim HRD akan menghubungi Anda melalui nomor yang terdaftar
              </li>
              <li>Pantau status lamaran Anda secara berkala</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleCloseModal}
              className="w-full px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {showCekStatusModal && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          {renderModalContent()}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="bg-blue-600 text-white py-16 pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-12">
              Lowongan Kerja
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Bergabunglah dengan Tim Kami dan Kembangkan Karir Anda di
              Perusahaan HR Terbaik
            </p>

            <button
              onClick={() => setShowCekStatusModal(true)}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
            >
              <Search size={20} />
              <span>Cek Status Lamaran</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ClipLoader color="#0891b2" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {lowonganData.map((lowongan) => (
                <div
                  key={lowongan.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-blue-600">
                        {lowongan.posisi}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                        Aktif
                      </span>
                    </div>

                    <div className="flex items-center gap-10 mb-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        <span>{lowongan.lokasi_kerja}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} />
                        <span>{lowongan.jenis_kerja}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {lowongan.catatan}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Gaji:</span>
                      <p className="text-green-600 font-semibold text-right">
                        {lowongan.range_gaji}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm text-gray-600">Deadline</span>
                      <span className="text-sm text-gray-900">
                        {formatDate(lowongan.deadline_lowongan)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/lowongan-publik/${lowongan.id}`)
                      }
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <span>Lihat Lowongan</span>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-center gap-2">
            <button
              disabled
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </button>

            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LowonganPublikPage;
