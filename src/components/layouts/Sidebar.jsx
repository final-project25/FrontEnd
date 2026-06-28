import {
  Home,
  Users,
  DollarSign,
  UserPlus,
  LogOut,
  Banknote,
  Contact,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import api from "../../services/api";
import { showError, succesError } from "../../utils/notify";
import ConfirmModal from "../Elements/ConfirmModal";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    {
      icon: Users,
      label: "Karyawan",
      path: "/karyawan",
      match: [
        "/karyawan",
        "/create-karyawan",
        "/update-karyawan",
        "/detail-karyawan",
      ],
    },
    {
      icon: Banknote,
      label: "Tagihan",
      path: "/tagihan",
      match: [
        "/tagihan",
        "/create-tagihan",
        "/detail-tagihan",
        "/update-tagihan",
      ],
    },
    {
      icon: DollarSign,
      label: "Penggajian",
      path: "/penggajian",
      match: [
        "/penggajian",
        "/create-penggajian",
        "/update-penggajian",
        "/detail-penggajian",
      ],
    },
    {
      icon: UserPlus,
      label: "Rekrutmen",
      path: "/rekrutmen",
      match: [
        "/rekrutmen",
        "/create-rekrutmen",
        "/detail-lowongan",
        "/update-lowongan",
        "/daftar-pelamar",
      ],
    },
    {
      icon: Contact,
      label: "Kontak",
      path: "/admin/kontak",
      match: ["/admin/kontak"],
    },
    {
      icon: ShieldCheck,
      label: "Kelola Admin",
      path: "/admin/register-admin",
      match: ["/admin/register-admin"],
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      succesError("Logout berhasil");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showError("Session habis / error logout");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const displayName =
    user?.name || user?.username || user?.nama_lengkap || user?.nama || "User";

  const isMenuActive = (item) => {
    if (item.match) {
      return item.match.some((p) => location.pathname.startsWith(p));
    }
    return location.pathname === item.path;
  };

  const activeItem = menuItems.find((item) => isMenuActive(item));

  return (
    <>
      <ConfirmModal
        isOpen={logoutModal}
        variant="logout"
        title="Konfirmasi Logout"
        message="Yakin ingin keluar dari aplikasi?"
        confirmText="Ya, Logout"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModal(false)}
        loading={isLoggingOut}
      />

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden md:flex w-64 h-screen bg-gradient-to-b from-cyan-600 to-cyan-700 text-white flex-col fixed">
        <div className="p-6 border-b border-cyan-500">
          <h1 className="text-xl font-bold">Manajemen SDM</h1>
          <p className="text-sm text-cyan-100">Admin Panel</p>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={() =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isMenuActive(item)
                          ? "bg-white text-cyan-700"
                          : "hover:bg-cyan-600"
                      }`
                    }
                  >
                    <Icon size={20} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-cyan-500">
          <div className="flex items-center justify-between">
            <NavLink
              to="/admin/profil"
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <div className="w-10 h-10 rounded-full bg-white text-cyan-700 flex items-center justify-center font-bold">
                {getInitials(displayName)}
              </div>
              <div>
                <p className="text-sm">{displayName}</p>
                <p className="text-xs text-cyan-100">Admin</p>
              </div>
            </NavLink>
            <button
              onClick={() => setLogoutModal(true)}
              className="hover:opacity-80 transition"
            >
              {isLoggingOut ? (
                <ClipLoader size={18} color="white" />
              ) : (
                <LogOut size={18} />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE TOP NAVBAR ─── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-cyan-600 text-white flex items-center justify-between px-4 h-14 shadow-md">
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1 rounded-lg hover:bg-cyan-500 transition-colors"
          aria-label="Buka menu"
        >
          <Menu size={24} />
        </button>

        {/* Judul halaman aktif */}
        <span className="text-sm font-semibold tracking-wide">
          {activeItem?.label || "Manajemen SDM"}
        </span>

        {/* Avatar profil */}
        <NavLink to="/admin/profil" className="hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-full bg-white text-cyan-700 flex items-center justify-center font-bold text-xs">
            {getInitials(displayName)}
          </div>
        </NavLink>
      </header>

      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ─── MOBILE DRAWER SIDEBAR ─── */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-cyan-600 to-cyan-700 text-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-5 border-b border-cyan-500">
          <div>
            <h1 className="text-lg font-bold">Manajemen SDM</h1>
            <p className="text-xs text-cyan-100">Admin Panel</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1 rounded-lg hover:bg-cyan-500 transition-colors"
            aria-label="Tutup menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Profil user di dalam drawer */}
        <div className="px-5 py-4 border-b border-cyan-500">
          <NavLink
            to="/admin/profil"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 rounded-full bg-white text-cyan-700 flex items-center justify-center font-bold">
              {getInitials(displayName)}
            </div>
            <div>
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-cyan-100">Admin</p>
            </div>
          </NavLink>
        </div>

        {/* Menu navigasi */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isMenuActive(item);
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={() =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                        active
                          ? "bg-white text-cyan-700 shadow-sm"
                          : "hover:bg-cyan-500/60 text-white"
                      }`
                    }
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        active ? "bg-cyan-100 text-cyan-700" : "bg-cyan-500/40"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    {item.label}
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout di bawah drawer */}
        <div className="p-4 border-t border-cyan-500">
          <button
            onClick={() => {
              setDrawerOpen(false);
              setTimeout(() => setLogoutModal(true), 300);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-500/60 transition-colors text-sm font-medium"
          >
            {isLoggingOut ? (
              <ClipLoader size={18} color="white" />
            ) : (
              <div className="p-1.5 rounded-lg bg-cyan-500/40">
                <LogOut size={18} />
              </div>
            )}
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;