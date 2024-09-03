import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuEyeOff } from "react-icons/lu";
import $ from "jquery";
import "jquery-validation";
import { NavLink } from "react-router-dom";

const Login = () => {
  const ref = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [passEye, setPassEye] = useState("");
  const { setAuth } = useContext(AuthContext);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    } else {
      fetchRoles();
    }
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getrole`);
      const response = await res.json();
      if (response.success) {
        setRoles(response.result);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handlePasswordType = (e) => {
    e.preventDefault();
    if (ref.current.type === "text") {
      ref.current.type = "password";
      setPassEye("password");
    } else {
      ref.current.type = "text";
      setPassEye("text");
    }
  };

  const validateLoginForm = () => {
    $("#loginform").validate({
      rules: {
        role: {
          required: true,
        },
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        role: {
          required: "Please select a role",
        },
        email: {
          required: "Please enter email",
          email: "Please enter a valid email address",
        },
        password: {
          required: "Please enter password",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element.parent()); // Insert error after the parent container
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    // Return validation status
    return $("#loginform").valid();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateLoginForm()) {
        return;
      }
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, role }),
      });
      const response = await res.json();
      if (response.success) {
        setLoading(false);
        setError("");
        toast.success("You are logged in Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        Cookies.set("jwt", response.token);
        setAuth({ isAuthenticated: true, user: response.user });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setLoading(false);
        setError(response.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="font-[sans-serif] relative">
      {loading && (
        <div className="absolute z-20 h-full w-full md:right-6 flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
            <div className="md:max-w-md w-full px-4 py-4">
              <form id="loginform">
                <div className="mb-12">
                  <h3 className="text-gray-800 text-3xl font-extrabold">
                    Log In
                  </h3>
                </div>

                {/* Email Field */}
                <div className="mb-6">
                  <label className="text-gray-800 text-xs block mb-2">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Enter email"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-2"
                      viewBox="0 0 682.667 682.667"
                    >
                      <defs>
                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                          <path
                            d="M0 512h512V0H0Z"
                            data-original="#000000"
                          ></path>
                        </clipPath>
                      </defs>
                      <g
                        clipPath="url(#a)"
                        transform="matrix(1.33 0 0 -1.33 0 682.667)"
                      >
                        <path
                          fill="none"
                          strokeMiterlimit="10"
                          strokeWidth="40"
                          d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label className="text-gray-800 text-xs block mb-2">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      ref={ref}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      required
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Enter password"
                    />
                    {passEye === "text" ? (
                      <svg
                        onClick={handlePasswordType}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#bbb"
                        stroke="#bbb"
                        className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                        viewBox="0 0 128 128"
                      >
                        <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.294-32.006C114.557 56.787 95.876 32 64 32c-31.955 0-50.553 24.775-55.294 32.006zM64 76c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12zm0-16c-2.205 0-4 1.794-4 4s1.795 4 4 4 4-1.794 4-4-1.795-4-4-4z"></path>
                      </svg>
                    ) : (
                      <LuEyeOff
                        onClick={handlePasswordType}
                        className="absolute right-2 text-[18px] cursor-pointer"
                      />
                    )}
                  </div>
                </div>

                {/* Role Dropdown */}
                <div className="mb-6">
                  <label className="text-gray-800 text-xs block mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    required
                  >
                    <option value="">Select role</option>
                    {roles.map((r, index) => (
                      <option key={index} value={r._id}>
                        {r.role}
                      </option>
                    ))}
                  </select>
                </div>
                {error && (
                  <div className="text-red-900  text-[17px] text-right">
                    {error}
                  </div>
                )}
                <NavLink to="/forgotpassword">
                  <div className="text-blue-600 text-sm text-right my-2">
                    Forgot Password
                  </div>
                </NavLink>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Log In
                </button>
              </form>
            </div>
            <div className="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8">
              <img
                src="https://readymadeui.com/signin-image.webp"
                className="w-full h-full object-contain"
                alt="login-image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
