import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { Edit, Eye, Plus, Search, Trash2, Download } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { succesError, showError } from "../../../utils/notify";

const TagihanPage = () => {
  const navigate = useNavigate();
  const [tagihan, setTagihan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [links, setLinks] = useState(null);

  // State untuk filter export (periode awal & akhir)
  const [periodeAwal, setPeriodeAwal] = useState("");
  const [periodeAkhir, setPeriodeAkhir] = useState("");

  // State search
  const [search, setSearch] = useState("");

  const getAllTagihan = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/tagihan?page=${page}`);
      setTagihan(response.data.data);
      setMeta(response.data.meta);
      setLinks(response.data.links);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTagihan(currentPage);

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setPeriodeAwal(firstDay.toISOString().split("T")[0]);
    setPeriodeAkhir(lastDay.toISOString().split("T")[0]);
  }, [currentPage]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus tagihan ini?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/tagihan/${id}`);
      getAllTagihan(currentPage);
      succesError("Data tagihan berhasil dihapus");
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Gagal menghapus data");
    }
  };

  const handleExportExcel = async () => {
    if (!periodeAwal || !periodeAkhir) {
      showError("Mohon pilih periode awal dan periode akhir");
      return;
    }
    if (new Date(periodeAwal) > new Date(periodeAkhir)) {
      showError("Periode awal tidak boleh lebih besar dari periode akhir");
      return;
    }

    try {
      setExportLoading(true);
      const formattedPeriodeAwal = periodeAwal.replace(/-/g, "/");
      const formattedPeriodeAkhir = periodeAkhir.replace(/-/g, "/");

      const response = await api.get(
        `/tagihan/export/excel?periode_awal=${formattedPeriodeAwal}&periode_akhir=${formattedPeriodeAkhir}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `Tagihan_${periodeAwal}_to_${periodeAkhir}.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      succesError(`File ${fileName} berhasil didownload!`);
    } catch (error) {
      console.log(error);
      showError(
        error.response?.data?.message ||
          "Gagal mengexport data. Pastikan ada data tagihan untuk periode yang dipilih."
      );
    } finally {
      setExportLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
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

  // Filter tagihan berdasarkan search
  const filteredTagihan = tagihan.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.karyawan?.nama_lengkap?.toLowerCase().includes(q) ||
      t.karyawan?.nomor_induk?.toLowerCase().includes(q) ||
      t.karyawan?.nik?.toLowerCase().includes(q)
    );
  });

  // Generate page numbers dari meta.links
  const pageNumbers =
    meta?.links?.filter((l) => l.page !== null).map((l) => l.page) || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Data Tagihan Perusahaan
        </h1>
        <p className="text-gray-600 mt-1">Kelola data tagihan perusahaan</p>
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
                placeholder="Cari nama, nomor induk, atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => navigate("/create-tagihan")}
              className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Plus size={20} />
              <span>Tambah Tagihan</span>
            </button>
          </div>

          {/* Export Excel Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Export Excel:
              </span>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Periode Awal:</label>
                <input
                  type="date"
                  value={periodeAwal}
                  onChange={(e) => setPeriodeAwal(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Periode Akhir:</label>
                <input
                  type="date"
                  value={periodeAkhir}
                  onChange={(e) => setPeriodeAkhir(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleExportExcel}
                disabled={exportLoading || !periodeAwal || !periodeAkhir}
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

              {periodeAwal && periodeAkhir && (
                <span className="text-sm text-gray-500">
                  Export data: {formatDate(periodeAwal)} -{" "}
                  {formatDate(periodeAkhir)}
                </span>
              )}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hari Kerja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upah Diterima Karyawan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tagihan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
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
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada data tagihan
                  </td>
                </tr>
              ) : (
                filteredTagihan.map((t, index) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* Nomor urut tetap benar meski paginasi */}
                      {(meta ? (meta.current_page - 1) * meta.per_page : 0) +
                        index +
                        1}
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
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {meta
            ? `Menampilkan ${meta.from ?? 0}–${meta.to ?? 0} dari ${meta.total} data tagihan`
            : `Menampilkan ${tagihan.length} data tagihan`}
        </div>

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
                  page === meta?.current_page
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, meta?.last_page ?? p))
            }
            disabled={!links?.next}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagihanPage;