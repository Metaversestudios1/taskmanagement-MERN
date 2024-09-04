import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { CgLogOut } from "react-icons/cg";
import { PiLineVerticalThin } from "react-icons/pi";

import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "./utils/getUserFromToken";
import { AuthContext } from "../context/AuthContext";
const Navbar = ({ toggleSideBar }) => {
  const { setAuth } = useContext(AuthContext);
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localDate = new Date(now.getTime() - offset);
  const navigate = useNavigate();
  const userInfo = getUserFromToken();
  const [checkInValue, setCheckInValue] = useState(true);
  const [date, setDate] = useState(localDate);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkInStatus, setCheckInStatus] = useState("");
  const [loader, setLoader] = useState(false);

  const [emp_id, setEmpId] = useState(userInfo?.id);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    "New Activity Added",
    "Your meeting confirmed",
    "Meeting at 3 PM",
  ]);

  const handleButtonClick = () => {
    //alert('ok')
    setShowNotifications(!showNotifications);
  };
  const handleClose = () => {
    setShowNotifications(false);
  };
  const token = Cookies.get("jwt");
  function getCurrentTime() {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'

    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${hours}:${minutesStr} ${ampm}`;

    return timeString;
  }
  useEffect(() => {
    fetchCheckInRecord();
  }, []);
  const currentDate = () => {
    const currentDate = new Date();

    // Get the year, month, and day
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, "0");

    // Format the date as YYYY-MM-DD
    return `${year}-${month}-${day}`;
  };
  const fetchCheckInRecord = async () => {
    setLoader(true);
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleattendence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userInfo?.id, date: currentDate() }),
    });
    const response = await res.json();
    if (response.success && !response?.result?.check_out) {
      setLoader(true);
      setCheckInValue(false);
      setCheckInTime(response.result?.check_in); // Store the check-in date
      setDate(response.result?.date);
    } else if (response.success && response?.result?.check_out) {
      setLoader(true);
      setCheckInValue(false);
      setCheckInStatus("Your status is recorded. Thank You!");
    } else {
      setLoader(true);
      setCheckInValue(true);
    }
  };
  const handleLogout = async () => {
    try {
      // Perform logout logic (e.g., API call to logout)
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include", // Send cookies with the request
        }
      );
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
        setAuth({ isAuthenticated: false, user: null });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getLocationURL = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Replace with actual URL encoding logic if using a real mapping service
            const locationURL = `https://maps.google.com/?q=${latitude},${longitude}`;
            resolve(locationURL);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const handleCheckIn = async () => {
    // const isoCheckIn = date.toISOString();
    const checkIn_location_url = await getLocationURL();
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/insertattendence`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date,
          emp_id,
          check_in: getCurrentTime(),
          checkIn_location_url,
        }),
      }
    );
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
    const checkOut_location_url = await getLocationURL();
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/updateattendence`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emp_id: userInfo?.id,
          date: date,
          checkOut_location_url,
          check_out: getCurrentTime(),
        }),
      }
    );
    const response = await res.json();
    console.log(response);
    if (response.success) {
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
        className="relative w-full bg-white border border-gray-200  px-4 flex items-center justify-between py-3"
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
          {(userInfo?.role === "Employee" || userInfo?.role === "employee") &&
            loader ? (
              <div className="mx-3">
                {checkInValue ? (
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    className="text-white bg-[#032e4e] hover:bg-[#001424]   rounded-full text-[14px] font-bold  text-center h-10 w-28 "
                  >
                    CheckIn
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${
                      checkInStatus && "hidden"
                    } text-white  bg-[#032e4e] hover:bg-[#001424]  rounded-full text-[14px] font-bold text-center h-10 w-28`}
                    onClick={handleCheckOut}
                  >
                    CheckOut
                  </button>
                )}
                <div className="text-lg ">{checkInStatus && checkInStatus}</div>
              </div>
            ) : (userInfo.role==="Employee" || userInfo.role==="employee") && (
              <div className="flex justify-center items-center">
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
            <div className="relative inline-block mx-2">
              <button
                id="notificationButton"
                className="text-2xl"
                onClick={handleButtonClick}
                style={{ color: "rgb(21, 101, 192)" }}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0.7"
                  viewBox="0 0 24 24"
                  className="text-xl"
                  height="2em"
                  width="1.5em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22c1.104.005 1.999-.892 2-1.997h-4c.002 1.106.896 2.002 2 1.997zM21.7 17.29l-1.4-1.4V11c0-4.28-2.99-7.99-7-8.72V2c0-.552-.449-1-1-1s-1 .448-1 1v.28C6.99 3.01 4 6.72 4 11v4.89l-1.4 1.4c-.391.391-.601.902-.601 1.41v.3c0 .552.449 1 1 1h18c.552 0 1-.448 1-1v-.3c0-.508-.21-1.019-.6-1.41z"></path>
                </svg>
              </button>

              <span className={`absolute top-[10px] right-1 inline-flex  items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full`}>
                3
              </span>
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
                <PiLineVerticalThin className="mx-2 text-2xl" />
                <button
                  onClick={handleLogout}
                  className="flex items-center text-[16px]  font-medium text-black hover:text-blue-900 "
                >
                  <CgLogOut className="text-lg mx-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        {showNotifications && (
          <div
            className="absolute top-[50px] right-40 w-64 p-4 bg-white border border-gray-300 rounded-lg shadow-lg"
            // style={{ background: "red", zIndex: 1111 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 mt-2 mr-2 text-black p-1 hover:bg-gray-800"
            >
              &times;
            </button>
            <ul>
              {notifications.map((notification, index) => (
                <li key={index} className="mb-2">
                  {notification}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
