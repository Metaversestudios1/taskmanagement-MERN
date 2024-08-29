import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import getUserFromToken from "../utils/getUserFromToken";

const Attendance = () => {
  const navigate = useNavigate()
  const userInfo = getUserFromToken();
  const [employee, setEmployee] = useState(
    userInfo.role === "Employee" || userInfo.role === "employee"
      ? userInfo.id
      : ""
  );
  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (userInfo.role === "Admin" || userInfo.role === "admin") {
      fetchEmployees();
    }
  }, []);

  useEffect(() => {
    if (employee) {
      fetchAttendance();
    } else {
      setAttendance([]);
    }
  }, [page, employee, startDate, endDate]);

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

  const fetchAttendance = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllattendence?page=${page}&limit=${pageSize}&id=${employee}&startDate=${startDate}&endDate=${endDate}`
    );
    const response = await res.json();
    if (response.success) {
      const attendanceWithEmployeeNames = await Promise.all(
        response.result.map(async (attendance) => {
          const employee_name = await fetchEmployeeName(attendance.emp_id);
          return {
            ...attendance,
            emp_id: employee_name,
          };
        })
      );
      setAttendance(attendanceWithEmployeeNames);
      setCount(response.count);
      setLoader(false);
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

  const handleAttendanceStatus = async (e, status, id) => {
    e.preventDefault();
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/updateAttendanceStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      }
    );
    const response = await res.json()
    if(response.success) {
      navigate(0)
    }
  };
  const startIndex = (page - 1) * pageSize;
  return (
    <div className="">
      <div className="flex items-center">
        <div className="text-2xl font-bold mx-2 my-8 px-4">
          Attendance Sheet
        </div>
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
        <div className="flex ">
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
      {attendance.length > 0 ? (
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
                  Employee Name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Check IN
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Check Out
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Working Hours
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Live location
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Attendance status
                </th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((item, index) => {
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
                      {item?.date.split("T")[0]}
                    </th>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.emp_id}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.check_in}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.check_out || "-"}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.working_hours || "-"}
                    </td>
                    <td className="px-2 py-4 border-2 border-gray-300">
                      <div className="flex flex-col justify-center items-center">
                        <div>
                          <a
                            className="text-blue-900"
                            href={item?.checkIn_location_url}
                            target="_blank"
                          >
                            Check In
                          </a>
                        </div>
                        <div>
                          <a
                            className="text-blue-900"
                            href={item?.checkOut_location_url}
                            target="_blank"
                          >
                            Check Out
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-1 border-2 border-gray-300">
                      <div className="flex  items-center flex-col">
                        {item?.attendance_status || "-"}
                        <div className="flex justify-center items-center py-2">
                          {(userInfo.role === "admin" ||
                            userInfo.role === "Admin") && (
                            <>
                              {item?.attendance_status === "present" ? (
                                <button
                                  onClick={(e) =>
                                    handleAttendanceStatus(
                                      e,
                                      "absent",
                                      item._id
                                    )
                                  }
                                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5   dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                >
                                  Absent
                                </button>
                              ) : (
                                <button
                                  onClick={(e) =>
                                    handleAttendanceStatus(
                                      e,
                                      "present",
                                      item._id
                                    )
                                  }
                                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5   dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                  Present
                                </button>
                              )}
                            </>
                          )}
                        </div>
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
          <div className="m-8 flex justify-center">No attendance Found</div>
        )
      )}
      {attendance.length > 0 && (
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
                attendance.length < pageSize || startIndex + pageSize >= count
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

export default Attendance;
