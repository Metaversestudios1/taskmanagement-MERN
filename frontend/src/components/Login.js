import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuEyeOff } from "react-icons/lu";
const Login = () => {
  const ref = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [passEye, setPassEye] = useState("");
  const { setAuth } = useContext(AuthContext);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } else {
      setLoading(false);
    }
    fetchRoles();
  }, [token]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email.includes("@") || !email.split("@")[1].includes(".")) {
        setError("Email is not valid");
        return;
      }
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
      {!loading && (
        <div className="font-[sans-serif]">
          <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
              <div className="md:max-w-md w-full px-4 py-4">
                <form>
                  <div className="mb-12">
                    <h3 className="text-gray-800 text-3xl font-extrabold">
                      Log In
                    </h3>
                  </div>

                  <div>
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

                  <div className="mt-8">
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
                          <path
                            d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                            data-original="#000000"
                          ></path>
                        </svg>
                      ) : (
                        <LuEyeOff
                          onClick={handlePasswordType}
                          className="text-lg opacity-25 absolute right-2 cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                  <div className="my-6">
                    <label
                      htmlFor="role"
                      className="block mb-2 text-xs font-medium text-gray-900 "
                    >
                      Role
                    </label>
                    <select
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 mb-5"
                    >
                      <option value="">Select a role</option>
                      {roles.map((option) => {
                        return (
                          <option
                            key={option._id}
                            value={option._id}
                            className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                          >
                            {option.role}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {error && (
                    <div className="text-red-900  text-[17px] text-right">
                      {error}
                    </div>
                  )}
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Log In
                    </button>
                  </div>
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
      )}
    </>
  );
};

export default Login;
