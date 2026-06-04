import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  DollarSign,
  Briefcase,
  FileText,
  TrendingUp,
  UserCheck,
  Mail,
  Calendar,
  MapPin,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import api from "../../services/api";
import { showError } from "../../utils/notify";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/dashboard");

      if (response.data.success) {
        // Data ada di response.data.data, bukan response.data
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      showError("Gagal mengambil data dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <ClipLoader color="#0891b2" size={50} />
        <p className="mt-4 text-gray-500">Memuat data dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data tidak tersedia</p>
      </div>
    );
  }

  const { stats, recent_data, summary, charts } = dashboardData;

  // Format data chart gaji untuk recharts
  const gajiChartData = charts?.gaji?.raw_data?.map((item) => ({
    bulan: item.bulan,
    "Total Gaji": item.total_gaji,
    "Total Tagihan": item.total_tagihan,
    "Rata-rata Gaji": item.rata_rata_gaji,
  })) ?? [];

  // Format data chart pelamar untuk recharts
  const pelamarChartData = charts?.pelamar?.raw_data?.map((item) => ({
    bulan: item.bulan,
    Pending: parseInt(item.pending),
    Diterima: parseInt(item.diterima),
    Ditolak: parseInt(item.ditolak),
  })) ?? [];

  const formatRupiah = (value) => {
    if (!value || value === "0.00") return "Rp 0";
    return `Rp ${parseFloat(value).toLocaleString("id-ID")}`;
  };

  const formatRupiahShort = (value) => {
    if (!value) return "Rp 0";
    const num = parseFloat(value);
    if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)}jt`;
    if (num >= 1_000) return `Rp ${(num / 1_000).toFixed(0)}rb`;
    return `Rp ${num}`;
  };

  const formatPosisi = (posisi) => {
    if (!posisi) return "-";
    return posisi
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
      diterima: { bg: "bg-green-100", text: "text-green-700", label: "Diterima" },
      ditolak: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" },
      aktif: { bg: "bg-green-100", text: "text-green-700", label: "Aktif" },
      non_aktif: { bg: "bg-gray-100", text: "text-gray-700", label: "Non Aktif" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Selamat Datang, Admin! 👋</h1>
            <p className="text-cyan-50 text-lg">
              Berikut adalah overview kegiatan perusahaan anda
            </p>
          </div>
          <div className="hidden md:block">
            <Calendar className="w-16 h-16 opacity-50" />
          </div>
        </div>
      </div>

      {/* Stats Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium mb-1">Total Karyawan</p>
              <h3 className="text-4xl font-bold mb-2">{stats.karyawan.total}</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center">
                  <UserCheck size={14} className="mr-1" />
                  <span>Aktif: {stats.karyawan.aktif}</span>
                </div>
                <span className="text-cyan-200">|</span>
                <span>Non-Aktif: {stats.karyawan.non_aktif}</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Users size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Gaji Bulan Ini</p>
              <h3 className="text-2xl font-bold mb-2">
                {formatRupiah(summary.total_gaji_bulan_ini)}
              </h3>
              <div className="text-sm">
                <span>Sudah Dibayar: {stats.penggajian.sudah_dibayar}</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <DollarSign size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Tagihan Bulan Ini</p>
              <h3 className="text-2xl font-bold mb-2">
                {formatRupiah(stats.tagihan.bulan_ini)}
              </h3>
              <div className="text-sm">
                <span>Tahun Ini: {formatRupiah(stats.tagihan.tahun_ini)}</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <FileText size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Total Pelamar</p>
              <h3 className="text-4xl font-bold mb-2">{stats.rekruitmen.total}</h3>
              <div className="text-sm flex gap-2">
                <span className="bg-white/20 px-2 py-1 rounded">
                  Pending: {stats.rekruitmen.pending}
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  Diterima: {stats.rekruitmen.diterima}
                </span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Briefcase size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Lowongan Aktif</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.lowongan.aktif}</h3>
              <p className="text-sm text-gray-500 mt-1">
                dari {stats.lowongan.total} total lowongan
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Pesan Masuk</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.kontak.total}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {stats.kontak.belum_dibaca > 0 ? (
                  <span className="text-pink-600 font-semibold">
                    {stats.kontak.belum_dibaca} belum dibaca
                  </span>
                ) : (
                  <span className="text-green-600">Semua sudah dibaca</span>
                )}
              </p>
            </div>
            <div className="bg-pink-100 p-3 rounded-full">
              <Mail className="text-pink-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Gaji Tahun Ini</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {formatRupiah(stats.penggajian.tahun_ini)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Belum Dibayar: {stats.penggajian.belum_dibayar}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <DollarSign className="text-emerald-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart: Gaji & Tagihan */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Tren Gaji & Tagihan
          </h3>
          <p className="text-sm text-gray-500 mb-4">6 bulan terakhir</p>
          {gajiChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gajiChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => formatRupiahShort(v)} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => formatRupiah(value)}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Legend />
                <Bar dataKey="Total Gaji" fill="rgba(54, 162, 235, 0.8)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Total Tagihan" fill="rgba(255, 99, 132, 0.8)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              Belum ada data chart
            </div>
          )}
        </div>

        {/* Chart: Pelamar */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
            <Briefcase size={20} className="text-purple-600" />
            Tren Pelamar
          </h3>
          <p className="text-sm text-gray-500 mb-4">6 bulan terakhir</p>
          {pelamarChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={pelamarChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelStyle={{ fontWeight: "bold" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Pending"
                  stroke="rgba(255, 206, 86, 1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Diterima"
                  stroke="rgba(75, 192, 192, 1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Ditolak"
                  stroke="rgba(255, 99, 132, 1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              Belum ada data chart
            </div>
          )}
        </div>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Karyawan Terbaru */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Users size={20} className="text-cyan-600" />
            Karyawan Terbaru
          </h3>
          <p className="text-sm text-gray-500 mb-4">5 Karyawan Terdaftar Terakhir</p>
          <div className="space-y-3">
            {recent_data.karyawan?.length > 0 ? (
              recent_data.karyawan.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{item.nama_lengkap}</p>
                    <p className="text-xs text-gray-500">
                      {formatPosisi(item.posisi)} • {item.nomor_induk}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(item.tanggal_masuk)}
                    </p>
                  </div>
                  <div>
                    {item.status_aktif ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        Aktif
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        Non-Aktif
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">Belum ada data karyawan</p>
            )}
          </div>
        </div>

        {/* Pelamar Terbaru */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Briefcase size={20} className="text-purple-600" />
            Pelamar Terbaru
          </h3>
          <p className="text-sm text-gray-500 mb-4">Pelamar yang Baru Mendaftar</p>
          <div className="space-y-3">
            {recent_data.rekruitmen?.length > 0 ? (
              recent_data.rekruitmen.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{item.nama}</p>
                    <p className="text-xs text-gray-500">
                      {formatPosisi(item.posisi_dilamar)}
                    </p>
                    {item.lowongan_info && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        {item.lowongan_info.lokasi_kerja}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  <div>{getStatusBadge(item.status_terima)}</div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">Belum ada data pelamar</p>
            )}
          </div>
        </div>

        {/* Penggajian Terbaru */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Penggajian Terbaru
          </h3>
          <p className="text-sm text-gray-500 mb-4">Data Gaji Terakhir Diproses</p>
          <div className="space-y-3">
            {recent_data.penggajian?.length > 0 ? (
              recent_data.penggajian.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.nama_karyawan}
                    </p>
                    <p className="text-xs text-gray-500">{item.nomor_induk}</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      {formatRupiah(item.upah_diterima)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(item.gajian_bulan)}
                    </p>
                  </div>
                  <div>
                    {item.status_penggajian ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        Selesai
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">Belum ada data penggajian</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;