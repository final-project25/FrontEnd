import {
  ArrowLeft,
  Save,
  X,
  FileText,
  Image,
  CheckCircle,
  Copy,
  Download,
  Briefcase,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";
import { ClipLoader } from "react-spinners";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";

const INITIAL_ERRORS = {
  nik: "",
  nama_lengkap: "",
  no_wa: "",
  posisi_dilamar: "",
  alamat: "",
  foto_ktp: "",
  foto_kk: "",
  foto_skck: "",
  pas_foto: "",
  surat_sehat: "",
  surat_anti_narkoba: "",
  surat_lamaran: "",
  cv: "",
};

const CreateLamaranPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [kodeLamaran, setKodeLamaran] = useState("");
  const [loadingLowongan, setLoadingLowongan] = useState(true);

  const [formData, setFormData] = useState({
    lowongan_kerja_id: id || "",
    nik: "",
    nama: "",
    nama_lengkap: "",
    posisi_dilamar: "",
    no_wa: "",
    alamat: "",
  });

  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const [files, setFiles] = useState({
    foto_ktp: null,
    foto_kk: null,
    foto_skck: null,
    pas_foto: null,
    surat_sehat: null,
    surat_anti_narkoba: null,
    surat_lamaran: null,
    cv: null,
  });

  const [previews, setPreviews] = useState({
    foto_ktp: null,
    foto_kk: null,
    foto_skck: null,
    pas_foto: null,
    surat_sehat: null,
    surat_anti_narkoba: null,
  });

  useEffect(() => {
    if (id) {
      fetchLowongan();
    }
  }, [id]);

  const fetchLowongan = async () => {
    try {
      setLoadingLowongan(true);
      const response = await api.get(`/lowongan-kerja/${id}`);
      const lowonganData = response.data.data;
      setFormData((prev) => ({
        ...prev,
        posisi_dilamar: lowonganData.posisi || "",
      }));
    } catch (error) {
      console.error("Error fetching lowongan:", error);
      showError("Gagal mengambil data lowongan");
    } finally {
      setLoadingLowongan(false);
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Kompresi gambar via Canvas API — tidak butuh library tambahan
  const compressImage = (file, maxWidthPx = 1280, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          // Resize jika lebih besar dari maxWidth
          if (width > maxWidthPx) {
            height = Math.round((height * maxWidthPx) / width);
            width = maxWidthPx;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              // Buat File baru dari blob terkompresi
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };
      };
    });
  };

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFields = [
      "foto_ktp", "foto_kk", "foto_skck",
      "pas_foto", "surat_sehat", "surat_anti_narkoba",
    ];
    const pdfFields = ["surat_lamaran", "cv"];

    if (imageFields.includes(fieldName)) {
      if (!file.type.startsWith("image/")) {
        showError("File harus berupa gambar (JPG, PNG, dll)");
        return;
      }
      // Kompresi otomatis — file besar dari HP kamera tinggi akan dikecilkan
      let finalFile = file;
      if (file.size > 500 * 1024) {
        // > 500KB baru dikompres
        try {
          finalFile = await compressImage(file);
        } catch {
          // Kalau kompresi gagal, pakai file asli
          finalFile = file;
        }
      }
      // Cek ulang setelah kompresi
      if (finalFile.size > 2 * 1024 * 1024) {
        showError("Ukuran file terlalu besar, maksimal 2MB");
        return;
      }

      setFiles((prev) => ({ ...prev, [fieldName]: finalFile }));
      if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: "" }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(finalFile);
      return;
    }

    if (pdfFields.includes(fieldName)) {
      if (file.type !== "application/pdf") {
        showError("File harus berupa PDF");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError("Ukuran file PDF maksimal 5MB");
        return;
      }
    }

    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nik.trim()) {
      newErrors.nik = "NIK wajib diisi";
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus 16 digit angka";
    }

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    }

    if (!formData.no_wa.trim()) {
      newErrors.no_wa = "Nomor WhatsApp wajib diisi";
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.no_wa)) {
      newErrors.no_wa = "Nomor WhatsApp tidak valid (contoh: 08xxxxxxxxxx)";
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = "Alamat wajib diisi";
    }

    // Validasi semua file wajib
    const requiredFiles = [
      "foto_ktp", "foto_kk", "foto_skck", "pas_foto",
      "surat_sehat", "surat_anti_narkoba", "surat_lamaran", "cv",
    ];
    requiredFiles.forEach((field) => {
      if (!files[field]) {
        newErrors[field] = "Dokumen ini wajib diupload";
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll ke error pertama
      const firstError = document.querySelector(".text-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      const response = await api.post("/rekruitmen", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const kode = response.data.data?.token_pendaftaran;
      if (kode) {
        setKodeLamaran(kode);
        setShowSuccessModal(true);
      } else {
        succesError("Lamaran berhasil dikirim");
        navigate("/lowongan-publik");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        const mappedErrors = {};
        Object.keys(backendErrors).forEach((key) => {
          mappedErrors[key] = backendErrors[key][0];
        });
        setErrors((prev) => ({ ...prev, ...mappedErrors }));

        // Scroll ke error pertama dari backend
        setTimeout(() => {
          const firstError = document.querySelector(".text-red-500");
          if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
        return;
      }
      if (error.response?.status === 413) {
        showError("Ukuran file terlalu besar. Pastikan setiap foto maksimal 2MB dan PDF maksimal 5MB.");
      } else if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        showError("Koneksi timeout. Pastikan internet stabil lalu coba lagi.");
      } else if (!error.response && error.request) {
        showError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else {
        showError(error.response?.data?.message || "Gagal mengirim lamaran. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Anda yakin untuk membatalkan pengajuan lamaran?")) {
      navigate("/lowongan-publik");
    }
  };

  const handleNumberOnly = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCopyKode = () => {
    navigator.clipboard.writeText(kodeLamaran);
    succesError("Kode berhasil disalin!");
  };

  const handleDownloadKode = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `KODE LAMARAN PEKERJAAN\n\n` +
          `Kode: ${kodeLamaran}\n\n` +
          `Simpan kode ini untuk mengecek status lamaran Anda.\n` +
          `Akses: ${window.location.origin}/cek-status-lamaran\n\n` +
          `Terima kasih telah melamar!`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Kode_Lamaran_${kodeLamaran}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    succesError("Kode berhasil didownload!");
  };

  // Helper komponen
  const FieldError = ({ message }) =>
    message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

  const inputClass = (field) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
      errors[field] ? "border-red-500 bg-red-50" : "border-gray-300"
    }`;

  // FileUploadBox menerima errors sebagai prop agar bisa tampil border merah
  const FileUploadBox = ({ label, name, accept, fileType, required = true }) => {
    const isImage = [
      "foto_ktp", "foto_kk", "foto_skck",
      "pas_foto", "surat_sehat", "surat_anti_narkoba",
    ].includes(name);

    const hasError = !!errors[name];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {!files[name] ? (
          <label
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              hasError
                ? "border-red-400 bg-red-50 hover:bg-red-100"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isImage ? (
                <Image className={`w-8 h-8 mb-2 ${hasError ? "text-red-400" : "text-gray-400"}`} />
              ) : (
                <FileText className={`w-8 h-8 mb-2 ${hasError ? "text-red-400" : "text-gray-400"}`} />
              )}
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-semibold">Klik untuk upload</span>
              </p>
              <p className="text-xs text-gray-400">
                {fileType === "image" ? "PNG, JPG (Max. 2MB)" : "PDF (Max. 5MB)"}
              </p>
            </div>
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(e, name)}
              className="hidden"
            />
          </label>
        ) : (
          <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
            {isImage && previews[name] ? (
              <div className="space-y-2">
                <img
                  src={previews[name]}
                  alt={label}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1">
                    {files[name].name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(name)}
                    className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-8 h-8 text-red-500 shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {files[name].name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(name)}
                  className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error message di dalam FileUploadBox, bukan di luar grid */}
        <FieldError message={errors[name]} />
      </div>
    );
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Lamaran Berhasil Dikirim!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Simpan kode di bawah untuk mengecek status lamaran Anda
        </p>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 text-center mb-2">
            Kode Lamaran Anda
          </p>
          <p className="text-3xl font-bold text-center text-cyan-700 tracking-wider break-all">
            {kodeLamaran}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Penting:</strong> Simpan kode ini dengan baik. Anda akan
            membutuhkannya untuk mengecek status lamaran.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleCopyKode}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors"
          >
            <Copy size={20} />
            <span>Salin Kode</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadKode}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <Download size={20} />
            <span>Download Kode</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/lowongan-publik");
            }}
            className="w-full text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Kembali ke Lowongan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      {showSuccessModal && <SuccessModal />}

      <div className="min-h-screen bg-gray-50 pt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
            >
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Form Lamaran Pekerjaan
            </h1>
            <p className="text-gray-600 mt-1">
              Lengkapi form di bawah untuk melamar pekerjaan
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow">

              {/* Section 1: Data Pribadi */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Data Pribadi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIK (No. KTP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nik"
                      value={formData.nik}
                      onChange={handleNumberOnly}
                      placeholder="16 digit NIK"
                      maxLength="16"
                      className={inputClass("nik")}
                    />
                    <FieldError message={errors.nik} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Panggilan
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Nama panggilan"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap sesuai KTP"
                      className={inputClass("nama_lengkap")}
                    />
                    <FieldError message={errors.nama_lengkap} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="no_wa"
                      value={formData.no_wa}
                      onChange={handleNumberOnly}
                      placeholder="08xxxxxxxxxx"
                      maxLength="13"
                      className={inputClass("no_wa")}
                    />
                    <FieldError message={errors.no_wa} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posisi yang Dilamar <span className="text-red-500">*</span>
                    </label>
                    {loadingLowongan ? (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center h-10">
                        <ClipLoader color="#0891b2" size={20} />
                      </div>
                    ) : (
                      <div
                        className={`w-full px-4 py-2 border rounded-lg bg-gray-50 ${
                          errors.posisi_dilamar ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} className="text-cyan-600" />
                          <span className="font-semibold text-gray-900">
                            {formatPosisi(formData.posisi_dilamar)}
                          </span>
                        </div>
                      </div>
                    )}
                    <input
                      type="hidden"
                      name="posisi_dilamar"
                      value={formData.posisi_dilamar}
                    />
                    <FieldError message={errors.posisi_dilamar} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="3"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      placeholder="Masukkan alamat lengkap"
                      className={inputClass("alamat")}
                    />
                    <FieldError message={errors.alamat} />
                  </div>

                </div>
              </div>

              {/* Section 2: Upload Foto Dokumen */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Upload Foto Dokumen
                </h2>
                <p className="text-xs text-gray-400 mb-4">Format PNG/JPG, maksimal 2MB per file</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Error message ada di DALAM FileUploadBox, bukan di luar */}
                  <FileUploadBox label="Foto KTP" name="foto_ktp" accept="image/*" fileType="image" />
                  <FileUploadBox label="Foto Kartu Keluarga (KK)" name="foto_kk" accept="image/*" fileType="image" />
                  <FileUploadBox label="Foto SKCK" name="foto_skck" accept="image/*" fileType="image" />
                  <FileUploadBox label="Pas Foto" name="pas_foto" accept="image/*" fileType="image" />
                  <FileUploadBox label="Surat Keterangan Sehat" name="surat_sehat" accept="image/*" fileType="image" />
                  <FileUploadBox label="Surat Bebas Narkoba" name="surat_anti_narkoba" accept="image/*" fileType="image" />
                </div>
              </div>

              {/* Section 3: Upload PDF */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Upload Surat-surat (PDF)
                </h2>
                <p className="text-xs text-gray-400 mb-4">Format PDF, maksimal 5MB per file</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadBox label="Surat Lamaran" name="surat_lamaran" accept=".pdf" fileType="pdf" />
                  <FileUploadBox label="Curriculum Vitae (CV)" name="cv" accept=".pdf" fileType="pdf" />
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
                    <span>Kirim Lamaran</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CreateLamaranPage;