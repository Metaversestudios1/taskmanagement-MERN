import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddPermission = () => {
  const navigate = useNavigate();
  const initialState = {
    permission: "",
  };
  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.permission.includes(" ")) {
      if (!data.permission.includes("-") || !data.permission.includes("_")) {
        setError("Input is wrong! Please read the NOTE Carefully");
        return;
      }
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/insertpermission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const response = await res.json();
        if (response.success) {
          setError("")
          toast.success("New Permission is added Successfully!", {
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
            navigate("/permissionstable");
          }, 1500);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
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
          <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div>
          <div className="text-xl font-bold mx-2 my-8">Add Permission</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form>
          <div>
            <label
              htmlFor="permission"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Permission
            </label>
            <input
              name="permission"
              value={data?.permission}
              onChange={handleChange}
              type="text"
              id="permission"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 mb-5"
              placeholder="Enter the Permission name"
              required
            />
          </div>
          <div className="mb-2 text-green-800">
            NOTE&#58;Space&#40;s&#41; are not allowed in between Permission
            name&#46;&#40;Example:permission-table, permission_table is
            allowed&#41;
          </div>
          {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
          <div>
            <button
              onClick={handleSubmit}
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ADD
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPermission;
