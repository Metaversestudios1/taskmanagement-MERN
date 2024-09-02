import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import getUserFromToken from "../utils/getUserFromToken";

const Tasks = () => {
  const userInfo = getUserFromToken();
  const [employee, setEmployee] = useState(
    userInfo.role === "Employee" || userInfo.role === "employee"
      ? userInfo.id
      : ""
  );
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (userInfo.role === "Admin" || userInfo.role === "admin") {
      fetchEmployees();
    }
  }, []);

  useEffect(() => {
    if (employee) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [page, search, employee, startDate, endDate]);

  const fetchEmployees = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getemployee`);
    const response = await res.json();
    if (response.success) {
      setEmployees(response.result);
    }
  };

  const fetchProjectName = async (id) => {
    const projectRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleproject`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const projectData = await projectRes.json();

    return projectData.success ? projectData?.result[0]?.name : "Unknown";
  };

  const fetchTasks = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/gettask?page=${page}&limit=${pageSize}&search=${search}&id=${employee}&startDate=${startDate}&endDate=${endDate}`
    );
    const response = await res.json();
    if (response.success) {
      setNoData(false)
      if(response.result.length===0){
        setNoData(true)
      }
      
      const tasksWithProjectNames = await Promise.all(
        response.result.map(async (task) => {
          const projectName = await fetchProjectName(task.project_name);
          return {
            ...task,
            project_name: projectName,
          };
        })
      );

      // Group tasks by date
      const groupedTasks = tasksWithProjectNames.reduce((acc, task) => {
  
        if (!acc[task.date]) {
          acc[task.date] = [];
        }
        acc[task.date].push(task);
        return acc;
      }, {});
      setTasks(groupedTasks);
      setCount(response.count);
      setLoader(false);
    }
  };

  const handleDelete = async (e, id, date) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the task?"
    );
    if (permissionOfDelete) {
      let taskOne = tasks.length === 1;
      if (count === 1) {
        taskOne = false;
      }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deletetask`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        if (taskOne) {
          setPage(page - 1);
        } else {
          fetchTasks();
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (userInfo.role === "admin" || userInfo.role === "Admin") &&
      name === "employees"
    ) {
      setEmployee(value);
    }
    if (name === "search") {
      setSearch(value);
      setPage(1);
    } else if (name === "startDate") {
      setStartDate(value);
      setPage(1);
    } else if (name === "endDate") {
      setEndDate(value);
      setPage(1);
    }
  };

  const handleDownload = (url) => {
    if (!url) {
      return window.alert("There is no attachment with this task.");
    }
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
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="relative"> 
      <div className="flex items-center">
        <div className="text-2xl font-bold mx-2 my-8 px-4 ">Tasks</div>
      </div>
      <div className="flex justify-between">
        {(userInfo.role === "Employee" || userInfo.role === "employee") && (
          <>
            <NavLink to="/tasks/addtask">
              <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
                Add New
              </button>
            </NavLink>
            <div className={`flex items-center`}>
              <input
                placeholder="Search"
                value={search}
                onChange={handleChange}
                type="text"
                name="search"
                className={`text-black border-[1px] border-gray-400 rounded-lg bg-white p-2 m-5`}
              />
            </div>
          </>
        )}
      </div>
      {loader && <div className="absolute h-full w-full  flex justify-center items-center"><div
        class=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>}

      <div className="flex justify-center items-center flex-wrap">
        {(userInfo.role === "Admin" || userInfo.role === "admin") && (
          <div className="mx-5">
            <select
              name="employees"
              value={employee}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block  p-2.5 m-auto"
            >
              <option value="">Select an employee for attendance.</option>
              {employees.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                  className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex ">
          <div className="flex items-center mx-4">
            <label
              htmlFor="startDate"
              className="block font-medium text-gray-900 w-36  "
            >
              Start Date:
            </label>
            <input
              name="startDate"
              value={startDate}
              onChange={handleChange}
              type="date"
              id="date"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the task name"
            />
          </div>
          <div className="flex items-center mx-4">
            <label
              htmlFor="endDate"
              className="block  font-medium text-gray-900 w-36"
            >
              End Date:
            </label>
            <input
              name="endDate"
              value={endDate}
              onChange={handleChange}
              type="date"
              id="endDate"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the task name"
            />
          </div>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="bg-blue-800 text-white px-4 py-2  text-sm rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>
      {Object.keys(tasks).length > 0 && (
        <div className="relative overflow-x-auto m-5 mb-0">
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs text uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Task name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Project name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Plans for tomorrow
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Additional comment
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Backlog
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Task time
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tasks).map((date, dateIndex) => {
                // const taskList = tasks[date];
                // let totalTaskTimeForDate = 0;
                const taskList = tasks[date];
                let totalTaskTimeForDate = 0;
                let totalMinutesForDate = 0;
                
                taskList.map((task) => {
                  // Check if task_time is defined and follows the expected format
                  if (task.task_time) {
                    // Split the task time into hours and minutes
                    const [hours, minutes] = task.task_time.split('.').map(Number);
                
                    // Ensure hours and minutes are valid numbers
                    if (!isNaN(hours) && !isNaN(minutes)) {
                      // Add hours to the total time for the date
                      totalTaskTimeForDate += hours;
                
                      // Add minutes to the total minutes for the date
                      totalMinutesForDate += minutes;
                
                      // If total minutes exceed or equal to 60, convert them to hours
                      if (totalMinutesForDate >= 60) {
                        totalTaskTimeForDate += Math.floor(totalMinutesForDate / 60);
                        totalMinutesForDate = totalMinutesForDate % 60;
                      }
                    }
                  }
                });
                
                // Format the total time with proper formatting, ensuring no NaN values
                const formattedTotalTime = `${totalTaskTimeForDate}.${totalMinutesForDate < 10 ? '0' : ''}${totalMinutesForDate}`;
                 return (
                  <React.Fragment key={date}>
                    {taskList.map((task, index) => (
                      <tr
                        className="bg-white border-b border-gray-300"
                        key={task._id}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {task.date}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {task.task_name}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {task.project_name}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {task?.plan_for_tommorow}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {task?.additional_comment}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {task?.backlog}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {task.task_time} hours
                        </td>
                        <td className=" py-5  gap-1 border-2 border-l-0 border-r-0 border-t-0 border-gray-300">
                        <div className="flex items-center justify-center">
                          {userInfo.role === "employee" ||
                          userInfo.role === "Employee" ? (
                            <>
                              <NavLink to={`/tasks/edittask/${task._id}`}>
                                <CiEdit className="text-2xl cursor-pointer text-green-900" />
                              </NavLink>
                              <MdDelete
                                onClick={(e) => handleDelete(e, task._id)}
                                className="text-2xl cursor-pointer text-red-900"
                              />
                              <IoMdDownload
                                onClick={() =>
                                  handleDownload(task?.attachment?.url)
                                }
                                className="cursor-pointer text-lg"
                              />
                            </>
                          ) : (
                            <IoMdDownload
                              onClick={() => handleDownload(task?.attachment?.url)}
                              className="cursor-pointer text-lg"
                            />
                          )}
                        </div>
                      </td>
                      </tr>
                    ))}

                    {/* Row for displaying total task time for this date */}
                    <tr className="bg-gray-200">
                      <td
                        colSpan={8}
                        className="px-6 py-4 text-right font-bold"
                      >
                        Total Task Time for {date}:
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {formattedTotalTime} hours
                      </td>
                      <td colSpan={4}></td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <br></br>

{noData && <div className="text-center text-xl">
            Currently! There are no Task in the storage.
          </div>}
      {tasks.length > 0 && (
        <div className="flex flex-col items-center my-10">
          <span className="text-sm text-black">
            Showing{" "}
            <span className="font-semibold text-black">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-black">
              {Math.min(startIndex + pageSize, count)}
            </span>{" "}
            of <span className="font-semibold text-black">{count}</span>{" "}
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={
                tasks.length < pageSize || startIndex + pageSize >= count
              }
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
