import React, { useEffect, useState } from "react";
import getUserFromToken from "../components/utils/getUserFromToken";
import { NavLink } from "react-router-dom";
const Home = () => {
  const userInfo = getUserFromToken();
  const [totalUsers, setTotalUsers] = useState(0);
  const [todayTasks, setTodayTasks] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    fetchProjectCount();
    fetchUsersCount();
    fetchTodayTasksCount();
    fetchTotalTasks();
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
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/gettotaltasks?id=${userInfo?.id}`);
    const response = await res.json();
    setTotalTasks(response)
  };
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 p-3 mb-6 w-full xl:grid-cols-2 2xl:grid-cols-4">
        {userInfo?.role === "admin" || userInfo?.role === "Admin" ? (
          <>
            {" "}
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
            <NavLink
                to="/employees">
                
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
               <NavLink
                to="/projects">
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
            <NavLink
                to="/tasks">
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
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
            <NavLink
                to="/tasks">
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
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
              
            <NavLink
                to="/tasks">
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
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
