import {
  Home,
  Users,
  DollarSign,
  UserPlus,
  BarChart3,
  LogOut,
  Banknote,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
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
    { icon: Users, label: "Karyawan", path: "/karyawan" },
    { icon: Banknote, label: "Tagihan", path: "/tagihan" },
    { icon: DollarSign, label: "Penggajian", path: "/penggajian" },
    { icon: UserPlus, label: "Rekrutmen", path: "/rekrutmen" },
    { icon: BarChart3, label: "Laporan", path: "/laporan" },
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (!confirmLogout) return;

    setIsLoggingOut(true);

    try {
      await api.post("/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      succesError("Logout berhasil");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (error.response?.status === 401) {
        showError("Session telah berakhir");
      } else {
        showError("Terjadi kesalahan saat logout");
      }

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 h-screen bg-linear-to-b from-cyan-600 to-cyan-700 text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-cyan-500">
        <h1 className="text-xl font-bold">Manajemen SDM</h1>
        <p className="text-sm text-cyan-100 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-white text-cyan-700 shadow-md"
                        : "hover:bg-cyan-600 text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-cyan-500">
        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-cyan-700 flex items-center justify-center font-semibold">
              {user ? getInitials(user.name) : "U"}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-cyan-100">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            title="Logout"
          >
            {isLoggingOut ? (
              <ClipLoader color="white" size={18} />
            ) : (
              <LogOut size={18} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
