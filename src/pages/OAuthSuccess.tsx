// src/pages/OAuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("OAuthSuccess: params", params.toString());
    const token = params.get("token");
    const user = { token: token }; 
    console.log("OAuthSuccess: token", token);

    if (token) {
      localStorage.setItem("auth", JSON.stringify(user));
      navigate("/"); // Redirect after storing
    } else {
      // Handle error
      navigate("/login");
    }
  }, []);

  return <div>Redirecting...</div>;
};

export default OAuthSuccess;
