import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth(); // Use `user` to check authentication
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;