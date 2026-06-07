import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";
import { mapBackendErrors } from "../../../utils/errorHandler";

const INITIAL_FORM = {
  karyawan_id: "",
  jumlah_penghasilan_kotor: 3732906,
  jumlah_hari_kerja: "",
  gaji_harian: 149316,
  gajian_bulan: "",
  jumlah_lembur: "",
  uang_thr: "",
  status_penggajian: true,
};

const INITIAL_ERRORS = {
  karyawan_id: "",
  jumlah_penghasilan_kotor: "",
  jumlah_hari_kerja: "",
  gaji_harian: "",
  gajian_bulan: "",
  jumlah_lembur: "",
  uang_thr: "",
  status_penggajian: "",
};

const CreatePenggajianPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [karyawan, setKaryawan] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  useEffect(() => {
    getAllKaryawan();
  }, []);

  const getAllKaryawan = async () => {
    try {
      setLoading(true);
      // Fetch semua halaman sampai habis
      let allKaryawan = [];
      let page = 1;
      let lastPage = 1;

      do {
        const response = await api.get(`/karyawan?page=${page}`);
        const data = response.data.data;
        const meta = response.data.meta;

        allKaryawan = [...allKaryawan, ...data];
        lastPage = Array.isArray(meta?.last_page) ? meta.last_page[0] : (meta?.last_page ?? 1);
        page++;
      } while (page <= lastPage);

      const activeKaryawan = allKaryawan.filter((k) => k.status_aktif === true);
      setKaryawan(activeKaryawan);
    } catch (error) {
      showError("Gagal memuat data karyawan");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeKaryawan = (e) => {
    const selectedId = e.target.value;
    const selectedKaryawan = karyawan.find(
      (k) => k.id === parseInt(selectedId),
    );
    if (selectedKaryawan) {
      setFormData((prev) => ({
        ...prev,
        karyawan_id: selectedKaryawan.id,
        no_induk: selectedKaryawan.nomor_induk,
        no_rek_bri: selectedKaryawan.no_rek_bri,
        nik: selectedKaryawan.nik,
        nama: selectedKaryawan.nama_lengkap,
        posisi: selectedKaryawan.posisi,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const requiredFields = [
      "jumlah_penghasilan_kotor",
      "jumlah_hari_kerja",
      "gaji_harian",
      "gajian_bulan",
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
        jumlah_penghasilan_kotor: parseFloat(formData.jumlah_penghasilan_kotor),
        uang_thr: parseFloat(formData.uang_thr),
        jumlah_hari_kerja: parseFloat(formData.jumlah_hari_kerja),
        gaji_harian: parseFloat(formData.gaji_harian),
        jumlah_lembur: parseFloat(formData.jumlah_lembur),
      };
      setLoading(true);
      const response = await api.post(`/penggajian`, submitData);
      console.log(response.data);
      succesError("Data penggajian berhasil ditambahkan");
      navigate("/penggajian");
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
        "Terjadi kesalahan pada server";

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formData.karyawan_id) {
      newErrors.karyawan_id = "Silakan pilih karyawan";
      isValid = false;
    }

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

    if (!formData.gajian_bulan) {
      newErrors.gajian_bulan = "Bulan tagihan wajib dipilih";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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

  const FieldError = ({ message }) =>
    message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

  const inputClass = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

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
          Tambah Data Penggajian
        </h1>
        <p className="text-gray-600 mt-1">
          Lengkapi form di bawah untuk menambahkan data penggajian baru
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pilih Karyawan
            </h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Karyawan <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChangeKaryawan}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">
                  {loading ? "Memuat karyawan..." : "Pilih karyawan"}
                </option>
                {karyawan.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nomor_induk} - {k.nama_lengkap} ({k.posisi})
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                readOnly
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
              Rincian Anggaran Gaji
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Gaji Kotor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jumlah_penghasilan_kotor"
                  value={formData.jumlah_penghasilan_kotor}
                  onChange={handleChange}
                  // placeholder="0"
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
                  THR
                </label>
                <input
                  type="text"
                  name="uang_thr"
                  value={formData.uang_thr}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                  className={inputClass("uang_thr")}
                />

                <FieldError message={errors.uang_thr} />
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
                    className={inputClass("jumlah_hari_kerja")}
                  />
                </div>
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
                  className={inputClass("gaji_harian")}
                />
                <FieldError message={errors.gaji_harian} />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(formData.jumlah_lembur)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Periode Penggajian
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagihan Bulan Ini <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="gajian_bulan"
                  value={formData.gajian_bulan}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass("gajian_bulan")}
                />
                <FieldError message={errors.gajian_bulan} />
              </div>
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Penggajian <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status_penggajian"
                  value="true"
                  checked={formData.status_penggajian === true}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      status_penggajian: true,
                    })
                  }
                  disabled={loading}
                  className="w-4 h-4 text-cyan-600"
                />
                <span>Aktif</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status_penggajian"
                  value="false"
                  checked={formData.status_penggajian === false}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      status_penggajian: false,
                    })
                  }
                  disabled={loading}
                  className="w-4 h-4 text-cyan-600"
                />
                <span>Tidak Aktif</span>
              </label>
            </div>

            <FieldError message={errors.status_penggajian} />
          </div> */}
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

export default CreatePenggajianPage;
