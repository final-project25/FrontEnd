import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  MapPin,
  Briefcase,
  Calendar,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { showError, succesError } from "../../../utils/notify";

const RekrutmenPage = () => {
  const navigate = useNavigate();
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    getAllRekrutmen();
  }, []);

  const getAllRekrutmen = async () => {
    try {
      setLoading(true);
      const response = await api.get("/lowongan");
      setLowongan(response.data.data);
    } catch (error) {
      console.log(error);
      showError("Gagal memuat Lowongan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, posisi) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus lowongan ${posisi}?`,
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/lowongan/${id}`);
      setLowongan((prev) => prev.filter((item) => item.id !== id));
      succesError("Lowongan berhasil dihapus");
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Gagal menghapus lowongan");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "aktif" ? "tidak_aktif" : "aktif";
    const confirmMessage =
      currentStatus === "aktif"
        ? "Nonaktifkan lowongan ini?"
        : "Aktifkan kembali lowongan ini?";

    if (!window.confirm(confirmMessage)) return;

    try {
      const lowonganToUpdate = lowongan.find((l) => l.id === id);

      if (!lowonganToUpdate) {
        alert("Data lowongan tidak ditemukan di state");
        return;
      }

      const updateData = {
        posisi: lowonganToUpdate.posisi,
        lokasi_kerja: lowonganToUpdate.lokasi_kerja,
        jenis_kerja: lowonganToUpdate.jenis_kerja,
        catatan: lowonganToUpdate.catatan || "",
        range_gaji: lowonganToUpdate.range_gaji,
        deadline_lowongan: lowonganToUpdate.deadline_lowongan,
        status_lowongan: newStatus,
      };

      const response = await api.put(`/lowongan/${id}`, updateData);

      console.log("Update response:", response.data);

      setLowongan((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status_lowongan: newStatus } : item,
        ),
      );

      succesError(
        `Lowongan berhasil ${newStatus === "aktif" ? "diaktifkan" : "dinonaktifkan"}`,
      );
    } catch (error) {
      console.error("Error toggle status:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.status === 404) {
        showError("Lowongan tidak ditemukan. Mungkin sudah dihapus.");
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        showError(`Validasi gagal: ${errorMessages}`);
      } else {
        showError(
          error.response?.data?.message || "Gagal mengubah status lowongan",
        );
      }
    }
  };

  const filteredLowongan = lowongan.filter((l) => {
    const matchSearch =
      l.posisi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.lokasi_kerja?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.jenis_kerja?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "aktif" && l.status_lowongan === "aktif") ||
      (filterStatus === "tidak_aktif" && l.status_lowongan === "tidak_aktif");

    return matchSearch && matchStatus;
  });

  const totalLowongan = lowongan.length;
  const lowonganAktif = lowongan.filter(
    (l) => l.status_lowongan === "aktif",
  ).length;
  const totalPelamar = lowongan.reduce(
    (sum, l) => sum + (l.jumlah_pelamar || 0),
    0,
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
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

  const pagination = {
    current_page: 1,
    last_page: 1,
    total: filteredLowongan.length,
    per_page: 10,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Rekrutmen
        </h1>
        <p className="text-gray-600 mt-1">
          Kelola lowongan pekerjaan dan proses rekrutmen karyawan
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari posisi, lokasi, atau jenis kerja..."
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
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
            </select>
          </div>

          <button
            onClick={() => navigate("/create-rekrutmen")}
            className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus size={20} />
            <span>Buat Lowongan Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Lowongan</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalLowongan}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lowongan Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {lowonganAktif}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pelamar</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalPelamar}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
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
                  Posisi & Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Kerja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Range Gaji
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelamar
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
                  <td colSpan="8" className="px-6 py-12">
                    <div className="flex items-center justify-center gap-2">
                      <ClipLoader color="grey" loading={true} size={20} />
                    </div>
                  </td>
                </tr>
              ) : filteredLowongan.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Briefcase
                      className="mx-auto text-gray-400 mb-2"
                      size={48}
                    />
                    <p className="text-gray-500">
                      {searchTerm || filterStatus !== "all"
                        ? "Tidak ada lowongan yang sesuai"
                        : "Belum ada lowongan pekerjaan"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLowongan.map((l, index) => {
                  const daysRemaining = getDaysRemaining(l.deadline_lowongan);
                  const deadlinePassed = isDeadlinePassed(l.deadline_lowongan);

                  return (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <Briefcase
                            size={18}
                            className="text-gray-400 mt-0.5 shrink-0"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {l.posisi}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin size={25} />
                              <span>{l.lokasi_kerja}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            l.jenis_kerja === "Full Time"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {l.jenis_kerja}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <span className="font-medium">{l.range_gaji}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-900">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{formatDate(l.deadline_lowongan)}</span>
                          </div>
                          {!deadlinePassed && daysRemaining !== null && (
                            <p
                              className={`text-xs mt-1 ${
                                daysRemaining <= 7
                                  ? "text-red-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {daysRemaining > 0
                                ? `${daysRemaining} hari lagi`
                                : "Hari ini"}
                            </p>
                          )}
                          {deadlinePassed && (
                            <p className="text-xs text-red-600 font-medium mt-1">
                              Sudah lewat
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/daftar-pelamar/${l.id}`)}
                          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium"
                        >
                          <Users size={16} />
                          <span>{l.jumlah_pelamar || 0} pelamar</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleToggleStatus(l.id, l.status_lowongan)
                          }
                          className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                            l.status_lowongan === "aktif"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {l.status_lowongan === "aktif"
                            ? "● Aktif"
                            : "○ Tidak Aktif"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/detail-lowongan/${l.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => navigate(`/update-lowongan/${l.id}`)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Edit Lowongan"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(l.id, l.posisi)}
                            className="text-red-600 hover:text-red-800"
                            title="Hapus Lowongan"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Menampilkan 1 - {filteredLowongan.length} dari {pagination.total}{" "}
          lowongan
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border rounded-lg text-sm bg-cyan-600 text-white border-cyan-600">
              1
            </button>
          </div>

          <button
            disabled
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RekrutmenPage;
