import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";
import { ClipLoader } from "react-spinners";

const UpdateKaryawanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nomor_induk: "",
    nik: "",
    no_rek_bri: "",
    nama_lengkap: "",
    posisi: "",
    email: "",
    alamat: "",
    no_wa: "",
    tanggal_masuk: "",
    status_aktif: "1",
  });

  useEffect(() => {
    getKaryawanById();
  }, [id]);

  const getKaryawanById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/karyawan/${id}`);
      const data = response.data.data;

      const formatDate = (isoDate) => {
        if (!isoDate) return "";
        return isoDate.split("T")[0];
      };

      setFormData({
        nomor_induk: data.nomor_induk || "",
        nik: data.nik || "",
        no_rek_bri: data.no_rek_bri || "",
        nama_lengkap: data.nama_lengkap || "",
        posisi: data.posisi || "",
        email: data.email || "",
        alamat: data.alamat || "",
        no_wa: data.no_wa || "",
        tanggal_masuk: formatDate(data.tanggal_masuk),
        status_aktif: data.status_aktif ? "1" : "0",
      });
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data karyawan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const submitData = {
        ...formData,
        status_aktif: parseInt(formData.status_aktif),
      };

      const response = await api.put(`/karyawan/${id}`, submitData);
      console.log(response.data);
      succesError("Data Karyawan berhasil diperbarui");
      navigate("/karyawan");
    } catch (error) {
      console.log(error);
      showError(
        error.response?.data?.message || "Gagal memperbarui data karyawan",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    if (window.confirm("Anda yakin untuk cancel?")) {
      navigate("/karyawan");
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Ubah Data Karyawan</h1>
        <p className="text-gray-600 mt-1">Perbarui informasi karyawan</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Induk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nomor_induk"
                  value={formData.nomor_induk}
                  onChange={handleChange}
                  placeholder="Contoh: KRY001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIK (No. KTP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="16 digit NIK"
                  maxLength="16"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukan alamat lengkap"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Kepegawaian
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi/Jabatan <span className="text-red-500">*</span>
                </label>
                <select
                  name="posisi"
                  value={formData.posisi}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih posisi</option>
                  <option value="cleaning_service">Cleaning Service</option>
                  <option value="supir">Supir</option>
                  <option value="keamanan">Keamanan</option>
                  <option value="jasa">Jasa</option>
                  <option value="operator">Operator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Masuk <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_masuk"
                  value={formData.tanggal_masuk}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Karyawan <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status_aktif"
                      onChange={handleChange}
                      value="1"
                      checked={formData.status_aktif === "1"} // ✅ Controlled component
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Aktif</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status_aktif"
                      onChange={handleChange}
                      value="0"
                      checked={formData.status_aktif === "0"} // ✅ Controlled component
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Tidak Aktif
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Kontak
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contoh@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="no_wa"
                  value={formData.no_wa}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  maxLength="13"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Rekening BRI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="no_rek_bri"
                  value={formData.no_rek_bri}
                  onChange={handleChange}
                  placeholder="Masukkan nomor rekening BRI"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-cyan-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <ClipLoader color="#ffffff" size={20} />
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateKaryawanPage;
