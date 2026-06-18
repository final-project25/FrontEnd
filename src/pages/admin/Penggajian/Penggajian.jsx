import { Search, Plus, Eye, Edit, Trash2, Download, Send, Copy, X, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { showError, succesError } from "../../../utils/notify";
import Pagination from "../../../components/Elements/Pagination";
import ConfirmModal from "../../../components/Elements/ConfirmModal";

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

const getValue = (val) => (Array.isArray(val) ? val[0] : val);

const PenggajianPage = () => {
  const navigate = useNavigate();
  const [penggajian, setPenggajian] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [slipGajiKaryawan, setSlipGajiKaryawan] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [confirmWa, setConfirmWa] = useState({ open: false, id: null, nama: "" });
  const [confirmCopy, setConfirmCopy] = useState(false);

  // Filter tabel — null = belum dipilih (tampilkan semua)
  const [filterBulanTabel, setFilterBulanTabel] = useState(null);
  const [filterTahunTabel, setFilterTahunTabel] = useState(null);

  // Filter export Excel
  const [exportBulan, setExportBulan] = useState(new Date().getMonth() + 1);
  const [exportTahun, setExportTahun] = useState(new Date().getFullYear());

  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Fetch ulang dari halaman 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
    getAllPenggajian(1, filterBulanTabel, filterTahunTabel);
  }, [filterBulanTabel, filterTahunTabel]);

  // Fetch saat ganti halaman
  useEffect(() => {
    getAllPenggajian(currentPage, filterBulanTabel, filterTahunTabel);
  }, [currentPage]);

  const getAllPenggajian = async (page = 1, bulan = filterBulanTabel, tahun = filterTahunTabel) => {
    try {
      setLoading(true);
      const params = { page };
      if (bulan && tahun) {
        params.gajian_bulan = `${tahun}-${String(bulan).padStart(2, "0")}-01`;
      }
      const response = await api.get("/penggajian", { params });
      setPenggajian(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error(error);
      showError("Gagal memuat data penggajian");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    setFilterBulanTabel(null);
    setFilterTahunTabel(null);
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/penggajian/${confirmDelete.id}`);
      succesError("Data penggajian berhasil dihapus");
      getAllPenggajian(currentPage, filterBulanTabel, filterTahunTabel);
    } catch (error) {
      showError(error.response?.data?.message || "Gagal menghapus data");
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  const handleSendWhatsApp = (id, namaKaryawan) => {
    setConfirmWa({ open: true, id, nama: namaKaryawan });
  };

  const handleConfirmSendWa = async () => {
    const { id, nama } = confirmWa;
    setConfirmWa({ open: false, id: null, nama: "" });
    try {
      setSlipGajiKaryawan((prev) => ({ ...prev, [id]: true }));
      const response = await api.get(`/penggajian/${id}/send-whatsapp`);
      const { whatsapp_url, karyawan, no_wa } = response.data.data;
      window.open(whatsapp_url, "_blank");
      succesError(`Slip gaji ${karyawan} siap dikirim ke ${no_wa}`);
    } catch (error) {
      showError(error.response?.data?.message || "Gagal generate URL WhatsApp");
    } finally {
      setSlipGajiKaryawan((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleCopyPreviousMonth = () => {
    const bulan_referensi = `${copyForm.refTahun}-${String(copyForm.refBulan).padStart(2, "0")}-01`;
    const bulan_baru = `${copyForm.newTahun}-${String(copyForm.newBulan).padStart(2, "0")}-01`;
    if (bulan_referensi === bulan_baru) {
      showError("Bulan referensi dan bulan baru tidak boleh sama.");
      return;
    }
    setConfirmCopy(true);
  };

  const handleConfirmCopy = async () => {
    const bulan_referensi = `${copyForm.refTahun}-${String(copyForm.refBulan).padStart(2, "0")}-01`;
    const bulan_baru = `${copyForm.newTahun}-${String(copyForm.newBulan).padStart(2, "0")}-01`;
    setConfirmCopy(false);
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
      getAllPenggajian(currentPage, filterBulanTabel, filterTahunTabel);
    } catch (error) {
      showError(error.response?.data?.message || "Gagal menyalin data penggajian");
    } finally {
      setCopyLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      const gajian_bulan = `${exportTahun}-${String(exportBulan).padStart(2, "0")}-01`;
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
      link.download = `Penggajian_${getNamaBulan(exportBulan)}_${exportTahun}.xlsx`;
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

  const filteredPenggajian = penggajian.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.karyawan?.nama_lengkap?.toLowerCase().includes(q) ||
      p.karyawan?.nomor_induk?.toLowerCase().includes(q) ||
      p.karyawan?.nik?.toLowerCase().includes(q)
    );
  });

  const currentPageMeta = getValue(meta?.current_page);
  const perPageMeta = getValue(meta?.per_page);
  const lastPageMeta = getValue(meta?.last_page);
  const totalMeta = getValue(meta?.total);
  const fromMeta = getValue(meta?.from);
  const toMeta = getValue(meta?.to);

  return (
    <div>
      <ConfirmModal
        isOpen={confirmDelete.open}
        title="Hapus Data Penggajian"
        message="Apakah Anda yakin ingin menghapus data penggajian ini?"
        confirmText="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />
      <ConfirmModal
        isOpen={confirmWa.open}
        variant="info"
        title="Kirim Slip Gaji"
        message={`Kirim slip gaji via WhatsApp ke ${confirmWa.nama}?`}
        confirmText="Ya, Kirim"
        onConfirm={handleConfirmSendWa}
        onCancel={() => setConfirmWa({ open: false, id: null, nama: "" })}
      />
      <ConfirmModal
        isOpen={confirmCopy}
        variant="info"
        title="Salin Data Penggajian"
        message={`Salin data penggajian dari ${getNamaBulan(copyForm.refBulan)} ${copyForm.refTahun} ke ${getNamaBulan(copyForm.newBulan)} ${copyForm.newTahun}? Proses ini akan membuat data penggajian baru berdasarkan bulan referensi.`}
        confirmText="Ya, Salin"
        onConfirm={handleConfirmCopy}
        onCancel={() => setConfirmCopy(false)}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Penggajian</h1>
        <p className="text-gray-600 mt-1">Kelola data penggajian karyawan perusahaan</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col gap-4">

          {/* Baris 1: Search + Filter tabel + Tombol aksi */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
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

            {/* Filter bulan/tahun — reaktif langsung seperti tagihan */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-sm text-gray-600 whitespace-nowrap">Filter:</label>
              <select
                value={filterBulanTabel ?? ""}
                onChange={(e) => setFilterBulanTabel(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Pilih</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{getNamaBulan(i + 1)}</option>
                ))}
              </select>
              <select
                value={filterTahunTabel ?? ""}
                onChange={(e) => setFilterTahunTabel(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Pilih</option>
                {generateYears().map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {(filterBulanTabel || filterTahunTabel) && (
                <button
                  onClick={handleResetFilter}
                  disabled={loading}
                  title="Reset filter"
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 border border-gray-300 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <RotateCcw size={15} />
                </button>
              )}
            </div>

            {/* Tombol aksi */}
            <div className="flex items-center gap-2">
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
            </div>
          </div>

          {/* Baris 2: Export Excel */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Export Excel:</span>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Bulan:</label>
                <select
                  value={exportBulan}
                  onChange={(e) => setExportBulan(parseInt(e.target.value))}
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
                  value={exportTahun}
                  onChange={(e) => setExportTahun(parseInt(e.target.value))}
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
                Export data: {getNamaBulan(exportBulan)} {exportTahun}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabel */}
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
                  <td colSpan="8" className="px-6 py-8">
                    <div className="flex items-center justify-center gap-2">
                      <ClipLoader color="grey" size={20} />
                      <span className="text-gray-600">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPenggajian.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    {filterBulanTabel && filterTahunTabel
                      ? `Tidak ada data penggajian untuk ${getNamaBulan(filterBulanTabel)} ${filterTahunTabel}`
                      : "Tidak ada data penggajian"}
                  </td>
                </tr>
              ) : (
                filteredPenggajian.map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-gray-600">
          {meta
            ? `Menampilkan ${fromMeta ?? 0}–${toMeta ?? 0} dari ${totalMeta ?? 0} data penggajian`
            : `Menampilkan ${penggajian.length} data penggajian`}
          <span className="ml-2 text-cyan-600 font-medium">
            {filterBulanTabel && filterTahunTabel
              ? `(${getNamaBulan(filterBulanTabel)} ${filterTahunTabel})`
              : "(Semua Periode)"}
          </span>
        </p>
        <Pagination
          currentPage={currentPageMeta ?? 1}
          totalPages={lastPageMeta ?? 1}
          onPageChange={setCurrentPage}
          disabled={loading}
        />
      </div>

      {/* Modal Copy Bulan Sebelumnya */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Copy size={20} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Salin Data Penggajian</h2>
                  <p className="text-sm text-gray-500">Copy data dari bulan sebelumnya ke bulan baru</p>
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

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulan Referensi (Sumber)</label>
                <div className="flex gap-3">
                  <select
                    value={copyForm.refBulan}
                    onChange={(e) => setCopyForm((p) => ({ ...p, refBulan: parseInt(e.target.value) }))}
                    disabled={copyLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{getNamaBulan(i + 1)}</option>
                    ))}
                  </select>
                  <select
                    value={copyForm.refTahun}
                    onChange={(e) => setCopyForm((p) => ({ ...p, refTahun: parseInt(e.target.value) }))}
                    disabled={copyLoading}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="h-px w-16 bg-gray-200" />
                  <span>disalin ke</span>
                  <div className="h-px w-16 bg-gray-200" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulan Baru (Tujuan)</label>
                <div className="flex gap-3">
                  <select
                    value={copyForm.newBulan}
                    onChange={(e) => setCopyForm((p) => ({ ...p, newBulan: parseInt(e.target.value) }))}
                    disabled={copyLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{getNamaBulan(i + 1)}</option>
                    ))}
                  </select>
                  <select
                    value={copyForm.newTahun}
                    onChange={(e) => setCopyForm((p) => ({ ...p, newTahun: parseInt(e.target.value) }))}
                    disabled={copyLoading}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Opsi Penyalinan</p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyForm.copy_all}
                    onChange={(e) => setCopyForm((p) => ({ ...p, copy_all: e.target.checked }))}
                    disabled={copyLoading}
                    className="mt-0.5 w-4 h-4 text-purple-600 rounded focus:ring-purple-500 disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Copy Semua Karyawan</span>
                    <p className="text-xs text-gray-500 mt-0.5">Salin data gaji seluruh karyawan dari bulan referensi</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyForm.adjust_thr}
                    onChange={(e) => setCopyForm((p) => ({ ...p, adjust_thr: e.target.checked }))}
                    disabled={copyLoading}
                    className="mt-0.5 w-4 h-4 text-purple-600 rounded focus:ring-purple-500 disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Sesuaikan THR</span>
                    <p className="text-xs text-gray-500 mt-0.5">Otomatis menyesuaikan komponen THR pada bulan baru</p>
                  </div>
                </label>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Ringkasan:</span> Menyalin data penggajian{" "}
                  <span className="font-semibold">{getNamaBulan(copyForm.refBulan)} {copyForm.refTahun}</span>{" "}
                  → <span className="font-semibold">{getNamaBulan(copyForm.newBulan)} {copyForm.newTahun}</span>
                </p>
              </div>
            </div>

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
                  <><ClipLoader color="#ffffff" size={18} /><span>Menyalin...</span></>
                ) : (
                  <><Copy size={18} /><span>Salin Data</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenggajianPage;