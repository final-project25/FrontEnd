import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  Download,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { succesError, showError } from "../../../utils/notify";

const TagihanPage = () => {
  const navigate = useNavigate();
  const [tagihan, setTagihan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // State untuk filter export (periode awal & akhir)
  const [periodeAwal, setPeriodeAwal] = useState("");
  const [periodeAkhir, setPeriodeAkhir] = useState("");

  useEffect(() => {
    const getAllTagihan = async () => {
      try {
        setLoading(true);
        const response = await api.get("/tagihan");
        setTagihan(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAllTagihan();

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setPeriodeAwal(firstDay.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    setPeriodeAkhir(lastDay.toISOString().split("T")[0]);
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus tagihan ini?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tagihan/${id}`);
      setTagihan((prev) => prev.filter((item) => item.id !== id));
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
        {
          responseType: "blob",
        },
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
          "Gagal mengexport data. Pastikan ada data tagihan untuk periode yang dipilih.",
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

          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Export Excel:
                </span>
              </div>

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
                  Total Diterima
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
                  <td colSpan="9" className="px-6 py-8">
                    <div className="flex items-center justify-center gap-2">
                      <ClipLoader color="grey" loading={true} size={20} />
                      <span className="text-gray-600">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : tagihan.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada data tagihan
                  </td>
                </tr>
              ) : (
                tagihan.map((t, index) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {t.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.posisi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.periode_awal && t.periode_akhir ? (
                        <>
                          {formatDate(t.periode_awal)}
                          <br />-<br />
                          {formatDate(t.periode_akhir)}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.jumlah_hari_kerja} hari
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(t.upah_yang_diterima_pekerja)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {formatCurrency(t.total_diterima)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          t.status_penggajian
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t.status_penggajian ? "Selesai" : "Pending"}
                      </span>
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
                          className="text-green-600 hover:text-green-800"
                          title="Cetak Slip Gaji"
                        >
                          <FileText size={18} />
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

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Menampilkan {tagihan.length} data tagihan
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
            <button className="px-3 py-1 border rounded-lg text-sm border-gray-300 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border rounded-lg text-sm border-gray-300 hover:bg-gray-50">
              3
            </button>
          </div>

          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagihanPage;
