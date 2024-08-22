import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import getUserFromToken from "../utils/getUserFromToken"
const HolidayTable = () => {
  const userInfo = getUserFromToken()
  const [holiday, setHoliday] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchholiday();
  }, [page, search]);
  const fetchholiday = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllholiday?page=${page}&limit=${pageSize}&search=${search}`
    );
    const response = await res.json();
    console.log(response)
    if (response.success) {
      setLoader(false);
      setHoliday(response.result);
      setCount(response.count);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const holidayofDelete = window.confirm(
      "Are you sure, you want to delete the holiday"
    );
    if (holidayofDelete) {
      let holiOne = holiday.length === 1;
      if (count === 1) {
        holiOne = false;
      }
      const res = await fetch("${process.env.REACT_APP_BACKEND_URL}/api/deleteholiday", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        if (holiOne) {
          setPage(page - 1);
        } else {
          fetchholiday();
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearch(value);
      setPage(1);
    }
  };

  const startIndex = (page - 1) * pageSize;
  return (
    <div className="">
      <div className="flex items-center">
        
        <div className="text-2xl font-bold mx-2 my-8 px-4">Holiday</div>
      </div>
      <div className="flex justify-between">
      {(userInfo.role ==="admin" || userInfo.role ==="Admin") && <NavLink to="/holiday/addholiday">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink>}
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

      <div className="relative overflow-x-auto m-5 mb-0">
        {holiday.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>

                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Reason
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Day
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Month
                </th>
                {(userInfo.role ==="admin" || userInfo.role ==="Admin") && <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>}
              </tr>
            </thead>

            <tbody>
              {holiday.map((item, index) => {
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
                      {new Date(item?.date)
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
                      {item?.reason}
                    </th>

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {item?.day}
                    </th>

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {item?.month}
                    </th>
                    {(userInfo.role ==="admin" || userInfo.role ==="Admin") && <td className="py-5  pl-5 gap-1 border-2  border-gray-300">
                    <div className="flex items-center">
                        <NavLink to={`/Holiday/editholiday/${item._id}`}>
                          <CiEdit className="text-2xl cursor-pointer text-green-900" />
                        </NavLink>
                        <MdDelete
                          onClick={(e) => handleDelete(e, item._id)}
                          className="text-2xl cursor-pointer text-red-900"
                        />
                      </div>
                    </td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-xl">
            Currently! There are no available Holiday.
          </div>
        )}
      </div>

      {holiday.length > 0 && (
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
export default HolidayTable;
