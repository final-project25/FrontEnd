import { Form, Link } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayouts";
import FormRegister from "../../../components/Fragments/Register";

const RegisterPage = () => {
  return (
    <AuthLayout title="Register" type="register">
      <FormRegister />
    </AuthLayout>
  );
};

export default RegisterPage;
