import { ArrowLeft, Save, Calculator } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";

const UpdatePenggajianPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    no_induk: "",
    nik: "",
    nama: "",
    no_rek_bri: "",
    posisi: "",
    jumlah_penghasilan_kotor: "",
    bpjs_kesehatan: "",
    bpjs_jht: "",
    bpjs_jp: "",
    total_bpjs: "",
    uang_thr: "0",
    jumlah_hari_kerja: "",
    gaji_harian: "",
    jumlah_lembur: "0",
    upah_kotor_karyawan: "",
    upah_diterima: "",
    status_penggajian: "true",
    gajian_bulan: "",
    periode_awal: "",
    periode_akhir: "",
    tanggal_cetak: "",
  });

  useEffect(() => {
    getPenggajianById();
  }, [id]);

  const getPenggajianById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/penggajian/${id}`);
      const data = response.data.data;

      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    } catch (error) {
      console.log(error);
      showError("Gagal memuat data penggajian");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nik) {
      showError("Silakan pilih karyawan terlebih dahulu");
      return;
    }
    try {
      const submitData = {
        ...formData,
        jumlah_penghasilan_kotor: parseFloat(formData.jumlah_penghasilan_kotor),
        bpjs_kesehatan: parseFloat(formData.bpjs_kesehatan),
        bpjs_jht: parseFloat(formData.bpjs_jht),
        bpjs_jp: parseFloat(formData.bpjs_jp),
        total_bpjs: parseFloat(formData.total_bpjs),
        uang_thr: parseFloat(formData.uang_thr),
        jumlah_hari_kerja: parseFloat(formData.jumlah_hari_kerja),
        gaji_harian: parseFloat(formData.gaji_harian),
        jumlah_lembur: parseFloat(formData.jumlah_lembur),
        upah_kotor_karyawan: parseFloat(formData.upah_kotor_karyawan),
        upah_diterima: parseFloat(formData.upah_diterima),
      };
      setLoading(true);
      const response = await api.put(`/penggajian/${id}`, submitData);
      console.log(response.data);
      succesError("Data penggajian berhasil ditambahkan");
      navigate("/penggajian");
    } catch (error) {
      console.log(error);
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
          <span>Kembali ke Data Penggajian</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Ubah Data Penggajian
        </h1>
        <p className="text-gray-600 mt-1">
          Lengkapi form di bawah untuk mengubah data penggajian
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Karyawan
            </h2>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bagian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="posisi"
                  value={formData.posisi}
                  onChange={handleChange}
                  placeholder="Posisi karyawan"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Rincian Anggaran Gaji
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Penghasilan Kotor{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jumlah_penghasilan_kotor"
                  value={formData.jumlah_penghasilan_kotor}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.jumlah_penghasilan_kotor)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BPJS Kesehatan 1%<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bpjs_kesehatan"
                  value={formData.bpjs_kesehatan}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.bpjs_kesehatan)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BPJS Ketenagakerjaan (JHT) 2%
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bpjs_jht"
                  value={formData.bpjs_jht}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.bpjs_jht)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BPJS Ketenagakerjaan (JP) 1%
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bpjs_jp"
                  value={formData.bpjs_jp}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.bpjs_jp)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total BPJS
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="total_bpjs"
                  value={formData.total_bpjs}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-red-600 mt-1">
                  {formatCurrency(formData.total_bpjs)}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.uang_thr)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Hari Kerja <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    step="0.5"
                    onChange={handleChange}
                    name="jumlah_hari_kerja"
                    value={formData.jumlah_hari_kerja}
                    placeholder="0"
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Bisa desimal (contoh: 24.5)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gaji_harian"
                  value={formData.gaji_harian}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.jumlah_lembur)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Periode Gaji
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status & Tanggal Cetak
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Penggajian <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status_penggajian"
                      value={true}
                      checked={formData.status_penggajian === true}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status_penggajian: true,
                        }))
                      }
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 disabled:cursor-not-allowed"
                    />
                    <span className="ml-2 text-sm text-gray-700">Selesai</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status_penggajian"
                      value={false}
                      checked={formData.status_penggajian === false}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status_penggajian: false,
                        }))
                      }
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 disabled:cursor-not-allowed"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pending</span>
                  </label>
                </div>
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
      </form>

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
            <>
              <ClipLoader color="#ffffff" size={20} />
            </>
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
