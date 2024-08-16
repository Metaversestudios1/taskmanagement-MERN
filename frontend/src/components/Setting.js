import React, { useState} from "react";
import getUserFromToken from "./utils/getUserFromToken";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Setting = () => {
  const userData = getUserFromToken();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!oldPassword || !newPassword || !confirmPassword) {
      setError("Please Provide all the fields")
      return 
    }
    if (oldPassword === newPassword) {
      setError("New password must be different");
      return;
    }
    if(newPassword!==confirmPassword) {
      setError("Confirm Password doesn't match!")
      return 
    }
    const confirmation = window.confirm(
      "Are you sure want to change the Password."
    );
    if (confirmation) {
      try {
        const res = await fetch("http://localhost:3000/api/changePassword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userData.id, oldPassword, newPassword }),
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
            navigate(0);
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
      <div className="flex items-center">
        <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div>
        <div className="text-xl font-bold mx-2 my-8">Account Setting</div>
      </div>
      <div className="flex flex-col items-center justify-center w-[70%] m-auto">
        <div className="text-2xl my-5 font-light ">Change Password</div>
        <form className="w-[60%]">
          <div className="my-4">
            <label
              htmlFor="oldPassword"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Old Password"
              required
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="newPassword"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="New Password"
              required
            />
          
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Confirm Password"
              required
            />
            
          
          </div>
          {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}

          <button
            type="submit"
            onClick={handleSubmit}
            className="my-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
