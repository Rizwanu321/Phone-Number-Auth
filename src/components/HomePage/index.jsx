import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../assets/logo.png";
import "./index.css";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          dispatch(setUser(parsedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      onClose: () => {
        localStorage.removeItem("user");
        dispatch(setUser(null));
        navigate("/login");
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="home-container">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <img src={Logo} alt="Logo" className="home-logo-img" />
      <div className="number-container">
        <h1 className="number-txt">{user?.phoneNumber}</h1>
        <button type="button" className="btn-log-out" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default HomePage;
