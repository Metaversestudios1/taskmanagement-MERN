import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserFromToken from "../utils/getUserFromToken";

const EditLeave = () => {
    const {id} = useParams()
  const userInfo = getUserFromToken();
  const navigate = useNavigate();
    const leaveTypes = [
        {name: "sick leave", id:1},
        {name: "casual leave", id:2},
    ]
    const status = [
        {name: "Pending", id:1},
        {name: "Rejected", id:2},
        {name: "Approved", id:3},
    ]
  const initialState = {
    leave_from: "",
    leave_to: "",
    reason: "",
    remarks: "",
    no_of_days: "",
    leave_type: "",
    status: "",
    emp_id : userInfo.id
  };

  const [data, setData] = useState(initialState);
useEffect(()=>{
fetchOldData()
},[])
const fetchOldData = async ()=>{
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleleave`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({id})
    })
    const response = await res.json()
    console.log(response)
    setData({
        leave_from:(response.result?.leave_from).split("T")[0],
        leave_to: (response.result?.leave_to).split("T")[0],
        reason: response.result?.reason,
        remarks: response.result?.remarks,
        no_of_days: response.result?.no_of_days,
        leave_type: response.result?.leave_type,
        status: response.result?.status,
        emp_id : response.result?.emp_id
    })
}
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setData({ ...data, [name]: value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {data, id}
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateleave`, {
      method: "PUT",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(updateData),
    });

    const response = await res.json();
    console.log(response)
    if (response.success) {
      toast.success("Leave status is updated Successfully!", {
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
        navigate("/leaverequests");
      }, 1500);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
console.log(data)
  return (
    <>
      <div className="flex items-center ">
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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Leave</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          
          <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="">
            <label
              htmlFor="leave_from"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Leave from
            </label>
            <input
              name="leave_from"
              value={data?.leave_from}
              onChange={handleChange}
              type="date"
              id="leave_from"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
            />
          </div>
          <div className="">
            <label
              htmlFor="leave_to"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
            Leave to
            </label>
            <input
              name="leave_to"
              value={data?.leave_to}
              onChange={handleChange}
              type="date"
              id="leave_to"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
            />
          </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="leavetype"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Leave type
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <select
                name="leave_type"
                value={data?.leave_type}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                required
              >
                <option value="">Choose leave type</option>
                {leaveTypes.map((option) => {
                  return (
                    <option
                      key={option.id}
                      value={option.name}
                      className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    >
                      {option.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="">
              <label
                htmlFor="no_of_days"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                No of days<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="no_of_days"
                value={data?.no_of_days}
                onChange={handleChange}
                type="text"
                id="no_of_days"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Enter the Number of days"
                required
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
           <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Status
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <select
                name="status"
                value={data?.status}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                required
              >
                <option value="">Select status</option>
                {status.map((option) => {
                  return (
                    <option
                      key={option.id}
                      value={option.name}
                      className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                    >
                      {option.name}
                    </option>
                  );
                })}
              </select>
            </div>
          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Reason<span className="text-red-900 text-lg ">&#x2a;</span>
            </label>
            <input
              name="reason"
              value={data?.reason}
              type = "text"
              onChange={handleChange}
              id="reason"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Reason for leave"
              required
            />
          </div>
          </div>
          
          <div className="mb-6">
            <label
              htmlFor="remarks"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Remarks
            </label>
            <textarea
              name="remarks"
              value={data?.remarks}
              onChange={handleChange}
              rows={6}
              id="remarks"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
            />
          </div>
          
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default EditLeave;
