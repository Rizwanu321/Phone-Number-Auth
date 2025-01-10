import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { db } from "../../firebase";
import { setUser, setError } from "../../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpImg from "../../assets/Rectangle 20.png";
import { doc, setDoc } from "firebase/firestore";
import "./index.css";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  termsAccepted: Yup.boolean().oneOf([true], "You must accept the terms"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.phoneNumber) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const userData = {
        ...user,
        ...values,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userData.uid), userData);
      dispatch(setUser(userData));

      toast.success("Account created successfully!", {
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
    } catch (err) {
      console.error("Registration error:", err);
      dispatch(setError("Failed to create account. Please try again."));
      toast.error("Failed to create account. Please try again.", {
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
    }
  };

  return (
    <div className="register-container">
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
      <div className="register-image-section">
        <img src={SignUpImg} alt="Sign Up" className="register-image" />
      </div>
      <div className="register-form-container">
        <h2 className="signup-txt">Sign up</h2>
        <p className="signup-desc">
          Let's get you all set up so you can access your personal account.
        </p>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            termsAccepted: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
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
            <form onSubmit={handleSubmit} className="form-signup-container">
              <div className="first-last-container">
                <div className="firstname-container">
                  <input
                    type="text"
                    name="firstName"
                    className={`signup-input-field first-input-field ${
                      errors.firstName && touched.firstName ? "error" : ""
                    }`}
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label className="r-placeholder">First Name</label>
                  {errors.firstName && touched.firstName && (
                    <div className="error-text">{errors.firstName}</div>
                  )}
                </div>
                <div className="lastname-container">
                  <input
                    type="text"
                    name="lastName"
                    className={`signup-input-field last-input-field ${
                      errors.lastName && touched.lastName ? "error" : ""
                    }`}
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label className="r-placeholder">Last Name</label>
                  {errors.lastName && touched.lastName && (
                    <div className="error-text">{errors.lastName}</div>
                  )}
                </div>
              </div>
              <div className="email-container">
                <input
                  type="email"
                  name="email"
                  className={`signup-input-field email-input-field ${
                    errors.email && touched.email ? "error" : ""
                  }`}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label className="r-placeholder">Email</label>
                {errors.email && touched.email && (
                  <div className="error-text">{errors.email}</div>
                )}
              </div>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  className="checkbox-field"
                  checked={values.termsAccepted}
                  onChange={handleChange}
                />
                <p className="checkbox-txt">
                  I agree to all the <span className="box-span">Terms</span> and{" "}
                  <span className="box-span">Privacy Policies</span>
                </p>
              </div>
              {errors.termsAccepted && touched.termsAccepted && (
                <div className="error-text err">{errors.termsAccepted}</div>
              )}

              <div className="btn-container">
                <button
                  type="submit"
                  className="btn-create"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Creating Account..." : "Create account"}
                </button>
                <p className="login-text">
                  Already have an account?{" "}
                  <span
                    className="login-link"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
