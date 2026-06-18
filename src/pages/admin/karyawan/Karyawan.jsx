import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Search, Plus, Edit, Trash2, Eye, RotateCcw, X, Download } from "lucide-react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";
import Pagination from "../../../components/Elements/Pagination";
import ConfirmModal from "../../../components/Elements/ConfirmModal";

const KaryawanPage = () => {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreNik, setRestoreNik] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreError, setRestoreError] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [filterStatusAktif, setFilterStatusAktif] = useState("1");
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    getAllKaryawan(currentPage);
  }, [currentPage]);

  const getAllKaryawan = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/karyawan?page=${page}`);
      setKaryawan(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data karyawan");
    } finally {
      setLoading(false);
    }
  };

  const filteredKaryawan = karyawan.filter(
    (k) =>
      k.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.nomor_induk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.nik?.includes(searchTerm) ||
      k.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );


  // const handleExportExcel = async () => {
  //   try {
  //     setExportLoading(true);

  //     let queryParam = "";
  //     if (filterStatusAktif !== "all") {
  //       queryParam = `?status_aktif=${filterStatusAktif}`;
  //     }

  //     const response = await api.get(
  //       `/karyawan/karyawan/download-excel${queryParam}`,
  //       {
  //         responseType: "blob",
  //       },
  //     );

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;

  //     let statusLabel = "Semua";
  //     if (filterStatusAktif === "1") statusLabel = "Aktif";
  //     if (filterStatusAktif === "0") statusLabel = "Tidak_Aktif";

  //     const fileName = `Data_Karyawan_${statusLabel}_${new Date().toISOString().split("T")[0]}.xlsx`;
  //     link.setAttribute("download", fileName);

  //     document.body.appendChild(link);
  //     link.click();

  //     link.parentNode.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     succesError(`File ${fileName} berhasil didownload!`);
  //   } catch (error) {
  //     console.log(error);
  //     showError(
  //       error.response?.data?.message ||
  //         "Gagal mengexport data. Pastikan ada data karyawan.",
  //     );
  //   } finally {
  //     setExportLoading(false);
  //   }
  // };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async (id) => {
    setConfirmModal({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/karyawan/${confirmModal.id}`);
      setKaryawan((prev) => prev.filter((item) => item.id !== confirmModal.id));
      succesError("Data karyawan berhasil dihapus");
    } catch (error) {
      showError(error.response?.data?.message || "Gagal menghapus data karyawan");
    } finally {
      setConfirmModal({ open: false, id: null });
    }
  };

  const handleRestore = async () => {
    if (!restoreNik.trim()) {
      setRestoreError("NIK tidak boleh kosong");
      return;
    }
    if (!/^\d{15,16}$/.test(restoreNik.trim())) {
      setRestoreError("NIK harus 15-16 digit angka");
      return;
    }

    try {
      setRestoreLoading(true);
      setRestoreError("");
      const response = await api.post("/karyawan/restore-by-nik", {
        nik: restoreNik.trim(),
      });
      succesError(
        response.data?.message || "Data karyawan berhasil dipulihkan"
      );
      setShowRestoreModal(false);
      setRestoreNik("");
      getAllKaryawan(currentPage);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 404) {
        setRestoreError("Data karyawan dengan NIK tersebut tidak ditemukan atau belum dihapus.");
      } else {
        setRestoreError(
          error.response?.data?.message || "Gagal memulihkan data karyawan"
        );
      }
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleCloseRestoreModal = () => {
    setShowRestoreModal(false);
    setRestoreNik("");
    setRestoreError("");
  };

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);

      const params = new URLSearchParams();
      if (filterStatusAktif !== "") {
        params.append("status_aktif", filterStatusAktif);
      }

      const response = await api.get(
        `/karyawan/download-excel?${params.toString()}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const statusLabel =
        filterStatusAktif === "1" ? "Aktif" :
        filterStatusAktif === "0" ? "Tidak_Aktif" : "Semua";
      const fileName = `Data_Karyawan_${statusLabel}_${new Date().toISOString().split("T")[0]}.xlsx`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      succesError(`${fileName} berhasil didownload!`);
    } catch (error) {
      console.log(error);
      showError(
        error.response?.data?.message || "Gagal mengexport data karyawan"
      );
    } finally {
      setExportLoading(false);
    }
  };

  const formatPosisi = (posisi) => {
    const posisiMap = {
      cleaning_service: "Cleaning Service",
      supir: "Supir",
      security: "Security",
      admin: "Admin",
      manager: "Manager",
    };
    return posisiMap[posisi] || posisi;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Karyawan</h1>
        <p className="text-gray-600 mt-1">Kelola data karyawan perusahaan</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari nama, nomor induk, NIK, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => navigate("/create-karyawan")}
              className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Plus size={20} />
              <span>Tambah Karyawan</span>
            </button>
            <button
              onClick={() => setShowRestoreModal(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <RotateCcw size={20} />
              <span>Restore Karyawan</span>
            </button>
          </div>

          {/* Export Excel */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Export Excel:</span>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Status:</label>
                <select
                  value={filterStatusAktif}
                  onChange={(e) => setFilterStatusAktif(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Semua Karyawan</option>
                  <option value="1">Karyawan Aktif</option>
                  <option value="0">Karyawan Tidak Aktif</option>
                </select>
              </div>
              <button
                onClick={handleExportExcel}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed text-sm"
              >
                {exportLoading ? (
                  <>
                    <ClipLoader color="#ffffff" size={16} />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Export Excel</span>
                  </>
                )}
              </button>
              <span className="text-sm text-gray-500">
                {filterStatusAktif === "" && "Export semua data karyawan"}
                {filterStatusAktif === "1" && "Export karyawan aktif"}
                {filterStatusAktif === "0" && "Export karyawan tidak aktif"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ClipLoader color="#0891b2" size={40} />
          </div>
        ) : filteredKaryawan.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm
                ? "Tidak ada data yang sesuai dengan pencarian"
                : "Belum ada data karyawan"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor Induk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIK
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. WA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Masuk
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
                {filteredKaryawan.map((k, index) => (
                  <tr key={k.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(meta?.current_page - 1) * meta?.per_page + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {k.nomor_induk}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {k.nama_lengkap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {k.nik}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPosisi(k.posisi)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {k.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {k.no_wa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(k.tanggal_masuk)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          k.status_aktif == 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {k.status_aktif == 1 ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/detail-karyawan/${k.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/update-karyawan/${k.id}`)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(k.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && (
        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-600">
            {meta
              ? `Menampilkan ${meta.from ?? 0}–${meta.to ?? 0} dari ${meta.total ?? 0} karyawan`
              : `Menampilkan ${filteredKaryawan.length} karyawan`}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={meta?.last_page ?? 1}
            onPageChange={setCurrentPage}
            disabled={loading}
          />
        </div>
      )}
      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title="Hapus Karyawan"
        message="Apakah Anda yakin ingin menghapus karyawan ini? Data yang dihapus dapat dipulihkan melalui fitur Restore."
        confirmText="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ open: false, id: null })}
      />

      {/* Modal Restore Karyawan */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <RotateCcw size={20} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Restore Karyawan
                  </h2>
                  <p className="text-sm text-gray-500">
                    Pulihkan data karyawan yang telah dihapus
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseRestoreModal}
                disabled={restoreLoading}
                className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIK Karyawan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={restoreNik}
                  onChange={(e) => {
                    if (!/^\d*$/.test(e.target.value)) return;
                    setRestoreNik(e.target.value);
                    setRestoreError("");
                  }}
                  placeholder="Masukkan 16 digit NIK karyawan"
                  maxLength={16}
                  disabled={restoreLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    restoreError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {restoreError && (
                  <p className="text-red-500 text-sm mt-1">{restoreError}</p>
                )}
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">
                  <span className="font-medium">Perhatian:</span> Masukkan NIK karyawan yang datanya ingin dipulihkan. Data yang dipulihkan akan kembali aktif di sistem.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
              <button
                onClick={handleCloseRestoreModal}
                disabled={restoreLoading}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={handleRestore}
                disabled={restoreLoading}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                {restoreLoading ? (
                  <>
                    <ClipLoader color="#ffffff" size={18} />
                    <span>Memulihkan...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={18} />
                    <span>Restore</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaryawanPage;
