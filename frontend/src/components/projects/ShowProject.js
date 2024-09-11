import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const ShowProject = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const params = useParams();
  const { id } = params;
  const initialState = {
    name: "",
    scope_finalization_date: "",
    kickoff_date: "",
    start_date: "",
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
      setLoader(true);
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
          setLoader(false);
          const formatDate = (dateString) => {
            if (dateString) {
              const date = new Date(dateString);
              return date.toISOString().split("T")[0]; // Convert to yyyy-mm-dd format
            }
            return ""; // Return empty if dateString is null/undefined
          };
          setOldData({
            name: res.result[0]?.name,
            scope_finalization_date: formatDate(
              res.result[0]?.scope_finalization_date
            ),
            kickoff_date: formatDate(res.result[0]?.kickoff_date),
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
            status: res.result[0]?.status,
            end_date: formatDate(res.result[0]?.end_date),
          });
        } else {
          setLoader(false);
          console.error("No data found for the given parameter.");
        }
      } catch (error) {
        console.error("Failed to fetch old data:", error);
      }
    };

    fetchOldData();
  }, [id]);

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  return (
    <>
      <div className=" relative items-center ">
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
          <div className="text-xl font-bold mx-2 my-8">Project Details</div>
        </div>

        {loader ? (
          <div className="absolute top-64 h-full w-full  flex justify-center items-center">
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
          <>
            <div className="w-[70%] m-auto my-10">
              <form id="projectform">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Project Name : {oldData.name}
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="start_date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Start Date : {oldData.start_date}
                    </label>
                  </div>
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-1">
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Project Description: {oldData.description}
                    </label>
                  </div>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="no_of_sprints"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      No of Sprints:{oldData.no_of_sprints}
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="scope_finalization_date"
                      className="block mb-2 text-sm  text-gray-900 dark:text-black font-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Scope Finalization Date :{" "}
                      {oldData.scope_finalization_date}
                    </label>
                  </div>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="kickoff_date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Kickoff Date : {oldData.kickoff_date}
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="no_of_milestones"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      No of Milestones : {oldData.no_of_milestones}
                    </label>
                  </div>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="assigned_manager"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      No of Assigned Manager : {oldData.assigned_manager}
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="designer"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Designer : {oldData.designer}
                    </label>
                  </div>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="developer"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Developer : {oldData.developer}
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="project_duration"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Project Duration : {oldData.project_duration}
                    </label>
                  </div>
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="end_date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      End Date : {oldData.end_date}
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="Comment"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Comment : {oldData.comment}
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="Status"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                      style={{ fontWeight: "bold" }}
                    >
                      Status :
                      {oldData.status === 0
                        ? "Inactive"
                        : oldData.status === 1
                        ? "Active"
                        : "unknown"}
                    </label>
                  </div>
                </div>

                {/* {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>} */}
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShowProject;
