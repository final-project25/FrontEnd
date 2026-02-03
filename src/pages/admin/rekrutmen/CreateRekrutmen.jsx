import { ArrowLeft, Save, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../../../services/api";

const CreateRekrutmenPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    posisi: "",
    lokasi_kerja: "",
    jenis_kerja: "Full Time",
    catatan: "",
    range_gaji: "",
    deadline_lowongan: "",
    status_lowongan: "aktif",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Batalkan pembuatan lowongan? Data yang diisi akan hilang.",
      )
    ) {
      navigate("/rekrutmen");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    const requiredFields = [
      "posisi",
      "lokasi_kerja",
      "jenis_kerja",
      "range_gaji",
      "deadline_lowongan",
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      alert("Mohon lengkapi semua field yang bertanda *");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/lowongan", formData);

      console.log("Response:", response.data);

      alert("Lowongan kerja berhasil dibuat");

      setTimeout(() => {
        navigate("/rekrutmen");
      }, 1000);
    } catch (error) {
      console.log(error);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        alert(errorMessages || "Data tidak valid");
      } else {
        alert(error.response?.data?.message || "Gagal membuat lowongan kerja");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Freelance">Freelance</option>
                </select>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: Rp X - Rp Y
                </p>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tanggal terakhir penerimaan pelamar
                </p>
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
