import { AlertTriangle, Info, LogOut, Trash2, X } from "lucide-react";

/**
 * Modal konfirmasi reusable.
 *
 * Props:
 * - isOpen       : boolean
 * - onConfirm    : () => void
 * - onCancel     : () => void
 * - title        : string
 * - message      : string
 * - confirmText  : string  (default "Ya, Lanjutkan")
 * - cancelText   : string  (default "Batal")
 * - variant      : "danger" | "warning" | "info" | "logout"  (default "danger")
 * - loading      : boolean (nonaktifkan tombol saat proses)
 */
const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    confirmBtn: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  logout: {
    icon: LogOut,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    confirmBtn: "bg-orange-500 hover:bg-orange-600 text-white",
  },
};

const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "danger",
  loading = false,
}) => {
  if (!isOpen) return null;

  const config = variantConfig[variant] ?? variantConfig.danger;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.iconBg}`}>
              <Icon size={20} className={config.iconColor} />
            </div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 pb-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${config.confirmBtn}`}
          >
            {loading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
