import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "../utils/getUserFromToken";
import $ from "jquery";
import 'jquery-validation';

const AddTask = () => {
  const { id } = getUserFromToken();
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months start at 0!
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const initialState = {
    date: getCurrentDate(),
    task_name: "",
    task_time: "",
    project_name: "",
    backlog: "",
    additional_comment: "",
    plan_for_tommorow: "",
    attachment: null,
    emp_id: id,
  };

  const [projects, setProjects] = useState([]);
  const [data, setData] = useState(initialState);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getproject`);
    const response = await res.json();
    if (response.success) {
      setProjects(response.result);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setData({ ...data, attachment: file });
  };

  $.validator.addMethod("validTime", function(value, element) {
    // Regular expression to match numbers between 1 and 3 with up to two decimal places,
    // and ensure that decimal values are not greater than .60
    var isValid = this.optional(element) || /^([1-2](\.\d{1,2})?|3(\.0{1,2})?)$/.test(value);
    
    // Further check if the value has decimal places and those decimal places do not exceed .60
    if (isValid && value.includes(".")) {
        var parts = value.split(".");
        if (parts[1] && parseInt(parts[1], 10) > 60) {
            return false;
        }
    }
    
    return isValid;
}, "Please enter a time between 1 and 3, with up to two decimal places, where decimal values should not exceed .60 minutes.");


  const validattaskForm = () => {
    // Initialize jQuery validation
    $("#taskform").validate({
      rules: {
        date: {
          required: true
        },
        task_name: {
          required: true
        },
        project_name: {
          required: true
        },   
        task_time: {
          required: true,
          validTime:true,
        }, 
           
      },
      messages: {
        date: {
          required: "Please select date"
        }, 
        task_name: {
          required: "Please enter task name"
        },     
        project_name: {
          required: "Please enter project name"
        }, 
      
        task_time: {
          required: "Please enter task time",
          taskvalidation: "Invalid task time. Must be between 1 and 3 hours with up to one decimal place."
     
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
    return $("#taskform").valid();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validattaskForm()) {
      // setError("Please fill in all required fields.");
        return;
      }
  setLoader(true);
    // if (!validTime(data.task_time)) {
    //   toast.error(
    //     "Task time should be between 1 and 3, and rounded figures like 1.3 or 1.30 are acceptable.",
    //     {
    //       position: "top-right",
    //       autoClose: 2000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     }
    //   );
    //   return;
    // }
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/inserttask`, {
      method: "POST",
      body: formData,
    });

    const response = await res.json();
    if (response.success) {
      setLoader(false);
      toast.success("New Task is added Successfully!", {
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
        navigate("/tasks");
      }, 1500);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Add Task</div>
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
        <form onSubmit={handleSubmit} id="taskform" encType="multipart/form-data">
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Date<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="date"
                value={data?.date}
                onChange={handleChange}
                type="date"
                id="date"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the task name"
                
              />
            </div>
            <div>
              <label
                htmlFor="taskname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Task Name<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="task_name"
                value={data?.task_name}
                onChange={handleChange}
                type="text"
                id="taskname"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the task name"
                
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="projectname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Project Name
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <select
                name="project_name"
                value={data?.project_name}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                
              >
                <option value="">Select a project name</option>
                {projects.map((option) => {
                  return (
                    <option
                      key={option._id}
                      value={option._id}
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
                htmlFor="tasktime"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Task time<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="task_time"
                value={data?.task_time}
                onChange={handleChange}
                type="text"
                id="tasktime"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the task completion time"
                
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="">
            <label
              htmlFor="backlog"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Backlog
            </label>
            <input
              name="backlog"
              value={data?.backlog}
              onChange={handleChange}
              type="text"
              id="backlog"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the task completion time"
            />
          </div>
          <div className="">
            <label
              htmlFor="plansfortommorow"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Plans for Tommorow
            </label>
            <input
              name="plan_for_tommorow"
              value={data?.plan_for_tommorow}
              onChange={handleChange}
              type="text"
              id="planfortommorow"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the Plans for tommorow"
            />
          </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="additionalcomment"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Additional comment
            </label>
            <input
              name="additional_comment"
              value={data?.additional_comment}
              onChange={handleChange}
              type="text"
              id="additionalcomment"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Any additional comments"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="attachment"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Attachment
            </label>
            <input
              name="attachment"
              onChange={handleFileChange}
              type="file"
              id="attachment"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the task completion time"
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

export default AddTask;
