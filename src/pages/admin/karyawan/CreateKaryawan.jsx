import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { succesError } from "../../../utils/notify";
import { ClipLoader } from "react-spinners";

const FieldError = ({ message }) =>
  message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

const INITIAL_FORM = {
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
};

const INITIAL_ERRORS = {
  nomor_induk: "",
  nik: "",
  no_rek_bri: "",
  nama_lengkap: "",
  posisi: "",
  email: "",
  alamat: "",
  no_wa: "",
  tanggal_masuk: "",
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidNoWa = (no) => /^08[0-9]{8,11}$/.test(no);

const CreateKaryawanPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formData.nomor_induk.trim()) {
      newErrors.nomor_induk = "Nomor induk tidak boleh kosong";
      isValid = false;
    }

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = "Nama lengkap tidak boleh kosong";
      isValid = false;
    } else if (formData.nama_lengkap.trim().length < 3) {
      newErrors.nama_lengkap = "Nama lengkap minimal 3 karakter";
      isValid = false;
    }

    if (!formData.nik.trim()) {
      newErrors.nik = "NIK tidak boleh kosong";
      isValid = false;
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus 16 digit angka";
      isValid = false;
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = "Alamat tidak boleh kosong";
      isValid = false;
    }

    if (!formData.posisi) {
      newErrors.posisi = "Posisi/jabatan harus dipilih";
      isValid = false;
    }

    if (!formData.tanggal_masuk) {
      newErrors.tanggal_masuk = "Tanggal masuk tidak boleh kosong";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Format email tidak valid";
      isValid = false;
    }

    if (!formData.no_wa.trim()) {
      newErrors.no_wa = "No. WhatsApp tidak boleh kosong";
      isValid = false;
    } else if (!isValidNoWa(formData.no_wa)) {
      newErrors.no_wa = "Format WhatsApp tidak valid (contoh: 08xxxxxxxxxx)";
      isValid = false;
    }

    if (!formData.no_rek_bri.trim()) {
      newErrors.no_rek_bri = "No. rekening BRI tidak boleh kosong";
      isValid = false;
    } else if (!/^\d+$/.test(formData.no_rek_bri)) {
      newErrors.no_rek_bri = "No. rekening hanya boleh berisi angka";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/karyawan", formData);
      succesError("Data Karyawan berhasil ditambahkan");
      navigate("/karyawan");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 422) {
        const backendErrors = error.response.data?.errors;
        if (backendErrors) {
          const mapped = { ...INITIAL_ERRORS };
          Object.keys(backendErrors).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(mapped, key)) {
              mapped[key] = backendErrors[key][0];
            }
          });
          setErrors(mapped);
        }
      } else {
        const { showError } = await import("../../../utils/notify");
        showError(error.response?.data?.message || "Gagal menambahkan data karyawan");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Anda yakin untuk cancel?")) {
      navigate("/karyawan");
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Data Karyawan</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Data Karyawan</h1>
        <p className="text-gray-600 mt-1">
          Lengkapi form di bawah untuk menambahkan karyawan baru
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-lg shadow">

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Pribadi</h2>
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
                  className={inputClass("nomor_induk")}
                />
                <FieldError message={errors.nomor_induk} />
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
                  className={inputClass("nama_lengkap")}
                />
                <FieldError message={errors.nama_lengkap} />
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
                  className={inputClass("nik")}
                />
                <FieldError message={errors.nik} />
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
                  className={`${inputClass("alamat")} resize-none`}
                />
                <FieldError message={errors.alamat} />
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Kepegawaian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi/Jabatan <span className="text-red-500">*</span>
                </label>
                <select
                  name="posisi"
                  value={formData.posisi}
                  onChange={handleChange}
                  className={inputClass("posisi")}
                >
                  <option value="">Pilih posisi</option>
                  <option value="cleaning_service">Cleaning Service</option>
                  <option value="supir">Supir</option>
                  <option value="keamanan">Keamanan</option>
                  <option value="jasa">Jasa</option>
                  <option value="operator">Operator</option>
                </select>
                <FieldError message={errors.posisi} />
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
                  className={inputClass("tanggal_masuk")}
                />
                <FieldError message={errors.tanggal_masuk} />
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
                      checked={formData.status_aktif === "1"}
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
                      checked={formData.status_aktif === "0"}
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tidak Aktif</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Kontak</h2>
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
                  className={inputClass("email")}
                />
                <FieldError message={errors.email} />
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
                  className={inputClass("no_wa")}
                />
                <FieldError message={errors.no_wa} />
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
                  className={inputClass("no_rek_bri")}
                />
                <FieldError message={errors.no_rek_bri} />
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
              <ClipLoader color="#ffffff" size={20} />
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Data</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateKaryawanPage;