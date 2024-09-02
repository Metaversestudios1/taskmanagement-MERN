import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import $ from "jquery";
import 'jquery-validation';
const AddProject = () => {
  const navigate = useNavigate()

  const initialState = {
    name: "",
  };
  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const validateprojectForm = () => {
    // Initialize jQuery validation
    $("#projectform").validate({
      rules: {
        name: {
          required: true
        },      
      },
      messages: {
        name: {
          required: "Please enter project name"
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
    return $("#projectform").valid();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateprojectForm()) {
     // setError("Please fill in all required fields.");
       return;
     }
      setLoader(true)
 
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertproject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.success) {
      setLoader(false)
      toast.success('New Project is added Successfully!', {
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
          navigate("/projects");
        }, 1500);
    }
  };


  const handleGoBack = ()=>{
    navigate(-1)
  }
  return (
    <>
    <div className="flex items-center relative ">
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
          {/* <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div> */}
          <div className="text-xl font-bold mx-2 my-8">Add Project</div>
        </div>
        {loader && <div className="absolute top-64 h-full w-full  flex justify-center items-center"><div
        className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>}
      </div>

    
       
        <div className="relative w-[70%] m-auto my-10">
          <form id="projectform">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Project Name<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  type="text"
                  id="name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Enter the project name"
                  required
                />
              </div>
              </div>

              {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
            <button
            onClick={handleSubmit}
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

export default AddProject;


//  <div
//           aria-label="Loading..."
//           role="status"
//           className="flex items-center justify-center space-x-2 mx-5"
//         >
//           <svg
//             className="h-12 w-12 animate-spin stroke-gray-500"
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