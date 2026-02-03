import { MapPin, Briefcase, ChevronRight } from "lucide-react";
import Navbar from "../../layouts/Navbar";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const LowonganPublikPage = () => {
  const [lowonganData, setLowonganData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllLowonganPublik();
  }, []);

  const getAllLowonganPublik = async () => {
    try {
      setLoading(true);
      const response = await api.get("/lowongan-kerja");
      setLowonganData(response.data.data);
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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="bg-blue-600 text-white py-16 pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-12">
              Lowongan Kerja
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Bergabunglah dengan Tim Kami dan Kembangkan Karir Anda di
              Perusahaan HR Terbaik{" "}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ClipLoader color="#0891b2" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {lowonganData.map((lowongan) => (
                <div
                  key={lowongan.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-blue-600">
                        {lowongan.posisi}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                        Aktif
                      </span>
                    </div>

                    <div className="flex items-center gap-10 mb-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        <span>{lowongan.lokasi_kerja}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} />
                        <span>{lowongan.jenis_kerja}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {lowongan.catatan}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Gaji:</span>
                      <p className="text-green-600 font-semibold text-right">
                        {lowongan.range_gaji}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm text-gray-600">Deadline</span>
                      <span className="text-sm text-gray-900">
                        {formatDate(lowongan.deadline_lowongan)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/lowongan-publik/${lowongan.id}`)
                      }
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <span>Lihat Lowongan</span>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-center gap-2">
            <button
              disabled
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </button>

            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LowonganPublikPage;
