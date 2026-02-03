import {
  ArrowLeft,
  Edit,
  Trash2,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../../../services/api";
import { showError } from "../../../utils/notify";

const DetailLowonganPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lowongan, setLowongan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowongan();
  }, [id]);

  const fetchLowongan = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lowongan/${id}`);
      setLowongan(response.data.data);
    } catch (error) {
      console.log(error);
      showError("Gagal mengambil data lowongan");
      navigate("/rekrutmen");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus lowongan ${lowongan.posisi}?`,
      )
    ) {
      return;
    }

    try {
      await api.delete(`/lowongan/${id}`);
      alert("Lowongan berhasil dihapus");
      navigate("/rekrutmen");
    } catch (error) {
      console.log(error);
      alert("Gagal menghapus lowongan");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ClipLoader color="#0891b2" size={40} />
          <p className="mt-4 text-gray-600">Memuat data lowongan...</p>
        </div>
      </div>
    );
  }

  if (!lowongan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-gray-600">Data lowongan tidak ditemukan</p>
          <button
            onClick={() => navigate("/rekrutmen")}
            className="mt-4 text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Kembali ke Rekrutmen
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(lowongan.deadline_lowongan);
  const deadlinePassed = isDeadlinePassed(lowongan.deadline_lowongan);

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/rekrutmen")}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Manajemen Rekrutmen</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Lowongan Pekerjaan
            </h1>
            <p className="text-gray-600 mt-1">
              Informasi lengkap lowongan pekerjaan
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/update-lowongan/${lowongan.id}`)}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            lowongan.status_lowongan === "aktif"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {lowongan.status_lowongan === "aktif"
            ? "● Lowongan Aktif"
            : "○ Lowongan Tidak Aktif"}
        </span>

        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            lowongan.jenis_kerja === "Full Time"
              ? "bg-blue-100 text-blue-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {lowongan.jenis_kerja}
        </span>

        {!deadlinePassed && daysRemaining !== null && daysRemaining <= 7 && (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800">
            <AlertCircle size={16} className="mr-1" />
            {daysRemaining > 0
              ? `${daysRemaining} hari lagi`
              : "Deadline hari ini!"}
          </span>
        )}

        {deadlinePassed && (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800">
            <AlertCircle size={16} className="mr-1" />
            Deadline sudah lewat
          </span>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-cyan-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Informasi Posisi
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Posisi/Jabatan
                </label>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-600" />
                  <p className="text-lg font-bold text-gray-900">
                    {lowongan.posisi}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Lokasi Kerja
                </label>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-red-600" />
                  <p className="text-base text-gray-900">
                    {lowongan.lokasi_kerja}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Jenis Kerja
                </label>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-purple-600" />
                  <p className="text-base text-gray-900">
                    {lowongan.jenis_kerja}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Range Gaji
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-green-600" />
                  <p className="text-base font-semibold text-green-600">
                    {lowongan.range_gaji}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-gray-600" />
              Deskripsi & Persyaratan
            </h2>
          </div>
          <div className="p-6">
            {lowongan.catatan ? (
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {lowongan.catatan}
              </p>
            ) : (
              <p className="text-gray-400 italic">
                Tidak ada catatan atau persyaratan
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Deadline & Status Pelamar
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline Lowongan
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} className="text-orange-600" />
                  <p className="text-xl font-bold text-orange-600">
                    {formatDate(lowongan.deadline_lowongan)}
                  </p>
                </div>
                {!deadlinePassed && daysRemaining !== null && (
                  <p
                    className={`text-sm ${
                      daysRemaining <= 7
                        ? "text-red-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {daysRemaining > 0
                      ? `${daysRemaining} hari lagi`
                      : "Hari ini adalah deadline!"}
                  </p>
                )}
                {deadlinePassed && (
                  <p className="text-sm text-red-600 font-semibold">
                    Deadline sudah terlewat
                  </p>
                )}
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Pelamar
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className="text-purple-600" />
                  <p className="text-xl font-bold text-purple-600">
                    {lowongan.jumlah_pelamar} pelamar
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/pelamar-lowongan/${lowongan.id}`)}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  Lihat daftar pelamar →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Status Lowongan
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`flex-1 p-4 rounded-lg border-2 ${
                  lowongan.status_lowongan === "aktif"
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">Status Saat Ini</p>
                <p
                  className={`text-xl font-bold ${
                    lowongan.status_lowongan === "aktif"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {lowongan.status_lowongan === "aktif"
                    ? "● Aktif"
                    : "○ Tidak Aktif"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {lowongan.status_lowongan === "aktif"
                    ? "Lowongan dapat dilihat oleh pelamar"
                    : "Lowongan tidak ditampilkan di halaman publik"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Dibuat pada:</span>
              <span className="ml-2 text-gray-700 font-medium">
                {formatDateTime(lowongan.created_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Terakhir diubah:</span>
              <span className="ml-2 text-gray-700 font-medium">
                {formatDateTime(lowongan.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailLowonganPage;
