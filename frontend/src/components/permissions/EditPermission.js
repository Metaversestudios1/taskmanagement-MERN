import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const EditPermission = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const initialState = {
    role: "",
    permission: "",
  };
  const [oldData, setOldData] = useState(initialState);

  useEffect(() => {
    fetchPermissions();

    // Adding a custom validation method for checking hyphen or underscore
    $.validator.addMethod(
      "containsDashOrUnderscore",
      function (value, element) {
        return value.includes("-") || value.includes("_");
      },
      "Input is wrong! Please read the NOTE carefully."
    );

    // Initialize jQuery validation
    $("#editPermissionForm").validate({
      rules: {
        permission: {
          required: true,
          containsDashOrUnderscore: true, // Applying custom validation rule
        },
      },
      messages: {
        permission: {
          required: "Permission is required.",
          containsDashOrUnderscore:
            "Input is wrong! Please read the NOTE carefully.",
        },
      },
      submitHandler: function (form) {
        handleSubmit();
      },
    });
  }, []);

  const fetchPermissions = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getesinglepermission`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    if (response.success) {
      setOldData(response.data[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData({ ...oldData, [name]: value });
  };

  const handleSubmit = async () => {
    const updateData = { id, oldData };
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updatpermission`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Permission is updated Successfully!", {
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
          navigate("/permissionsTable");
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
        {`
          .error {
            color: red; /* Error messages in red */
          }
          label,
          input,
          .form-note {
            color: black; /* Keep label, input, and notes in black */
          }
        `}
      </style>

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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Permission</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form id="editPermissionForm">
          <div>
            <label
              htmlFor="permission"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Permission
            </label>
            <input
              name="permission"
              value={oldData?.permission}
              onChange={handleChange}
              type="text"
              id="permission"
              className="bg-gray-200 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 mb-6"
              placeholder="Enter the permission name"
              required
            />
          </div>
          <div className="form-note mb-2">
          NOTE&#58;Space&#40;s&#41; are not allowed in between Permission
          name&#46;&#40;Example:permission-table, permission_table is
          allowed&#41;
          </div>
          <div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPermission;
