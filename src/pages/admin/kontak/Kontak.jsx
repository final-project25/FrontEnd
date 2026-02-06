import { Search, Eye, Trash2, Mail, MailOpen } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { showError, succesError } from "../../../utils/notify";

const KontakPage = () => {
  const navigate = useNavigate();
  const [kontak, setKontak] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua"); // semua, pending, dibaca

  useEffect(() => {
    getAllKontak();
  }, []);

  const getAllKontak = async () => {
    try {
      setLoading(true);
      const response = await api.get("/kontak");
      setKontak(response.data.data);
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data kontak");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus kontak ini?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/kontak/${id}`);
      setKontak((prev) => prev.filter((item) => item.id !== id));
      succesError("Kontak berhasil dihapus");
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Gagal menghapus kontak");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/kontak/${id}/status`, { status_dibaca: "dibaca" });
      setKontak((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status_dibaca: "dibaca" } : item,
        ),
      );

      succesError("Kontak ditandai sudah dibaca");
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Gagal update status");
    }
  };

  const filteredKontak = kontak.filter((k) => {
    const matchSearch =
      k.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.subjek?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.perusahaan?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "semua" || k.status_dibaca === filterStatus;

    return matchSearch && matchStatus;
  });

  const formatDate = (dateString) => {
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

  // Hitung jumlah pending
  const pendingCount = kontak.filter(
    (k) => k.status_dibaca === "pending",
  ).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pesan Kontak</h1>
        <p className="text-gray-600 mt-1">
          Kelola pesan masuk dari pengunjung website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Pesan</p>
              <p className="text-2xl font-bold text-gray-900">
                {kontak.length}
              </p>
            </div>
            <Mail className="text-cyan-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Belum Dibaca</p>
              <p className="text-2xl font-bold text-orange-600">
                {pendingCount}
              </p>
            </div>
            <MailOpen className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sudah Dibaca</p>
              <p className="text-2xl font-bold text-green-600">
                {kontak.length - pendingCount}
              </p>
            </div>
            <MailOpen className="text-green-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama, email, subjek, atau perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="semua">Semua</option>
              <option value="pending">Belum Dibaca</option>
              <option value="dibaca">Sudah Dibaca</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ClipLoader color="#0891b2" size={40} />
          </div>
        ) : filteredKontak.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "semua"
                ? "Tidak ada pesan yang sesuai dengan filter"
                : "Belum ada pesan kontak"}
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
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perusahaan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjek
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
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
                {filteredKontak.map((k, index) => (
                  <tr
                    key={k.id}
                    className={`hover:bg-gray-50 ${
                      k.status_dibaca === "pending" ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {k.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {k.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {k.perusahaan || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">{k.subjek}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(k.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          k.status_dibaca === "dibaca"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {k.status_dibaca === "dibaca"
                          ? "Sudah Dibaca"
                          : "Belum Dibaca"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/kontak/${k.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        {k.status_dibaca === "pending" && (
                          <button
                            onClick={() => handleMarkAsRead(k.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Tandai Sudah Dibaca"
                          >
                            <MailOpen size={18} />
                          </button>
                        )}
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

      {!loading && filteredKontak.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Menampilkan {filteredKontak.length} dari {kontak.length} pesan
        </div>
      )}
    </div>
  );
};

export default KontakPage;
