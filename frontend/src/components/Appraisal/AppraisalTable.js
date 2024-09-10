import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "../utils/getUserFromToken";

const AppraisalTable = () => {
  const userInfo = getUserFromToken();
  const [search, setSearch] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [appraisal, setappraisal] = useState([]);
  const [count, setCount] = useState(0);
  const [loader, setLoader] = useState(true);
  const [noData, setNoData] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setPage(1);
      setSearch(value);
    }
  };
  const handleDelete = async (e, id) => {
    e.preventDefault();
    const appraisaldelete = window.confirm(
      "Are you sure, you want to delete the Appraisal"
    );
    if (appraisaldelete) {
      let activOne = appraisal.length === 1;
      if (count === 1) {
        activOne = false;
      }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deleteappraisal`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const response = await res.json();
      if (response.success) {
        toast.success("Appraisal is deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (activOne) {
          setPage(page - 1);
        } else {
          fetchappraisal();
        }
      }
    }
  };
  useEffect(() => {
    fetchappraisal();
  }, [page, search]);

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
  const fetchappraisal = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllappraisal?page=${page}&limit=${pageSize}&search=${search}`
    );
    const response = await res.json();
    if (response.success) {
      setNoData(false);
      if (response.result.length === 0) {
        setNoData(true);
      }
      const appraisalWithEmployeeNames = await Promise.all(
        response.result.map(async (appraisal) => {
          const employee_name = await fetchEmployeeName(appraisal.employee_id);
          return {
            ...appraisal,
            employee_id: employee_name,
          };
        })
      );
      setLoader(false);
      setappraisal(appraisalWithEmployeeNames);
      setCount(response.count);
    }
  };

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="relative">
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
        
        <div className="text-2xl font-bold mx-2 my-8 px-4">AppraisalTable</div>
      </div>
      <div className="flex justify-between">
        {(userInfo.role === "admin" || userInfo.role === "Admin") && (
          <NavLink to="/appraisal/addappraisal">
            <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
              Add New
            </button>
          </NavLink>
        )}
        <div className={` flex items-center`}>
          <input
            placeholder="Search "
            type="text"
            name="search"
            value={search}
            onChange={handleChange}
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          />
        </div>
      </div>
      {loader && <div className="absolute h-full w-full  flex justify-center items-center"><div
        className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>}

      <div className="relative overflow-x-auto m-5 mb-0">
        {appraisal.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>

                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Employee Name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Appraisal Date
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Start period
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  End Period
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  criteria
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                Goals For Next Period
                </th>
                {(userInfo.role === "admin" || userInfo.role === "Admin") && (
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
              {appraisal.map((item, index) => {
                return (
                  <tr key={item._id} className="bg-white border-b ">
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
                      {item?.employee_id}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {new Date(item?.appraisal_date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                        .replace(/\//g, "-")}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {new Date(item?.period_start)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                        .replace(/\//g, "-")}
                    </th>

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900  border-2 border-gray-300"
                    >
                         {new Date(item?.period_end)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                        .replace(/\//g, "-")}
                    </th>

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {item?.overall_rating}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {item?.criteria}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {item?.goals_for_next_period}
                    </th>
                  

                    {(userInfo.role === "admin" ||
                      userInfo.role === "Admin") && (
                      <td className="py-5  pl-5 gap-1 border-2  border-gray-300">
                        <div className="flex items-center">
                          <NavLink to={`/appraisal/editappraisal/${item._id}`}>
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
        )}
      </div>
      {noData && <div className="text-center text-xl">
            Currently! There are no Appraisal in the storage.
          </div>}

      {appraisal.length > 0 && (
        <div className="flex flex-col items-center my-10">
          <span className="text-sm text-black ">
            Showing{" "}
            <span className="font-semibold text-black ">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-black ">
              {" "}
              {Math.min(startIndex + pageSize, count)}
            </span>{" "}
            of <span className="font-semibold text-black ">{count}</span>{" "}
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 ">
              Prev
            </button>
            <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 ">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AppraisalTable;
