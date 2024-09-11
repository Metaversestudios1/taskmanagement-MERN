import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Projects = () => {

  const navigate = useNavigate()
  const [projects, setProjects] = useState([]);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [noData, setNoData] = useState(false);

  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setfilter] = useState("");
  useEffect(() => {
    fetchProjects();
  }, [page, search, filter]);
  const fetchProjects = async () => {
    setLoader(true)
    const res = await fetch(
      `http://localhost:3000/api/getproject?page=${page}&limit=${pageSize}&search=${search}&filter=${filter}`
    );
    const response = await res.json();
    if (response.success) {
      setNoData(false)
      if (response.result.length === 0) {
        setNoData(true)
      }

      setLoader(false)
      setProjects(response.result);
      setCount(response.count);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm("Are you sure, you want to delete the Project")
    if (permissionOfDelete) {
      let projectOne = projects.length === 1;
      if (count === 1) {
        projectOne = false;
      }
      const res = await fetch(`http://localhost:3000/api/deleteproject`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        toast.success('Project is deleted Successfully!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (projectOne) {
          setPage(page - 1);
        } else {
          fetchProjects();
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
    if (name === "filter") {
      setfilter(value);
      setPage(1);
    }
  };
  const handleStatusChange = async (id, newStatus) => {
    let status = "Activate"; // changed to let
    if (newStatus === 1) {
      status = "Inactive";
    }
    const permissionOfDelete = window.confirm(`Are you sure you want to ${status} the Project?`);
    if (permissionOfDelete) {
      let projectOne = projects.length === 1;
      if (count === 1) {
        projectOne = false;
      }
      try {
        const res = await fetch(`http://localhost:3000/api/updatestatus/Project/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        const response = await res.json(); // Awaiting the response to parse it
        if (response.success) {
          toast.success(`Project is ${status} Successfully!`, {
            position: "top-right",
            autoClose: 1000,
          });
          if (projectOne) {
            setPage(page - 1);
          } else {
            fetchProjects();
          }
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
      }
    }
  };

  const handleStatuspublish = async(id, newStatus) =>{
    const permissionOfpublish = window.confirm(`Are you sure you want to publish the Project?`);
    if(permissionOfpublish){
      let projectOne = projects.length === 1;
      if(count===1){
        projectOne = false;
      }
      
      const updateData = { id, newStatus };
      try{    
           const res = await fetch(`http://localhost:3000/api/publishproject`,{
            method:'POST',
            headers: { "Content-Type": "application/json " }, // Remove the extra space
            body: JSON.stringify(updateData),
           })
           const response = await res.json(); // Add await here

           console.log(response.success)
           if(response.success){
              toast.success('Project is Published Successfully',{
                position: "top-right",
                autoClose: 1000,
              });
              if(projectOne){
                setPage(page-1);
              }else{
                fetchProjects();
              }
           }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
      }
    }
  }

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

        <div className="text-2xl font-bold mx-2 my-8 px-4">Projects</div>
      </div>
      <div className="flex justify-between">
        <NavLink to="/projects/addproject">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink>
        <div className={` flex `}>
          <input
            placeholder="Search "
            type="text"
            name="search"
            value={search}
            onChange={handleChange}
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          />
        </div>
        <div className={` flex `}>
          <select

            type="text"
            name="filter"
            value={filter}
            onChange={handleChange}
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}>
            <option value="">select filter</option>
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="running">Running</option>
            <option value="closed">Closed</option>
          </select>

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
        {projects.length > 0 && <table className="w-full text-sm text-left rtl:text-right   border-2 border-gray-300 ">
          <thead className="text-xs  uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                Sr no.
              </th>
              <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                Project Name
              </th>
              <th scope="col" className="px-6 py-3 border-2 border-gray-300">Start Date</th>
              <th scope="col" className="px-6 py-3 border-2 border-gray-300">Assigned Manager</th>
              <th scope="col" className="px-6 py-3 border-2 border-gray-300" style={{ width: '200px' }}>Project Description</th>
              <th scope="col" className="px-6 py-3 border-2 border-gray-300">Status</th>
              <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map((item, index) => {
              return (
                <tr key={item._id} className="bg-white border-b ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-gray-300"
                  >
                    {startIndex + index + 1}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900   border-2 border-gray-300"
                  >
                    {item?.name}
                  </th>

                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-gray-300"
                  >
                    {item?.start_date ? new Date(item.start_date).toLocaleDateString('en-GB') : 'N/A'}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-gray-300"
                  >
                    {item?.assigned_manager}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900  border-2 border-gray-300 text-ellipsis overflow-hidden"
                    style={{ width: '200px' }}
                  >
                    {item?.description?.length > 100 ? item.description.slice(0, 100) + '...' : item.description}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.status === 0 ? (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleStatusChange(item._id, 0)}
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleStatusChange(item._id, 1)}
                      >
                        Inactive
                      </button>
                    )}
                    &ensp;
                    {item?.publish === 0 ? (
                      <button
                        className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleStatuspublish(item._id, 0)}
                      >
                        publish
                      </button>
                    ) : (
                      <button
                        className="bg-grey-500 hover:bg-red-600 text-black font-bold py-2 px-4 rounded"
                         >
                        published
                      </button>
                    )}

                    
                  </th>

                  <td className="py-5  pl-5 gap-1 border-2  border-gray-300">
                    <div className="flex items-center">
                    <NavLink to={`/projects/showproject/${item?._id}`}>
                    <IoMdEye
                    className="text-2xl cursor-pointer text-blue-900"
                    />
                    </NavLink>
                      <NavLink to={`/projectjs/editproject/${item._id}`}>
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
        </table>}
      </div>
      {noData && <div className="text-center text-xl">
        Currently! There are no Project in the storage.
      </div>}

      {projects.length > 0 && <div className="flex flex-col items-center my-10">
        <span className="text-sm text-black ">
          Showing <span className="font-semibold text-black ">{startIndex + 1}</span> to{" "}
          <span className="font-semibold text-black "> {Math.min(startIndex + pageSize, count)}</span> of{" "}
          <span className="font-semibold text-black ">{count}</span> Entries
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
          projects.length < pageSize || startIndex + pageSize >= count
        }
        className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
      >
        Next
      </button>
        </div>
      </div>}
    </div>
  );
};

export default Projects;
