import React, { useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import getUserFromToken from "./utils/getUserFromToken";
import { SlCalender } from "react-icons/sl";

const Sidebar = ({ sidebar }) => {
  const { role } = getUserFromToken();
  console.log(role);

  const [openSubMenu, setOpenSubMenu] = useState({
    attendance: false,
    admin: false,
    leave: false,
  });
  const toggleSubMenu = (menu) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <>
      <div className="h-full bg-[#032e4e] flex flex-col">
        <div
          id="docs-sidebar"
          className={`hs-overlay [--auto-close:lg] start-0 z-[60] w-64 border-gray-200 pt-7 pb-10 overflow-y-auto sidebar ${
            sidebar ? "open1" : "hidden1"
          }`}
        >
          <div className="px-6">
            <a
              className="flex-none text-xl font-semibold text-white"
              href="/"
              aria-label="Brand"
            >
              TMS
            </a>
          </div>
          <nav
            className="hs-accordion-group p-6 w-full flex flex-col flex-wrap mt-8"
            data-hs-accordion-always-open
          >
            <ul className="space-y-1.5">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Dashboard
                </NavLink>
              </li>

              <li className="hs-accordion" id="users-accordion">
                <button
                  onClick={() => toggleSubMenu("attendance")}
                  type="button"
                  className="justify-between active:bg-gray-100 hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-100 hover:text-black"
                >
                  <div className="flex items-center">
                    <SlCalender className="text-xl mr-4" />
                    Attendance Management
                  </div>
                  {openSubMenu.attendance ? (
                    <FaAngleDown className="text-end" />
                  ) : (
                    <FaAngleRight className="text-end" />
                  )}
                </button>
              </li>
              {openSubMenu.attendance && (
                <ul>
                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/attendance"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Attendance List
                      </NavLink>
                    </div>
                  </li>
                </ul>
              )}
              <li className="hs-accordion" id="users-accordion">
                <button
                  onClick={() => toggleSubMenu("leave")}
                  type="button"
                  className="justify-between active:bg-gray-100 hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-100 hover:text-black"
                >
                  <div className="flex items-center">
                    <svg
                      className="size-4 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Leave Management
                  </div>
                  {openSubMenu.leave ? (
                    <FaAngleDown className="text-end" />
                  ) : (
                    <FaAngleRight className="text-end" />
                  )}
                </button>
              </li>
              {openSubMenu.leave && (
                <ul>
                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/leaverequests"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Leave Requests
                      </NavLink>
                    </div>
                  </li>
                  {/* <li
                      id="users-accordion"
                      className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                    >
                      <div className="hs-accordion" id="users-accordion-sub-1">
                        <NavLink
                          to="/leavehistory"
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                              : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                          }
                        >
                          Leave History
                        </NavLink>
                        </div>
                        </li>*/}
                </ul>
              )}
              {(role === "Admin" || role === "admin") &&  (
                <>
                  <li className="hs-accordion" id="users-accordion">
                    <button
                      onClick={() => toggleSubMenu("admin")}
                      type="button"
                      className="justify-between active:bg-gray-100 hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-100 hover:text-black"
                    >
                      <div className="flex items-center">
                        <svg
                          className="size-4 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Admin
                      </div>
                      {openSubMenu.admin ? (
                        <FaAngleDown className="text-end" />
                      ) : (
                        <FaAngleRight className="text-end" />
                      )}
                    </button>
                  </li>

                  {openSubMenu.admin && <ul>
                    <li
                      id="users-accordion"
                      className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                    >
                      <div className="hs-accordion" id="users-accordion-sub-1">
                        <NavLink
                          to="/employees"
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                              : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                          }
                        >
                          Employee List
                        </NavLink>
                      </div>
                    </li>
                    <li
                      id="users-accordion"
                      className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                    >
                      <div className="hs-accordion" id="users-accordion-sub-1">
                        <NavLink
                          to="/employees/addemployee"
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                              : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                          }
                        >
                          Add Employee
                        </NavLink>
                      </div>
                    </li>
                    <li
                      id="users-accordion"
                      className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                    >
                      <div className="hs-accordion" id="users-accordion-sub-1">
                        <NavLink
                          to="/rolestable"
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                              : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                          }
                        >
                          Role List
                        </NavLink>
                      </div>
                    </li>
                    <li
                      id="users-accordion"
                      className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                    >
                      <div className="hs-accordion" id="users-accordion-sub-1">
                        <NavLink
                          to="/rolestable/addroles"
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                              : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                          }
                        >
                          Add Role
                        </NavLink>
                      </div>
                    </li>
                    <li
                      id="users-accordion"
                      className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                    >
                      <div className="hs-accordion" id="users-accordion-sub-1">
                        <NavLink
                          to="/permissionstable"
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                              : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                          }
                        >
                          Permission List
                        </NavLink>
                      </div>
                    </li>
                    <li
                      id="users-accordion"
                      className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                    >
                      <div className="hs-accordion" id="users-accordion-sub-1">
                        <NavLink
                          to="/permissionstable/addpermission"
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                              : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                          }
                        >
                          Add Permission
                        </NavLink>
                      </div>
                    </li>
                    <li>
                      <NavLink
                        to="/projects"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Projects
                      </NavLink>
                    </li>
                    <li
                      id="users-accordion"
                      className="hs-accordion-content w-full my-2 overflow-hidden transition-[height] duration-300"
                    >
                      <div className="hs-accordion" id="users-accordion-sub-1">
                        <NavLink
                          to="/projects/addproject"
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg ml-10 "
                              : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                          }
                        >
                          Add Project
                        </NavLink>
                      </div>
                    </li>
                  </ul>}
                </>
              )}
              <li>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <AiOutlineFundProjectionScreen className="text-lg" />
                  Tasks
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/holiday"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <AiOutlineFundProjectionScreen className="text-lg" />
                  Holiday
                </NavLink>
              </li>
              <li>
              <NavLink
                to="/activity"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg"
                    : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                }
              >
                <AiOutlineFundProjectionScreen className="text-lg" />
                Activity
              </NavLink>
            </li>
              <li>
                <NavLink
                  to="/setting"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <AiOutlineFundProjectionScreen className="text-lg" />
                  Setting
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
