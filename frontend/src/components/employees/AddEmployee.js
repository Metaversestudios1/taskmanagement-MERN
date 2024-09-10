import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const AddEmployee = () => {
  const [loader, setLoader] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [mobileValid, setMobileValid] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const employeeType = [
    {
      id: 1,
      type: "Full time",
    },
    {
      id: 2,
      type: "Part time",
    },
    {
      id: 3,
      type: "Freelancer",
    },
  ];
  const genders = [
    {
      id:1,
      gen:"male"
    },
    {
      id:2,
      gen:"female"
    },
  ]
  const initialState = {
    name: "",
    personal_email: "",
    password: "",
    company_email: "",
    contact_number: "",
    role: "",
    photo: null,
    document: null,
    department: "",
    designation: "",
    employee_type: "",
    shift_timing: "",
    permanent_address: "",
    work_location: "",
    joining_date: "",
    reporting_manager: "",
    date_of_birth: "",
    marriage_anniversary: "",
    nationality: "",
    gender: "",
    experience: "",
    hobbies: "",
    education: "",
    skills: "",
    bank_details: {
      acc_no: "",
      ifsc_code: "",
      acc_holder_name: "",
      bank_name: "",
      branch: "",
    },
  };
  const [data, setData] = useState(initialState);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await fetch(`http://localhost:3000/api/getalldepartment`);
    const response = await res.json();
    if (response.success) {
      setDepartments(response.result);
    }
  };
  const fetchRoles = async () => {
    const res = await fetch(`http://localhost:3000/api/getrole`);
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
    $.validator.addMethod(
      "validPhone",
      function (value, element) {
        return this.optional(element) || /^\d{10}$/.test(value);
      },
      "Please enter a valid 10-digit phone number."
    );

    // Initialize jQuery validation
    $("#employeeform").validate({
      rules: {
        name: {
          required: true,
        },
        personal_email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
        contact_number: {
          required: true,
          validPhone: true, // Apply custom phone number validation
        },
        role: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "Please enter name",
        },
        email: {
          required: "Please enter email",
          email: "Please enter a valid email address",
        },
        password: {
          required: "Please enter password",
        },
        contact_number: {
          required: "Please enter contact details",
          validPhone: "Phone number must be exactly 10 digits", // Custom error message
        },
        role: {
          required: "Please select a role",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    // Return validation status
    return $("#employeeform").valid();
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  // Check if the name includes nested object properties
  if (name.includes("bank_details.")) {
    const [parent, child] = name.split(".");

    setData((prevState) => ({
      ...prevState,
      [parent]: {
        ...prevState[parent],
        [child]: value,
      },
    }));
  } else {
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmployeeForm()) {
      //setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoader(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      console.log(formData)
      const res = await fetch(`http://localhost:3000/api/insertemployee`, {
        method: "POST",
        body: formData,
      });
      const response = await res.json();
      console.log(response)
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
        setLoader(false);
        setError(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData({ ...data, [e.target.name]: file });
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  console.log(data)
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
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="employeeform">
            <h4 className="font-bold my-3">Personal Information: </h4>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
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
                  Phone number
                  <span className="text-red-900 text-lg ">&#x2a;</span>
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
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
                <label
                  htmlFor="personal_email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Email address
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="personal_email"
                  value={data.personal_email}
                  onChange={handleChange}
                  type="email"
                  id="personal_email"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="john.doe@company.com"
                  required
                />
              </div>
              <div className="">
                <label
                  htmlFor="company_email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Company Email address
                </label>
                <input
                  name="company_email"
                  value={data.company_email}
                  onChange={handleChange}
                  type="email"
                  id="company_email"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="john.doe@company.com"
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
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
              <div className="">
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
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="hobbies"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Hobbies
                </label>
                <input
                  name="hobbies"
                  value={data?.hobbies}
                  onChange={handleChange}
                  type="text"
                  id="hobbies"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div className="">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  value={data?.gender}
                  onChange={handleChange}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                >
                  <option value="">Select a gender.</option>
                  {genders.map((option) => {
                    return (
                      <option
                        key={option._id}
                        value={option.gen}
                        className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                      >
                        {option.gen}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="marriage_anniversary"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Marriage Anniversary
                </label>
                <input
                  name="marriage_anniversary"
                  value={data?.marriage_anniversary}
                  onChange={handleChange}
                  type="date"
                  id="marriage_anniversary"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="nationality"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Nationality
                </label>
                <input
                  name="nationality"
                  value={data?.nationality}
                  onChange={handleChange}
                  type="text"
                  id="nationality"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="mb-6">
                <label
                  htmlFor="permanent_address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Permanent Address
                </label>
                <textarea
                  name="permanent_address"
                  value={data?.permanent_address}
                  onChange={handleChange}
                  type="text"
                  rows={5}
                  id="permanent_address"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="date_of_birth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Date of Birth
                </label>
                <input
                  name="date_of_birth"
                  value={data?.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  id="date_of_birth"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <h4 className="font-bold my-3">Company Information: </h4>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div className="">
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
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
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

              <div className="">
                <label
                  htmlFor="department"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Department
                </label>
                <select
                  name="department"
                  value={data?.department}
                  onChange={handleChange}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                >
                  <option value="">Select a Department.</option>
                  {departments.map((option) => {
                    return (
                      <option
                        key={option?._id}
                        value={option?._id}
                        className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                      >
                        {option?.department_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="designation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Designation
                </label>
                <input
                  name="designation"
                  value={data?.designation}
                  onChange={handleChange}
                  type="text"
                  id="designation"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div className="">
                <label
                  htmlFor="employee_type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Employee type
                </label>
                <select
                  name="employee_type"
                  value={data?.employee_type}
                  onChange={handleChange}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                >
                  <option value="">Select an employee type.</option>
                  {employeeType.map((option) => {
                    return (
                      <option
                        key={option?.id}
                        value={option?.type}
                        className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                      >
                        {option?.type}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="shift_timing"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Shift Timing
                </label>
                <input
                  name="shift_timing"
                  onChange={handleChange}
                  type="text"
                  id="shift_timing"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Ex. 9-6, 10-7"
                />
              </div>
              <div>
                <label
                  htmlFor="reporting_manager"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Reporting Manager
                </label>
                <input
                  name="reporting_manager"
                  value={data?.reporting_manager}
                  onChange={handleChange}
                  type="text"
                  id="reporting_manager"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="work_location"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Work Location
                </label>
                <input
                  name="work_location"
                  value={data?.work_location}
                  onChange={handleChange}
                  type="text"
                  id="work_location"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="joining_date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Joining Date
                </label>
                <input
                  name="joining_date"
                  value={data?.joining_date}
                  onChange={handleChange}
                  type="date"
                  id="joining_date"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="experience"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Experience
                </label>
                <input
                  name="experience"
                  value={data?.experience}
                  onChange={handleChange}
                  type="text"
                  id="experience"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="education"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Education
                </label>
                <input
                  name="education"
                  value={data?.education}
                  onChange={handleChange}
                  type="text"
                  id="education"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="skills"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Skills
                </label>
                <input
                  name="skills"
                  value={data?.skills}
                  onChange={handleChange}
                  type="text"
                  id="skills"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
              <div className="">
                <label
                  htmlFor="document"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Any document
                </label>
                <input
                  name="document"
                  onChange={handleFileChange}
                  type="file"
                  id="photo"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <h4 className="font-bold my-3">Bank details: </h4>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="acc_no"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Account Number
                </label>
                <input
                  name="bank_details.acc_no"
                  value={data?.bank_details?.acc_no}
                  onChange={handleChange}
                  type="text"
                  id="acc_no"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="ifsc_code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  IFSC Code
                </label>
                <input
                  name="bank_details.ifsc_code"
                  value={data?.bank_details?.ifsc_code}
                  onChange={handleChange}
                  type="text"
                  id="ifsc_code"
                  className="bg-gray-200  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="acc_holder_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Account holder name
                </label>
                <input
                  name="bank_details.acc_holder_name"
                  value={data?.bank_details?.acc_holder_name}
                  onChange={handleChange}
                  type="text"
                  id="acc_holder_name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>

              <div>
                <label
                  htmlFor="bank_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Bank Name
                </label>
                <input
                  name="bank_details.bank_name"
                  value={data?.bank_details?.bank_name}
                  onChange={handleChange}
                  type="text"
                  id="bank_name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="branch"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Branch
                </label>
                <input
                  name="bank_details.branch"
                  value={data?.bank_details?.branch}
                  onChange={handleChange}
                  type="text"
                  id="branch"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                />
              </div>
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
      )}
    </>
  );
};

export default AddEmployee;
