import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams, useRoutes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from 'jquery';
import 'jquery-validation';

const Editappraisal = () => {
    const navigate = useNavigate();
    const { id } = useParams();
  const initialState = {
    employee_id: "",
    period_start: "",
    period_end: "",
    overall_rating: "",
    criteria: "",
    goals_for_next_period: "",
    appraisal_date: "",
  };
  const [oldData, setOldData] = useState(initialState);
  const [employees,setEmployees] = useState([])
  const [error, setError] = useState("");
  const [loader,setLoader] =useState(false)
  const [appraisal, setAppraisal] = useState([]);

  useEffect(() => {
    fetchOldData();
    fetchAllAppraisal();
    fetchEmployees();
  }, []);

  const validateappraisalForm = () => {
    // Initialize jQuery validation
    $("#appraisalform").validate({
      rules: {
        employee_id: {
          required: true,
        },
        appraisal_date: {
          required: true,
        },
        overall_rating: {
          required: true,
          digit:true,
        },
       
      },
      messages: {
        employee_id: {
          required: "Please select employee",
        },
        appraisal_date: {
          required: "Please select appraisal",
        },
        overall_rating: {
          required: "Please enter rating ",
           digit:"please enter valid number"
        },
        
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-criteria");
        error.insertAfter(element);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    // Return validation status
    return $("#appraisalform").valid();
  };


  const fetchEmployees = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getemployee`);
    const response = await res.json();
   
    if (response.success) {
      setEmployees(response.result);
    }

  };
  const fetchOldData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleAppraisal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      
      // Ensure response.data is valid and contains elements
      if (response && Array.isArray(response.data) && response.data.length > 0) {
        // console.log( response.data[0].employee_id);
        
        const formatDate = (dateString) => {
          if (dateString) {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // Convert to yyyy-mm-dd format
          }
          return ''; // Return empty if dateString is null/undefined
        };

        setOldData({
          period_start: formatDate(response.data[0].period_start),
          period_end: formatDate(response.data[0].period_end),
          appraisal_date: formatDate(response.data[0].appraisal_date), // Changed from response.result[0]
          employee_id: response.data[0].employee_id,
          overall_rating: response.data[0].overall_rating,
          criteria: response.data[0].criteria,
          goals_for_next_period: response.data[0].goals_for_next_period,
        });
      } else {
        console.error("No data found for the given ID.");
      }
    } catch (error) {
      console.error("Error fetching old data:", error);
    }
  };

  

  const fetchAllAppraisal = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllappraisal`);
      const response = await res.json();
      if (response.success) {
        setAppraisal(response.result);
      }
    } catch (error) {
      console.error("Error fetching Appraisal:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateappraisalForm()) {
        //setError("Please fill in all required fields.");
        return;
      }
      setLoader(true);
    try {
        const updateData = { id, oldData };
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateappraisal`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData), // Spread oldData into the body
      });
      const response = await res.json();
      if (response.success) {
        setLoader(false)
        toast.success('Appraisal is updated successfully!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        // Uncomment if you want to navigate after successful update
         setTimeout(() => navigate("/appraisal"), 1500);
      } else {
        setError(response.message || "Failed to update Appraisal.");
      }
    } catch (error) {
      console.error("Error updating Appraisal:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex items-center relative">
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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Appraisal</div>
        </div>
        {loader && <div className="absolute h-full w-full top-64 flex justify-center items-center"><div
        className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div></div>}

      </div>

      <div className="w-[70%] m-auto my-10">
           <form onSubmit={handleSubmit} id="appraisalform">
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="reason" className="block mb-2 text-sm">
                Employee<span className="text-red-900 text-lg">*</span>
              </label>
              <select
                                name="employee_id"
                                id="employee_id"
                                onChange={handleChange}
                                disabled
                                value={oldData.employee_id}
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 m-auto"
                            >
                                <option value="">Select an employee</option>
                                {employees.map((item) => (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>           </div>
            <div className="form-group">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
               Appraisal Date<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="appraisal_date"
                value={oldData.appraisal_date}
                onChange={handleChange}
                type="date"
                id="appraisal_date"
                className="form-control bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="period_start"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
               Start Period
              </label>
              <input
                name="period_start"
                value={oldData.period_start}
                onChange={handleChange}
                type="date"
                id="period_start"
                className="form-control bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
               End Period
              </label>
              <input
                name="period_end"
                value={oldData.period_end}
                onChange={handleChange}
                type="date"
                id="period_end"
                className="form-control bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            
            <div>
              <label htmlFor="overall_rating" className="block mb-2 text-sm">
                Rating/Stars
                <span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="overall_rating"
                value={oldData.overall_rating}
                onChange={handleChange}
                type="text"
                id="overall_rating"
                placeholder="out of 5"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="criteria" className="block mb-2 text-sm">
              criteria
              </label>
              <input
                name="criteria"
                value={oldData.criteria}
                onChange={handleChange}
                type="text"
                id="criteria"
                placeholder="criteria"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>{" "}
            <div>
              <label
                htmlFor="goals_for_next_period"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Goals For Next Period
              </label>
              <textarea
                name="goals_for_next_period"
                value={oldData.goals_for_next_period}
                onChange={handleChange}
                type="text"
                id="goals_for_next_period"
                placeholder="goals for next period"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
          </div>

          {error && <p className="text-red-900 text-[17px] mb-5">{error}</p>}
          <div>
            <button
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

export default Editappraisal;
