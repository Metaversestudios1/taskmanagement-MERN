import React, { useEffect,useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
// import 'jquery-validation'; // Ensure the validation plugin is also importe
import "jquery-validation";

const Addappraisal = () => {
  const navigate = useNavigate();
  const initialState = {
    employee_id: "",
    period_start: "",
    period_end: "",
    overall_rating: "",
    criteria: "",
    goals_for_next_period: "",
    appraisal_date: "",
  };
  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [employees, setEmployees] = useState([]);




  useEffect(() => {
      fetchEmployees();
  },[]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  // Separate validation function
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
    const res = await fetch(`http://localhost:3000/api/getemployee`);
    const response = await res.json();
   
    if (response.success) {
      setEmployees(response.result);
    }

  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateappraisalForm()) {
      // setError("Please fill in all required fields.");
      return;
    }
    setLoader(true);
    
    try {
      const res = await fetch(`http://localhost:3000/api/insertappraisal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
        setError("");
        setLoader(false)
        toast.success("New Appraisal is added successfully!", {
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
          navigate("/appraisal");
        }, 1500);
      } else {
        setError(
          response.message || "An error occurred while adding the appraisal."
        );
      }
    } catch (error) {
      setError("An error occurred while adding the appraisal.");
      console.error("Error adding appraisal:", error);
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
          
          <div className="text-2xl font-bold mx-2 my-8 px-4">
            Add Appraisal
          </div>
        </div>
        {loader && <div className="absolute h-full w-full top-64  flex justify-center items-center"><div
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
             value={data?.employee_id}
             className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 m-auto"
         
             >
                <option value="">select an employee</option>
                {employees.map((item) => (
                    <option
                    key={item._id}
                    value={item._id}
                    className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                    >{item.name}</option>
                ))}

             </select>
            </div>
            <div className="form-group">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
               Appraisal Date<span className="text-red-900 text-lg">*</span>
              </label>
              <input
                name="appraisal_date"
                value={data.appraisal_date}
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
                value={data.period_start}
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
                value={data.period_end}
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
                value={data.overall_rating}
                onChange={handleChange}
                type="text"
                id="overall_rating"
                placeholder="out of 5"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="criteria" className="block mb-2 text-sm">
              Criteria
              </label>
              <input
                name="criteria"
                value={data.criteria}
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
                value={data.goals_for_next_period}
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

export default Addappraisal;
