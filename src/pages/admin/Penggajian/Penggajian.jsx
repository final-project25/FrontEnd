import { Search, Plus, Eye, Edit, Trash2, Download, Send, Copy, X, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
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
  const [copyLoading, setCopyLoading] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [bulkWaLoading, setBulkWaLoading] = useState(false);
  const [showBulkWaModal, setShowBulkWaModal] = useState(false);
  const [bulkWaResult, setBulkWaResult] = useState(null); // null = form, object = hasil
  const [bulkWaForm, setBulkWaForm] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
  });
  const [slipGajiKaryawan, setSlipGajiKaryawan] = useState({});
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState(null);
  const [links, setLinks] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // State untuk copy modal
  const currentYear = new Date().getFullYear();
  const prevMonth = new Date().getMonth() === 0 ? 12 : new Date().getMonth();
  const prevYear = new Date().getMonth() === 0 ? currentYear - 1 : currentYear;
  const [copyForm, setCopyForm] = useState({
    refBulan: prevMonth,
    refTahun: prevYear,
    newBulan: new Date().getMonth() + 1,
    newTahun: currentYear,
    copy_all: true,
    adjust_thr: false,
  });

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

  const handleCopyPreviousMonth = async () => {
    const bulan_referensi = `${copyForm.refTahun}-${String(copyForm.refBulan).padStart(2, "0")}-01`;
    const bulan_baru = `${copyForm.newTahun}-${String(copyForm.newBulan).padStart(2, "0")}-01`;

    if (bulan_referensi === bulan_baru) {
      showError("Bulan referensi dan bulan baru tidak boleh sama.");
      return;
    }

    if (
      !window.confirm(
        `Salin data penggajian dari ${getNamaBulan(copyForm.refBulan)} ${copyForm.refTahun} ke ${getNamaBulan(copyForm.newBulan)} ${copyForm.newTahun}?\n\nProses ini akan membuat data penggajian baru berdasarkan bulan referensi.`
      )
    )
      return;

    try {
      setCopyLoading(true);
      await api.post("/penggajian/copy-previous-month", {
        bulan_referensi,
        bulan_baru,
        copy_all: copyForm.copy_all,
        adjust_thr: copyForm.adjust_thr,
      });
      succesError(
        `Berhasil menyalin penggajian ${getNamaBulan(copyForm.refBulan)} ${copyForm.refTahun} ke ${getNamaBulan(copyForm.newBulan)} ${copyForm.newTahun}`
      );
      setShowCopyModal(false);
      fetchPenggajian(currentPage);
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Gagal menyalin data penggajian");
    } finally {
      setCopyLoading(false);
    }
  };

  const handleBulkSendWhatsApp = async () => {
    const gajian_bulan = `${bulkWaForm.tahun}-${String(bulkWaForm.bulan).padStart(2, "0")}-01`;
    try {
      setBulkWaLoading(true);
      const response = await api.post(`/penggajian/send-whatsapp-bulk`, {
        gajian_bulan,
      });
      const result = response.data.data;
      setBulkWaResult(result);
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Gagal mengambil data slip gaji bulk");
    } finally {
      setBulkWaLoading(false);
    }
  };

  const handleOpenAllWa = () => {
    if (!bulkWaResult?.berhasil?.length) return;
    // Buka tab pertama langsung (diizinkan browser karena direct click)
    window.open(bulkWaResult.berhasil[0].whatsapp_url, "_blank");
    // Sisanya dengan delay — browser modern sering blokir ini,
    // user sebaiknya klik link per karyawan di daftar
    bulkWaResult.berhasil.slice(1).forEach((item, index) => {
      setTimeout(() => {
        window.open(item.whatsapp_url, "_blank");
      }, (index + 1) * 500);
    });
    succesError(`${bulkWaResult.berhasil_count} slip gaji berhasil dibuka di WhatsApp`);
  };

  const handleCloseBulkWaModal = () => {
    setShowBulkWaModal(false);
    setBulkWaResult(null);
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

  // Normalisasi semua nilai meta yang bisa datang sebagai array
  const currentPageMeta = getValue(meta?.current_page);
  const perPageMeta = getValue(meta?.per_page);
  const lastPageMeta = getValue(meta?.last_page);
  const totalMeta = getValue(meta?.total);
  const fromMeta = getValue(meta?.from);
  const toMeta = getValue(meta?.to);

  // Filter hanya nomor halaman (bukan label navigasi "Sebelumnya"/"Berikutnya"), lalu deduplikasi
  const pageNumbers = [
    ...new Set(
      meta?.links
        ?.filter((l) => l.page !== null && !isNaN(Number(l.label)))
        .map((l) => l.page) || []
    ),
  ];

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
            <button
              onClick={() => setShowCopyModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Copy size={20} />
              <span>Salin Bulan Lalu</span>
            </button>
            <button
              onClick={() => { setBulkWaResult(null); setShowBulkWaModal(true); }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={20} />
              <span>Kirim Semua Slip Gaji</span>
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
            ? `Menampilkan ${fromMeta ?? 0}–${toMeta ?? 0} dari ${totalMeta ?? 0} data penggajian`
            : `Menampilkan ${penggajian.length} data penggajian`}
        </p>

        {pageNumbers.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={!links?.prev || loading}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
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
              disabled={!links?.next || loading}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* Modal Copy Bulan Sebelumnya */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Copy size={20} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Salin Data Penggajian
                  </h2>
                  <p className="text-sm text-gray-500">
                    Copy data dari bulan sebelumnya ke bulan baru
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCopyModal(false)}
                disabled={copyLoading}
                className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Bulan Referensi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan Referensi (Sumber)
                </label>
                <div className="flex gap-3">
                  <select
                    value={copyForm.refBulan}
                    onChange={(e) =>
                      setCopyForm((p) => ({ ...p, refBulan: parseInt(e.target.value) }))
                    }
                    disabled={copyLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {getNamaBulan(i + 1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={copyForm.refTahun}
                    onChange={(e) =>
                      setCopyForm((p) => ({ ...p, refTahun: parseInt(e.target.value) }))
                    }
                    disabled={copyLoading}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Panah */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="h-px w-16 bg-gray-200" />
                  <span>disalin ke</span>
                  <div className="h-px w-16 bg-gray-200" />
                </div>
              </div>

              {/* Bulan Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan Baru (Tujuan)
                </label>
                <div className="flex gap-3">
                  <select
                    value={copyForm.newBulan}
                    onChange={(e) =>
                      setCopyForm((p) => ({ ...p, newBulan: parseInt(e.target.value) }))
                    }
                    disabled={copyLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {getNamaBulan(i + 1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={copyForm.newTahun}
                    onChange={(e) =>
                      setCopyForm((p) => ({ ...p, newTahun: parseInt(e.target.value) }))
                    }
                    disabled={copyLoading}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Opsi */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Opsi Penyalinan</p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyForm.copy_all}
                    onChange={(e) =>
                      setCopyForm((p) => ({ ...p, copy_all: e.target.checked }))
                    }
                    disabled={copyLoading}
                    className="mt-0.5 w-4 h-4 text-purple-600 rounded focus:ring-purple-500 disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Copy Semua Karyawan</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Salin data gaji seluruh karyawan dari bulan referensi
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyForm.adjust_thr}
                    onChange={(e) =>
                      setCopyForm((p) => ({ ...p, adjust_thr: e.target.checked }))
                    }
                    disabled={copyLoading}
                    className="mt-0.5 w-4 h-4 text-purple-600 rounded focus:ring-purple-500 disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Sesuaikan THR</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Otomatis menyesuaikan komponen THR pada bulan baru
                    </p>
                  </div>
                </label>
              </div>

              {/* Ringkasan */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Ringkasan:</span> Menyalin data penggajian{" "}
                  <span className="font-semibold">
                    {getNamaBulan(copyForm.refBulan)} {copyForm.refTahun}
                  </span>{" "}
                  →{" "}
                  <span className="font-semibold">
                    {getNamaBulan(copyForm.newBulan)} {copyForm.newTahun}
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
              <button
                onClick={() => setShowCopyModal(false)}
                disabled={copyLoading}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={handleCopyPreviousMonth}
                disabled={copyLoading}
                className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
              >
                {copyLoading ? (
                  <>
                    <ClipLoader color="#ffffff" size={18} />
                    <span>Menyalin...</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Salin Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Kirim Semua Slip Gaji via WhatsApp */}
      {showBulkWaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Kirim Semua Slip Gaji
                  </h2>
                  <p className="text-sm text-gray-500">
                    Kirim slip gaji ke seluruh karyawan via WhatsApp
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseBulkWaModal}
                disabled={bulkWaLoading}
                className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {!bulkWaResult ? (
                /* Form pilih bulan/tahun */
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Periode Penggajian
                    </label>
                    <div className="flex gap-3">
                      <select
                        value={bulkWaForm.bulan}
                        onChange={(e) =>
                          setBulkWaForm((p) => ({ ...p, bulan: parseInt(e.target.value) }))
                        }
                        disabled={bulkWaLoading}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {getNamaBulan(i + 1)}
                          </option>
                        ))}
                      </select>
                      <select
                        value={bulkWaForm.tahun}
                        onChange={(e) =>
                          setBulkWaForm((p) => ({ ...p, tahun: parseInt(e.target.value) }))
                        }
                        disabled={bulkWaLoading}
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        {generateYears().map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <span className="font-medium">Perhatian:</span> Fitur ini akan membuka tab WhatsApp untuk setiap karyawan. Pastikan browser mengizinkan popup dari halaman ini.
                    </p>
                  </div>
                </div>
              ) : (
                /* Hasil */
                <div className="space-y-4">
                  {/* Ringkasan */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{bulkWaResult.total}</p>
                      <p className="text-xs text-gray-500 mt-1">Total</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{bulkWaResult.berhasil_count}</p>
                      <p className="text-xs text-green-600 mt-1">Berhasil</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-red-600">{bulkWaResult.gagal_count}</p>
                      <p className="text-xs text-red-600 mt-1">Gagal</p>
                    </div>
                  </div>

                  {/* Periode */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      Periode: {bulkWaResult.periode}
                    </p>
                  </div>

                  {/* Daftar karyawan berhasil */}
                  {bulkWaResult.berhasil?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <CheckCircle size={15} className="text-green-500" />
                        Klik nama karyawan untuk membuka WhatsApp:
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {bulkWaResult.berhasil.map((item) => (
                          <a
                            key={item.penggajian_id}
                            href={item.whatsapp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 bg-gray-50 hover:bg-green-50 border border-transparent hover:border-green-200 rounded-lg text-sm transition-colors group"
                          >
                            <div className="flex items-center gap-2">
                              <Send size={14} className="text-green-500 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-800 group-hover:text-green-700">
                                  {item.nama}
                                </span>
                                <span className="text-gray-400 ml-2 text-xs">{item.nomor_induk}</span>
                              </div>
                            </div>
                            <span className="text-gray-500 text-xs">{item.no_wa}</span>
                          </a>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Atau klik tombol di bawah untuk membuka semua sekaligus (izinkan popup di browser)
                      </p>
                    </div>
                  )}

                  {/* Daftar gagal */}
                  {bulkWaResult.gagal?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                        <AlertCircle size={15} />
                        Gagal:
                      </p>
                      <div className="space-y-1">
                        {bulkWaResult.gagal.map((item, i) => (
                          <div key={i} className="p-2 bg-red-50 rounded-lg text-sm text-red-700">
                            {item.nama || item.nomor_induk || `ID: ${item.penggajian_id}`}
                            {item.alasan && <span className="ml-2 text-xs">— {item.alasan}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
              {!bulkWaResult ? (
                <>
                  <button
                    onClick={handleCloseBulkWaModal}
                    disabled={bulkWaLoading}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleBulkSendWhatsApp}
                    disabled={bulkWaLoading}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                  >
                    {bulkWaLoading ? (
                      <>
                        <ClipLoader color="#ffffff" size={18} />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle size={18} />
                        <span>Proses Slip Gaji</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCloseBulkWaModal}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tutup
                  </button>
                  {bulkWaResult.berhasil?.length > 0 && (
                    <button
                      onClick={handleOpenAllWa}
                      className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Send size={18} />
                      <span>Buka {bulkWaResult.berhasil_count} WhatsApp</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenggajianPage;