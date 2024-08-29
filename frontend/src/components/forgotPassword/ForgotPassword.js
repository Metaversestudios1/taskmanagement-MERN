import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const ForgotPassword = () => {
  const [verifyEmail, setEmailVerify] = useState(false);
  const [verifyOtp, setOtpVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
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

  const handleEmailVerify = async(e) =>{
    e.preventDefault()
    setEmailVerify(true)
  }
  const handleOtpVerify = async(e) =>{
    e.preventDefault()
    setOtpVerify(true)
  }

  return (
    <div>
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
                      for="email"
                      className="block text-sm font-bold ml-1 mb-2 "
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
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
                    Confirm
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
              type="submit"
              className=" my-2 mx-7 py-3 px-4  rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm "
              >
                Reset Password
              </button>
              </div>
              </>
              )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
