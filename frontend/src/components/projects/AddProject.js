import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddProject = () => {
  const navigate = useNavigate()

  const initialState = {
    name: "",
  };
  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!(data.name)) {
      setError("Please provide field.")
    }
 
    const res = await fetch("http://localhost:3000/api/insertproject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.success) {
      toast.success('New Project is added Successfully!', {
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


  const handleGoBack = ()=>{
    navigate(-1)
  }
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
          <div className="text-xl font-bold mx-2 my-8">Add Project</div>
        </div>
      </div>


       
        <div className="w-[70%] m-auto my-10">
          <form>
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
                  value={data.name}
                  onChange={handleChange}
                  type="text"
                  id="name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Enter the project name"
                  required
                />
              </div>
              </div>

              {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
            <button
            onClick={handleSubmit}
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ADD
            </button>
          </form>
        </div>
     
    </>
  );
};

export default AddProject;


//  <div
//           aria-label="Loading..."
//           role="status"
//           class="flex items-center justify-center space-x-2 mx-5"
//         >
//           <svg
//             class="h-12 w-12 animate-spin stroke-gray-500"
//             viewBox="0 0 256 256"
//           >
//             <line
//               x1="128"
//               y1="32"
//               x2="128"
//               y2="64"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="195.9"
//               y1="60.1"
//               x2="173.3"
//               y2="82.7"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="224"
//               y1="128"
//               x2="192"
//               y2="128"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="195.9"
//               y1="195.9"
//               x2="173.3"
//               y2="173.3"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="128"
//               y1="224"
//               x2="128"
//               y2="192"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="60.1"
//               y1="195.9"
//               x2="82.7"
//               y2="173.3"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="32"
//               y1="128"
//               x2="64"
//               y2="128"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//             <line
//               x1="60.1"
//               y1="60.1"
//               x2="82.7"
//               y2="82.7"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="24"
//             ></line>
//           </svg>
//         </div>