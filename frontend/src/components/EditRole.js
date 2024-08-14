import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditRole = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const initialState = {
    role: "",
    permission: [],
  };
  const [oldData, setOldData] = useState(initialState);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState("");

  
  useEffect(() => {
    fetchOldData();
    fetchAllPermissions();
  }, []);
  
  const fetchOldData = async () => {
    const res = await fetch("http://localhost:3000/api/getSingleRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    if (response.success) {
      setOldData({ role: response.data[0].role, permission: response.data[0].permission });
    }
  };
  
  const fetchAllPermissions = async () => {
    const res = await fetch("http://localhost:3000/api/getpermission");
    const response = await res.json();
    if (response.success) {
      setPermissions(response.result);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "permission") {
      let updatedPermissions = [...oldData.permission];
      if (checked) {
        updatedPermissions.push(value);
      } else {
        updatedPermissions = updatedPermissions.filter((perm) => perm !== value);
      }
      setOldData({ ...oldData, permission: updatedPermissions });
    } else {
      setOldData({ ...oldData, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(oldData.permission.length===0) {
      setError("Please provide atleast one permission correspond to specific Role")
      return 
    }
    const updateData = {id, oldData}
    const res = await fetch("http://localhost:3000/api/updaterole", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    const response = await res.json();
    console.log(response)
    if (response.success) {
      toast.success('Role is updated Successfully!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        setTimeout(() => {
          navigate("/rolesTable");
        }, 1500);
    }
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  console.log(oldData)
  return (
    <>
      <div className="flex items-center">
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
          <IoIosArrowRoundBack
            onClick={handleGoBack}
            className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
          />
        </div>
        <div className="flex items-center">
          <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div>
          <div className="text-xl font-bold mx-2 my-8">Edit Role</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form>
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Role
            </label>
            <input
              name="role"
              value={oldData.role}
              onChange={handleChange}
              type="text"
              id="role"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              placeholder="Enter the task description"
              required
            />
          </div>
          <div>
            <div className="mt-4">Permissions</div>
            {permissions.map((item) => {
              const isChecked = oldData.permission.includes(item._id);
              return (
                <div key={item._id} className="flex flex-row items-center">
                  <label
                    className="relative flex items-center p-3 rounded-full cursor-pointer"
                    htmlFor={`check-${item._id}`}
                  >
                    <input
                      value={item._id}
                      checked={isChecked}
                      onChange={handleChange}
                      type="checkbox"
                      name="permission"
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                      id={`check-${item._id}`}
                    />
                    <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </label>
                  <label
                    className="mt-px font-light text-gray-700 cursor-pointer select-none"
                    htmlFor={`check-${item._id}`}
                  >
                    {item.permission}
                  </label>
                </div>
              );
            })}
          </div>
          {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}

          <div>
            <button
              onClick={handleSubmit}
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditRole;
