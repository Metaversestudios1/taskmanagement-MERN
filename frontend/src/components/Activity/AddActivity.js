import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
// import 'jquery-validation'; // Ensure the validation plugin is also importe
import "jquery-validation";

const AddActivity = () => {
  const navigate = useNavigate();
  const initialState = {
    title: "",
    type: "",
    date: "",
    location: "",
    purpose: "",
    organizer: "",
    duration: "",
    comment: "",
  };
  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  // Separate validation function
  const validateactivityForm = () => {
    // Initialize jQuery validation
    $("#activityform").validate({
      rules: {
        date: {
          required: true,
        },
        title: {
          required: true,
        },
        location: {
          required: true,
        },
        purpose: {
          required: true,
        },
      },
      messages: {
        title: {
          required: "Please enter title",
        },
        purpose: {
          required: "Please enter purpose",
        },
        date: {
          required: "Please select date ",
        },
        location: {
          required: "Please enter location/venue/link",
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
    return $("#activityform").valid();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateactivityForm()) {
      // setError("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertevent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
        setError("");
        toast.success("New Activity is added successfully!", {
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
          navigate("/activity");
        }, 1500);
      } else {
        setError(
          response.message || "An error occurred while adding the activity."
        );
      }
    } catch (error) {
      setError("An error occurred while adding the activity.");
      console.error("Error adding activity:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex items-center">
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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">
            Add Acitivity/Events
          </div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form onSubmit={handleSubmit} id="activityform">
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="reason" className="block mb-2 text-sm">
                Title<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                type="text"
                id="title"
                placeholder="Title"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Date<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="date"
                value={data.date}
                onChange={handleChange}
                type="date"
                id="date"
                className="form-control bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="reason" className="block mb-2 text-sm">
                Location/Venue/Link
                <span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="location"
                value={data.location}
                onChange={handleChange}
                type="text"
                id="location"
                placeholder="Location"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="reason" className="block mb-2 text-sm">
                Purpose<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="purpose"
                value={data.purpose}
                onChange={handleChange}
                type="text"
                id="purpose"
                placeholder="Purpose"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>{" "}
            <div>
              <label
                htmlFor="organizer"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Organizer
              </label>
              <input
                name="organizer"
                value={data.organizer}
                onChange={handleChange}
                type="text"
                id="organizer"
                placeholder="Organizer"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div>
              <label
                htmlFor="month"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Duration
              </label>
              <input
                name="duration"
                value={data.duration}
                onChange={handleChange}
                type="text"
                id="duration"
                placeholder="1PM To 4PM "
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div>
              <label
                htmlFor="month"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              > 
                Comments
              </label>
              <input
                name="comments"
                value={data.comment}
                onChange={handleChange}
                type="text"
                id="comment"
                placeholder="Comments"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
          </div>

          {error && <p className="text-red-900 text-[17px] mb-5">{error}</p>}
          <div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ADD
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddActivity;
