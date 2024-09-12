import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
const ShowEmployee = () => {
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate()
  const initialState = {
    name: "",
    personal_email: "",
    password: "",
    company_email: "",
    contact_number: "",
    role: "",
    photo: null,
    document: null,
    department: "",
    designation: "",
    employee_type: "",
    shift_timing: "",
    permanent_address: "",
    current_address: "",
    work_location: "",
    joining_date: "",
    reporting_manager: "",
    date_of_birth: "",
    marriage_anniversary: "",
    nationality: "",
    gender: "",
    experience: "",
    hobbies: "",
    education: "",
    skills: [],
    bank_details: {
      acc_no: "",
      ifsc_code: "",
      acc_holder_name: "",
      bank_name: "",
      branch: "",
    },
    relative_name: "",
    relative_contact: "",
    relative_relation: "",
  };
  const params = useParams();
  const { id } = params;
  const [employeeDetail, setEmployeeDetail] = useState(initialState);
  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchRoleName = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      if (response.success) {
        setEmployeeDetail((prevState) => ({
          ...prevState,
          role: response.data[0]?.role,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchDepartmentName = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleDepartment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      if (response.success) {
        setEmployeeDetail((prevState) => ({
          ...prevState,
          department: response.data[0]?.department_name,
        }));
      }
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchEmployeeDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getesingleemployee`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        const formatDate = (dateString) => {
          if (dateString) {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0]; // Convert to yyyy-mm-dd format
          }
          return ""; // Return empty if dateString is null/undefined
        };
        setEmployeeDetail({
          ...employeeDetail,
          name: result.data[0]?.name,
          personal_email: result.data[0]?.personal_email,
          company_email: result.data[0]?.company_email,
          contact_number: result.data[0]?.contact_number,
          relative_contact: result.data[0]?.relative_contact,
          role: result.data[0]?.role,
          photo: result.data[0]?.photo?.url,
          document: result.data[0]?.document?.url,
          department: result.data[0]?.department,
          designation: result.data[0]?.designation,
          employee_type: result.data[0]?.employee_type,
          shift_timing: result.data[0]?.shift_timing,
          permanent_address: result.data[0]?.permanent_address,
          current_address: result.data[0]?.current_address,
          work_location: result.data[0]?.work_location,
          joining_date: formatDate(result.data[0]?.joining_date),
          reporting_manager: result.data[0]?.reporting_manager,
          date_of_birth: formatDate(result.data[0]?.date_of_birth),
          marriage_anniversary: formatDate(
            result.data[0]?.marriage_anniversary
          ),
          nationality: result.data[0]?.nationality,
          gender: result.data[0]?.gender,
          experience: result.data[0]?.experience,
          hobbies: result.data[0]?.hobbies,
          education: result.data[0]?.education,
          skills: result.data[0]?.skills.split(", "),
          bank_details: {
            acc_no: result.data[0]?.bank_details?.acc_no,
            ifsc_code: result.data[0]?.bank_details?.ifsc_code,
            acc_holder_name: result.data[0]?.bank_details?.acc_holder_name,
            bank_name: result.data[0]?.bank_details?.bank_name,
            branch: result.data[0]?.bank_details?.branch,
          },
        });
        if (!result.data[0].role && !result.data[0].department) {
          setLoader(false);
          return;
        }
        if (result.data[0].role) {
          fetchRoleName(result.data[0].role);
        } else {
          setLoader(false);
        }
        if (result.data[0].department) {
          fetchDepartmentName(result.data[0].department);
        } else {
          setLoader(false);
        }
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Failed to fetch old data:", error);
    }
  };

  const handleDocumentView = ()=>{
    if(!employeeDetail.document) {
      alert("There is no document attach with the profile!")
    }
    else{

      window.open(employeeDetail.document, "_blank");
    }
  }
  return (
    <div className="relative bg-gray-100">
      {loader ? (
        <div className="absolute h-full w-full top-64  flex justify-center items-center">
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
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <img
                    src={employeeDetail?.photo}
                    className="w-32 h-32  bg-gray-300 rounded-full mb-4 shrink-0"
                  ></img>
                  <h1 className="text-xl font-bold">
                    {employeeDetail?.name || "NA"}
                  </h1>
                  <p className="text-gray-700">
                    {employeeDetail?.designation || "NA"}
                  </p>
                  <IoMdDownload className="mt-4 text-2xl cursor-pointer" onClick={handleDocumentView}/>
                </div>
                <hr className="my-6 border-t border-gray-300" />
                <div className="flex flex-col">
                  <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                    Skills
                  </span>
                  <ul>
                    {employeeDetail?.skills.map((item) => {
                      return (
                        <li key={item} className="mb-2">
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
              <div className="bg-white shadow rounded-lg p-6">
                <div>
                  <h3 className="font-semibold text-center mt-3 text-lg">
                    Personal Information:
                  </h3>
                  <div className="flex justify-between mx-10 flex-wrap">
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Employee Name: </div>
                        <div>{employeeDetail?.name || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Personal Email: </div>
                        <div>{employeeDetail?.personal_email || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Company Email: </div>
                        <div>{employeeDetail?.company_email || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Contact number: </div>
                        <div>{employeeDetail?.contact_number || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Role: </div>
                        <div>{employeeDetail?.role || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Education: </div>
                        <div>{employeeDetail?.education || "NA"}</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Date of birth: </div>
                        <div>{employeeDetail?.date_of_birth || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Marriage anniversary: </div>
                        <div>
                          {employeeDetail?.marriage_anniversary || "NA"}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Nationality: </div>
                        <div>{employeeDetail?.nationality || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Gender: </div>
                        <div>{employeeDetail?.gender || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Experience: </div>
                        <div>{employeeDetail?.experience || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Hobbies: </div>
                        <div>{employeeDetail?.hobbies || "NA"}</div>
                      </div>
                    </div>
                    </div>
                    <div className=" mx-10 ">
                    <div className=" text-lg">
                    Current Address: {employeeDetail?.current_address || "NA"} 
                    </div>
                    </div>
                    <div className=" mx-10 my-2">
                    <div className=" text-lg">
                    Permanent Address: {employeeDetail?.permanent_address || "NA"} 
                    </div>
                    </div>
                </div>
                <div>
                  <h3 className="font-semibold text-center mt-3 text-lg">
                    Relaive/Spouse Information:
                  </h3>
                  <div className="flex mx-10 flex-wrap">
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Relative Name: </div>
                        <div>{employeeDetail?.relative_name || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Relative Contact: </div>
                        <div>{employeeDetail?.relative_contact || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Relative Relation: </div>
                        <div>{employeeDetail?.relative_relation || "NA "}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-center mt-3 text-lg">
                    Employment Details:
                  </h3>
                  <div className="flex justify-between mx-10 flex-wrap">
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Department: </div>
                        <div>{employeeDetail?.department || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Designation: </div>
                        <div>{employeeDetail?.designation || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Joining date: </div>
                        <div>{employeeDetail?.joining_date || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Employee Type: </div>
                        <div>{employeeDetail?.employee_type || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Shift timing: </div>
                        <div>{employeeDetail?.shift_timing || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Work Location: </div>
                        <div>{employeeDetail?.work_location || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Reporting manager: </div>
                        <div>{employeeDetail?.reporting_manager || "NA"}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-center mt-3 text-lg">
                    Bank Details:
                  </h3>
                  <div className="flex mx-10 flex-wrap">
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Account holder Name: </div>
                        <div>{employeeDetail?.bank_details?.acc_holder_name || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Account Number: </div>
                        <div>{employeeDetail?.bank_details?.acc_no || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>IFSC code: </div>
                        <div>{employeeDetail?.bank_details?.ifsc_code || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Bank name: </div>
                        <div>{employeeDetail?.bank_details?.bank_name || "NA "}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div>Bank Branch: </div>
                        <div>{employeeDetail?.bank_details?.branch || "NA "}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEmployee;
