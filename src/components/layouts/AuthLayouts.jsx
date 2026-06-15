import { Link } from "react-router-dom";

const AuthLayout = (props) => {
  const { children, title, type } = props;
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="w-full max-w-xs bg-sky-200 rounded-2xl shadow-lg px-8 py-10">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 text-center">{title}</h1>

        {children}
        {/* <p className="text-sm text-slate-600 mt-5 text-center">
          {type === "login" ? "Belum Punya Akun? " : "Sudah punya akun? "}
          {type === "login" ? (
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Register Disini
            </Link>
          ) : (
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Login Disini
            </Link>
          )}
        </p> */}
      </div>
    </div>
  );
};

export default AuthLayout;
