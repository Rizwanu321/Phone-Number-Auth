import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { setLoading, setError } from "../../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../assets/logo.png";
import SecureImg from "../../assets/Frame 4.png";
import "./index.css";

const phoneRegExp = /^[0-9]{10}$/;

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(phoneRegExp, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleGetOTP = async (values, { setSubmitting }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const phoneNumber = `+91${values.phoneNumber}`;
      const dummyOTP = Math.floor(100000 + Math.random() * 900000).toString();

      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("dummyOTP", dummyOTP);

      toast.info(`Your OTP is: ${dummyOTP}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => {
          navigate("/verify");
        },
      });
    } catch (err) {
      dispatch(setError("Failed to send OTP. Please try again."));
      toast.error("Failed to send OTP. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="login-container">
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
      <div className="logo-form-container">
        <img src={Logo} alt="Logo" className="logo-img" />
        <div className="login-form">
          <h2 className="login-txt">Login</h2>
          <p className="login-desc">Login to access your travelwise account</p>
        </div>

        <Formik
          initialValues={{ phoneNumber: "" }}
          validationSchema={validationSchema}
          onSubmit={handleGetOTP}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="form-container">
              <div className="input-container">
                <input
                  type="tel"
                  name="phoneNumber"
                  className={`input-field ${
                    errors.phoneNumber && touched.phoneNumber ? "error" : ""
                  }`}
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="10"
                  disabled={loading}
                />
                <label className="placeholder">Enter mobile number</label>

                {errors.phoneNumber && touched.phoneNumber && (
                  <div className="error-text">{errors.phoneNumber}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn-get-otp"
                disabled={isSubmitting || loading}
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </button>
            </form>
          )}
        </Formik>

        <p className="signup-text">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/register")}>
            Sign up
          </span>
        </p>
      </div>

      <div className="image-section">
        <img src={SecureImg} alt="Login" className="login-image" />
      </div>
    </div>
  );
};

export default Login;
