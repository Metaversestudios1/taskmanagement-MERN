import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Employees = () => {
  const [users, setUsers] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchRoleName = async (id) => {
    const roleRes = await fetch(`http://localhost:3000/api/getSingleRole`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const roleData = await roleRes.json();
    const type = roleData.success ? roleData.data[0].role : "Unknown";
    return type;
  };

  const fetchData = async () => {
    setLoader(true)
    const res = await fetch(
      `http://localhost:3000/api/getemployee?page=${page}&limit=${pageSize}&search=${search}`
    );
    const response = await res.json();
    if (response.success) {
      if(response.result.length===0){

        setNoData(true)
      }
      const usersWithRoles = await Promise.all(
        response.result.map(async (users) => {
          const role = await fetchRoleName(users.role);
          return {
            ...users,
            role,
          };
        })
      );
      setUsers(usersWithRoles);
      setCount(response.count);
      setLoader(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm("Are you sure, you want to delete the user")
    if(permissionOfDelete) {
      
      let userOne = users.length === 1;
      if (count === 1) {
      userOne = false;
    }
    const res = await fetch(`http://localhost:3000/api/deleteemployee`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const response = await res.json();
    if (response.success) {
      toast.success('Employee is deleted Successfully!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      if (userOne) {
        setPage(page - 1);
      } else {
        fetchData();
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
        <div className="text-2xl font-bold mx-2 my-8 px-4">Employees List</div>
      </div>
      <div className="flex justify-between">
        <NavLink to="/employees/addemployee">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink>
        <div className={`flex items-center`}>
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

      {loader && <div className="flex justify-center"><div
        class=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>}
      <div className="relative overflow-x-auto m-5 mb-0">

        {users.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Full name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((item, index) => (
                <tr key={item?._id} className="bg-white">
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
                    {item?.name}
                  </th>
                  <td className="px-6 py-4 border-2 border-gray-300">{item?.role}</td>
                  <td className="px-6 py-4 border-2 border-gray-300">{item?.contact_number}</td>
                  <td className="px-6 py-4 border-2 border-gray-300">{item?.email}</td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.createdAt?.split("T")[0]}
                  </td>
                  <td className=" py-5 pl-5 gap-1 border-2  border-gray-300">
                  <div className="flex items-center">
                    {/*<a href="/">
                      <GrFormView className="text-3xl cursor-pointer text-yellow-700" />
                    </a>*/}
                    <NavLink to={`/employee/editemployee/${item?._id}`}>
                      <CiEdit className="text-2xl cursor-pointer text-green-900" />
                    </NavLink>
                    <MdDelete
                      onClick={(e) => handleDelete(e, item?._id)}
                      className="text-2xl cursor-pointer text-red-900"
                    />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
          </div>
          {noData && <div className="text-center text-xl">
            Currently! There are no users in the storage.
          </div>}

      {users.length > 0 && (
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
                users.length < pageSize || startIndex + pageSize >= count
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

export default Employees;
