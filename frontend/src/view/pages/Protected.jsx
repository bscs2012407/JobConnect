import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
const ProtectedAppPage = () => {
  const isLogIn = useSelector((state) => state.auth?.isLoggedIn);
  if (!isLogIn) {
    return <Redirect to="/pages/authentication/login" />;
  }

  return null;
};
export default ProtectedAppPage;