import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from 'jquery';
// import 'jquery-validation'; // Ensure the validation plugin is also importe
import 'jquery-validation'; 

const AddEmployee = () => {
  const [loader, setLoader] = useState(false)
  const [mobileValid, setMobileValid] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    password: "",
    contact_number: "",
    role: "",
    photo:null
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

  // const validatePhoneNumber = (number) => {
  //   const phoneRegex = /^\d{10}$/;
  //   return phoneRegex.test(number);
  // };
  const validateEmployeeForm = () => {
    // Add custom validation method for phone number
    $.validator.addMethod("validPhone", function(value, element) {
      return this.optional(element) || /^\d{10}$/.test(value);
    }, "Please enter a valid 10-digit phone number.");
  
    // Initialize jQuery validation
    $("#employeeform").validate({
      rules: {
        name: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
        },
        contact_number: {
          required: true,
          validPhone: true  // Apply custom phone number validation
        },
        role: {
          required: true
        }
      },
      messages: {
        name: {
          required: "Please enter name"
        },
        email: {
          required: "Please enter email",
          email: "Please enter a valid email address"
        },
        password: {
          required: "Please enter password"
        },
        contact_number: {
          required: "Please enter contact details",
          validPhone: "Phone number must be exactly 10 digits"  // Custom error message
        },
        role: {
          required: "Please select a role"
        }
      },
      errorElement: 'div',
      errorPlacement: function(error, element) {
        error.addClass('invalid-feedback');
        error.insertAfter(element);
      },
      highlight: function(element, errorClass, validClass) {
        $(element).addClass('is-invalid').removeClass('is-valid');
      },
      unhighlight: function(element, errorClass, validClass) {
        $(element).removeClass('is-invalid').addClass('is-valid');
      }
    });
  
    // Return validation status
    return $("#employeeform").valid();
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmployeeForm()) {
      //setError("Please fill in all required fields.");
      return;
    }
  
    try {
      
      setLoader(true)
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertemployee`, {
        method: "POST",
        body: formData,
      });
      const response = await res.json();
      if (response.success) {
        setMobileValid("");
        toast.success("New employee is added Successfully!", {
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
        setLoader(false)
        setError(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData({ ...data, photo: file });
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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Add Employee</div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center"><div
        className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>
      ) : (
      <div className="w-[70%] m-auto my-10">
        <form id="employeeform">
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
          <div className="mb-6">
            <label
              htmlFor="photo"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Profile Picture
            </label>
            <input
              name="photo"
              onChange={handleFileChange}
              type="file"
              id="photo"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the task completion time"
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
      </div>)}
    </>
  );
};

export default AddEmployee;
