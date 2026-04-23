import {
  Home,
  Users,
  DollarSign,
  UserPlus,
  LogOut,
  Banknote,
  Contact,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import api from "../../services/api";
import { showError, succesError } from "../../utils/notify";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      match: ["/rekrutmen", "/create-rekrutmen", "/detail-lowongan", "/update-lowongan", "/daftar-pelamar"],
    },
    { icon: Contact, label: "Kontak", path: "/admin/kontak", match: ["/admin/kontak",] },
  ];

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

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Yakin logout?");
    if (!confirmLogout) return;

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

  const location = useLocation();

  const isMenuActive = (item) => {
    if (item.match) {
      return item.match.some((p) => location.pathname.startsWith(p));
    }
    return location.pathname === item.path;
  };

  return (
    <>
      <aside className="hidden md:flex w-64 h-screen bg-gradient-to-b from-cyan-600 to-cyan-700 text-white flex-col fixed">
        <div className="p-6 border-b border-cyan-500">
          <h1 className="text-xl font-bold">Manajemen SDM</h1>
          <p className="text-sm text-cyan-100">Admin Panel</p>
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={() =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg ${
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-cyan-700 flex items-center justify-center font-bold">
                {getInitials(user?.name)}
              </div>
              <div>
                <p className="text-sm">{user?.name || "User"}</p>
                <p className="text-xs text-cyan-100">Admin</p>
              </div>
            </div>

            <button onClick={handleLogout}>
              {isLoggingOut ? (
                <ClipLoader size={18} color="white" />
              ) : (
                <LogOut size={18} />
              )}
            </button>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t flex justify-around py-2 md:hidden z-50">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={() =>
                `flex flex-col items-center text-xs ${
                  isMenuActive(item) ? "text-cyan-600" : "text-gray-500"
                }`
              }
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
