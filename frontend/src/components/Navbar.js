import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { CgLogOut } from "react-icons/cg";
import { PiLineVerticalThin } from "react-icons/pi";

import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "./utils/getUserFromToken";
const Navbar = ({ toggleSideBar }) => {
  const navigate = useNavigate();
  const userInfo = getUserFromToken();
  const now = new Date();
  const [checkInValue, setCheckInValue] = useState(true);
  const [date, setDate] = useState(new Date(now.getTime() - now.getTimezoneOffset() * 60000));
  const [emp_id, setEmpId] = useState(userInfo.id);
  const [check_in, setcheckIn] = useState(new Date(now.getTime() - now.getTimezoneOffset() * 60000));
  const [isMidnight, setIsMidnight] = useState(false);
  // const initialState = {
  //   date: new Date(),
  //   check_in: new Date(),
  //   check_out: 0,
  //   emp_id: "",
  //   working_hours: 0,
  //   attendance_status: "",
  // };
  // const [data, setData] = useState(initialState);

  const token = Cookies.get("jwt");
 
  useEffect(() => {
    // Function to change state at midnight
    const changeStateAtMidnight = () => {
      setIsMidnight(true);
      localStorage.removeItem("status");
      localStorage.removeItem("message");
    };

    // Calculate time until midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set time to 00:00:00

    const timeUntilMidnight = midnight.getTime() - now.getTime();
    // Set a timeout to change the state at midnight
    const timeoutId = setTimeout(() => {
      changeStateAtMidnight();

      // Set an interval to trigger every 24 hours after that
      setInterval(changeStateAtMidnight, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    // Clean up the timeout and interval on component unmount

    fetchCheckInRecord();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchCheckInRecord = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleattendence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userInfo.id }),
    });
    const response = await res.json();
    if (
      response.success &&
      !response.result.check_out
    ) {
      setCheckInValue(false);
    } 
  };

  const handleLogout = async () => {
    try {
      // Perform logout logic (e.g., API call to logout)
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include", // Send cookies with the request
      });
      const response = await res.json();
      if (response.status) {
        Cookies.remove("jwt");
        toast.success(response.message, {
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
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCheckIn = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertattendence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, emp_id, check_in }),
    });
    const response = await res.json();
    if (response.success) {
      setCheckInValue(false);
      toast.success("You are Check In!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleCheckOut = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateattendence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emp_id: userInfo.id, date: new Date() }),
    });
    const response = await res.json();
    console.log(response);
    if (response.success) {
      localStorage.setItem("status", "true");
      localStorage.setItem("message", "Your status is recorded. Thank you!");
      toast.success("You are Check Out!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate(0);
    }
  };
  return (
    <header className="flex flex-wrap justify-start  z-50 w-full text-sm shadow-lg">
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
      <nav
        className="relative w-full bg-white border border-gray-200  px-4 flex items-center justify-between py-6 "
        aria-label="Global"
      >
        <div className="flex items-center ">
          <div className="md:hidden" onClick={toggleSideBar}>
            <button
              type="button"
              className="hs-collapse-toggle size-8 flex justify-center items-center text-sm font-semibold rounded-full border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700"
              data-hs-collapse="#navbar-collapse-with-animation"
              aria-controls="navbar-collapse-with-animation"
              aria-label="Toggle navigation"
            >
              <svg
                className="hs-collapse-open:hidden flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="hs-collapse-open:block hidden flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18" />
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="navbar-collapse-with-animation"
          className="hs-collapse  overflow-hidden transition-all duration-300 "
        >
          <div className="flex flex-row items-center justify-end ">
            <div className="mx-3">
              {checkInValue && localStorage.getItem("status") !== "true" ? (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="text-white bg-purple-500 hover:bg-purple-800   rounded-full text-[14px] font-bold px-5 py-2.5 text-center "
                >
                  CheckIn
                </button>
              ) : (
                <button
                  type="button"
                  className={`${
                    localStorage.getItem("status") === "true" && "hidden"
                  } text-white  bg-red-500 hover:bg-red-800  rounded-full text-[14px] font-bold px-5 py-2.5 text-center`}
                  onClick={handleCheckOut}
                >
                  CheckOut
                </button>
              )}
              <div className="text-lg ">
                {localStorage.getItem("status") === "true" &&
                  localStorage.getItem("message")}
              </div>
            </div>
            {!token ? (
              <NavLink
                className="flex items-center  font-medium text-black hover:text-blue-600 md:border-s md:border-gray-300 "
                to="/login"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Log in
              </NavLink>
            ) : (
              <>
              <PiLineVerticalThin className="mx-2 text-2xl"/>
              <button
              onClick={handleLogout}
              className="flex items-center text-lg  font-medium text-black hover:text-blue-600 "
              >
              <CgLogOut className="text-xl mx-2"/>              
                Logout
              </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
