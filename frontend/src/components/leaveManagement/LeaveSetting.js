import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LeaveHistory = () => {
  const navigate = useNavigate()
  const initialState = {
    total_yearly_leaves: 0,
    total_casual_yearly_leaves: 0,
    total_sick_yearly_leaves: 0,
  };

  const [data, setData] = useState(initialState);
  useEffect(() => {
    fetchOldData();
  }, []);
  const fetchOldData = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getGlobalLeaveData`);
    const response = await res.json();
    if (response.success) {
      setData({
        total_yearly_leaves: response.result[0].total_yearly_leaves,
        total_casual_yearly_leaves:response.result[0].total_casual_yearly_leaves,
        total_sick_yearly_leaves: response.result[0].total_sick_yearly_leaves,
      });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateGlobalLeave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.success) {
      toast.success("Leaves updated Successfully!", {
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
        navigate(0)
      }, 1500);
    }
  };
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
      <div className="text-2xl font-bold mx-2 my-8 px-4">Leave Setting</div>
    </div>
      <form>
        <div className="w-[50%] m-auto">
          <div className="my-4">
            <label
              htmlFor="total_yearly_leaves"
              className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-white"
            >
              Total Leaves
            </label>
            <input
              type="text"
              value={data.total_yearly_leaves}
              onChange={handleChange}
              name="total_yearly_leaves"
              id="total_yearly_leaves"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="my-4">
            <label
              htmlFor="total_casual_yearly_leaves"
              className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-white"
            >
              Total casual leaves
            </label>
            <input
              type="text"
              value={data.total_casual_yearly_leaves}
              onChange={handleChange}
              id="total_casual_yearly_leaves"
              name="total_casual_yearly_leaves"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="my-4">
            <label
              htmlFor="total_sick_yearly_leaves"
              className="block mb-2 text-[16px] font-medium text-gray-900 dark:text-white"
            >
              Total sick leaves
            </label>
            <input
              type="text"
              value={data.total_sick_yearly_leaves}
              onChange={handleChange}
              id="total_sick_yearly_leaves"
              name="total_sick_yearly_leaves"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <button
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-5"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeaveHistory;
