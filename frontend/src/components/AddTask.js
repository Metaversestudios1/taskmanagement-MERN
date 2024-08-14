import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getUserFromToken from "./utils/getUserFromToken";

const AddTask = () => {
  const { id } = getUserFromToken();
  const navigate = useNavigate();
  const initialState = {
    date: "",
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:3000/api/getproject");
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

  const validateTaskTime = (time) => {
    const taskTime = parseFloat(time);
    return (taskTime >= 1 && taskTime <= 3) && (time.match(/^(1(\.0|\.3|\.30)?|2(\.0|\.3|\.30)?|3(\.0|\.3|\.30)?)$/));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTaskTime(data.task_time)) {
      toast.error('Task time should be between 1 and 3, and rounded figures like 1.3 or 1.30 are acceptable.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const res = await fetch("http://localhost:3000/api/inserttask", {
      method: "POST",
      body: formData,
    });

    const response = await res.json();
    if (response.success) {
      toast.success('New Task is added Successfully!', {
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
          <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div>
          <div className="text-xl font-bold mx-2 my-8">Add Task</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Date
              </label>
              <input
                name="date"
                value={data?.date}
                onChange={handleChange}
                type="date"
                id="date"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the task name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="taskname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Task Name
              </label>
              <input
                name="task_name"
                value={data?.task_name}
                onChange={handleChange}
                type="text"
                id="taskname"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the task name"
                required
              />
            </div>
          </div>

          <label
            htmlFor="projectname"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Project Name
          </label>
          <select
            name="project_name"
            value={data?.project_name}
            onChange={handleChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 mb-5"
            required
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
          <div className="mb-6">
            <label
              htmlFor="tasktime"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Task time
            </label>
            <input
              name="task_time"
              value={data?.task_time}
              onChange={handleChange}
              type="text"
              id="tasktime"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the task completion time"
              required
            />
          </div>
          <div className="mb-6">
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
          <div className="mb-6">
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
