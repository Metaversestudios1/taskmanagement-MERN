import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddEmployee = () => {
  const [mobileValid, setMobileValid] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    password: "",
    contact_number: "",
    role: "",
  };
  const [data, setData] = useState(initialState);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);
  const fetchRoles = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getrole`);
    const response = await res.json();
    if (response.success) {
      setRoles(response.result);
    }
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(data.contact_number)) {
      setMobileValid("Please enter a valid Phone Number.");
      return 
    } else {
      setMobileValid("");
      // Submit the form or handle the valid input
    }
    if (!data.email.includes("@") || !data.email.split("@")[1].includes(".")) {
      setError("Email is not valid");
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertemployee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
        setMobileValid("");
        toast.success("New user is added Successfully!", {
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
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoBack = () => {
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
          <div className="text-xl font-bold mx-2 my-8">Add Employee</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Full Name<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="name"
                value={data.name}
                onChange={handleChange}
                type="text"
                id="name"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="John"
                required
              />
            </div>

            <div>
              <label
                htmlFor="contact"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Phone number<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="contact_number"
                value={data.contact_number}
                onChange={handleChange}
                type="text"
                id="contact"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="123-45-678"
                required
              />
              {mobileValid && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {mobileValid}
                </p>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Email address<span className="text-red-900 text-lg ">&#x2a;</span>
            </label>
            <input
              name="email"
              value={data.email}
              onChange={handleChange}
              type="email"
              id="email"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="john.doe@company.com"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Role<span className="text-red-900 text-lg ">&#x2a;</span>
            </label>
            <select
              name="role"
              value={data?.role}
              onChange={handleChange}
              required
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 mb-5"
            >
              <option value="">Select a role</option>
              {roles.map((option) => {
                return (
                  <option
                    key={option._id}
                    value={option._id}
                    className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  >
                    {option.role}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Password<span className="text-red-900 text-lg ">&#x2a;</span>
            </label>
            <input
              name="password"
              value={data.password}
              onChange={handleChange}
              type="password"
              id="password"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="•••••••••"
              required
            />
          </div>
          {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
          <button
            type="submit"
            onClick={handleSubmit}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            ADD
          </button>
        </form>
      </div>
    </>
  );
};

export default AddEmployee;

//  <div
//           aria-label="Loading..."
//           role="status"
//           class="flex items-center justify-center space-x-2 mx-5"
//         >
//           <svg
//             class="h-12 w-12 animate-spin stroke-gray-500"
//             viewBox="0 0 256 256"
//           >
//             <line
//               x1="128"
//               y1="32"
//               x2="128"
//               y2="64"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="195.9"
//               y1="60.1"
//               x2="173.3"
//               y2="82.7"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="224"
//               y1="128"
//               x2="192"
//               y2="128"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="195.9"
//               y1="195.9"
//               x2="173.3"
//               y2="173.3"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="128"
//               y1="224"
//               x2="128"
//               y2="192"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="60.1"
//               y1="195.9"
//               x2="82.7"
//               y2="173.3"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="32"
//               y1="128"
//               x2="64"
//               y2="128"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="60.1"
//               y1="60.1"
//               x2="82.7"
//               y2="82.7"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//           </svg>
//         </div>
