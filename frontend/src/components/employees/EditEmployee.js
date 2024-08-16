import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditEmployee = () => {
  const [loader, setLoader] = useState(false);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const initialState = {
    name: "",
    email: "",
    contact_number: "",
    role: "",
  };
  
  const [oldData, setOldData] = useState(initialState);

  useEffect(() => {
    const fetchOldData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/getesingleemployee`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );
        const result = await response.json();
        if (result.data[0]) { 
          setOldData({
            name: result.data[0]?.name,
            email: result.data[0]?.email,
            contact_number: result.data[0]?.contact_number,
            role: result.data[0]?.role,
          });
        } else {
          console.error("No data found for the given parameter.");
        }
      } catch (error) {
        console.error("Failed to fetch old data:", error);
      }
    };

    const fetchRoles = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getrole`);
      const response = await res.json();
      if (response.success) {
        setRoles(response.result);
      }
    };

    fetchOldData();
    fetchRoles();
  }, [id]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData({
      ...oldData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = { id, oldData };
    setLoader(true);
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updatemployee`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    const res = await response.json();
    if (res.success) {
      setLoader(false);
      toast.success('User is updated Successfully!', {
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
          navigate("/employees");
        }, 1500);
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  return (
    <>
      <div className="flex items-center ">
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
          <IoIosArrowRoundBack
            onClick={handleGoBack}
            className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
          />
        </div>
        <div className="flex items-center">
          <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div>
          <div className="text-xl font-bold mx-2 my-8">Edit Employee</div>
        </div>
      </div>
      {loader ? (
        <div
          aria-label="Loading..."
          role="status"
          className="flex items-center justify-center space-x-2 mx-5"
        >
          <svg
            className="h-12 w-12 animate-spin stroke-gray-500"
            viewBox="0 0 256 256"
          >
            <line
              x1="128"
              y1="32"
              x2="128"
              y2="64"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="195.9"
              y1="60.1"
              x2="173.3"
              y2="82.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="224"
              y1="128"
              x2="192"
              y2="128"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="195.9"
              y1="195.9"
              x2="173.3"
              y2="173.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="128"
              y1="224"
              x2="128"
              y2="192"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="60.1"
              y1="195.9"
              x2="82.7"
              y2="173.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="32"
              y1="128"
              x2="64"
              y2="128"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
            <line
              x1="60.1"
              y1="60.1"
              x2="82.7"
              y2="82.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
          </svg>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Full Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  value={oldData?.name}
                  id="name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Phone number
                </label>
                <input
                  onChange={handleChange}
                  type="tel"
                  name="contact_number"
                  value={oldData?.contact_number}
                  id="phone"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Email address
              </label>
              <input
                onChange={handleChange}
                type="email"
                id="email"
                name="email"
                value={oldData?.email}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Role
              </label>
              <select
                name="role"
                value={oldData.role}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 mb-5"
              >
              <option value="">Select a role</option>
              {roles.map((option) => (
                <option  key={option._id} value={option._id} selected = {oldData.role === option._id}>
             
                    {option.role}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditEmployee;
