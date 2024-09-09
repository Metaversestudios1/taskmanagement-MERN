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
    scope_finalization_date: "",
    kickoff_date: "",
    start_Date: "",
    no_of_milestones: "",
    no_of_sprints: "",
    no_of_leads_assigned: "",
    designer: "",
    developer: "",
    project_duration: "",
    assigned_manager: "",
    description: "",
    comment: "recent",
    status: "0",
    end_date: "",
  };
  const [oldData, setOldData] = useState(initialState);
  useEffect(() => {
    const fetchOldData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/getSingleproject`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );
        const res = await response.json();
        if (res.result[0]) {
          const formatDate = (dateString) => {
            if (dateString) {
              const date = new Date(dateString);
              return date.toISOString().split('T')[0]; // Convert to yyyy-mm-dd format
            }
            return ''; // Return empty if dateString is null/undefined
          };
          setOldData({
            name: res.result[0]?.name,
            scope_finalization_date: formatDate(res.result[0]?.scope_finalization_date),
            kickoff_date:formatDate(res.result[0]?.kickoff_date),
            start_date: formatDate(res.result[0]?.start_date),
            no_of_milestones: res.result[0]?.no_of_milestones,
            no_of_sprints: res.result[0]?.no_of_sprints,
            no_of_leads_assigned: res.result[0]?.no_of_leads_assigned,
            designer: res.result[0]?.designer,
            developer: res.result[0]?.developer,            
            project_duration: res.result[0]?.project_duration,
            assigned_manager: res.result[0]?.assigned_manager,
            description: res.result[0]?.description,
            comment: res.result[0]?.comment,
            end_date: formatDate(res.result[0]?.end_date),              


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
    $("#projectform").validate({
      rules: {
        name: {
          required: true
        },
        no_of_milestones: {
          digits: true,
        },
        no_of_sprints: {
          digits: true,
        },
       
        project_duration: {
          digits: true,
        },
        description: {
          required: true,
          minlength: 100 // Minimum length validation
        }
      },
      messages: {
        name: {
          required: "Please enter project name"
        },
        description: {
          required: "Please enter a description",
          minlength: "Description must be at least 100 characters long" // Error message for minlength
     
        },
        no_of_milestones: {
          digits: "Please enter a valid number"
        },
        no_of_sprints: {
          digits: "Please enter a valid number"
        },
        project_duration: {
          digits: "Please enter a valid number"
        }
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
    const response = await fetch(`http://localhost:3000/api/updateproject`, {
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
          className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
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
                Project Name<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="name"
                value={oldData.name}
                onChange={handleChange}
                type="text"
                id="name"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Project name"

              />
            </div>

            <div>
              <label
                htmlFor="start_date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Start Date
              </label>
              <input
                name="start_date"
                value={oldData.start_date}
                onChange={handleChange}
                type="date"
                id="start_date"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="123-45-678"
              />

            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Project Description<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <textarea
                name="description"
                value={oldData.description}
                onChange={handleChange}
                type="text"
                id="description"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Description"

              />
            </div>

          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="no_of_sprints"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                No of Sprints<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="no_of_sprints"
                value={oldData.no_of_sprints}
                onChange={handleChange}
                type="text"
                id="no_of_sprints"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="No of Sprints"

              />
            </div>

            <div>
              <label
                htmlFor="scope_finalization_date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Scope Finalization Date
              </label>
              <input
                name="scope_finalization_date"
                value={oldData.scope_finalization_date}
                onChange={handleChange}
                type="date"
                id="scope_finalization_date"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="123-45-678"

              />

            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="kickoff_date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Kickoff Date
              </label>
              <input
                name="kickoff_date"
                value={oldData.kickoff_date}
                onChange={handleChange}
                type="date"
                id="kickoff_date"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="John"

              />
            </div>

            <div>
              <label
                htmlFor="no_of_milestones"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                No of Milestones
              </label>
              <input
                name="no_of_milestones"
                value={oldData.no_of_milestones}
                onChange={handleChange}
                type="text"
                id="no_of_milestones"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="no of milestones"

              />

            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="assigned_manager"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                No of Assigned Manager
              </label>
              <input
                name="assigned_manager"
                value={oldData.assigned_manager}
                onChange={handleChange}
                type="text"
                id="assigned_manager"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Leads"

              />
            </div>

            <div>
              <label
                htmlFor="designer"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Designer
              </label>
              <input
                name="designer"
                value={oldData.designer}
                onChange={handleChange}
                type="text"
                id="designer"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Designer"

              />

            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="developer"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Developer
              </label>
              <input
                name="developer"
                value={oldData.developer}
                onChange={handleChange}
                type="text"
                id="developer"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="developer"

              />
            </div>

            <div>
              <label
                htmlFor="project_duration"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Project Duration
              </label>
              <input
                name="project_duration"
                value={oldData.project_duration}
                onChange={handleChange}
                type="text"
                id="project_duration"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="duration in days "

              />

            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="end_date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                End Date
              </label>
              <input
                name="end_date"
                value={oldData.end_date}
                onChange={handleChange}
                type="date"
                id="end_date"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="123-45-678"

              />

            </div>
            <div>
              <label
                htmlFor="Comment"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                 Comment
              </label>
              <textarea
                name="comment"
                value={oldData.comment}
                onChange={handleChange}
                id="comment"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                
              />
            </div>

          </div>

          {/* {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>} */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            ADD
          </button>
        </form>
      </div>

    </>
  );
};

export default EditProject;
