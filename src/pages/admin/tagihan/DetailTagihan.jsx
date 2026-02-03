import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Calendar,
  User,
  CreditCard,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { showError, succesError } from "../../../utils/notify";

const DetailTagihanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [tagihan, setTagihan] = useState([]);

  useEffect(() => {
    getTagihanById();
  }, [id]);

  const getTagihanById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tagihan/${id}`);
      setTagihan(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus tagihan ${tagihan.nama}?`,
      )
    ) {
      try {
        await api.delete(`/tagihan/${id}`);
        succesError("Tagihan berhasil dihapus");
        navigate("/tagihan");
      } catch (error) {
        console.log(error);
        showError("Gagal menghapus tagihan");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="grey" loading={true} size={20} />
      </div>
    );
  }

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
        <button
          onClick={() => navigate("/tagihan")}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Data Tagihan</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Tagihan</h1>
            <p className="text-gray-600 mt-1">
              Informasi lengkap data tagihan karyawan
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <FileText size={18} />
              <span>Cetak Tagihan</span>
            </button>
            <button
              onClick={() => navigate(`/update-tagihan/${id}`)}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Karyawan
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nomor Induk
                </label>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <p className="text-base text-gray-900 font-medium">
                    {tagihan.no_induk}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  NIK
                </label>
                <p className="text-base text-gray-900">{tagihan.nik}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nama Karyawan
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {tagihan.nama}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Posisi/Bagian
                </label>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-400" />
                  <p className="text-base text-gray-900">
                    {formatPosisi(tagihan.posisi)}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  No. Rekening BRI
                </label>
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-gray-400" />
                  <p className="text-base text-gray-900">
                    {tagihan.no_rek_bri}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Periode Tagihan
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Periode Awal
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-medium">
                    {formatDate(tagihan.periode_awal)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Periode Akhir
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(tagihan.periode_akhir)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tanggal Cetak
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(tagihan.tanggal_cetak)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Jumlah Hari Kerja
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {tagihan.jumlah_hari_kerja} hari
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Gaji Harian
                </label>
                <p className="text-base text-gray-900">
                  {formatCurrency(tagihan.gaji_harian)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Rincian Penghasilan
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Jumlah Lembur
                </label>
                <p className="text-base text-gray-900">
                  {formatCurrency(tagihan.lembur)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Uang THR
                </label>
                <p className="text-base text-gray-900">
                  {formatCurrency(tagihan.thr)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Iuran BPJS</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  BPJS Kesehatan
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(tagihan.bpjs_kesehatan)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  JKK (Jaminan Kecelakaan Kerja)
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(tagihan.jkk)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  JKM (Jaminan Kematian)
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(tagihan.jkm)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  JHT (Jaminan Hari Tua)
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(tagihan.jht)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  JP (Jaminan Pensiun)
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(tagihan.jp)}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Iuran BPJS
                </label>
                <p className="text-xl font-bold text-red-600">
                  - {formatCurrency(tagihan.jumlah_iuran_bpjs)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Potongan & Tambahan Lain
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Seragam CS & Keamanan
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(tagihan.seragam_cs_dan_keamanan)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Fee Manajemen
                </label>
                <p className="text-base text-green-600 font-medium">
                  + {formatCurrency(tagihan.fee_manajemen)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg border-2 border-green-200">
          <div className="p-6 border-b border-green-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Ringkasan Tagihan
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border-2 border-blue-200 shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upa Pekerja
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} className="text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(tagihan.upa_pekerja)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  (Hari Kerja × Gaji Harian) + Lembur + THR
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border-2 border-orange-200 shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upah Diterima Pekerja
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} className="text-orange-600" />
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(tagihan.upah_yang_diterima_pekerja)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upa Pekerja - Total BPJS - Seragam
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border-2 border-green-300 shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Diterima
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} className="text-green-600" />
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(tagihan.total_diterima)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upah Diterima + Fee Manajemen
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Dibuat pada:</span>
              <span className="ml-2 text-gray-700">
                {formatDate(tagihan.created_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Terakhir diubah:</span>
              <span className="ml-2 text-gray-700">
                {formatDate(tagihan.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTagihanPage;
