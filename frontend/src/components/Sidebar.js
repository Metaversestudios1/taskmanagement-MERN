import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import getUserFromToken from "./utils/getUserFromToken";

const Sidebar = () => {
  const {role} = getUserFromToken()

  const [openSubMenu, setOpenSubMenu] = useState(false);

  return (
    <>
      <div className="h-full bg-[#032e4e] flex flex-col">
        <div
          id="docs-sidebar"
          className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden start-0 z-[60] w-64 border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
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
          <hr className="mt-3" />
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
              {role==="Admin" && <li className="hs-accordion" id="users-accordion">
                <button
                  onClick={() => {
                    setOpenSubMenu(!openSubMenu);
                  }}
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
                  {openSubMenu ? (
                    <FaAngleDown className="text-end" />
                  ) : (
                    <FaAngleRight className="text-end" />
                  )}
                </button>
              </li>}
              {openSubMenu && (
                <ul>
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
                </ul>
              )}
              {/*<li>
                <NavLink
                  to="/rolestable"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <RiAdminLine className="text-lg" />
                  Roles Table
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/permissionstable"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-blue-600 rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <MdOutlineSecurity className="text-lg" />
                  Permissions Table
                </NavLink>
              </li>*/}
              
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