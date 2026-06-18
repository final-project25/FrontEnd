import { ArrowLeft, Edit, Trash2, Calendar, Mail, Phone, MapPin, Briefcase, CreditCard, User } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { showError, succesError } from "../../../utils/notify";
import ConfirmModal from "../../../components/Elements/ConfirmModal";

// ✅ PINDAH: helper functions ke luar komponen
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPosisi = (posisi) => {
  const posisiMap = {
    cleaning_service: "Cleaning Service",
    supir: "Supir",
    keamanan: "Keamanan",
    jasa: "Jasa",
    operator: "Operator",
  };
  return posisiMap[posisi] || posisi || "-";
};

const DetailKaryawanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [karyawan, setKaryawan] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    getKaryawanById();
  }, [id]);

  const getKaryawanById = async () => {
    try {
      setLoading(true); // ✅ FIX: aktifkan
      const response = await api.get(`/karyawan/${id}`);
      setKaryawan(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // ✅ FIX: aktifkan
    }
  };

  const handleBack = () => navigate("/karyawan");

  const handleDelete = () => setDeleteModal(true);

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/karyawan/${id}`);
      succesError("Data karyawan berhasil dihapus");
      navigate("/karyawan");
    } catch (error) {
      showError(error.response?.data?.message || "Gagal menghapus data karyawan");
    } finally {
      setDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="grey" size={20} />
      </div>
    );
  }

  const isActive = karyawan.status_aktif;

  return (
    <div>
      <ConfirmModal
        isOpen={deleteModal}
        title="Hapus Karyawan"
        message="Apakah Anda yakin ingin menghapus data karyawan ini? Data dapat dipulihkan melalui fitur Restore."
        confirmText="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal(false)}
      />
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Data Karyawan</span>
        </button>

        {/* ✅ FIX: responsive — stack di mobile */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Karyawan
            </h1>
            <p className="text-gray-600 mt-1">
              Informasi lengkap data karyawan
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(`/update-karyawan/${id}`)}
              className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 size={16} />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "● Aktif" : "● Tidak Aktif"}
        </span>
      </div>

      <div className="space-y-6">
        {/* Data Pribadi */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Pribadi
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nomor Induk
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {karyawan.nomor_induk || "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nama Lengkap
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {karyawan.nama_lengkap || "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  NIK (No. KTP)
                </label>
                {/* ✅ FIX: break-all agar NIK tidak overflow di mobile */}
                <p className="text-base text-gray-900 break-all">
                  {karyawan.nik || "-"}
                </p>
              </div>

              {/* Field opsional — hanya tampil jika ada datanya */}
              {karyawan.tempat_lahir && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tempat Lahir
                  </label>
                  <p className="text-base text-gray-900">
                    {karyawan.tempat_lahir}
                  </p>
                </div>
              )}
              {karyawan.tanggal_lahir && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tanggal Lahir
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar size={16} className="text-gray-400 shrink-0" />
                    <span>{formatDate(karyawan.tanggal_lahir)}</span>
                  </div>
                </div>
              )}
              {karyawan.jenis_kelamin && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Jenis Kelamin
                  </label>
                  <p className="text-base text-gray-900">
                    {karyawan.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </p>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Alamat Lengkap
                </label>
                <div className="flex items-start gap-2 text-gray-900">
                  <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                  <p className="text-base">{karyawan.alamat || "-"}</p>
                </div>
              </div>

              {karyawan.pendidikan_terakhir && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <p className="text-base text-gray-900">
                    {karyawan.pendidikan_terakhir}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Kepegawaian */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Kepegawaian
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Posisi/Jabatan
                </label>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-400 shrink-0" />
                  <p className="text-base text-gray-900 font-medium">
                    {formatPosisi(karyawan.posisi)}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tanggal Masuk
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar size={16} className="text-gray-400 shrink-0" />
                  <span>{formatDate(karyawan.tanggal_masuk)}</span>
                </div>
              </div>

              {/* ✅ TAMBAH: tanggal keluar hanya tampil jika ada */}
              {karyawan.tanggal_keluar && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tanggal Keluar
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar size={16} className="text-gray-400 shrink-0" />
                    <span>{formatDate(karyawan.tanggal_keluar)}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status Kepegawaian
                </label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isActive ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Kontak */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Data Kontak</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <a
                    href={`mailto:${karyawan.email}`}
                    className="text-base text-cyan-600 hover:text-cyan-700 hover:underline break-all"
                  >
                    {karyawan.email || "-"}
                  </a>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  No. WhatsApp
                </label>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  <a
                    href={`https://wa.me/${karyawan.no_wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-cyan-600 hover:text-cyan-700 hover:underline"
                  >
                    {karyawan.no_wa || "-"}
                  </a>
                </div>
              </div>
              {karyawan.no_rek_bri && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    No. Rekening BRI
                  </label>
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-gray-400 shrink-0" />
                    <p className="text-base text-gray-900 break-all">
                      {karyawan.no_rek_bri}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ TAMBAH: section baru — Informasi Audit dari response API */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Informasi Audit
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* ditambahkan_oleh */}
              {karyawan.ditambahkan_oleh && (
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
                        {karyawan.ditambahkan_oleh.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {karyawan.ditambahkan_oleh.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(karyawan.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* diubah_oleh */}
              {karyawan.diubah_oleh && (
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
                        {karyawan.diubah_oleh.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {karyawan.diubah_oleh.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(karyawan.diubah_oleh.diubah_pada)}
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

export default DetailKaryawanPage;
