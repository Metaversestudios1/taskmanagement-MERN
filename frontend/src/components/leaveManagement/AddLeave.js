import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "../utils/getUserFromToken";
import $ from "jquery";
import 'jquery-validation';

const AddLeave = () => {
  const { id } = getUserFromToken();
  const navigate = useNavigate();
    const leaveTypes = [
        {name: "sick leave", id:1},
        {name: "casual leave", id:2},
    ]
  const initialState = {
    leave_from: "",
    leave_to: "",
    reason: "",
    remarks: "",
    no_of_days: "",
    leave_type: "",
    emp_id : id
  };

  const [data, setData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setData({ ...data, [name]: value });
  };

  const validateleaveForm = () => {
    // Initialize jQuery validation
    $("#leaveform").validate({
      rules: {
        leave_from: {
          required: true
        }, 
        leave_to: {
          required: true
        }, 
        leave_type: {
          required: true
        }, 
        no_of_days: {
          required: true
        }, 
        reason: {
          required: true
        }, 
        
             
      },
      messages: {
        leave_from: {
          required: "Please select leave from date"
        },     
        leave_to: {
          required: "Please select leave to date"
        },     
      
        leave_type: {
          required: "Please select leave type"
        },  
        no_of_days: {
          required: "Please enter number of day's "
        },
        reason: {
          required: "Please enter reason"
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
    return $("#leaveform").valid();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateleaveForm()) {
      // setError("Please fill in all required fields.");
        return;
      }
  
   
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertleave`, {
      method: "POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(data),
    });

    const response = await res.json();
    console.log(response)
    if (response.success) {
      toast.success("New Leave is added Successfully!", {
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
        navigate("/leaverequests");
      }, 1500);
    }
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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Add Leave</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form onSubmit={handleSubmit} id="leaveform" encType="multipart/form-data">
          
          <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="">
            <label
              htmlFor="leave_from"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Leave from
            </label>
            <input
              name="leave_from"
              value={data?.leave_from}
              onChange={handleChange}
              type="date"
              id="leave_from"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
            />
          </div>
          <div className="">
            <label
              htmlFor="leave_to"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
            Leave to
            </label>
            <input
              name="leave_to"
              value={data?.leave_to}
              onChange={handleChange}
              type="date"
              id="leave_to"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
            />
          </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="leavetype"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Leave type
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <select
                name="leave_type"
                value={data?.leave_type}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                
              >
                <option value="">Choose leave type</option>
                {leaveTypes.map((option) => {
                  return (
                    <option
                      key={option.id}
                      value={option.name}
                      className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    >
                      {option.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="">
              <label
                htmlFor="no_of_days"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                No of days<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="no_of_days"
                value={data?.no_of_days}
                onChange={handleChange}
                type="text"
                id="no_of_days"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the Number of days"
                
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Reason<span className="text-red-900 text-lg ">&#x2a;</span>
            </label>
            <input
              name="reason"
              value={data?.reason}
              type = "text"
              onChange={handleChange}
              id="reason"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Reason for leave"
              
            />
          </div>
          
          <div className="mb-6">
            <label
              htmlFor="remarks"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Remarks
            </label>
            <textarea
              name="remarks"
              value={data?.remarks}
              onChange={handleChange}
              rows={2}
              id="remarks"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
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

export default AddLeave;
