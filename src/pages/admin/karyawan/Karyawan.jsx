import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const KaryawanPage = () => {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllKaryawan();
  }, []);

  const getAllKaryawan = async () => {
    try {
      setLoading(true);
      const response = await api.get("/karyawan");
      setKaryawan(response.data.data);
    } catch (error) {
      console.log(error);
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
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus karyawan ini?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/karyawan/${id}`);

      setKaryawan((prev) => prev.filter((item) => item.id !== id));

      alert("Data karyawan berhasil dihapus");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Gagal menghapus data karyawan");
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
                      {index + 1}
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

      {!loading && filteredKaryawan.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Menampilkan {filteredKaryawan.length} dari {karyawan.length} karyawan
        </div>
      )}
    </div>
  );
};

export default KaryawanPage;
