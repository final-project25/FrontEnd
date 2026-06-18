import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";
import { mapBackendErrors } from "../../../utils/errorHandler";
import ConfirmModal from "../../../components/Elements/ConfirmModal";

const INITIAL_FORM = {
  jumlah_penghasilan_kotor: "",
  jumlah_hari_kerja: "",
  gaji_harian: "",
  tagihan_bulan: "",
  jlh_lembur: "",
  thr: "",
  seragam_cs_dan_keamanan: "",
  fee_manajemen: "",
};

const INITIAL_ERRORS = {
  jumlah_penghasilan_kotor: "",
  jumlah_hari_kerja: "",
  gaji_harian: "",
  tagihan_bulan: "",
  jlh_lembur: "",
  thr: "",
  seragam_cs_dan_keamanan: "",
  fee_manajemen: "",
};

const UpdateTagihanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [cancelModal, setCancelModal] = useState(false);

  useEffect(() => {
    getTagihanById();
  }, [id]);

  const getTagihanById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tagihan/${id}`);
      const data = response.data.data;

      setFormData({
        nomor_induk: data.karyawan?.nomor_induk || "",
        nik: data.karyawan?.nik || "",
        nama_lengkap: data.karyawan?.nama_lengkap || "",
        posisi: data.karyawan?.posisi || "",
        no_rek_bri: data.karyawan?.no_rek_bri || "",
        jumlah_penghasilan_kotor: data.jumlah_penghasilan_kotor || "",
        seragam_cs_dan_keamanan: data.seragam_cs_dan_keamanan || "",
        fee_manajemen: data.fee_manajemen || "",
        jumlah_hari_kerja: data.jumlah_hari_kerja || "",
        gaji_harian: data.gaji_harian || "",
        tagihan_bulan: data.tagihan_bulan || "",
        jlh_lembur: data.jlh_lembur || "",
        thr: data.thr || "",
      });
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data tagihan");
      navigate("/tagihan");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formData.jumlah_penghasilan_kotor) {
      newErrors.jumlah_penghasilan_kotor =
        "Jumlah penghasilan kotor wajib diisi";
      isValid = false;
    }

    if (!formData.jumlah_hari_kerja) {
      newErrors.jumlah_hari_kerja = "Jumlah hari kerja wajib diisi";
      isValid = false;
    }

    if (!formData.gaji_harian) {
      newErrors.gaji_harian = "Gaji harian wajib diisi";
      isValid = false;
    }

    if (!formData.seragam_cs_dan_keamanan) {
      newErrors.seragam_cs_dan_keamanan = "Seragam CS dan Keamanan wajib diisi";
      isValid = false;
    }

    if (!formData.fee_manajemen) {
      newErrors.fee_manajemen = "Fee Manajemen wajib diisi";
      isValid = false;
    }

    if (!formData.tagihan_bulan) {
      newErrors.tagihan_bulan = "Bulan tagihan wajib dipilih";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCancel = () => setCancelModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const requiredFields = [
      "nomor_induk",
      "nik",
      "nama_lengkap",
      "no_rek_bri",
      "posisi",
      "jumlah_penghasilan_kotor",
      "seragam_cs_dan_keamanan",
      "fee_manajemen",
      "jumlah_hari_kerja",
      "gaji_harian",
      "tagihan_bulan",
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      console.log("Field kosong:", emptyFields);
      showError(`Field kosong: ${emptyFields.join(", ")}`);
      return;
    }
    try {
      const submitData = {
        ...formData,
        seragam_cs_dan_keamanan:
          parseFloat(formData.seragam_cs_dan_keamanan) || 0,
        fee_manajemen: parseFloat(formData.fee_manajemen) || 0,
        thr: parseFloat(formData.thr) || 0,
        jumlah_hari_kerja: parseFloat(formData.jumlah_hari_kerja),
        gaji_harian: parseFloat(formData.gaji_harian),
        jlh_lembur: parseFloat(formData.jlh_lembur) || 0,
      };

      setLoading(true);
      const response = await api.put(`/tagihan/${id}`, submitData);
      console.log(response.data);
      succesError("Data tagihan berhasil diperbarui");
      navigate("/tagihan");
    } catch (error) {
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;

        if (backendErrors) {
          setErrors((prev) => ({
            ...prev,
            ...mapBackendErrors(backendErrors),
          }));
        }

        return;
      }

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Gagal memperbarui data tagihan";

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ message }) =>
    message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

  const inputClass = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const formatCurrency = (value) => {
    if (!value) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <ConfirmModal
        isOpen={cancelModal}
        variant="warning"
        title="Batalkan Perubahan?"
        message="Perubahan yang belum disimpan akan hilang. Yakin ingin kembali?"
        confirmText="Ya, Batalkan"
        onConfirm={() => navigate("/tagihan")}
        onCancel={() => setCancelModal(false)}
      />
      <div className="mb-6">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Data Tagihan</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Ubah Data Tagihan</h1>
        <p className="text-gray-600 mt-1">
          Lengkapi form di bawah untuk mengubah data tagihan
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Karyawan
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
                  placeholder="Contoh: KRY-001"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIK <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="NIK karyawan"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50"
                  readOnly
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
                  placeholder="Nama karyawan"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50"
                  readOnly
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
                  placeholder="Nomor rekening BRI"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="posisi"
                  value={formData.posisi}
                  onChange={handleChange}
                  placeholder="Posisi karyawan"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Rincian Gaji & Hari Kerja
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Gaji Kotor <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="jumlah_penghasilan_kotor"
                  value={formData.jumlah_penghasilan_kotor}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass("jumlah_penghasilan_kotor")}
                />

                <FieldError message={errors.jumlah_penghasilan_kotor} />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.jumlah_penghasilan_kotor)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Hari Kerja <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="jumlah_hari_kerja"
                  value={formData.jumlah_hari_kerja}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass("jumlah_hari_kerja")}
                />
                <FieldError message={errors.jumlah_hari_kerja} />
                <p className="text-xs text-gray-500 mt-1">
                  Bisa desimal (contoh: 24.5)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji Harian <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="gaji_harian"
                  value={formData.gaji_harian}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass("gaji_harian")}
                />
                <FieldError message={errors.gaji_harian} />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.gaji_harian)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lembur
                </label>
                <input
                  type="number"
                  name="jlh_lembur"
                  value={formData.jlh_lembur}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.jlh_lembur)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  THR
                </label>
                <input
                  type="number"
                  name="thr"
                  value={formData.thr}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.thr)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Iuran BPJS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seragam CS & Keamanan
                </label>
                <input
                  type="number"
                  name="seragam_cs_dan_keamanan"
                  value={formData.seragam_cs_dan_keamanan}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass("seragam_cs_dan_keamanan")}
                />

                <FieldError message={errors.seragam_cs_dan_keamanan} />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.seragam_cs_dan_keamanan)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Manajemen
                </label>
                <input
                  type="number"
                  name="fee_manajemen"
                  value={formData.fee_manajemen}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass("fee_manajemen")}
                />
                <FieldError message={errors.fee_manajemen} />
                <p className="text-xs text-green-600 mt-1">
                  {formatCurrency(formData.fee_manajemen)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Periode Tagihan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagihan Bulan Ini <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tagihan_bulan"
                  value={formData.tagihan_bulan}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass("tagihan_bulan")}
                />
                <FieldError message={errors.tagihan_bulan} />
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
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTagihanPage;
