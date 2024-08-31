import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams, useRoutes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from 'jquery';
// import 'jquery-validation'; // Ensure the validation plugin is also importe
import 'jquery-validation'; 
const Editactivity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialState = {
    date: '',
    title: "",
    location: "",
    purpose: "",
    organizer:"",
    duration:"",
    comment:""
  };
  const [oldData, setOldData] = useState(initialState);
  const [error, setError] = useState("");
  const [loader,setLoader] =useState(false)
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchOldData();
    fetchAllActivity();
  }, []);

  const validateactivityForm = () => {
    // Initialize jQuery validation
    $("#activityform").validate({
      rules: {
        date: {
          required: true
        },
        title: {
          required: true
        },
        location: {
          required: true
        },
        purpose: {
          required: true
        },
      
      },
      messages: {
        title: {
          required: "Please enter title"
        },
        purpose: {
            required: "Please enter purpose"
          },
        date: {
          required: "Please select date "
        },
        location: {
            required: "Please enter location/venue/link"
          },
       
      
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
    return $("#activityform").valid();
  };
  
  const fetchOldData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleevent`, {
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
          title: response.result.title,         
          location:  response.result.location,
          purpose:  response.result.purpose,
          organizer: response.result.organizer,
          duration: response.result.duration,
          comments: response.result.comments
        });
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Error fetching old data:", error);
    }
  };
  

  const fetchAllActivity = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllevent`);
      const response = await res.json();
      if (response.success) {
        setActivity(response.result);
      }
    } catch (error) {
      console.error("Error fetching Activity:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateactivityForm()) {
        //setError("Please fill in all required fields.");
        return;
      }
      setLoader(true);
    try {
        const updateData = { id, oldData };
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateevent`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData), // Spread oldData into the body
      });
      const response = await res.json();
      if (response.success) {
        setLoader(false)
        toast.success('Actitvity is updated successfully!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        // Uncomment if you want to navigate after successful update
         setTimeout(() => navigate("/activity"), 1500);
      } else {
        setError(response.message || "Failed to update Activity.");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Acitivity/Events</div>
        </div>
        {loader && <div className="absolute h-full w-full top-64 flex justify-center items-center"><div
        class=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>}

      </div>

      <div className="w-[70%] m-auto my-10">
        <form id="activityform" onSubmit={handleSubmit}>
       
          <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
                <label htmlFor="reason" className="block mb-2 text-sm">
                Title<span className="text-red-900 text-lg">*</span>
                </label>
                <input
                  name="title"
                  value={oldData.title}
                  onChange={handleChange}
                  type="text"
                  id="title"
                  placeholder="Title"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                />
              </div>
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
                Location/Venue/Link<span className="text-red-900 text-lg">*</span>
                </label>
                <input
                  name="location"
                  value={oldData.location}
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
                  value={oldData.purpose}
                  onChange={handleChange}
                  type="text"
                  id="purpose"
                  placeholder="Purpose"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                />
              </div>              <div>
                <label htmlFor="organizer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Organizer
                </label>
                <input
                  name="organizer"
                  value={oldData.organizer}
                  onChange={handleChange}
                  type="text"
                  id="organizer"
                  placeholder="Organizer"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                />
              </div>
              <div>
                <label htmlFor="month" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Duration
                </label>
                <input
                  name="duration"
                  value={oldData.duration}
                  onChange={handleChange}
                  type="text"
                  id="duration"
                  placeholder="1PM To 4PM "
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                />
              </div>
            <div>
                <label htmlFor="month" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Comments<span className="text-red-900 text-lg"></span>
                </label>
                <input
                  name="comments"
                  value={oldData.comments}
                  onChange={handleChange}
                  type="text"
                  id="comments"
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
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Editactivity;
