import React, { useEffect, useState } from "react";
import getUserFromToken from "../components/utils/getUserFromToken";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
const Home = () => {
  const userInfo = getUserFromToken();
  const [loader, setLoader] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [todayTasks, setTodayTasks] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    setLoader(true);
    // Execute all fetch requests in parallel and only hide loader when all of them are done.
    Promise.all([
      fetchProjectCount(),
      fetchUsersCount(),
      fetchTodayTasksCount(),
      fetchTotalTasks(),
    ]).finally(() => {
      setLoader(false);
    });
  }, []);

  const fetchProjectCount = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getprojectcount`);
    const response = await res.json();
    setTotalProjects(response.count);
  };
  const fetchUsersCount = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getemployeecount`);
    const response = await res.json();
    setTotalUsers(response.count);
  };
  const fetchTodayTasksCount = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/gettodaystask`);
    const response = await res.json();
    setTodayTasks(response.count);
  };
  const fetchTotalTasks = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/gettotaltasks?id=${userInfo?.id}`
    );
    const response = await res.json();
    setTotalTasks(response);
  };
  return (
    <div>
      {loader ? (
        <div className="absolute z-20 h-full w-full md:right-6 flex justify-center items-center">
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
        <div className="flex flex-col md:flex-row p-3 mb-6 w-full ">
          {userInfo?.role === "admin" || userInfo?.role === "Admin" ? (
            <>
              {" "}
              <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
                <NavLink to="/employees">
                  <div className="flex items-center">
                    <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                        {totalUsers}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Total Users
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>
              <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
                <NavLink to="/projects">
                  <div className="flex items-center">
                    <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                        {totalProjects}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Total Projects
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>
              <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
                <NavLink to="/tasks">
                  <div className="flex items-center">
                    <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                        {todayTasks}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Today's Tasks
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col flex-1 my-1">
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4  ">
                  <NavLink to="/tasks">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                          {todayTasks}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Today's Tasks
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4  my-2">
                  <NavLink to="/tasks">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                          2
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Assigned Leaves
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4  my-2">
                  <NavLink to="/tasks">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                          1
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Completed Leaves
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
              <div className="flex flex-col flex-1 my-1">
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 ">
                  <NavLink to="/tasks">
                    <div className="flex items-center">
                      <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] to-voilet-500 rounded-lg">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                          {totalTasks}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Total Tasks
                        </h3>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="rounded-2xl shadow-lg shadow-gray-200 p-3 mx-1 py-5">
                  <div className="flex justify-between items-center">
                    <div className="font-bold flex items-center"><span className="inline-block mr-2 h-5 w-5 rounded-full bg-[#1E88E5] "></span>Upcoming Activites/Events</div>
                    <div>
                      <IoIosArrowRoundForward className="text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col my-3">
                      <div className="flex items-center ">
                        <div className="mr-2 text-lg">10 Sep</div>
                        <div className="text-sm font-thin">Tuesday</div>
                      </div>
                      <div className="text-sm  font-thin">Meeting</div>
                    </div>

                    <div className="flex flex-col my-3">
                      <div className="flex items-center ">
                        <div className="mr-2 text-lg">28 Sep</div>
                        <div className="text-sm font-thin">Friday</div>
                      </div>
                      <div className="text-sm  font-thin">Fun Activity</div>
                    </div>
                    <div className="flex flex-col my-3">
                      <div className="flex items-center ">
                        <div className="mr-2 text-lg">5 Oct </div>
                        <div className="text-sm font-thin">Wednesday</div>
                      </div>
                      <div className="text-sm  font-thin">New member meet</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 my-1">
                <div className="rounded-2xl shadow-lg shadow-gray-200 p-3 mx-1">
                  <div className="flex justify-between items-center">
                    <div className="font-bold flex items-center"><span className="inline-block mr-2 h-5 w-5 rounded-full bg-[#1E88E5] "></span>Upcoming Holidays</div>
                    <div>
                      <IoIosArrowRoundForward className="text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col my-3">
                      <div className="flex items-center ">
                        <div className="mr-2 text-lg">16 Sep</div>
                        <div className="text-sm font-thin">Monday</div>
                      </div>
                      <div className="text-sm  font-thin">Eid-E-Milad</div>
                    </div>

                    <div className="flex flex-col my-3">
                      <div className="flex items-center ">
                        <div className="mr-2 text-lg">02 Oct</div>
                        <div className="text-sm font-thin">Wednesday</div>
                      </div>
                      <div className="text-sm  font-thin">Gandhu jayanti</div>
                    </div>
                    <div className="flex flex-col my-3">
                      <div className="flex items-center ">
                        <div className="mr-2 text-lg">11 Oct </div>
                        <div className="text-sm font-thin">Friday</div>
                      </div>
                      <div className="text-sm  font-thin">Maha Ashtami</div>
                    </div>
                    <div className="flex flex-col my-3">
                      <div className="flex items-center ">
                        <div className="mr-2 text-lg">16 Sep</div>
                        <div className="text-sm font-thin">Monday</div>
                      </div>
                      <div className="text-sm  font-thin">Eid-E-Milad</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
