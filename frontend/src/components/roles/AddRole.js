import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import 'jquery-validation'; // Import jQuery validation

const AddRole = () => {
  const navigate = useNavigate();
  const initialState = {
    role: "",
    permission: [],
  };
  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    validateRoleForm(); // Initialize validation after permissions are fetched
  }, [permissions]);

  const fetchPermissions = async () => {
    const res = await fetch(`http://localhost:3000/api/getpermission`);
    const response = await res.json();
    if (response.success) {
      setPermissions(response.result);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "permission") {
      let updatedPermissions = [...data.permission];
      if (checked) {
        updatedPermissions.push(value);
      } else {
        updatedPermissions = updatedPermissions.filter((perm) => perm !== value);
      }
      setData({ ...data, permission: updatedPermissions });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const validateRoleForm = () => {
    $("#roleForm").validate({
      rules: {
        role: {
          required: true,
          minlength: 2,
        },
        permission: {
          required: true,
        },
      },
      messages: {
        role: {
          required: "Please enter a role name",
          minlength: "Role name must be at least 2 characters",
        },
        permission: {
          required: "Please select at least one permission",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!$("#roleForm").valid()) {
      return;
    }

    const res = await fetch(`http://localhost:3000/api/insertrole`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.success) {
      toast.success('New Role is added Successfully!', {
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
          <div className="text-xl font-bold mx-2 my-8">Add Role</div>
        </div>
      </div>

      <div className="w-[70%] m-auto my-10">
        <form id="roleForm">
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Role<span className="text-red-900 text-lg ">&#x2a;</span>
            </label>
            <input
              name="role"
              value={data.role}
              onChange={handleChange}
              type="text"
              id="role"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the role name"
              required
            />
          </div>
          <div>
            <div className="mt-4">
              Permissions<span className="text-red-900 text-lg ">&#x2a;</span>
            </div>
            {permissions.map((item) => (
              <div key={item._id} className="flex flex-row items-center">
                <label
                  className="relative flex items-center p-3 rounded-full cursor-pointer"
                  htmlFor={`check-${item._id}`}
                >
                  <input
                    value={item._id}
                    onChange={handleChange}
                    type="checkbox"
                    name="permission"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all checked:border-gray-900 checked:bg-gray-900"
                    id={`check-${item._id}`}
                  />
                </label>
                <label
                  className="mt-px font-light text-gray-700 cursor-pointer select-none"
                  htmlFor={`check-${item._id}`}
                >
                  {item.permission}
                </label>
              </div>
            ))}
          </div>
          {error && <p className="text-red-900 text-[17px] mb-5">{error}</p>}
          <div>
            <button
              onClick={handleSubmit}
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

export default AddRole;
