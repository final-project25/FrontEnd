import { Link } from "react-router-dom";

const AuthLayout = (props) => {
  const { children, title, type } = props;
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="w-full max-w-xs">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 py-5">{title}</h1>

        {children}
        <p className="text-sm text-slate-500 mt-4">
          {type === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          {type === "login" ? (
            <Link to="/register" className="font-bold text-blue-600">
              Register disini
            </Link>
          ) : (
            <Link to="/login" className="font-bold text-blue-600">
              Login disini
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
