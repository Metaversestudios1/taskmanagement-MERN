import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "../utils/getUserFromToken";

const AddPayroll = () => {
  const userInfo = getUserFromToken();

  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const initialState = {
    emp_id: "",
    salary: "",
    designation: "",
  };

  const [data, setData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  useEffect(() => {
    if (userInfo.role === "Admin" || userInfo.role === "admin") {
      fetchEmployees();
    }
  }, []);
  const fetchEmployees = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getemployee`);
    const response = await res.json();
    if (response.success) {
      setEmployees(response.result);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertpayroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    if (response.success) {
      toast.success("New Payroll is added Successfully!", {
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
        navigate("/payroll");
      }, 1500);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  console.log(data);
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Add Leave</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-6">
            <label
              htmlFor="employees"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black  m-auto"
            >
              Select an Employee
            </label>
            <select
              name="emp_id"
              value={data?.emp_id}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 m-auto"
            >
              <option value="">Select an employee.</option>
              {employees.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                  className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="salary"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Salary
            </label>
            <input
              name="salary"
              value={data?.salary}
              onChange={handleChange}
              type="text"
              id="salary"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="designation"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Designation<span className="text-red-900 text-lg ">&#x2a;</span>
            </label>
            <input
              name="designation"
              value={data?.designation}
              onChange={handleChange}
              type="text"
              id="designation"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the Number of days"
              required
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            ADD
          </button>
        </form>
      </div>
    </>
  );
};

export default AddPayroll;
