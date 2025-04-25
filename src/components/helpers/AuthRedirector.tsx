// components/helpers/AuthRedirector.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthRedirector: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("AuthRedirector: user", user);

  useEffect(() => {
    if (user && (location.pathname === "/login" || location.pathname === "/signup")) {
      navigate("/", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return null;
};

export default AuthRedirector;
