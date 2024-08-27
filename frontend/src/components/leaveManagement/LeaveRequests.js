import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import getUserFromToken from "../utils/getUserFromToken";
import { ImCross } from "react-icons/im";
import { FcApproval } from "react-icons/fc";
const LeaveRequests = () => {
  const navigate = useNavigate();
  const userInfo = getUserFromToken();
  const [employee, setEmployee] = useState(
    userInfo.role === "Employee" || userInfo.role === "employee"
      ? userInfo.id
      : ""
  );
  const [leaves, setLeaves] = useState([]);
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
      fetchLeaves();
    } else {
      setLeaves([]);
    }
  }, [page, search, employee, startDate, endDate]);

  const fetchEmployees = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getemployee`);
    const response = await res.json();
    if (response.success) {
      setEmployees(response.result);
    }
  };

  const fetchEmployeeName = async (id) => {
    const nameRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getesingleemployee`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const employeeName = await nameRes.json();
    return employeeName.success ? employeeName.data[0].name : "Unknown";
  };

  const fetchLeaves = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllLeave?page=${page}&limit=${pageSize}&id=${employee}&startDate=${startDate}&endDate=${endDate}`
    );
    const response = await res.json();
    if (response.success) {
      const leavesWithEmployeeNames = await Promise.all(
        response.result.map(async (leave) => {
          const employee_name = await fetchEmployeeName(leave.emp_id);
          return {
            ...leave,
            emp_id: employee_name,
          };
        })
      );
      setLeaves(leavesWithEmployeeNames);
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
      let leaveOne = leaves.length === 1;
      if (count === 1) {
        leaveOne = false;
      }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deleteleave`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        if (leaveOne) {
          setPage(page - 1);
        } else {
          fetchLeaves();
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
    if (name === "startDate") {
      setStartDate(value);
      setPage(1);
    } else if (name === "endDate") {
      setEndDate(value);
      setPage(1);
    }
  };

  const handleLeaveStatus = async (e, status, id) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateLeaveStatus`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, id }),
    });
    const response = await res.json();
    if (response.success) {
      navigate(0);
    }
  };

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="">
      <div className="flex items-center">
        <div className="text-2xl font-bold mx-2 my-8 px-4">Leave Requests</div>
      </div>
      <div className="flex justify-between">
        {(userInfo.role === "Employee" || userInfo.role === "employee") && (
          <NavLink to="/leaverequests/addleave">
            <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
              Add New
            </button>
          </NavLink>
        )}
      </div>

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
        <div className="flex flex-wrap">
          <div className="flex items-center mx-4">
            <label
              htmlFor="startDate"
              className="block text-lg font-medium text-gray-900 w-36  "
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
              className="block  text-lg font-medium text-gray-900 w-36"
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
      {leaves.length > 0 ? (
        <div className="relative overflow-x-auto m-5 mb-0">
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs text uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  employee name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Leave from
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  leave to
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  total days
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Leave type
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  reason
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  remarks
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  status
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((item, index) => {
                return (
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
                      {item?.emp_id}
                    </th>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {(item?.leave_from).split("T")[0]}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {(item?.leave_to).split("T")[0]}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.no_of_days} days
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.leave_type}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.reason}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.remarks || "NA"}
                    </td>
                    <td className="px-6 py-2 border-2 border-gray-300">
                      <div className="flex  items-center flex-col">
                        {item?.status}
                        <div className="flex justify-center items-center py-2">
                          {(item.status === "Pending" ||
                            item.status === "pending") &&
                            (userInfo.role === "admin" ||
                              userInfo.role === "Admin") && (
                              <>
                                <ImCross
                                  onClick={(e) =>
                                    handleLeaveStatus(e, "rejected", item._id)
                                  }
                                  className="cursor-pointer text-sm mr-1"
                                />
                                <FcApproval
                                  onClick={(e) =>
                                    handleLeaveStatus(e, "approved", item._id)
                                  }
                                  className="cursor-pointer text-xl ml-1"
                                />
                              </>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className=" py-5  gap-1 border-2 border-l-0 border-r-0 border-t-0 border-gray-300">
                      <div className="flex items-center justify-center">
                        <MdDelete
                          onClick={(e) => handleDelete(e, item._id)}
                          className="text-2xl cursor-pointer text-red-900"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        !loader && (
          <div className="m-8 flex justify-center">No leaves Found</div>
        )
      )}
      {leaves.length > 0 && (
        <div className="flex flex-col items-center my-10">
          <span className="text-sm text-black">
            Showing{" "}
            <span className="font-semibold text-black">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-black">
              {Math.min(startIndex + pageSize, count)}
            </span>{" "}
            of <span className="font-semibold text-black">{count}</span> Entries
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
                leaves.length < pageSize || startIndex + pageSize >= count
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

export default LeaveRequests;
