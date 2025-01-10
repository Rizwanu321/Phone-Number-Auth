import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const userData = localStorage.getItem("user");
      if (!userData) {
        navigate("/login");
      }
    }
    setIsLoading(false);
  }, [user, navigate]);

  if (isLoading) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
