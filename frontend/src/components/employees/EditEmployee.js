import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation"; // Import the validation plugin
import { IoMdEye } from "react-icons/io";
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
    photo:null,
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
            photo: result.data[0]?.photo,
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
    validateEmployeeForm(); // Initialize validation on mount
  }, [id]);

  useEffect(() => {
    // Re-initialize validation on data change
    validateEmployeeForm();
  }, [oldData]);

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
        email: {
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
    setOldData({
      ...oldData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmployeeForm()) {
      return;
    }
    const formData = new FormData();

    formData.append("oldData", JSON.stringify(oldData));
  
    // Append the employee ID
    formData.append("id", id);
  
    // Append the photo if it's selected
    if (oldData.photo) {
      formData.append("photo", oldData.photo);
    }
  
    setLoader(true);
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updatemployee`, {
      method: "PUT",
      body: formData,
    });
    const res = await response.json();
    if (res.success) {
      toast.success("Employee is updated Successfully!", {
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setOldData({ ...oldData, photo: file });
  };

  const handleDownload = (url) => {
    if (!url) {
      return window.alert("There is no Photo with this employee.");
    }
    console.log(url);
    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/) != null;

    if (isImage) {
      window.open(url, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.substring(url.lastIndexOf("/") + 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Employee</div>
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
                  <option
                    key={option._id}
                    value={option._id}
                    selected={oldData.role === option._id}
                  >
                    {option.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="photo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Profile Picture
              </label>
              {oldData?.photo?.url && (
  <IoMdEye
    onClick={() => handleDownload(oldData?.photo)}
    className="cursor-pointer text-lg"
  />
)}
              <input
                name="photo"
                onChange={handleFileChange}
                type="file"
                id="photo"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the task completion time"
              />
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
