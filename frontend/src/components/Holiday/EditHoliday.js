import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from 'jquery';
// import 'jquery-validation'; // Ensure the validation plugin is also importe
import 'jquery-validation'; 
const EditHoliday = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialState = {
    date: '',
    reason: "",
    day: "",
    month: "",
  };
  const [oldData, setOldData] = useState(initialState);
  const [error, setError] = useState("");
  const [holiday, setHoliday] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchOldData();
    fetchAllHoliday();
  }, []);

  // Separate validation function
const validateHolidayForm = () => {
    // Initialize jQuery validation
    $("#holidayform").validate({
      rules: {
        date: {
          required: true
        },
        day: {
          required: true
        },
        reason: {
          required: true
        },
        month: {
          required: true
        }
      },
      messages: {
        day: {
          required: "Please enter day"
        },
        date: {
          required: "Please enter date"
        },
        reason: {
          required: "Please enter reason"
        },
        month: {
          required: "Please enter month"
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
    return $("#holidayform").valid();
  };
  
  const fetchOldData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleholiday`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      if (response.result) {
        const date = new Date(response.result.date);
        const formattedDate = date.toISOString().split('T')[0]; // Convert to yyyy-mm-dd
        setOldData({
          date: formattedDate,
          day: response.result.day,
          reason: response.result.reason,
          month: response.result.month,
        });
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Error fetching old data:", error);
    }
  };
  

  const fetchAllHoliday = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllholiday`);
      const response = await res.json();
      if (response.success) {
        setHoliday(response.result);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateHolidayForm()) {
        //setError("Please fill in all required fields.");
        return;
      }
      setLoader(true);
    try {
        const updateData = { id, oldData };
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateholiday`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData), // Spread oldData into the body
      });
      const response = await res.json();
      if (response.success) {
        setLoader(false);
        toast.success('Holiday is updated successfully!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        // Uncomment if you want to navigate after successful update
         setTimeout(() => navigate("/holiday"), 1500);
      } else {
        setError(response.message || "Failed to update holiday.");
      }
    } catch (error) {
      console.error("Error updating holiday:", error);
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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Holiday</div>
        </div>
        {loader && <div className="absolute h-full w-full top-64  flex justify-center items-center"><div
        className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>}
      </div>

      <div className="w-[70%] m-auto my-10">
        <form id="holidayform" onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Date<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="date"
                value={oldData.date} // Added value
                onChange={handleChange}
                type="date"
                id="date"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="reason" className="block mb-2 text-sm">
                Reason<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="reason"
                value={oldData.reason} // Added value
                onChange={handleChange}
                type="text"
                id="reason"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="day" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Day<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="day"
                value={oldData.day} // Added value
                onChange={handleChange}
                type="text"
                id="day"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="month" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Month<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="month"
                value={oldData.month} // Added value
                onChange={handleChange}
                type="text"
                id="month"
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
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditHoliday;
