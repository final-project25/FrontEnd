import { ArrowLeft, Edit, Trash2, FileText, Calendar, User, CreditCard, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { showError, succesError } from "../../../utils/notify";
import ConfirmModal from "../../../components/Elements/ConfirmModal";

const DetailTagihanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [tagihan, setTagihan] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);

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
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/tagihan/${id}`);
      succesError("Tagihan berhasil dihapus");
      navigate("/tagihan");
    } catch (error) {
      showError("Gagal menghapus tagihan");
    } finally {
      setDeleteModal(false);
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

  const totalBpjs =
    Number(tagihan.bpjs_kesehatan || 0) +
    Number(tagihan.jkk || 0) +
    Number(tagihan.jkm || 0) +
    Number(tagihan.jht || 0) +
    Number(tagihan.jp || 0);

  return (
    <div>
      <ConfirmModal
        isOpen={deleteModal}
        title="Hapus Tagihan"
        message={`Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal(false)}
      />
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
                    {tagihan.karyawan?.nomor_induk}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  NIK
                </label>
                <p className="text-base text-gray-900">
                  {tagihan.karyawan?.nik}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nama Karyawan
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {tagihan.karyawan?.nama_lengkap}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Posisi/Bagian
                </label>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-400" />
                  <p className="text-base text-gray-900">
                    {formatPosisi(tagihan.karyawan?.posisi)}
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
                    {tagihan.karyawan?.no_rek_bri}
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
                  Bulan Tagihan
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-medium">
                    {tagihan.bulan_tahun || "-"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tanggal Tagihan
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(tagihan.tagihan_bulan)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Dibuat Pada
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(tagihan.created_at)}
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
                  Jumlah Penghasilan Kotor
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {formatCurrency(tagihan.jumlah_penghasilan_kotor)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Jumlah Lembur
                </label>
                <p className="text-base text-gray-900">
                  {formatCurrency(tagihan.jlh_lembur)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  THR
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
                  {formatCurrency(totalBpjs)}
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
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(tagihan.jumlah_penghasilan_kotor)}{" "}
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
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(tagihan.upah_diterima_pekerja)}{" "}
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
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(tagihan.upah_total)}{" "}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upah Diterima + Fee Manajemen
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* dibuat_oleh */}
              {tagihan.dibuat_oleh && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Ditambahkan Oleh
                  </label>
                  <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-cyan-100 p-2 rounded-full shrink-0">
                      <User size={16} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tagihan.dibuat_oleh.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tagihan.dibuat_oleh.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(tagihan.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* diubah_oleh */}
              {tagihan.diubah_oleh && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Terakhir Diubah Oleh
                  </label>
                  <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-yellow-100 p-2 rounded-full shrink-0">
                      <User size={16} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tagihan.diubah_oleh.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tagihan.diubah_oleh.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(tagihan.diubah_oleh.diubah_pada)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTagihanPage;
