import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { db } from "../../firebase";
import { setUser, setError, setLoading } from "../../store/authSlice";
import { collection, query, where, getDocs } from "firebase/firestore";
import { IoIosArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../../assets/logo.png";
import VerifyImg from "../../assets/Verify.png";
import "./index.css";

const RESEND_COOLDOWN = 60;

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

const VerifyCode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [currentOTP, setCurrentOTP] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const storedOTP = localStorage.getItem("dummyOTP");
    const storedPhone = localStorage.getItem("phoneNumber");
    if (storedOTP && storedPhone) {
      setCurrentOTP(storedOTP);
      setPhoneNumber(storedPhone);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [countdown]);

  const checkUserExists = async (phoneNumber) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          exists: true,
          userData: { id: userDoc.id, ...userDoc.data() },
        };
      }

      return { exists: false, userData: null };
    } catch (err) {
      console.error("Error checking user existence:", err);
      throw err;
    }
  };

  const handleVerify = async (values, { setSubmitting }) => {
    try {
      dispatch(setLoading(true));

      if (values.code !== currentOTP) {
        throw new Error("Invalid verification code");
      }

      const uniqueId = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const { exists, userData } = await checkUserExists(phoneNumber);

      if (exists && userData) {
        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => {
            navigate("/");
          },
        });
      } else {
        const newUserData = {
          uid: uniqueId,
          phoneNumber: phoneNumber,
          isNewUser: true,
          createdAt: new Date().toISOString(),
        };

        dispatch(setUser(newUserData));
        localStorage.setItem("user", JSON.stringify(newUserData));
        toast.success("Verification successful!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => {
            navigate("/register");
          },
        });
      }

      localStorage.removeItem("dummyOTP");
    } catch (err) {
      const errorMessage = err.message || "Invalid verification code.";
      dispatch(setError(errorMessage));
      toast.error(errorMessage, {
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

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      dispatch(setLoading(true));

      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("dummyOTP", newOTP);
      setCurrentOTP(newOTP);

      toast.info(`Your new OTP is: ${newOTP}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.", {
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
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="verify-container">
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
      <img src={Logo} alt="Logo" className="logo-img" />
      <div className="verify-section">
        <div className="verify-form-container">
          <div className="back-container" onClick={() => navigate("/login")}>
            <IoIosArrowBack className="back-icon" size={22} />
            <p className="back">Back to login</p>
          </div>
          <h2 className="verify-txt">Verify Code</h2>
          <p className="verify-desc">
            An authentication code has been sent to your phone.
          </p>
          <div className="otp">Current OTP: {currentOTP}</div>
          <Formik
            initialValues={{ code: "" }}
            validationSchema={validationSchema}
            onSubmit={handleVerify}
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
              <form onSubmit={handleSubmit} className="form-verify">
                <input
                  type="text"
                  name="code"
                  className={`verify-input-field ${
                    errors.code && touched.code ? "error" : ""
                  }`}
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="6"
                />
                <label className="placeholder">Enter Code</label>
                {errors.code && touched.code && (
                  <div className="error-text">{errors.code}</div>
                )}
                <p className="recieve-text">
                  Didn't receive a code?{" "}
                  {countdown > 0 ? (
                    <span className="resend-link">Resend in {countdown}s</span>
                  ) : (
                    <span
                      className="resend-link"
                      onClick={handleResendCode}
                      style={{ cursor: canResend ? "pointer" : "default" }}
                    >
                      Resend
                    </span>
                  )}
                </p>
                <button
                  type="submit"
                  className="btn-verify"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </form>
            )}
          </Formik>
        </div>
        <div className="verify-image-section">
          <img src={VerifyImg} alt="Verify" className="verify-image" />
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
