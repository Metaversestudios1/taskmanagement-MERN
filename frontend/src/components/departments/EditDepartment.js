import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams, useRoutes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from 'jquery';
// import 'jquery-validation'; // Ensure the validation plugin is also importe
import 'jquery-validation'; 
const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialState = {
    department_name: '',
    department_head: "",
    description: "",
  };
  const [oldData, setOldData] = useState(initialState);
  const [loader,setLoader] = useState(false)

  useEffect(() => {
    fetchOldData();
  }, []);

  const validateDepartmentForm = () => {
    // Initialize jQuery validation
    $("#departmentform").validate({
      rules: {
        department_name: {
          required: true
        },
        department_head: {
          required: true
        },
      
      
      },
      messages: {
        department_name: {
          required: "Please enter department name"
        },
        department_head: {
            required: "Please enter department head"
          },
      },
      errorElement: 'div',
      errorPlacement: function(error, element) {
        error.addClass('invalid-feedback');
        error.insertAfter(element);
      },
      highlight: function(element, errorClass, validClass) {
        $(element).addClass('is-invalid').removeClass('is-valid');
      },
      unhighlight: function(element, errorClass, validClass) {
        $(element).removeClass('is-invalid').addClass('is-valid');
      }
    });
  
    // Return validation status
    return $("#departmentform").valid();
  };
  
  const fetchOldData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/getSingleDepartment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      console.log(response)
      if (response.success) {
        setOldData({
          department_name: response?.data[0]?.department_name,
          department_head: response?.data[0]?.department_head,         
          description:  response?.data[0]?.description,
        });
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Error fetching old data:", error);
    }
  };
  



  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDepartmentForm()) {
        return;
      }
      setLoader(true);
    try {
        const updateData = { id, oldData };
      const res = await fetch(`http://localhost:3000/api/updatedepartment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData), // Spread oldData into the body
      });
      const response = await res.json();
      if (response.success) {
        setLoader(false)
        toast.success('Department is updated successfully!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        // Uncomment if you want to navigate after successful update
         setTimeout(() => navigate("/departments"), 1500);
      }
    } catch (error) {
      console.error("Error updating department:", error);
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">
            Edit Department
          </div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="departmentform">
            <div className="my-4">
              <label
                htmlFor="department_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Department Name
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="department_name"
                value={oldData.department_name}
                onChange={handleChange}
                type="text"
                id="department_name"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="department name"
                required
              />
            </div>

            <div className="my-4">
              <label
                htmlFor="department_head"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Department head
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="department_head"
                value={oldData.department_head}
                onChange={handleChange}
                type="text"
                id="department_head"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="department head"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Description
              </label>
              <textarea
                name="description"
                value={oldData.description}
                onChange={handleChange}
                id="description"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              UPDATE
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditDepartment;
