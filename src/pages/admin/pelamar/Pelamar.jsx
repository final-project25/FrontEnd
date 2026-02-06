import {
  Search,
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Phone,
  MapPin,
  Calendar,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../../../services/api";
import { showError, succesError } from "../../../utils/notify";

const DaftarPelamarPage = () => {
  const navigate = useNavigate();
  const { id: lowonganId } = useParams();

  const [pelamar, setPelamar] = useState([]);
  const [lowonganInfo, setLowonganInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPelamar, setSelectedPelamar] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState({
    type: "",
    url: "",
    title: "",
  });
  const [statusAction, setStatusAction] = useState({
    id: null,
    status: "",
    catatan: "",
  });

  useEffect(() => {
    getAllPelamar();
  }, [lowonganId]);

  const getAllPelamar = async () => {
    try {
      setLoading(true);
      const response = await api.get("/rekruitmen");

      const filteredPelamar = response.data.data.filter(
        (p) => p.lowongan_kerja.id === parseInt(lowonganId),
      );

      setPelamar(filteredPelamar);

      if (filteredPelamar.length > 0) {
        setLowonganInfo(filteredPelamar[0].lowongan_kerja);
      }
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data pelamar");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (pelamarId) => {
    try {
      const response = await api.get(`/rekruitmen/${pelamarId}`);
      setSelectedPelamar(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.log(error);
      showError("Gagal memuat detail pelamar");
    }
  };

  const handlePreviewFile = (url, title) => {
    const fileType = getFileType(url);
    setPreviewData({ url, title, type: fileType });
    setShowPreviewModal(true);
  };

  const getFileType = (url) => {
    if (!url) return "unknown";
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    return "unknown";
  };

  const handleUpdateStatus = async () => {
    if (!statusAction.id) return;

    try {
      await api.patch(`/rekruitmen/${statusAction.id}/status`, {
        status_terima: statusAction.status,
        catatan: statusAction.catatan || null,
      });

      setPelamar((prev) =>
        prev.map((p) =>
          p.id === statusAction.id
            ? {
                ...p,
                status_terima: statusAction.status,
                catatan: statusAction.catatan,
              }
            : p,
        ),
      );

      succesError(
        `Status pelamar berhasil diubah menjadi ${statusAction.status}`,
      );
      setShowStatusModal(false);
      setStatusAction({ id: null, status: "", catatan: "" });
    } catch (error) {
      console.log(error);
      showError(
        error.response?.data?.message || "Gagal mengubah status pelamar",
      );
    }
  };

  const filteredPelamar = pelamar.filter((p) => {
    const matchSearch =
      p.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nik?.includes(searchTerm) ||
      p.no_wa?.includes(searchTerm);

    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && p.status_terima === "pending") ||
      (filterStatus === "diterima" && p.status_terima === "diterima") ||
      (filterStatus === "ditolak" && p.status_terima === "ditolak");

    return matchSearch && matchStatus;
  });

  const totalPelamar = pelamar.length;
  const pendingCount = pelamar.filter(
    (p) => p.status_terima === "pending",
  ).length;
  const diterimaCount = pelamar.filter(
    (p) => p.status_terima === "diterima",
  ).length;
  const ditolakCount = pelamar.filter(
    (p) => p.status_terima === "ditolak",
  ).length;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
        icon: Clock,
      },
      diterima: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Diterima",
        icon: CheckCircle,
      },
      ditolak: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Ditolak",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/rekrutmen")}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar Lowongan</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Daftar Pelamar</h1>
        {lowonganInfo && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {lowonganInfo.posisi}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              {lowonganInfo.lokasi_kerja}
            </div>
            <span>•</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
              {lowonganInfo.jenis_kerja}
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama, NIK, atau nomor WhatsApp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="diterima">Diterima</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pelamar</p>
              <p className="text-2xl font-bold text-gray-900">{totalPelamar}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Diterima</p>
              <p className="text-2xl font-bold text-green-600">
                {diterimaCount}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-red-600">{ditolakCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelamar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posisi Dilamar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Apply
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12">
                    <div className="flex items-center justify-center gap-2">
                      <ClipLoader color="grey" loading={true} size={20} />
                    </div>
                  </td>
                </tr>
              ) : filteredPelamar.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Users className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-500">
                      {searchTerm || filterStatus !== "all"
                        ? "Tidak ada pelamar yang sesuai"
                        : "Belum ada pelamar"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPelamar.map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {p.nama}
                        </p>
                        <p className="text-xs text-gray-500">NIK: {p.nik}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Phone size={14} className="text-gray-400" />
                        <span>{p.no_wa}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                        {p.posisi_dilamar}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{formatDate(p.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(p.status_terima)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(p.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>

                        {p.status_terima === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                setStatusAction({
                                  id: p.id,
                                  status: "diterima",
                                  catatan: "",
                                });
                                setShowStatusModal(true);
                              }}
                              className="text-green-600 hover:text-green-800"
                              title="Terima"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setStatusAction({
                                  id: p.id,
                                  status: "ditolak",
                                  catatan: "",
                                });
                                setShowStatusModal(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="Tolak"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}

                        {p.status_terima !== "pending" && (
                          <button
                            onClick={() => {
                              setStatusAction({
                                id: p.id,
                                status: p.status_terima,
                                catatan: p.catatan || "",
                              });
                              setShowStatusModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-800"
                            title="Ubah Status"
                          >
                            <FileText size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailModal && selectedPelamar && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">
                Detail Pelamar
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Pribadi
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">NIK</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPelamar.nik}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPelamar.nama_lengkap}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama Panggilan</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPelamar.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">No. WhatsApp</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPelamar.no_wa}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Alamat</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPelamar.alamat}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Posisi Dilamar</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPelamar.posisi_dilamar}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Token Pendaftaran</p>
                    <p className="text-sm font-medium text-cyan-600">
                      {selectedPelamar.token_pendaftaran}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dokumen Lamaran
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Foto KTP", url: selectedPelamar.foto_ktp },
                    { label: "Foto KK", url: selectedPelamar.foto_kk },
                    { label: "Foto SKCK", url: selectedPelamar.foto_skck },
                    { label: "Pas Foto", url: selectedPelamar.pas_foto },
                    { label: "Surat Sehat", url: selectedPelamar.surat_sehat },
                    {
                      label: "Surat Anti Narkoba",
                      url: selectedPelamar.surat_anti_narkoba,
                    },
                    {
                      label: "Surat Lamaran",
                      url: selectedPelamar.surat_lamaran,
                    },
                    { label: "CV", url: selectedPelamar.cv },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePreviewFile(doc.url, doc.label)}
                      className="flex items-center justify-between gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm text-gray-900 flex-1">
                        {doc.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Status & Catatan
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    {getStatusBadge(selectedPelamar.status_terima)}
                  </div>
                  {selectedPelamar.catatan && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Catatan</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {selectedPelamar.catatan}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-90 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{previewData.title}</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {previewData.type === "image" ? (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={previewData.url}
                    alt={previewData.title}
                    className="max-w-full max-h-full object-contain rounded shadow-lg"
                  />
                </div>
              ) : previewData.type === "pdf" ? (
                <iframe
                  src={previewData.url}
                  className="w-full h-full min-h-[600px] rounded shadow-lg"
                  title={previewData.title}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Preview tidak tersedia. Silakan download file.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Ubah Status Pelamar
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusAction.status}
                  onChange={(e) =>
                    setStatusAction({ ...statusAction, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="diterima">Diterima</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={statusAction.catatan}
                  onChange={(e) =>
                    setStatusAction({
                      ...statusAction,
                      catatan: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Tambahkan catatan untuk pelamar..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusAction({ id: null, status: "", catatan: "" });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarPelamarPage;
