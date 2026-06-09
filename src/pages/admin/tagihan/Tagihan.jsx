import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Edit, Eye, Plus, Search, Trash2, Download, Copy, X, RotateCcw } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { succesError, showError } from "../../../utils/notify";
import Pagination from "../../../components/Elements/Pagination";

const POSISI_OPTIONS = [
  { value: "", label: "Semua Posisi" },
  { value: "cleaning_service", label: "Cleaning Service" },
  { value: "supir", label: "Supir" },
  { value: "security", label: "Security" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "operator", label: "Operator" },
];

const TagihanPage = () => {
  const navigate = useNavigate();
  const [tagihan, setTagihan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);

  // State filter tabel — null = belum dipilih, tidak difilter
  const [filterBulanTabel, setFilterBulanTabel] = useState(null);
  const [filterTahunTabel, setFilterTahunTabel] = useState(null);

  // State filter export
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
  const [posisiExport, setPosisiExport] = useState("");

  // State search
  const [search, setSearch] = useState("");

  // State copy modal
  const currentYear = new Date().getFullYear();
  const prevMonth = new Date().getMonth() === 0 ? 12 : new Date().getMonth();
  const prevYear = new Date().getMonth() === 0 ? currentYear - 1 : currentYear;
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyForm, setCopyForm] = useState({
    refBulan: prevMonth,
    refTahun: prevYear,
    newBulan: new Date().getMonth() + 1,
    newTahun: currentYear,
  });

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

  const getAllTagihan = async (page = 1, bulan = filterBulanTabel, tahun = filterTahunTabel) => {
    try {
      setLoading(true);
      let url = `/tagihan?page=${page}`;
      if (bulan && tahun) {
        const tagihan_bulan = `${tahun}-${String(bulan).padStart(2, "0")}-01`;
        url += `&tagihan_bulan=${tagihan_bulan}`;
      }
      const response = await api.get(url);
      setTagihan(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data tagihan");
    } finally {
      setLoading(false);
    }
  };

  // Fetch saat bulan/tahun filter berubah — reset ke page 1
  useEffect(() => {
    setCurrentPage(1);
    getAllTagihan(1, filterBulanTabel, filterTahunTabel);
  }, [filterBulanTabel, filterTahunTabel]);

  // Fetch saat pindah halaman (pakai filter yang sedang aktif)
  useEffect(() => {
    getAllTagihan(currentPage, filterBulanTabel, filterTahunTabel);
  }, [currentPage]);

  const handleResetFilter = () => {
    setFilterBulanTabel(null);
    setFilterTahunTabel(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus tagihan ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/tagihan/${id}`);
      getAllTagihan(currentPage, filterBulanTabel, filterTahunTabel);
      succesError("Data tagihan berhasil dihapus");
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Gagal menghapus data");
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);

      const tagihan_bulan = `${filterTahun}-${String(filterBulan).padStart(2, "0")}-01`;
      const params = new URLSearchParams();
      params.append("tagihan_bulan", tagihan_bulan);
      if (posisiExport) params.append("posisi", posisiExport);

      const response = await api.get(
        `/tagihan/export/excel?${params.toString()}`,
        { responseType: "blob" },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = `Tagihan_${getNamaBulan(filterBulan)}_${filterTahun}.xlsx`;
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      succesError("Export Excel berhasil!");
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Gagal export Excel");
    } finally {
      setExportLoading(false);
    }
  };

  const handleCopyPreviousMonth = async () => {
    const bulan_referensi = `01-${String(copyForm.refBulan).padStart(2, "0")}-${copyForm.refTahun}`;
    const bulan_tujuan = `01-${String(copyForm.newBulan).padStart(2, "0")}-${copyForm.newTahun}`;

    if (bulan_referensi === bulan_tujuan) {
      showError("Bulan referensi dan bulan tujuan tidak boleh sama.");
      return;
    }

    if (
      !window.confirm(
        `Salin data tagihan dari ${getNamaBulan(copyForm.refBulan)} ${copyForm.refTahun} ke ${getNamaBulan(copyForm.newBulan)} ${copyForm.newTahun}?\n\nProses ini akan membuat data tagihan baru berdasarkan bulan referensi.`
      )
    ) return;

    try {
      setCopyLoading(true);
      await api.post("/tagihan/copy-previous-month", { bulan_referensi, bulan_tujuan });
      succesError(
        `Berhasil menyalin tagihan ${getNamaBulan(copyForm.refBulan)} ${copyForm.refTahun} ke ${getNamaBulan(copyForm.newBulan)} ${copyForm.newTahun}`
      );
      setShowCopyModal(false);
      getAllTagihan(currentPage, filterBulanTabel, filterTahunTabel);
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Gagal menyalin data tagihan");
    } finally {
      setCopyLoading(false);
    }
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

  const filteredTagihan = tagihan.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.karyawan?.nama_lengkap?.toLowerCase().includes(q) ||
      t.karyawan?.nomor_induk?.toLowerCase().includes(q) ||
      t.karyawan?.nik?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Tagihan Perusahaan</h1>
        <p className="text-gray-600 mt-1">Kelola data tagihan perusahaan</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search, Filter & Tambah */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari nama, nomor induk, atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Filter Bulan & Tahun tabel */}
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/create-tagihan")}
                className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Plus size={20} />
                <span>Tambah Tagihan</span>
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

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Export Excel</p>

            <div className="flex flex-col md:flex-row md:items-end gap-4 flex-wrap">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Bulan</label>
                  <select
                    value={filterBulan}
                    onChange={(e) => setFilterBulan(parseInt(e.target.value))}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{getNamaBulan(i + 1)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Tahun</label>
                  <select
                    value={filterTahun}
                    onChange={(e) => setFilterTahun(parseInt(e.target.value))}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Posisi</label>
                  <select
                    value={posisiExport}
                    onChange={(e) => setPosisiExport(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {POSISI_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-transparent">Export</label>
                  <button
                    onClick={handleExportExcel}
                    disabled={exportLoading}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed text-sm"
                  >
                    {exportLoading ? (
                      <><ClipLoader color="#ffffff" size={16} /><span>Exporting...</span></>
                    ) : (
                      <><Download size={18} /><span>Export Excel</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {filterBulan && (
              <p className="text-xs text-gray-400 mt-2">
                Export: {getNamaBulan(filterBulan)} {filterTahun} •{" "}
                {posisiExport ? posisiExport.replace(/_/g, " ") : "Semua posisi"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["No", "Nama", "Posisi", "Periode", "Hari Kerja", "Upah Diterima Karyawan", "Total Tagihan", "Aksi"].map((h) => (
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
                      <ClipLoader color="grey" loading={true} size={20} />
                      <span className="text-gray-600">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTagihan.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data tagihan
                  </td>
                </tr>
              ) : (
                filteredTagihan.map((t, index) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(meta ? (meta.current_page - 1) * meta.per_page : 0) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {t.karyawan?.nama_lengkap ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {t.karyawan?.posisi?.replace(/_/g, " ") ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.bulan_tahun ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.jumlah_hari_kerja} hari
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(t.upah_diterima_pekerja)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {formatCurrency(t.upah_total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/detail-tagihan/${t.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/update-tagihan/${t.id}`)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
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
        <div className="text-sm text-gray-600">
          {meta
            ? `Menampilkan ${meta.from ?? 0}–${meta.to ?? 0} dari ${meta.total ?? 0} data tagihan`
            : `Menampilkan ${tagihan.length} data tagihan`}
          <span className="ml-2 text-cyan-600 font-medium">
            {filterBulanTabel && filterTahunTabel
              ? `(${getNamaBulan(filterBulanTabel)} ${filterTahunTabel})`
              : "(Semua Periode)"}
          </span>
        </div>
        <Pagination
          currentPage={meta?.current_page ?? currentPage}
          totalPages={meta?.last_page ?? 1}
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
                  <h2 className="text-lg font-semibold text-gray-900">Salin Data Tagihan</h2>
                  <p className="text-sm text-gray-500">Copy data tagihan dari bulan sebelumnya ke bulan baru</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan Referensi (Sumber)
                </label>
                <div className="flex gap-3">
                  <select
                    value={copyForm.refBulan}
                    onChange={(e) => setCopyForm((p) => ({ ...p, refBulan: parseInt(e.target.value) }))}
                    disabled={copyLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{getNamaBulan(i + 1)}</option>
                    ))}
                  </select>
                  <select
                    value={copyForm.refTahun}
                    onChange={(e) => setCopyForm((p) => ({ ...p, refTahun: parseInt(e.target.value) }))}
                    disabled={copyLoading}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan Tujuan
                </label>
                <div className="flex gap-3">
                  <select
                    value={copyForm.newBulan}
                    onChange={(e) => setCopyForm((p) => ({ ...p, newBulan: parseInt(e.target.value) }))}
                    disabled={copyLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{getNamaBulan(i + 1)}</option>
                    ))}
                  </select>
                  <select
                    value={copyForm.newTahun}
                    onChange={(e) => setCopyForm((p) => ({ ...p, newTahun: parseInt(e.target.value) }))}
                    disabled={copyLoading}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Ringkasan:</span> Menyalin data tagihan{" "}
                  <span className="font-semibold">{getNamaBulan(copyForm.refBulan)} {copyForm.refTahun}</span>{" "}
                  →{" "}
                  <span className="font-semibold">{getNamaBulan(copyForm.newBulan)} {copyForm.newTahun}</span>
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

export default TagihanPage;
