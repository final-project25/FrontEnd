import { ArrowLeft, Mail, Calendar, Building2, User } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { showError } from "../../../utils/notify";

const DetailKontakPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kontak, setKontak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKontakById();
  }, [id]);

  const getKontakById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/kontak/${id}`);
      if (response.data.data.status_dibaca === "pending") {
        await api.post(`/kontak/${id}/status`, { status_dibaca: "dibaca" });
      }
      setKontak(response.data.data);
    } catch (error) {
      console.log(error);
      showError("Gagal memuat detail kontak");
      navigate("/admin/kontak");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#0891b2" size={50} />
      </div>
    );
  }

  if (!kontak) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data kontak tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/kontak")}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Pesan Kontak</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Detail Pesan Kontak
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {kontak.subjek}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(kontak.created_at)}</span>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    kontak.status_dibaca === "dibaca"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {kontak.status_dibaca === "dibaca"
                    ? "Sudah Dibaca"
                    : "Belum Dibaca"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informasi Pengirim
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="text-base font-medium text-gray-900">
                  {kontak.nama}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <a
                  href={`mailto:${kontak.email}`}
                  className="text-base font-medium text-cyan-600 hover:underline"
                >
                  {kontak.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Perusahaan</p>
                <p className="text-base font-medium text-gray-900">
                  {kontak.perusahaan || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Isi Pesan
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {kontak.isi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKontakPage;
