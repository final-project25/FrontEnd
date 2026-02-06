import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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
        setDashboardData(response.data);
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

  const { stats, charts, recent_data, summary } = dashboardData;

  const gajiChartData = charts.gaji.raw_data
    .filter((item) => item.bulan)
    .map((item) => ({
      bulan: item.bulan || "N/A",
      gaji: item.total_gaji,
      tagihan: item.total_tagihan,
    }));

  const pelamarChartData = charts.pelamar.raw_data.map((item) => ({
    bulan: item.bulan,
    pending: parseInt(item.pending),
    diterima: parseInt(item.diterima),
    ditolak: parseInt(item.ditolak),
  }));

  const karyawanPieData = Object.entries(stats.karyawan.by_posisi).map(
    ([key, value]) => ({
      name: key.replace("_", " ").toUpperCase(),
      value: value,
    }),
  );

  const rekrutmenPieData = stats.rekruitmen.by_posisi.map((item) => ({
    name: item.posisi.replace("_", " ").toUpperCase(),
    value: item.total,
  }));

  const COLORS = [
    "#0891b2",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const formatRupiah = (value) => {
    if (!value || value === "0.00") return "Rp 0";
    return `Rp ${parseFloat(value).toLocaleString("id-ID")}`;
  };

  const formatPosisi = (posisi) => {
    return posisi
      .replace("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending",
      },
      diterima: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Diterima",
      },
      ditolak: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" },
      aktif: { bg: "bg-green-100", text: "text-green-700", label: "Aktif" },
      non_aktif: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Non Aktif",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Selamat Datang, Admin! 👋
            </h1>
            <p className="text-cyan-50 text-lg">
              Berikut adalah overview kegiatan perusahaan anda
            </p>
          </div>
          <div className="hidden md:block">
            <Calendar className="w-16 h-16 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium mb-1">
                Total Karyawan
              </p>
              <h3 className="text-4xl font-bold mb-2">
                {stats.karyawan.total}
              </h3>
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
              <p className="text-green-100 text-sm font-medium mb-1">
                Gaji Bulan Ini
              </p>
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
              <p className="text-orange-100 text-sm font-medium mb-1">
                Tagihan Bulan Ini
              </p>
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
              <p className="text-purple-100 text-sm font-medium mb-1">
                Total Pelamar
              </p>
              <h3 className="text-4xl font-bold mb-2">
                {stats.rekruitmen.total}
              </h3>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Lowongan Aktif
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.lowongan.aktif}
              </h3>
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
              <p className="text-gray-600 text-sm font-medium mb-1">
                Pesan Masuk
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.kontak.total}
              </h3>
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
              <p className="text-gray-600 text-sm font-medium mb-1">
                Total Gaji Tahun Ini
              </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Tren Penggajian vs Tagihan
              </h3>
              <p className="text-sm text-gray-500">
                Perbandingan 6 Bulan Terakhir
              </p>
            </div>
          </div>

          {gajiChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gajiChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" style={{ fontSize: "12px" }} />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="gaji"
                  fill="#10b981"
                  name="Total Gaji"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="tagihan"
                  fill="#ef4444"
                  name="Total Tagihan"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Belum ada data penggajian
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Trend Pelamar</h3>
              <p className="text-sm text-gray-500">Status Pelamar per Bulan</p>
            </div>
          </div>

          {pelamarChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pelamarChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" style={{ fontSize: "12px" }} />
                <YAxis style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="Pending"
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="diterima"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Diterima"
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="ditolak"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Ditolak"
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Belum ada data pelamar
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Komposisi Karyawan
          </h3>
          <p className="text-sm text-gray-500 mb-4">Berdasarkan Posisi</p>

          {karyawanPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={karyawanPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {karyawanPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400">
              Belum ada data karyawan
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Distribusi Pelamar
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Berdasarkan Posisi yang Dilamar
          </p>

          {rekrutmenPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={rekrutmenPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rekrutmenPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400">
              Belum ada data rekrutmen
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Users size={20} className="text-cyan-600" />
            Karyawan Terbaru
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            5 Karyawan Terdaftar Terakhir
          </p>

          <div className="space-y-3">
            {recent_data.karyawan && recent_data.karyawan.length > 0 ? (
              recent_data.karyawan.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.nama_lengkap}
                    </p>
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
              <p className="text-center text-gray-400 py-8">
                Belum ada data karyawan
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Briefcase size={20} className="text-purple-600" />
            Status Pelamar Terbaru
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Pelamar yang Baru Mendaftar
          </p>

          <div className="space-y-3">
            {recent_data.rekruitmen && recent_data.rekruitmen.length > 0 ? (
              recent_data.rekruitmen.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.nama}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPosisi(item.posisi_dilamar)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  <div>{getStatusBadge(item.status_terima)}</div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">
                Belum ada data pelamar
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-orange-600" />
            Lowongan Aktif
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Posisi yang Sedang Dibuka
          </p>

          <div className="space-y-3">
            {recent_data.lowongan && recent_data.lowongan.length > 0 ? (
              recent_data.lowongan.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-l-4 border-orange-500"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{item.posisi}</h4>
                    {getStatusBadge(item.status_lowongan)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={14} />
                    <span>{item.lokasi_kerja}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>Deadline: {formatDate(item.deadline_lowongan)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">
                Belum ada lowongan aktif
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
