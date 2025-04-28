"use client";
import { useState, useEffect, createContext, useContext } from "react";
import EventCard from "./(approvalComponents)/Approvalcard";
import { fetchAllApproval, SubmitedApproval } from "@/_api_/approval";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ApprovalBox from "./(approvalComponents)/ApprovalBox";
import { toast, ToastContainer } from "react-toastify";

const categories = ["All", "Star of month"];

export const ApprovalData = createContext();
export default function ApprovalPage() {
  const [approvalModeActivated, setApprovalModeActivated] = useState(false);
  const [approvlemodeData, setApprovalModeData] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [nominatedEmployee, setNominatedEmployee] = useState([]);
  const [submiteData, setSubnmiteData] = useState(null);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const time = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (user && user.userRole != 1 && user.userRole != 2) {
      router.push("/dashboard");
      return;
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAllApproval(user?.userRole);
        setNominatedEmployee(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (submiteData) {
      const SubmiteApproval = async () => {
        try {
          toast.success("Submit successfull");
          setNominatedEmployee((prev) =>
            prev.filter((item) => item.employeeName?.id !== submiteData.UserId)
          );
          setSubnmiteData(null);
          setApprovalModeActivated(false);
        } catch (error) {
          console.error(error);
        }
      };
      SubmiteApproval();
    }
  }, [submiteData]);


  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100">
      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all shadow-md  ${
              selectedCategory === category
                ? "bg-purple-600 text-white"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      <div
        className={`${
          (time.getDate() < 16 || time.getDate() > 20) && user?.userRole == 2
            ? "flex justify-center items-center"
            : nominatedEmployee.length != 0 &&
              time.getDate() >= 16 &&
              time.getDate() <= 20 &&
              user?.userRole == 2
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            : (time.getDate() < 20 || time.getDate() > 25) &&
              user?.userRole == 1
            ? "flex justify-center items-center"
            : nominatedEmployee.length != 0 &&
              time.getDate() >= 21 &&
              time.getDate() <= 25 &&
              user?.userRole == 1
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            : nominatedEmployee.length == 0
            ? "flex justify-center items-center"
            : "flex justify-center items-center"
        }`}
      >
        {nominatedEmployee.length > 0 &&
        !loading &&
        time.getDate() >= 16 &&
        time.getDate() <= 20 &&
        user?.userRole == 2 ? (
          nominatedEmployee.map((event, index) => (
            <div
              key={event.id}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex justify-center"
            >
              <ApprovalData.Provider
                value={{
                  setNominatedEmployee,
                  nominatedEmployee,
                  setApprovalModeActivated,
                  setApprovalModeData,
                }}
              >
                {(selectedCategory === "All" ||
                  selectedCategory === "Star of month") && (
                  <EventCard
                    NominationType={event.nomination_Type}
                    NominationReason={event.managerReason}
                    NominatedName={event.employeeName.name}
                    Image={event.employeeName?.image}
                    userId={event.employeeName?.id}
                    NominatedBy={event.nominated_ByUser?.name}
                    NominationId={index}
                    Role={user.userRole}
                  />
                )}
              </ApprovalData.Provider>
            </div>
          ))
        ) : time.getDate() < 16 && user?.userRole == 2 ? (
          <p className="text-center text-black text-xl sm:text-2xl md:text-3xl px-4">
            The review portal will open on 16th {monthNames[time.getMonth()]}
          </p>
        ) : time.getDate() > 20 && user?.userRole == 2 ? (
          <p className="text-center justify-center text-black text-xl sm:text-2xl md:text-3xl px-4">
            The review portal will close for {monthNames[time.getMonth()]}
          </p>
        ) : nominatedEmployee.length > 0 &&
          !loading &&
          time.getDate() > 20 &&
          time.getDate() <= 25 &&
          user?.userRole == 1 ? (
          nominatedEmployee.map((event, index) => (
            <div
              key={event.id}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex justify-center"
            >
              <ApprovalData.Provider
                value={{
                  setNominatedEmployee,
                  nominatedEmployee,
                  setApprovalModeActivated,
                  setApprovalModeData,
                }}
              >
                {(selectedCategory === "All" ||
                  selectedCategory === "Star of month") && (
                  <EventCard
                    NominationType={event.nomination_Type}
                    NominationReason={event?.managerReason!=null?event?.managerReason: event?.hrReason}
                    NominatedName={event.employeeName.name}
                    Image={event.employeeName?.image}
                    userId={event.employeeName?.id}
                    NominatedBy={event.nominated_ByUser?.name}
                    NominationId={index}
                    Role={user.userRole}
                  />
                )}
              </ApprovalData.Provider>
            </div>
          ))
        ) : time.getDate() < 21 && user?.userRole == 1 ? (
          <p className="text-center text-black text-xl sm:text-2xl md:text-3xl px-4">
            The approval portal will open on 16th {monthNames[time.getMonth()]}
          </p>
        ) : time.getDate() > 25 && user?.userRole == 1 ? (
          <p className="text-center text-black text-xl sm:text-2xl md:text-3xl px-4">
            The approval portal will close for {monthNames[time.getMonth()]}
          </p>
        ) : (
          <p className="text-center text-black text-xl sm:text-2xl md:text-3xl px-4">
            No further approvals are available
          </p>
        )}
      </div>

      {/* Modal Box for Approval */}
      {approvalModeActivated && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black bg-opacity-50 overflow-y-auto pt-10 px-4 sm:px-0">
          <div className="w-full max-w-4xl bg-white rounded-lg p-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <ApprovalData.Provider
              value={{
                setApprovalModeActivated,
                setSubnmiteData,
                approvalModeActivated,
              }}
            >
              <ApprovalBox
                ManagerRating={
                  nominatedEmployee[approvlemodeData].managerRating
                }
                HrRating={nominatedEmployee[approvlemodeData].hrRating}
                ManagerReson={nominatedEmployee[approvlemodeData].managerReason}
                HrReason={nominatedEmployee[approvlemodeData].hrReason}
                NominatedName={
                  nominatedEmployee[approvlemodeData].employeeName?.name
                }
                NominatedBy={
                  nominatedEmployee[approvlemodeData].nominated_ByUser?.name
                }
                NominatedEmployeeId={
                  nominatedEmployee[approvlemodeData].employeeName?.id
                }
              />
            </ApprovalData.Provider>
          </div>
        </div>
      )}
    </div>
  );
}
