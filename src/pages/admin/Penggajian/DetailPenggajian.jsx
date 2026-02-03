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

const DetailPenggajianPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [penggajian, setPenggajian] = useState([]);

  useEffect(() => {
    getPenggajianById();
  }, [id]);

  const getPenggajianById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/penggajian/${id}`);
      setPenggajian(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  const formatMonthYear = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
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
        <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4">
          <ArrowLeft size={20} />
          <span>Kembali ke Data Penggajian</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Penggajian
            </h1>
            <p className="text-gray-600 mt-1">
              Informasi lengkap data penggajian karyawan
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <FileText size={18} />
              <span>Cetak Slip</span>
            </button>
            <button
              onClick={() => navigate(`/update-penggajian/${id}`)}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
            <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              <Trash2 size={18} />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            penggajian.status_penggajian
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {penggajian.status_penggajian
            ? "● Penggajian Selesai"
            : "● Penggajian Pending"}
        </span>
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
                    {penggajian.no_induk}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  NIK
                </label>
                <p className="text-base text-gray-900">{penggajian.nik}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nama Karyawan
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {penggajian.nama}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Posisi/Bagian
                </label>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-400" />
                  <p className="text-base text-gray-900">
                    {formatPosisi(penggajian.posisi)}
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
                    {penggajian.no_rek_bri}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Periode Gaji
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Bulan Gajian
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-medium">
                    {formatMonthYear(penggajian.gajian_bulan)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Periode Awal
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(penggajian.periode_awal)}
                </p>
              </div>
              \{" "}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Periode Akhir
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(penggajian.periode_akhir)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Jumlah Hari Kerja
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {penggajian.jumlah_hari_kerja} hari
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Gaji Harian (Satuan)
                </label>
                <p className="text-base text-gray-900">
                  {formatCurrency(penggajian.gaji_harian)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tanggal Cetak
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(penggajian.tanggal_cetak)}
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
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Penghasilan Kotor
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-blue-600" />
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(penggajian.jumlah_penghasilan_kotor)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Jumlah Lembur
                </label>
                <p className="text-base text-gray-900">
                  {formatCurrency(penggajian.jumlah_lembur)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Uang THR
                </label>
                <p className="text-base text-gray-900">
                  {formatCurrency(penggajian.uang_thr)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Potongan BPJS
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  BPJS Kesehatan 1%
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(penggajian.bpjs_kesehatan)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  BPJS Ketenagakerjaan (JHT) 2%
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(penggajian.bpjs_jht)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  BPJS Ketenagakerjaan (JP) 1%
                </label>
                <p className="text-base text-red-600 font-medium">
                  - {formatCurrency(penggajian.bpjs_jp)}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Potongan BPJS
                </label>
                <p className="text-xl font-bold text-red-600">
                  - {formatCurrency(penggajian.total_bpjs)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Gaji */}
        <div className="bg-linear-to-r from-green-50 to-blue-50 rounded-lg shadow-lg border-2 border-green-200">
          <div className="p-6 border-b border-green-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Ringkasan Gaji
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border-2 border-blue-200 shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upah Kotor Karyawan
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} className="text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(penggajian.upah_kotor_karyawan)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Penghasilan Kotor + Lembur + THR
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border-2 border-green-300 shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upah Diterima (Take Home Pay)
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} className="text-green-600" />
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(penggajian.upah_diterima)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upah Kotor - Total BPJS
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
                {formatDate(penggajian.created_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Terakhir diubah:</span>
              <span className="ml-2 text-gray-700">
                {formatDate(penggajian.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPenggajianPage;
