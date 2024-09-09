import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Employees from "./components/employees/Employees";
import Home from "./components/Home";
import Projects from "./components/projects/Projects";
import Tasks from "./components/tasks/Tasks";
import AddProject from "./components/projects/AddProject";
import AddEmployee from "./components/employees/AddEmployee";
import AddTask from "./components/tasks/AddTask";
import EditTask from "./components/tasks/EditTask";
import EditProject from "./components/projects/EditProject";
import EditEmployee from "./components/employees/EditEmployee";
import RolesTable from "./components/roles/RolesTable";
import PermissionsTable from "./components/permissions/PermissionsTable";
import AddRole from "./components/roles/AddRole";
import AddPermission from "./components/permissions/AddPermission";
import EditRole from "./components/roles/EditRole";
import EditPermission from "./components/permissions/EditPermission";
import Login from "./components/Login";
import AuthProvider from "./context/AuthContext";
import PrivateRoute from "./components/utils/PrivateRoute";
import Setting from "./components/Setting";
import AdminRoute from "./components/utils/AdminRoute";
import EmployeeRoute from "./components/utils/EmployeeRoute";
import Attendance from "./components/attendance/Attendance";
import LeaveHistory from "./components/leaveManagement/LeaveHistory";
import LeaveRequests from "./components/leaveManagement/LeaveRequests";
import AddLeave from "./components/leaveManagement/AddLeave";
import EditLeave from "./components/leaveManagement/EditLeave";
import AddHoliday from "./components/Holiday/AddHoliday";
import HolidayTable from "./components/Holiday/HolidayTable";
import EditHoliday from "./components/Holiday/EditHoliday";
import AddActivity from "./components/Activity/AddActivity";
import ActivityTable from "./components/Activity/ActivityTable";
import EditActivity from "./components/Activity/EditActivity";
import PayrollTable from "./components/payroll/PayrollTable";
import AddPayroll from "./components/payroll/AddPayroll";
import EditPayroll from "./components/payroll/EditPayroll";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import ShowProject from "./components/projects/ShowProject";

function App() {
  const [sideBar, setSideBar] = useState(true);
  const toggleSideBar = () => {
    setSideBar(!sideBar);
  };
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    {
      path: "/forgotpassword",
      element: (
        <div>
          <ForgotPassword />
        </div>
      ),
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar sidebar={sideBar} />
            <div className="flex flex-col flex-grow overflow-y-auto">
              <Navbar toggleSideBar={toggleSideBar} />
              <div className="flex-grow ">
                <Home />
              </div>
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/employees",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <Employees />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },

    {
      path: "/employees/addemployee",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddEmployee />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/employee/editemployee/:id",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <EditEmployee />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/projects",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <Projects />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/projects/addproject",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddProject />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/projectjs/editproject/:id",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <EditProject />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/projects/showproject/:id",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <ShowProject />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/rolestable",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <RolesTable />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/rolestable/addroles",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddRole />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/roles/editrole/:id",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <EditRole />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/permissionstable",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <PermissionsTable />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/permissionstable/addpermission",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddPermission />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/permissionstable/editpermission/:id",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <EditPermission />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/tasks",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar sidebar={sideBar} />
            <div className="flex flex-col flex-grow overflow-y-auto">
              <Navbar toggleSideBar={toggleSideBar} />
              <div className="flex-grow ">
                <Tasks />
              </div>
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/tasks/addtask",
      element: (
        <PrivateRoute>
          <EmployeeRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddTask />
                </div>
              </div>
            </div>
          </EmployeeRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/tasks/edittask/:id",
      element: (
        <PrivateRoute>
          <EmployeeRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <EditTask />
                </div>
              </div>
            </div>
          </EmployeeRoute>
        </PrivateRoute>
      ),
    },

    {
      path: "/setting",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar sidebar={sideBar} />
            <div className="flex flex-col flex-grow overflow-y-auto">
              <Navbar toggleSideBar={toggleSideBar} />
              <div className="flex-grow ">
                <Setting />
              </div>
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/leavehistory",
      element: (
        <PrivateRoute>
          <EmployeeRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <LeaveHistory />
                </div>
              </div>
            </div>
          </EmployeeRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/leaverequests",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar sidebar={sideBar} />
            <div className="flex flex-col flex-grow overflow-y-auto">
              <Navbar toggleSideBar={toggleSideBar} />
              <div className="flex-grow ">
                <LeaveRequests />
              </div>
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/attendance",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar sidebar={sideBar} />
            <div className="flex flex-col flex-grow overflow-y-auto">
              <Navbar toggleSideBar={toggleSideBar} />
              <div className="flex-grow ">
                <Attendance />
              </div>
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/leaverequests/addleave",
      element: (
        <PrivateRoute>
          <EmployeeRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddLeave />
                </div>
              </div>
            </div>
          </EmployeeRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/leaverequests/editleave/:id",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar sidebar={sideBar} />
            <div className="flex flex-col flex-grow overflow-y-auto">
              <Navbar toggleSideBar={toggleSideBar} />
              <div className="flex-grow ">
                <EditLeave />
              </div>
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/holiday",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar sidebar={sideBar} />
            <div className="flex flex-col flex-grow overflow-y-auto">
              <Navbar toggleSideBar={toggleSideBar} />
              <div className="flex-grow ">
                <HolidayTable />
              </div>
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/holiday/editholiday/:id",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <EditHoliday />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/holiday/addholiday",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddHoliday />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/activity/addactivity",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddActivity />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/activity",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar sidebar={sideBar} />
            <div className="flex flex-col flex-grow overflow-y-auto">
              <Navbar toggleSideBar={toggleSideBar} />
              <div className="flex-grow ">
                <ActivityTable />
              </div>
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/activity/editactivity/:id",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <EditActivity />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/payroll",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <PayrollTable />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/payroll/editpayroll/:id",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <EditPayroll />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/payroll/addpayroll",
      element: (
        <PrivateRoute>
          <AdminRoute>
            <div className="flex h-screen">
              <Sidebar sidebar={sideBar} />
              <div className="flex flex-col flex-grow overflow-y-auto">
                <Navbar toggleSideBar={toggleSideBar} />
                <div className="flex-grow ">
                  <AddPayroll />
                </div>
              </div>
            </div>
          </AdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "*",
      element: (
        <PrivateRoute>
          <div className="flex h-screen justify-center items-center">
            <section className="bg-white dark:bg-gray-900">
              <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                  <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                    404
                  </h1>
                  <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                    Something's missing.
                  </p>
                  <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                    Sorry, we can't find that page. You'll find lots to explore
                    on the home page.{" "}
                  </p>
                  <a
                    href="/"
                    className="inline-flex text-white bg-primary-600  font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 bg-blue-900"
                  >
                    Back to Homepage
                  </a>
                </div>
              </div>
            </section>
          </div>
        </PrivateRoute>
      ),
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
