import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";

const UpdateTagihanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    no_induk: "",
    nik: "",
    nama: "",
    no_rek_bri: "",
    posisi: "",
    jumlah_gaji_diterima: "",
    bpjs_kesehatan: "",
    jkk: "",
    jkm: "",
    jht: "",
    jp: "",
    jumlah_iuran_bpjs: "0",
    seragam_cs_dan_keamanan: "",
    fee_manajemen: "",
    thr: "0",
    jumlah_hari_kerja: "",
    gaji_harian: "",
    lembur: "0",
    upa_yang_diterima_pekerja: "",
    total_diterima: "",
    periode_awal: "",
    periode_akhir: "",
    tanggal_cetak: "",
  });

  useEffect(() => {
    getTagihanById();
  }, [id]);

  const getTagihanById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tagihan/${id}`);
      const data = response.data.data;

      setFormData({
        no_induk: data.no_induk || "",
        nik: data.nik || "",
        nama: data.nama || "",
        no_rek_bri: data.no_rek_bri || "",
        posisi: data.posisi || "",
        jumlah_gaji_diterima: data.jumlah_gaji_diterima || "",
        bpjs_kesehatan: data.bpjs_kesehatan || "",
        jkk: data.jkk || "",
        jkm: data.jkm || "",
        jht: data.jht || "",
        jp: data.jp || "",
        jumlah_iuran_bpjs: data.jumlah_iuran_bpjs || "0",
        seragam_cs_dan_keamanan: data.seragam_cs_dan_keamanan || "",
        fee_manajemen: data.fee_manajemen || "",
        thr: data.thr || "0",
        jumlah_hari_kerja: data.jumlah_hari_kerja || "",
        gaji_harian: data.gaji_harian || "",
        lembur: data.lembur || "0",
        upa_yang_diterima_pekerja: data.upa_yang_diterima_pekerja || "",
        total_diterima: data.total_diterima || "",
        periode_awal: data.periode_awal || "",
        periode_akhir: data.periode_akhir || "",
        tanggal_cetak: data.tanggal_cetak || "",
      });
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data tagihan");
      navigate("/tagihan");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    if (window.confirm("Batalkan perubahan? Data yang diubah akan hilang.")) {
      navigate("/tagihan");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "no_induk",
      "nik",
      "nama",
      "no_rek_bri",
      "posisi",
      "jumlah_hari_kerja",
      "gaji_harian",
      "periode_awal",
      "periode_akhir",
      "tanggal_cetak",
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      showError("Mohon lengkapi semua field yang bertanda *");
      return;
    }

    try {
      const submitData = {
        ...formData,
        jumlah_gaji_diterima: parseFloat(formData.jumlah_gaji_diterima) || 0,
        bpjs_kesehatan: parseFloat(formData.bpjs_kesehatan) || 0,
        jkk: parseFloat(formData.jkk) || 0,
        jkm: parseFloat(formData.jkm) || 0,
        jht: parseFloat(formData.jht) || 0,
        jp: parseFloat(formData.jp) || 0,
        seragam_cs_dan_keamanan:
          parseFloat(formData.seragam_cs_dan_keamanan) || 0,
        fee_manajemen: parseFloat(formData.fee_manajemen) || 0,
        thr: parseFloat(formData.thr) || 0,
        jumlah_hari_kerja: parseFloat(formData.jumlah_hari_kerja),
        gaji_harian: parseFloat(formData.gaji_harian),
        lembur: parseFloat(formData.lembur) || 0,
      };

      setLoading(true);
      const response = await api.put(`/tagihan/${id}`, submitData);
      console.log(response.data);
      succesError("Data tagihan berhasil diperbarui");
      navigate("/tagihan");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        showError(errorMessages || "Data tidak valid");
      } else {
        showError(error.response?.data?.message || "Gagal menyimpan data");
      }
    } finally {
      setLoading(false);
    }
  };

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
                  name="no_induk"
                  value={formData.no_induk}
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
                  name="nama"
                  value={formData.nama}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  type="number"
                  name="gaji_harian"
                  value={formData.gaji_harian}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
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
                  name="lembur"
                  value={formData.lembur}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.lembur)}
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
                  BPJS Kesehatan
                </label>
                <input
                  type="number"
                  name="bpjs_kesehatan"
                  value={formData.bpjs_kesehatan}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.bpjs_kesehatan)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JKK (Jaminan Kecelakaan Kerja)
                </label>
                <input
                  type="number"
                  name="jkk"
                  value={formData.jkk}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.jkk)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JKM (Jaminan Kematian)
                </label>
                <input
                  type="number"
                  name="jkm"
                  value={formData.jkm}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.jkm)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JHT (Jaminan Hari Tua)
                </label>
                <input
                  type="number"
                  name="jht"
                  value={formData.jht}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.jht)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JP (Jaminan Pensiun)
                </label>
                <input
                  type="number"
                  name="jp"
                  value={formData.jp}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.jp)}
                </p>
              </div>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-green-600 mt-1">
                  {formatCurrency(formData.fee_manajemen)}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Iuran BPJS (Auto)
                </label>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(formData.jumlah_iuran_bpjs)}
                </div>
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
                  Periode Awal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="periode_awal"
                  value={formData.periode_awal}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode Akhir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="periode_akhir"
                  value={formData.periode_akhir}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Cetak <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_cetak"
                  value={formData.tanggal_cetak}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
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
