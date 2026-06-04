import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";

const INITIAL_FORM = {
  // Field yang dikirim ke backend
  karyawan_id: null,
  jumlah_penghasilan_kotor: "",
  jumlah_hari_kerja: "",
  gaji_harian: "",
  gajian_bulan: "",
  jumlah_lembur: "",
  uang_thr: "",
  status_penggajian: true,
  tanggal_cetak: "",
  // Field display only (read-only, tidak dikirim ke backend)
  no_induk: "",
  no_rek_bri: "",
  nik: "",
  nama: "",
  posisi: "",
  bpjs_kesehatan: "",
  bpjs_jht: "",
  bpjs_jp: "",
  total_bpjs: "",
  upah_kotor_karyawan: "",
  upah_diterima: "",
  bulan_tahun: "",
};

const UpdatePenggajianPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    getPenggajianById();
  }, [id]);

  const getPenggajianById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/penggajian/${id}`);
      const data = response.data.data;

      setFormData({
        // Ambil karyawan_id dari nested object karyawan
        karyawan_id: data.karyawan?.id ?? null,
        jumlah_penghasilan_kotor: data.jumlah_penghasilan_kotor ?? "",
        jumlah_hari_kerja: data.jumlah_hari_kerja ?? "",
        gaji_harian: data.gaji_harian ?? "",
        gajian_bulan: data.gajian_bulan ?? "",
        jumlah_lembur: data.jumlah_lembur ?? "",
        uang_thr: data.uang_thr ?? "",
        status_penggajian: data.status_penggajian ?? true,
        tanggal_cetak: data.tanggal_cetak ?? "",
        // Read-only display dari nested object karyawan
        no_induk: data.karyawan?.nomor_induk ?? "",
        no_rek_bri: data.karyawan?.no_rek_bri ?? "",
        nik: data.karyawan?.nik ?? "",
        nama: data.karyawan?.nama_lengkap ?? "",
        posisi: data.karyawan?.posisi ?? "",
        // Kalkulasi dari backend
        bpjs_kesehatan: data.bpjs_kesehatan ?? "",
        bpjs_jht: data.bpjs_jht ?? "",
        bpjs_jp: data.bpjs_jp ?? "",
        total_bpjs: data.total_bpjs ?? "",
        upah_kotor_karyawan: data.upah_kotor_karyawan ?? "",
        upah_diterima: data.upah_diterima ?? "",
        bulan_tahun: data.bulan_tahun ?? "",
      });
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data penggajian");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.karyawan_id) {
      showError("Data karyawan tidak ditemukan, coba muat ulang halaman");
      return;
    }

    try {
      setLoading(true);

      // Hanya kirim field yang diperlukan backend, bukan seluruh formData
      const submitData = {
        karyawan_id: formData.karyawan_id, // integer, bukan string kosong
        jumlah_penghasilan_kotor: parseFloat(formData.jumlah_penghasilan_kotor) || 0,
        jumlah_hari_kerja: parseFloat(formData.jumlah_hari_kerja) || 0,
        gaji_harian: parseFloat(formData.gaji_harian) || 0,
        gajian_bulan: formData.gajian_bulan,
        jumlah_lembur: parseFloat(formData.jumlah_lembur) || 0,
        uang_thr: parseFloat(formData.uang_thr) || 0,
        status_penggajian: formData.status_penggajian,
        tanggal_cetak: formData.tanggal_cetak || null,
      };

      const response = await api.put(`/penggajian/${id}`, submitData);
      console.log(response.data);
      succesError("Data penggajian berhasil diubah");
      navigate("/penggajian");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        const firstError = Object.values(backendErrors)?.[0]?.[0];
        showError(firstError || "Validasi gagal");
        return;
      }
      showError(error.response?.data?.message || "Gagal menyimpan data");
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
      navigate("/penggajian");
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const readOnlyClass =
    "w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed";
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Data Penggajian</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Ubah Data Penggajian</h1>
        <p className="text-gray-600 mt-1">
          Lengkapi form di bawah untuk mengubah data penggajian
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow">

          {/* Section 1: Data Karyawan (read-only) */}
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Karyawan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Induk
                </label>
                <input
                  type="text"
                  value={formData.no_induk}
                  className={readOnlyClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIK
                </label>
                <input
                  type="text"
                  value={formData.nik}
                  className={readOnlyClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  className={readOnlyClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Rekening BRI
                </label>
                <input
                  type="text"
                  value={formData.no_rek_bri}
                  className={readOnlyClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi
                </label>
                <input
                  type="text"
                  value={formData.posisi}
                  className={readOnlyClass}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode
                </label>
                <input
                  type="text"
                  value={formData.bulan_tahun}
                  className={readOnlyClass}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section 2: Rincian Gaji (editable) */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Rincian Anggaran Gaji
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Penghasilan Kotor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jumlah_penghasilan_kotor"
                  value={formData.jumlah_penghasilan_kotor}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.jumlah_penghasilan_kotor)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  THR
                </label>
                <input
                  type="text"
                  name="uang_thr"
                  value={formData.uang_thr}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.uang_thr)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Hari Kerja <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jumlah_hari_kerja"
                  value={formData.jumlah_hari_kerja}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bisa desimal (contoh: 24.5)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji Harian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gaji_harian"
                  value={formData.gaji_harian}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.gaji_harian)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Lembur
                </label>
                <input
                  type="text"
                  name="jumlah_lembur"
                  value={formData.jumlah_lembur}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.jumlah_lembur)}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Periode & Status */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Periode & Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan Gajian <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="gajian_bulan"
                  value={formData.gajian_bulan}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                />
              </div>

             

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Penggajian <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status_penggajian"
                      checked={formData.status_penggajian === true}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, status_penggajian: true }))
                      }
                      disabled={loading}
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Selesai</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status_penggajian"
                      checked={formData.status_penggajian === false}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, status_penggajian: false }))
                      }
                      disabled={loading}
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pending</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Action Buttons */}
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
          onClick={handleSubmit}
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
    </div>
  );
};

export default UpdatePenggajianPage;