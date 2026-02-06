import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/public/home";

import DashboardLayout from "./components/layouts/AdminDashboard";
import Dashboard from "./pages/admin/Dashboard";
import LoginPage from "./pages/admin/auth/login";
import RegisterPage from "./pages/admin/auth/register";
import KaryawanPage from "./pages/admin/karyawan/Karyawan";
import Laporan from "./pages/admin/laporan/Laporan";
import UpdateKaryawanPage from "./pages/admin/karyawan/UpdateKaryawan";
import DetailKaryawanPage from "./pages/admin/karyawan/DetailKaryawan";
import PenggajianPage from "./pages/admin/Penggajian/Penggajian";
import CreatePenggajianPage from "./pages/admin/Penggajian/CreatePenggajian";
import UpdatePenggajianPage from "./pages/admin/Penggajian/UpdatePenggajian";
import CreateKaryawanPage from "./pages/admin/karyawan/CreateKaryawan";
import DetailPenggajianPage from "./pages/admin/Penggajian/DetailPenggajian";
import ProtectedRoute from "./components/ProtectedRoute";
import TagihanPage from "./pages/admin/tagihan/Tagihan";
import CreateTagihanPage from "./pages/admin/tagihan/CreateTagihan";
import DetailTagihanPage from "./pages/admin/tagihan/DetailTagihan";
import UpdateTagihanPage from "./pages/admin/tagihan/UpdateTagihan";
import RekrutmenPage from "./pages/admin/rekrutmen/Rekrutmen";
import CreateRekrutmenPage from "./pages/admin/rekrutmen/CreateRekrutmen";
import DetailLowonganPage from "./pages/admin/rekrutmen/DetailLowongan";
import UpdateLowonganPage from "./pages/admin/rekrutmen/UpdateLowongan";
import LowonganPublikPage from "./components/landing/lowongan-publik/Lowongan";
import DetailLowonganPublikPage from "./components/landing/lowongan-publik/DetailLowongan";
import CreateLamarPage from "./components/landing/lowongan-publik/CreateLamar";
import DaftarPelamarPage from "./pages/admin/pelamar/Pelamar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Lowongan Publik Routes */}
        <Route path="/lowongan-publik" element={<LowonganPublikPage />} />
        <Route
          path="/lowongan-publik/:id"
          element={<DetailLowonganPublikPage />}
        />
        <Route path="/lamar-pekerjaan/:id" element={<CreateLamarPage />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Karyawan Routes */}
          <Route path="/karyawan" element={<KaryawanPage />} />
          <Route path="/create-karyawan" element={<CreateKaryawanPage />} />
          <Route path="/update-karyawan/:id" element={<UpdateKaryawanPage />} />
          <Route
            path="/detail-karyawan/:id"
            element={<DetailKaryawanPage />}
          />{" "}
          {/* Tagihan Routes */}
          <Route path="/tagihan" element={<TagihanPage />} />
          <Route path="/create-tagihan" element={<CreateTagihanPage />} />
          <Route path="/detail-tagihan/:id" element={<DetailTagihanPage />} />
          <Route path="/update-tagihan/:id" element={<UpdateTagihanPage />} />
          {/* Penggajian Routes */}
          <Route path="/penggajian" element={<PenggajianPage />} />
          <Route path="/create-penggajian" element={<CreatePenggajianPage />} />
          <Route
            path="/update-penggajian/:id"
            element={<UpdatePenggajianPage />}
          />
          <Route
            path="/detail-penggajian/:id"
            element={<DetailPenggajianPage />}
          />
          {/* Rekrutmen Routes */}
          <Route path="/rekrutmen" element={<RekrutmenPage />} />
          <Route path="/create-rekrutmen" element={<CreateRekrutmenPage />} />
          <Route path="/detail-lowongan/:id" element={<DetailLowonganPage />} />
          <Route path="/update-lowongan/:id" element={<UpdateLowonganPage />} />
          {/* Pelamar Routes */}
          <Route path="/daftar-pelamar/:id" element={<DaftarPelamarPage />} />
          {/* Laporan Routes */}
          <Route path="/laporan" element={<Laporan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
