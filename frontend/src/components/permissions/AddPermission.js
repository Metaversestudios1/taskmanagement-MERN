import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const AddPermission = () => {
  const navigate = useNavigate();
  const initialState = {
    permission: "",
  };
  const [data, setData] = useState(initialState);

  useEffect(() => {
    // Initialize validation when the component mounts
    //validatePermissionForm();
  }, []);

  const validatepermissionForm = () => {
    // Adding a custom validation method for checking hyphen or underscore
    $.validator.addMethod("noSpaces", function(value, element) {
      return this.optional(element) || /^[a-zA-Z0-9_]+$/.test(value);
  }, "Permission should not contain spaces, use _ instead.");
    // Initialize jQuery validation when the component mounts
    $("#permissionForm").validate({
      rules: {
        permission: {
          required: true,
          noSpaces: true, // Applying custom validation rule
        },
      },
      messages: {
        permission: {
          required: "Permission is required.",
        },
      },
     
    });
    return $("#permissionForm").valid();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target);
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!validatepermissionForm()) {
      // setError("Please fill in all required fields.");
      return;
    }
    console.log(data);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertpermission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
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
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <style>
       
      </style>

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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Add Permission</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form onSubmit={handleSubmit} id="permissionForm" >
          <div>
            <label
              htmlFor="permission"
              className="block mb-2 text-sm font-medium"
            >
              Permission<span className="text-red-900 text-lg ">&#x2a;</span>
            </label>
            <input
              name="permission"
              value={data?.permission}
              onChange={handleChange}
              type="text"
              id="permission"
              className="bg-gray-200 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 mb-5"
              placeholder="Enter the Permission name"

            />
          </div>
          {/* <div className="form-note mb-2 text-green-800">
          NOTE&#58;Space&#40;s&#41; are not allowed in between Permission
          name&#46;&#40;Example:permission-table, permission_table is
          allowed&#41;
          </div> */}
          <div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
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
