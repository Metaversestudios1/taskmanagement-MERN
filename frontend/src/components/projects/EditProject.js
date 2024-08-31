import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";
import 'jquery-validation';

const EditProject = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const params = useParams();
  const { id } = params;
  const initialState = {
    name: "",
  };
  const [oldData, setOldData] = useState(initialState);
  useEffect(() => {
    const fetchOldData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/getSingleproject`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );
        const res = await response.json();
        if (res.result[0]) {
          setOldData({
            name: res.result[0]?.name,
          });
        } else {
          console.error("No data found for the given parameter.");
        }
      } catch (error) {
        console.error("Failed to fetch old data:", error);
      }
    };

    fetchOldData();
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData({
      ...oldData,
      [name]: value,
    });
  };
  const validateprojectForm = () => {
    // Initialize jQuery validation
    $("#projectform").validate({
      rules: {
        name: {
          required: true
        },      
      },
      messages: {
        name: {
          required: "Please enter project name"
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
    return $("#projectform").valid();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateprojectForm()) {
      // setError("Please fill in all required fields.");
        return;
      }
      setLoader(true);
    const updateData = { id, oldData };
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateproject`, {
      method: "PUT",
      headers: { "Content-Type": "application/json " },
      body: JSON.stringify(updateData),
    });
    const res = await response.json();
    if (res.success) {
      setLoader(false)
      toast.success('Project is updated Successfully!', {
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
          navigate("/projects");
        }, 1500);
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  return (
    <>
    <div className="flex relative items-center ">
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
      {/* <div className="bg-[#032e4e] rounded-[5px] ml-5 h-[30px] w-[10px]"></div> */}
      <div className="text-xl font-bold mx-2 my-8">Edit Project</div>
    </div>
    {loader && <div className="absolute top-64 h-full w-full  flex justify-center items-center"><div
        class=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>}
  </div>
        <div className="w-[70%] m-auto my-10">
          <form id="projectform">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Project Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  value={oldData?.name}
                  id="name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  required
                />
              </div>
              </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
          </form>
        </div>
      
    </>
  );
};

export default EditProject;
