import {
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  ArrowLeft,
  ChevronRight,
  Clock,
  Banknote,
} from "lucide-react";
import Navbar from "../../layouts/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";

const DetailLowonganPublikPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLowonganById();
  }, [id]);

  const getLowonganById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lowongan-kerja/${id}`);
      setLowongan(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-600 transition-colors pt-8"
          >
            <ArrowLeft size={20} />
            <span>Kembali ke Daftar Lowongan</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ClipLoader color="#0891b2" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-start justify-between py-3">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {lowongan.posisi}
                      </h1>
                      <div className="flex items-center gap-6 text-gray-700 text-sm pb-12">
                        <div className="flex items-center gap-2">
                          <MapPin size={18} />
                          <span>{lowongan.lokasi_kerja}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} />
                          <span>{lowongan.jenis_kerja}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-4 py-2 ${
                        lowongan.status_lowongan === "aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } text-sm font-semibold rounded-full`}
                    >
                      {lowongan.status_lowongan === "aktif"
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Deskripsi Pekerjaan
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line pb-12">
                    {lowongan.catatan}
                  </p>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Informasi Lowongan
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                      <Banknote size={20} className="text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Range Gaji</p>
                        <p className="text-lg font-semibold text-green-600">
                          {lowongan.range_gaji}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                      <Calendar size={20} className="text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          Batas Akhir Lamaran
                        </p>
                        <p className="text-base font-medium text-gray-800">
                          {formatDate(lowongan.deadline_lowongan)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock size={20} className="text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          Diposting Pada
                        </p>
                        <p className="text-base font-medium text-gray-800">
                          {formatDateTime(lowongan.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Tertarik dengan Posisi Ini?
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Batas Waktu:</span>
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        {formatDate(lowongan.deadline_lowongan)}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Estimasi Gaji:</span>
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        {lowongan.range_gaji}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/lamar-pekerjaan/${lowongan.id}`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 mb-3"
                  >
                    <span>Lamar Sekarang</span>
                    <ChevronRight size={20} />
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Dengan melamar, Anda menyetujui syarat dan ketentuan yang
                      berlaku
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailLowonganPublikPage;
