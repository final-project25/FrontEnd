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

const formatCurrency = (amount) => {
  if (!amount) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper: ambil nilai pertama jika array, atau nilai langsung
const getValue = (val) => (Array.isArray(val) ? val[0] : val);

const PenggajianPage = () => {
  const navigate = useNavigate();
  const [penggajian, setPenggajian] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [slipGajiKaryawan, setSlipGajiKaryawan] = useState({});
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState(null);
  const [links, setLinks] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPenggajian(currentPage);
  }, [currentPage]);

  const fetchPenggajian = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/penggajian?page=${page}`);
      setPenggajian(response.data.data);
      setMeta(response.data.meta);
      setLinks(response.data.links);
    } catch (error) {
      console.error(error);
      showError("Gagal memuat data penggajian");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data penggajian ini?")) return;
    try {
      await api.delete(`/penggajian/${id}`);
      succesError("Data penggajian berhasil dihapus");
      fetchPenggajian(currentPage);
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

    const gajian_bulan = `${filterTahun}-${String(filterBulan).padStart(2, "0")}-01`;

    const response = await api.get("/penggajian/excel", {
      params: { gajian_bulan },
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Penggajian_${getNamaBulan(filterBulan)}_${filterTahun}.xlsx`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    succesError("Export Excel berhasil!");
  } catch (error) {
    console.error(error);
    showError("Export gagal. Cek data atau server.");
  } finally {
    setExportLoading(false);
  }
};

  // ✅ Dipindah ke dalam component
  const filteredPenggajian = penggajian.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.karyawan?.nama_lengkap?.toLowerCase().includes(q) ||
      p.karyawan?.nomor_induk?.toLowerCase().includes(q) ||
      p.karyawan?.nik?.toLowerCase().includes(q)
    );
  });

  // ✅ Gunakan getValue() untuk handle nilai array dari backend
  const currentPageMeta = getValue(meta?.current_page);
  const perPageMeta = getValue(meta?.per_page);
  const lastPageMeta = getValue(meta?.last_page);
  const totalMeta = getValue(meta?.total);

  const pageNumbers =
    meta?.links?.filter((l) => l.page !== null).map((l) => l.page) || [];

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  <><ClipLoader color="#ffffff" size={16} /><span>Exporting...</span></>
                ) : (
                  <><Download size={20} /><span>Export Excel</span></>
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
                {["No", "Nama", "Posisi", "Periode", "Hari Kerja", "Gaji Kotor", "Upah Diterima", "Aksi"].map((h) => (
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
              ) : filteredPenggajian.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data penggajian
                  </td>
                </tr>
              ) : (
                filteredPenggajian.map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* ✅ Pakai getValue() agar tidak NaN */}
                      {(currentPageMeta - 1) * perPageMeta + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {p.karyawan?.nama_lengkap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.karyawan?.posisi?.replace(/_/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.bulan_tahun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.jumlah_hari_kerja} hari
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(p.upah_kotor_karyawan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {formatCurrency(p.upah_diterima)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status_penggajian ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {p.status_penggajian ? "Selesai" : "Pending"}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/detail-penggajian/${p.id}`)} className="text-blue-600 hover:text-blue-800" title="Lihat Detail">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleSendWhatsApp(p.id, p.karyawan?.nama_lengkap)}
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
          {meta
            ? `Menampilkan ${meta.from ?? 0}–${meta.to ?? 0} dari ${totalMeta} data penggajian`
            : `Menampilkan ${penggajian.length} data penggajian`}
        </p>

        {pageNumbers.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={!links?.prev}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg text-sm ${
                    page === currentPageMeta
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, lastPageMeta ?? p))}
              disabled={!links?.next}
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