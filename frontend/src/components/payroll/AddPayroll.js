import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "../utils/getUserFromToken";
import $ from "jquery";
import "jquery-validation";

const AddPayroll = () => {
  const userInfo = getUserFromToken();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState(null);

  const initialState = {
    emp_id: "",
    salary: "",
    designation: "",
  };
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    if (userInfo.role === "Admin" || userInfo.role === "admin") {
      fetchPayrolls();
    }
  }, []);

  useEffect(() => {
    if(payrolls){

      fetchEmployees();
    }
  }, [payrolls]);

  const fetchEmployees = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getemployee`);
    const response = await res.json();
    console.log(response)
    if (response.success) {
      // Filter employees that do not have a payroll entry
      const employeesWithoutPayroll = response.result.filter(
        (employee) =>
          !payrolls.some((payroll) => payroll.emp_id.toString() === employee._id.toString())
      );
      
      console.log(employeesWithoutPayroll)
      setEmployees(employeesWithoutPayroll);
    }
  };
  
  const fetchPayrolls = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllPayroll`);
    const response = await res.json();
    console.log(response)
    if (response.success) {
      setPayrolls(response.result);
    }
  };
  
  const validatePayrollForm = () => {
    $("#payrollform").validate({
      rules: {
        emp_id: {
          required: true,
        },
        salary: {
          required: true,
        },
        designation: {
          required: true,
        },
      },
      messages: {
        emp_id: {
          required: "Please Select employee name",
        },
        salary: {
          required: "Please enter salary",
        },
        designation: {
          required: "Please enter designation",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element.parent());
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    // Return validation status
    return $("#payrollform").valid();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePayrollForm()) {
      return;
    }
    setLoader(true);
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertpayroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    if (response.success) {
      setLoader(false);
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

  return (
    <>
      <div className="flex items-center relative">
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Add Payroll</div>
        </div>
        {loader && (
          <div className="absolute h-full w-full top-64  flex justify-center items-center">
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
      </div>

      <div className="w-[70%] m-auto my-10">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          id="payrollform"
        >
          <div className="mb-1">
            <label
              htmlFor="employees"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black  m-auto"
            >
              Select an Employee
              <span className="text-red-900 text-lg ">&#x2a;</span>
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
          <div className="mb-1">
            <label
              htmlFor="salary"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Salary<span className="text-red-900 text-lg ">&#x2a;</span>
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

          <div className="mb-1">
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
              placeholder="Enter the designation"
            />
          </div>

          <button
            type="submit"
            className="my-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            ADD
          </button>
        </form>
      </div>
    </>
  );
};

export default AddPayroll;
