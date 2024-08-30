import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [verifyEmail, setEmailVerify] = useState(false);
  const [verifyOtp, setOtpVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      setOtp(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleEmailVerify = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/sendotp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const response = await res.json();
    if (response.success) {
      toast.success("OTP sent Successfully! It is valid for 10 minutes.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setError("");
      setEmailVerify(true);
      setMinutes(9);
      setSeconds(59);
    } else {
      setError(response.message);
    }
  };
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verifyOtp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const response = await res.json();
    if (response.success) {
      toast.success("OTP verified.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setError("");
      setOtpVerify(true);
      setMinutes(0)
      setSeconds(0)
    } else {
      setError(response.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please Provide all the fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Confirm Password doesn't match!");
      return;
    }
    const confirmation = window.confirm(
      "Are you sure want to change the Password."
    );
    if (confirmation) {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resetPassword`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        });
        const response = await res.json();
        if (response.success) {
          setError("");
          toast.success("Password changed Successfully!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.err(err);
      }
    }
  };

  return (
    <div>
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
      <main
        id="content"
        role="main"
        className="w-full  max-w-md mx-auto p-6 my-10"
      >
        <div className="mt-7 bg-white  rounded-xl shadow-lg border-2 ">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 ">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-600 ">
                Remember your password?
                <NavLink
                  to="/login"
                  className="text-blue-600 decoration-2  font-medium"
                  href="#"
                >
                  Login here
                </NavLink>
              </p>
            </div>

            <div className="mt-5">
              <form>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 "
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        required
                        placeholder="email"
                        aria-describedby="email-error"
                      />
                    </div>
                    <p
                      className="hidden text-xs text-red-600 mt-2"
                      id="email-error"
                    >
                      Please include a valid email address so we can get back to
                      you
                    </p>
                  </div>
                  <button
                    onClick={handleEmailVerify}
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm "
                  >
                    Generate OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
          {verifyEmail && (
            <>
              <div className="flex my-5 mx-7">
                <input
                  type="text"
                  id="otp"
                  onChange={handleChange}
                  name="otp"
                  className="flex-1 py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm  shadow-sm"
                  required
                  placeholder="OTP"
                />
                <button
                  disabled={!otp}
                  onClick={handleOtpVerify}
                  className="flex-[0.2] ml-2 px-6 border-1 bg-green-900 text-white rounded-md"
                >
                  Verify
                </button>
              </div>
            <div className="countdown-text flex flex-col justify-end">
              {seconds > 0 || minutes > 0 ? (
                <p className="text-right mx-2">
                  Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </p>
              ) : (
                !verifyOtp && <p className="text-right mx-2">Didn't recieve code?</p>
              )}
  
              {!verifyOtp && <button
                disabled={seconds > 0 || minutes > 0}
                style={{
                  color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
                }}
                className="text-right mx-2"
                onClick={handleEmailVerify}
              >
                Resend OTP
              </button>}
            </div>
            </>
          )}
          {verifyOtp && (
            <>
              <div className="my-5 mx-7">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-bold ml-1 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={newPassword}
                  onChange={handleChange}
                  className="flex-1 py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm  shadow-sm"
                  placeholder="New Password"
                  required
                />
              </div>
              <div className="my-5 mx-7">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold ml-1 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="flex-1 py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm  shadow-sm"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <div className="flex flex-col">
                <button
                  onClick={handleChangePassword}
                  className=" my-2 mx-7 py-3 px-4  rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm "
                >
                  Reset Password
                </button>
              </div>
            </>
          )}
          {error && (
            <p className="text-red-900  text-[17px] mb-5 mx-7">{error}</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
