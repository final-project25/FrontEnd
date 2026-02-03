import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const DetailKaryawanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [karyawan, setKaryawan] = useState([]);

  // Fetch data karyawan
  useEffect(() => {
    getKaryawanById();
  }, [id]);

  const getKaryawanById = async () => {
    try {
      // setLoading(true);
      const response = await api.get(`/karyawan/${id}`);
      setKaryawan(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Anda yakin untuk cancel?")) {
      navigate("/karyawan");
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
          onClick={handleCancel}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Data Karyawan</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Karyawan
            </h1>
            <p className="text-gray-600 mt-1">
              Informasi lengkap data karyawan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/update-karyawan/${id}`)}
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
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${karyawan.status_aktif === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {karyawan.status_aktif === 1 ? "● Karyawan Aktif" : "● Tidak Aktif"}
        </span>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Pribadi
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-base text-gray-900">{karyawan.nik || "-"}</p>
              </div>
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
                    <Calendar size={16} className="text-gray-400" />
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
              <div className="md:col-span-2">
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

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Kepegawaian
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Posisi/Jabatan
                </label>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-400" />
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
                  <Calendar size={16} className="text-gray-400" />
                  <span>{formatDate(karyawan.tanggal_masuk)}</span>
                </div>
              </div>
              {karyawan.tanggal_keluar && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tanggal Keluar
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{formatDate(karyawan.tanggal_keluar)}</span>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status Kepegawaian
                </label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${karyawan.status_aktif === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {karyawan.status_aktif === 1 ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Data Kontak</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <a
                    href={`mailto:${karyawan.email}`}
                    className="text-base text-cyan-600 hover:text-cyan-700 hover:underline"
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
                  <Phone size={16} className="text-gray-400" />
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
                    <CreditCard size={16} className="text-gray-400" />
                    <p className="text-base text-gray-900">
                      {karyawan.no_rek_bri}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Dibuat pada:</span>
              <span className="ml-2 text-gray-700">
                {formatDate(karyawan.created_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Terakhir diubah:</span>
              <span className="ml-2 text-gray-700">
                {formatDate(karyawan.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKaryawanPage;
