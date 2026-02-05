import {
  ArrowLeft,
  Save,
  X,
  FileText,
  Image,
  CheckCircle,
  Copy,
  Download,
} from "lucide-react";
import { useState } from "react";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { showError, succesError } from "../../../utils/notify";
import { ClipLoader } from "react-spinners";
import Navbar from "../../layouts/Navbar";

const CreateLamaranPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [kodeLamaran, setKodeLamaran] = useState("");

  const [formData, setFormData] = useState({
    lowongan_kerja_id: id || "",
    nik: "",
    nama: "",
    nama_lengkap: "",
    posisi_dilamar: "",
    no_wa: "",
    alamat: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageFields = [
      "foto_ktp",
      "foto_kk",
      "foto_skck",
      "pas_foto",
      "surat_sehat",
      "surat_anti_narkoba",
    ];
    const pdfFields = ["surat_lamaran", "cv"];

    if (imageFields.includes(fieldName)) {
      if (!file.type.startsWith("image/")) {
        showError("File harus berupa gambar (JPG, PNG, dll)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showError("Ukuran file maksimal 2MB");
        return;
      }
    }

    if (pdfFields.includes(fieldName)) {
      if (file.type !== "application/pdf") {
        showError("File harus berupa PDF");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError("Ukuran file maksimal 5MB");
        return;
      }
    }

    setFiles({ ...files, [fieldName]: file });

    if (imageFields.includes(fieldName)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [fieldName]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (fieldName) => {
    setFiles({ ...files, [fieldName]: null });
    setPreviews({ ...previews, [fieldName]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lowongan_kerja_id) {
      showError(
        "ID Lowongan tidak ditemukan. Mohon akses melalui halaman lowongan.",
      );
      return;
    }

    if (
      !formData.nik ||
      !formData.nama_lengkap ||
      !formData.posisi_dilamar ||
      !formData.no_wa ||
      !formData.alamat
    ) {
      showError("Mohon lengkapi semua data pribadi yang wajib diisi");
      return;
    }

    const requiredFiles = [
      "foto_ktp",
      "foto_kk",
      "foto_skck",
      "pas_foto",
      "surat_sehat",
      "surat_anti_narkoba",
      "surat_lamaran",
      "cv",
    ];
    const missingFiles = requiredFiles.filter((field) => !files[field]);

    if (missingFiles.length > 0) {
      showError("Mohon upload semua dokumen yang diperlukan");
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);

      const kode = response.data.data?.token_pendaftaran;

      console.log(kode);

      if (kode) {
        setKodeLamaran(kode);
        setShowSuccessModal(true);
      } else {
        succesError("Lamaran berhasil dikirim");
        navigate("/lowongan-publik");
      }

      succesError("Lamaran berhasil dikirim");
    } catch (error) {
      showError(error.response?.data?.message || "Gagal mengirim lamaran");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Anda yakin untuk membatalkan pengajuan lamaran?")) {
      navigate("/lowongan-publik");
    }
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
      { type: "text/plain" },
    );
    element.href = URL.createObjectURL(file);
    element.download = `Kode_Lamaran_${kodeLamaran}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    succesError("Kode berhasil didownload!");
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      {" "}
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

  const FileUploadBox = ({
    label,
    name,
    accept,
    fileType,
    required = true,
  }) => {
    const isImage = [
      "foto_ktp",
      "foto_kk",
      "foto_skck",
      "pas_foto",
      "surat_sehat",
      "surat_anti_narkoba",
    ].includes(name);

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {!files[name] ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isImage ? (
                <Image className="w-8 h-8 mb-2 text-gray-400" />
              ) : (
                <FileText className="w-8 h-8 mb-2 text-gray-400" />
              )}
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Klik untuk upload</span>
              </p>
              <p className="text-xs text-gray-500">
                {fileType === "image"
                  ? "PNG, JPG (Max. 2MB)"
                  : "PDF (Max. 5MB)"}
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
          <div className="border-2 border-gray-300 rounded-lg p-4">
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
      </div>
    );
  };

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
                      onChange={handleChange}
                      placeholder="16 digit NIK"
                      maxLength="16"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
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
                      Posisi yang Dilamar{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="posisi_dilamar"
                      value={formData.posisi_dilamar}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    >
                      <option value="">Pilih posisi</option>
                      <option value="cleaning_service">Cleaning Service</option>
                      <option value="supir">Supir</option>
                      <option value="security">Security</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload Foto Dokumen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadBox
                    label="Foto KTP"
                    name="foto_ktp"
                    accept="image/*"
                    fileType="image"
                  />
                  <FileUploadBox
                    label="Foto Kartu Keluarga (KK)"
                    name="foto_kk"
                    accept="image/*"
                    fileType="image"
                  />
                  <FileUploadBox
                    label="Foto SKCK"
                    name="foto_skck"
                    accept="image/*"
                    fileType="image"
                  />
                  <FileUploadBox
                    label="Pas Foto"
                    name="pas_foto"
                    accept="image/*"
                    fileType="image"
                  />
                  <FileUploadBox
                    label="Surat Keterangan Sehat"
                    name="surat_sehat"
                    accept="image/*"
                    fileType="image"
                  />
                  <FileUploadBox
                    label="Surat Bebas Narkoba"
                    name="surat_anti_narkoba"
                    accept="image/*"
                    fileType="image"
                  />
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload Surat-surat (PDF)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadBox
                    label="Surat Lamaran"
                    name="surat_lamaran"
                    accept=".pdf"
                    fileType="pdf"
                  />
                  <FileUploadBox
                    label="Curriculum Vitae (CV)"
                    name="cv"
                    accept=".pdf"
                    fileType="pdf"
                  />
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
                    <span>Kirim Lamaran</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateLamaranPage;
