import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import getUserFromToken from "./utils/getUserFromToken";
const Tasks = () => {
  const userInfo = getUserFromToken();
  const [employee, setEmployee] = useState(
    userInfo.role === "Employee" || userInfo.role === "employee"
      ? userInfo.id
      : ""
  );
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
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
    }
  }, [page, search, employee]);
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
      `http://localhost:3000/api/gettask?page=${page}&limit=${pageSize}&search=${search}&id=${employee}`
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
      "Are you sure, you want to delete the task"
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
    if (userInfo.role === "admin" || userInfo.role === "Admin") {
      setEmployee(value);
    }
    if (name === "search") {
      setSearch(value);
      setPage(1);
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
            <div className={` flex items-center`}>
              <input
                placeholder="Search "
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
            {employees.map((item) => {
              return (
                <option
                  key={item._id}
                  value={item._id}
                  className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                >
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
      )}
      {(userInfo.role === "admin" || userInfo.role === "Admin") && employee ? (
        <div className="relative overflow-x-auto m-5 mb-0">
          {tasks.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right  border-2 border-gray-300  ">
              <thead className="text-xs text uppercase bg-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Sr no.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Task name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Project name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Plans for tommorow
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    additional comment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    backlog
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Task time
                  </th>
                  {(userInfo.role === "Employee" ||
                    userInfo.role === "employee") && (
                    <th
                      scope="col"
                      className="px-6 py-3 border-2 border-gray-300"
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {tasks.map((item, index) => {
                  return (
                    <tr key={item._id} className="bg-white border-b ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300 "
                      >
                        {startIndex + index + 1}
                      </th>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300 "
                      >
                        {(item?.date).split("T")[0]}
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
                      {(userInfo.role === "Employee" ||
                        userInfo.role === "employee") && (
                        <td className=" py-5 pl-5 gap-1 border-2 border-l-0 border-r-0 border-t-0 border-gray-300">
                          <div className="flex items-center">
                            <NavLink to={`/tasks/edittask/${item._id}`}>
                              <CiEdit className="text-2xl cursor-pointer text-green-900" />
                            </NavLink>
                            <MdDelete
                              onClick={(e) => handleDelete(e, item._id)}
                              className="text-2xl cursor-pointer text-red-900"
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-xl">
              Currently! There are no tasks for the project.
            </div>
          )}
        </div>
      ) : (
        <div className="relative overflow-x-auto m-5 mb-0">
          {tasks.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right  border-2 border-gray-300  ">
              <thead className="text-xs text uppercase bg-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Sr no.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Task name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Project name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Plans for tommorow
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    additional comment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    backlog
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 border-2 border-gray-300"
                  >
                    Task time
                  </th>
                  
                    <th
                      scope="col"
                      className="px-6 py-3 border-2 border-gray-300"
                    >
                      Action
                    </th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((item, index) => {
                  return (
                    <tr key={item._id} className="bg-white border-b ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300 "
                      >
                        {startIndex + index + 1}
                      </th>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300 "
                      >
                        {(item?.date).split("T")[0]}
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
                      {(userInfo.role === "Employee" ||
                        userInfo.role === "employee") ? (
                        <td className=" py-5 pl-5 gap-1 border-2 border-l-0 border-r-0 border-t-0 border-gray-300">
                          <div className="flex items-center">
                            <NavLink to={`/tasks/edittask/${item._id}`}>
                              <CiEdit className="text-2xl cursor-pointer text-green-900" />
                            </NavLink>
                            <MdDelete
                              onClick={(e) => handleDelete(e, item._id)}
                              className="text-2xl cursor-pointer text-red-900"
                            />
                          </div>
                        </td>
                      ): <IoMdDownload className="text-lg"/>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-xl">
              Currently! There are no tasks for the project.
            </div>
          )}
        </div>
      )}

      {(userInfo.role === "admin" || userInfo.role === "Admin") &&
        employee &&
        tasks.length > 0 && (
          <div className="flex flex-col items-center my-10">
            <span className="text-sm text-black ">
              Showing{" "}
              <span className="font-semibold text-black ">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-black ">
                {" "}
                {Math.min(startIndex + pageSize, count)}
              </span>{" "}
              of <span className="font-semibold text-black ">{count}</span>{" "}
              Entries
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 "
              >
                Prev
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={
                  tasks.length < pageSize || startIndex + pageSize >= count
                }
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 "
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
