import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "../utils/getUserFromToken";

const EditTask = () => {
  const userInfo = getUserFromToken();
  const { id } = useParams();
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
    emp_id: userInfo.id,
  };

  const [projects, setProjects] = useState([]);
  const [oldData, setOldData] = useState(initialState);

  useEffect(() => {
    fetchOldoldData();
    fetchProjects();
  }, []);
  const fetchOldoldData = async () => {
    const res = await fetch("http://localhost:3000/api/getSingletask", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    if (response.success) {
      setOldData({
        date: (response?.data[0]?.date).split("T")[0],
        task_name: response?.data[0]?.task_name,
        task_time: response?.data[0]?.task_time,
        project_name: response?.data[0]?.project_name,
        backlog: response?.data[0]?.backlog,
        additional_comment: response?.data[0]?.additional_comment,
        plan_for_tommorow: response?.data[0]?.plan_for_tommorow,
        emp_id: response?.data[0]?.emp_id,
      });
    }
  };
  const fetchProjects = async () => {
    const res = await fetch("http://localhost:3000/api/getproject");
    const response = await res.json();
    if (response.success) {
      setProjects(response.result);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData({ ...oldData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setOldData({ ...oldData, attachment: file });
  };

  const validateTaskTime = (time) => {
    const taskTime = parseFloat(time);
    return (
      taskTime >= 1 &&
      taskTime <= 3 &&
      time.match(/^(1(\.0|\.3|\.30)?|2(\.0|\.3|\.30)?|3(\.0|\.3|\.30)?)$/)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTaskTime(oldData.task_time)) {
      toast.error(
        "Task time should be between 1 and 3, and rounded figures like 1.3 or 1.30 are acceptable.",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      return;
    }

    const formData = new FormData();
    Object.keys(oldData).forEach((key) => {
      formData.append(key, oldData[key]);
    });

    const res = await fetch(`http://localhost:3000/api/updatetask/${id}`, {
      method: "PUT",
      body: formData,
    });

    const response = await res.json();
    if (response.success) {
      toast.success("Task is updated Successfully!", {
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
  console.log(oldData);

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
          <div className="text-xl font-bold mx-2 my-8">Edit Task</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form onSubmit={handleSubmit} encType="multipart/form-oldData">
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
                value={oldData?.date}
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
                Task Name<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="task_name"
                value={oldData?.task_name}
                onChange={handleChange}
                type="text"
                id="taskname"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the task name"
                required
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
                value={oldData?.project_name}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
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
                value={oldData?.task_time}
                onChange={handleChange}
                type="text"
                id="tasktime"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the task completion time"
                required
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
                value={oldData?.backlog}
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
                value={oldData?.plan_for_tommorow}
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
              value={oldData?.additional_comment}
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
              files={oldData?.attachment}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the task completion time"
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save changes
          </button>
        </form>
      </div>
    </>
  );
};

export default EditTask;
