import { ArrowLeft, Save, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../../../services/api";
import { mapBackendErrors } from "../../../utils/errorHandler";
import { showError, succesError } from "../../../utils/notify";
import ConfirmModal from "../../../components/Elements/ConfirmModal";

const CreateRekrutmenPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cancelModal, setCancelModal] = useState(false);
  const [formData, setFormData] = useState({
    posisi: "",
    lokasi_kerja: "",
    jenis_kerja: "Full Time",
    catatan: "",
    range_gaji: "",
    deadline_lowongan: "",
    status_lowongan: "aktif",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.posisi.trim())
      newErrors.posisi = "Posisi/Jabatan wajib diisi.";

    if (!formData.lokasi_kerja.trim())
      newErrors.lokasi_kerja = "Lokasi Kerja wajib diisi.";

    if (!formData.jenis_kerja)
      newErrors.jenis_kerja = "Jenis Kerja wajib dipilih.";

    if (!formData.range_gaji.trim())
      newErrors.range_gaji = "Range Gaji wajib diisi.";

    if (!formData.deadline_lowongan)
      newErrors.deadline_lowongan = "Deadline Lowongan wajib diisi.";
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadline = new Date(formData.deadline_lowongan);
      if (deadline < today)
        newErrors.deadline_lowongan = "Deadline tidak boleh sebelum hari ini.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCancel = () => setCancelModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await api.post("/lowongan", formData);

      succesError("Lowongan kerja berhasil dibuat");

      setTimeout(() => {
        navigate("/rekrutmen");
      }, 1000);
    } catch (error) {
      console.log(error);

      if (error.response?.status === 422) {
        const backendErrors = mapBackendErrors(error.response.data.errors);
        setErrors(backendErrors);
        showError("Mohon periksa kembali data yang diisi.");
      } else {
        showError(
          error.response?.data?.message || "Gagal membuat lowongan kerja"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ConfirmModal
        isOpen={cancelModal}
        variant="warning"
        title="Batalkan Pengisian?"
        message="Data yang sudah diisi akan hilang. Yakin ingin kembali?"
        confirmText="Ya, Batalkan"
        onConfirm={() => navigate("/rekrutmen")}
        onCancel={() => setCancelModal(false)}
      />
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
          disabled={loading}
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Manajemen Rekrutmen</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Buat Lowongan Pekerjaan Baru
        </h1>
        <p className="text-gray-600 mt-1">
          Lengkapi form di bawah untuk membuat lowongan pekerjaan baru
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Posisi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi/Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="posisi"
                  value={formData.posisi}
                  onChange={handleChange}
                  placeholder="Contoh: Supir, Security, Admin"
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.posisi ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.posisi && (
                  <p className="text-red-500 text-sm mt-1">{errors.posisi}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Kerja <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lokasi_kerja"
                  value={formData.lokasi_kerja}
                  onChange={handleChange}
                  placeholder="Contoh: Jakarta, DKI Jakarta"
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.lokasi_kerja ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lokasi_kerja && (
                  <p className="text-red-500 text-sm mt-1">{errors.lokasi_kerja}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kerja <span className="text-red-500">*</span>
                </label>
                <select
                  name="jenis_kerja"
                  value={formData.jenis_kerja}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.jenis_kerja ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Freelance">Freelance</option>
                </select>
                {errors.jenis_kerja && (
                  <p className="text-red-500 text-sm mt-1">{errors.jenis_kerja}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Range Gaji <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="range_gaji"
                  value={formData.range_gaji}
                  onChange={handleChange}
                  placeholder="Contoh: Rp 4.000.000 - Rp 5.000.000"
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.range_gaji ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.range_gaji ? (
                  <p className="text-red-500 text-sm mt-1">{errors.range_gaji}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Format: Rp X - Rp Y</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Deskripsi & Persyaratan
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan/Persyaratan
              </label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows="6"
                placeholder="Jelaskan persyaratan, kualifikasi, dan informasi tambahan lowongan..."
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opsional - Jelaskan detail persyaratan dan kualifikasi
              </p>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Deadline & Status Lowongan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline Lowongan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="date"
                    name="deadline_lowongan"
                    value={formData.deadline_lowongan}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.deadline_lowongan ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.deadline_lowongan ? (
                  <p className="text-red-500 text-sm mt-1">{errors.deadline_lowongan}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Tanggal terakhir penerimaan pelamar
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Lowongan <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status_lowongan"
                      value="aktif"
                      checked={formData.status_lowongan === "aktif"}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 disabled:cursor-not-allowed"
                    />
                    <span className="ml-2 text-sm text-gray-700">Aktif</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status_lowongan"
                      value="tidak_aktif"
                      checked={formData.status_lowongan === "tidak_aktif"}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 disabled:cursor-not-allowed"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Tidak Aktif
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Lowongan aktif akan ditampilkan di halaman publik
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                <span>Buat Lowongan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRekrutmenPage;
