import { Search, Plus, Eye, Edit, Trash2, Download, Send } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { showError, succesError } from "../../../utils/notify";

const getNamaBulan = (bulan) => {
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return namaBulan[bulan - 1];
};

const generateYears = () => {
  const current = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, i) => current - 5 + i);
};

const formatMonthYear = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (!amount) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const INITIAL_PAGINATION = {
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15,
  from: 0,
  to: 0,
};

const PenggajianPage = () => {
  const navigate = useNavigate();
  const [penggajian, setPenggajian] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [slipGajiKaryawan, setSlipGajiKaryawan] = useState({});
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchPenggajian(1);
  }, []);

  const fetchPenggajian = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/penggajian?page=${page}`);
      const data = response.data.data;

      setPenggajian(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        per_page: data.per_page,
        from: data.from,
        to: data.to,
      });
    } catch (error) {
      console.error(error);
      showError("Gagal memuat data penggajian");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchPenggajian(page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data penggajian ini?")) return;
    try {
      await api.delete(`/penggajian/${id}`);
      succesError("Data penggajian berhasil dihapus");
      fetchPenggajian(pagination.current_page);
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Gagal menghapus data");
    }
  };

  const handleSendWhatsApp = async (id, namaKaryawan) => {
    if (!window.confirm(`Kirim slip gaji ke WhatsApp ${namaKaryawan}?`)) return;
    try {
      setSlipGajiKaryawan((prev) => ({ ...prev, [id]: true }));
      const response = await api.get(`/penggajian/${id}/send-whatsapp`);
      const { whatsapp_url, karyawan, no_wa } = response.data.data;
      window.open(whatsapp_url, "_blank");
      succesError(`Slip gaji ${karyawan} siap dikirim ke ${no_wa}`);
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Gagal generate URL WhatsApp");
    } finally {
      setSlipGajiKaryawan((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      const response = await api.get(
        `/penggajian/excel?tahun=${filterTahun}&bulan=${filterBulan}`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const fileName = `Penggajian_${getNamaBulan(filterBulan)}_${filterTahun}.xlsx`;
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      succesError(`File ${fileName} berhasil didownload!`);
    } catch (error) {
      console.error(error);
      showError(
        error.response?.data?.message ||
        "Gagal mengexport data. Pastikan ada data penggajian untuk periode yang dipilih.",
      );
    } finally {
      setExportLoading(false);
    }
  };

  const pageNumbers = Array.from(
    { length: pagination.last_page },
    (_, i) => i + 1,
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Penggajian</h1>
        <p className="text-gray-600 mt-1">Kelola data penggajian karyawan perusahaan</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama, nomor induk, atau NIK..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => navigate("/create-penggajian")}
              className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Plus size={20} />
              <span>Tambah Penggajian</span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Export Excel:</span>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Bulan:</label>
                <select
                  value={filterBulan}
                  onChange={(e) => setFilterBulan(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{getNamaBulan(i + 1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Tahun:</label>
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {generateYears().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleExportExcel}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {exportLoading ? (
                  <>
                    <ClipLoader color="#ffffff" size={16} />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Export Excel</span>
                  </>
                )}
              </button>
              <span className="text-sm text-gray-500">
                Export data: {getNamaBulan(filterBulan)} {filterTahun}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["No", "Nama", "Posisi", "Periode", "Hari Kerja", "Gaji Kotor", "Upah Diterima", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8">
                    <div className="flex items-center justify-center gap-2">
                      <ClipLoader color="grey" size={20} />
                      <span className="text-gray-600">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : penggajian.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data penggajian
                  </td>
                </tr>
              ) : (
                penggajian.map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(pagination.current_page - 1) * pagination.per_page + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.posisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMonthYear(p.gajian_bulan)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.jumlah_hari_kerja} hari</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatCurrency(p.upah_kotor_karyawan)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{formatCurrency(p.upah_diterima)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status_penggajian ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {p.status_penggajian ? "Selesai" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/detail-penggajian/${p.id}`)} className="text-blue-600 hover:text-blue-800" title="Lihat Detail">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleSendWhatsApp(p.id, p.nama)}
                          disabled={slipGajiKaryawan[p.id]}
                          className="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Kirim Slip Gaji via WhatsApp"
                        >
                          {slipGajiKaryawan[p.id] ? <ClipLoader color="#16a34a" size={16} /> : <Send size={18} />}
                        </button>
                        <button onClick={() => navigate(`/update-penggajian/${p.id}`)} className="text-yellow-600 hover:text-yellow-800" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800" title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {pagination.from}–{pagination.to} dari {pagination.total} data
        </p>

        {pagination.last_page > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-lg text-sm ${
                    page === pagination.current_page
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenggajianPage;