import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import getUserFromToken from "../utils/getUserFromToken";

const Attendance = () => {
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
  const [search, setSearch] = useState("");
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
  }, [page, search, employee, startDate, endDate]);

  const fetchEmployees = async () => {
    const res = await fetch(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/getemployee`);
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
    console.log(employeeName)
    return employeeName.success ? employeeName.data[0].name : "Unknown";
  };

  const fetchAttendance = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/getAllattendence?page=${page}&limit=${pageSize}&search=${search}&id=${employee}&startDate=${startDate}&endDate=${endDate}`
    );
    const response = await res.json();
    console.log(response);
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
      console.log(attendanceWithEmployeeNames);
      setAttendance(attendanceWithEmployeeNames);
      setCount(response.count);
      setLoader(false);
    }
  };

  // const handleDelete = async (e, id) => {
  //   e.preventDefault();
  //   const permissionOfDelete = window.confirm(
  //     "Are you sure, you want to delete the attendance?"
  //   );
  //   if (permissionOfDelete) {
  //     let attendanceOne = attendance.length === 1;
  //     if (count === 1) {
  //       attendanceOne = false;
  //     }
  //     const res = await fetch(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/deletetask`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ id }),
  //     });
  //     if (!res.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const response = await res.json();
  //     if (response.success) {
  //       if (taskOne) {
  //         setPage(page - 1);
  //       } else {
  //         fetchAttendance();
  //       }
  //     }
  //   }
  // };

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

  // const handleDownload = (url) => {
  //   if (!url) {
  //     return window.alert("There is no attachment with this task.");
  //   }
  //   const isImage = url.match(/\.(jpeg|jpg|gif|png)$/) != null;

  //   if (isImage) {
  //     window.open(url, "_blank");
  //   } else {
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = url.substring(url.lastIndexOf("/") + 1);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="">
      <div className="flex items-center">
        <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div>
        <div className="text-xl font-bold mx-2 my-8">Attendance Sheet</div>
      </div>
      <div className="flex justify-between">
        {(userInfo.role === "Employee" || userInfo.role === "employee") && (
          <>
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
            Select an employee
          </label>
          <select
            name="employees"
            value={employee}
            onChange={handleChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-[60%] p-2.5 m-auto"
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
                  Attendance status
                </th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((item, index) => {
                const checkIndateTime =(item?.check_in)?.split(".")[0] 
                const checkIntime = checkIndateTime?.split("T")[1]
                const checkOutdateTime =(item?.check_out)?.split(".")[0] 
                const checkOuttime = checkOutdateTime?.split("T")[1]
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
                      {checkIntime}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {checkOuttime}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.working_hours || "-"}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.attendance_status || "-"}
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
    </div>
  );
};

export default Attendance;
