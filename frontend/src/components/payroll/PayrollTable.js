import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import getUserFromToken from "../utils/getUserFromToken";

const  PayrollTable = () => {
  const userInfo = getUserFromToken();
  const [employee, setEmployee] = useState(
    userInfo.role === "Employee" || userInfo.role === "employee"
      ? userInfo.id
      : ""
  );
  const [payroll, setPayroll] = useState([]);
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
      fetchPayroll();
    } else {
      setPayroll([]);
    }
  }, [page, employee]);

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

  const fetchPayroll = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllPayroll?page=${page}&limit=${pageSize}&id=${employee}`
    );
    const response = await res.json();
    if (response.success) {
      const payrollWithEmployeeNames = await Promise.all(
        response.result.map(async (payroll) => {
          const employee_name = await fetchEmployeeName(payroll.emp_id);
          return {
            ...payroll,
            emp_id: employee_name,
          };
        })
      );
      setPayroll(payrollWithEmployeeNames);
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
      let payrollOne = payroll.length === 1;
      if (count === 1) {
        payrollOne = false;
      }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deletepayroll`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        if (payrollOne) {
          setPage(page - 1);
        } else {
          fetchPayroll();
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
  };

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="">
      <div className="flex items-center">
        
        <div className="text-2xl font-bold mx-2 my-8 px-4">Payroll</div>
      </div>
      <div className="flex justify-between">
      <NavLink to="/payroll/addpayroll">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink>
        
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
            <option value="">Select an employee</option>
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
      {payroll.length > 0 ? (
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
                  designation
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                 salary
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {payroll.map((item, index) => {
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
                      {item?.designation}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.salary}
                    </td>
                    <td className=" py-5  gap-1 border-2 border-l-0 border-r-0 border-t-0 border-gray-300">
                      <div className="flex items-center justify-center">
                        <NavLink to={`/payroll/editpayroll/${item._id}`}>
                          <CiEdit className="text-2xl cursor-pointer text-green-900" />
                        </NavLink>
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
          <div className="m-8 flex justify-center">No Payroll Found</div>
        )
      )}
      {payroll.length > 0 && (
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
                payroll.length < pageSize || startIndex + pageSize >= count
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

export default  PayrollTable;
