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
    const res = await fetch("http://localhost:3000/api/getemployee");
    const response = await res.json();
    if (response.success) {
      setEmployees(response.result);
    }
  };

  const fetchProjectName = async (id) => {
    const projectRes = await fetch(
      `http://localhost:3000/api/getSingleproject`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const projectData = await projectRes.json();

    return projectData.success ? projectData.result[0].name : "Unknown";
  };

  const fetchTasks = async () => {
    setLoader(true);
    const res = await fetch(
      `http://localhost:3000/api/gettask?page=${page}&limit=${pageSize}&search=${search}&id=${employee}&startDate=${startDate}&endDate=${endDate}`
    );
    const response = await res.json();
    if (response.success) {
      const tasksWithProjectNames = await Promise.all(
        response.result.map(async (task) => {
          const projectName = await fetchProjectName(task.project_name);
          return {
            ...task,
            project_name: projectName,
          };
        })
      );
      setTasks(tasksWithProjectNames);
      setCount(response.count);
      setLoader(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the task?"
    );
    if (permissionOfDelete) {
      let taskOne = tasks.length === 1;
      if (count === 1) {
        taskOne = false;
      }
      const res = await fetch("http://localhost:3000/api/deletetask", {
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
    <div className="">
      <div className="flex items-center">
        <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div>
        <div className="text-xl font-bold mx-2 my-8">Tasks</div>
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
                className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
              />
            </div>
          </>
        )}
      </div>

      {(userInfo.role === "Admin" || userInfo.role === "admin") && (
        <div className="w-full ">
          <label
            htmlFor="employees"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-black w-[60%] m-auto"
          >
            Select an Employee
          </label>
          <select
            name="employees"
            value={employee}
            onChange={handleChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-[60%] p-2.5 m-auto"
          >
            <option value="">Select an employee for tasks.</option>
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
      <div className="flex mt-10 ml-6 flex-wrap">
        <div className="flex items-center mx-2">
          <label className="font-bold ">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleChange}
            className="border-2 p-1 mb-1"
          />
        </div>
        <div className="flex   items-center mx-2">
          <label className="font-bold ">End Date:</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleChange}
            className="border-2 p-1 mb-1"
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
      {tasks.length > 0 ? (
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
              {tasks.map((item, index) => (
                <tr key={item._id} className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {startIndex + index + 1}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.date.split("T")[0]}
                  </th>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.task_name}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.project_name}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.plan_for_tommorow}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.additional_comment}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.backlog}
                  </td>
                  <td className="px-6 py-2 border-2 border-gray-300">
                    {item?.task_time} Hours
                  </td>
                  <td className=" py-5  gap-1 border-2 border-l-0 border-r-0 border-t-0 border-gray-300">
                    <div className="flex items-center justify-center">
                      {userInfo.role === "employee" ||
                      userInfo.role === "Employee" ? (
                        <>
                          <NavLink to={`/tasks/edittask/${item._id}`}>
                            <CiEdit className="text-2xl cursor-pointer text-green-900" />
                          </NavLink>
                          <MdDelete
                            onClick={(e) => handleDelete(e, item._id)}
                            className="text-2xl cursor-pointer text-red-900"
                          />
                          <IoMdDownload
                            onClick={() =>
                              handleDownload(item?.attachment?.url)
                            }
                            className="cursor-pointer text-lg"
                          />
                        </>
                      ) : (
                        <IoMdDownload
                          onClick={() => handleDownload(item?.attachment?.url)}
                          className="cursor-pointer text-lg"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loader && <div className="m-8 flex justify-center">No Tasks Found</div>
      )}
    </div>
  );
};

export default Tasks;
