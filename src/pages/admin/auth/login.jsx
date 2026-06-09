import { Link } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayouts";
import FormLogin from "../../../components/Fragments/Login";

const LoginPage = () => {
  return (
    <AuthLayout title="Selamat Datang" type="login">
      <FormLogin />
    </AuthLayout>
  );
};

export default LoginPage;
