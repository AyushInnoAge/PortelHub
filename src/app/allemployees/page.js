"use client";
import "./page.css";
import { useState, useEffect, useContext } from "react";
import { Pencil, X } from "lucide-react";
import { fetchAllEmployeesByTeamLeaderId } from "@/_api_/nomination";
import { FetchAllDepartment, FetchAllRole, FetchAllTeam } from "@/_api_/signup";
import { SubmiteEmployeeData } from "@/_api_/allemployees";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { ImBlocked } from "react-icons/im";
import { lockUserProfile } from "@/_api_/profilepage";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
export default function EmployeeListPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [department, setDepartment] = useState([]);
  const [role, setRole] = useState([]);
  const [team, setTeam] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [Name, setName] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [image, setImage] = useState(null);
  const [Empid, setEmpid] = useState(null);
  const [deactivateModal, setDeactivateModal] = useState(null);

  useEffect(() => {
    if (user && user.userRole != 1 && user.userRole != 2) {
      router.push("/dashboard");
      return;
    }
  }, [user]);

  useEffect(() => {
    try {
      const fetch = async () => {
        const fetchalldepartment = await (await FetchAllDepartment()).json();
        fetchalldepartment.unshift({
          id: "1",
          departmentName: "All",
        });
        setDepartment(fetchalldepartment);

        const fetchallusers = await fetchAllEmployeesByTeamLeaderId(true);

        setEmployees(fetchallusers.data.employeeData);

        const fetchallrole = await FetchAllRole();
        setRole(await fetchallrole.json());
        const seen = new Set();
        const filtered = [];

        for (const e of fetchallusers.data.employeeData) {
          const role = e.role.roleName;
          if (["TeamLeader", "HR", "Admin"].includes(role) && !seen.has(e.id)) {
            seen.add(e.id);
            filtered.push({ id: e.id, teamName: e.name, teamLeader: e.id });
          }
        }
        setTeam(filtered);
      };

      fetch();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const filteredEmployees =
    filter === "All"
      ? employees
      : employees.filter((emp) => emp.department?.departmentName === filter);
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee({ ...editingEmployee, [name]: value });
  };

  const handleEditSubmit = () => {
    const updated = employees.map((emp) =>
      emp.id === editingEmployee.id ? editingEmployee : emp
    );
    setEmployees(updated);
    setEditingEmployee(null);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingEmployee((prev) => ({
          ...prev,
          image: reader.result, // Temporarily display preview before upload
          imageFile: file, // Store actual file for API upload
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submiteAllData = async () => {
    try {
      const response = await SubmiteEmployeeData(
        Name ? Name : editingEmployee?.name,
        email ? email : editingEmployee?.email,
        phoneNumber ? phoneNumber : editingEmployee?.phoneNo,
        designation ? designation : editingEmployee?.designation,
        image ? image : null,
        selectedDepartmentId
          ? selectedDepartmentId
          : editingEmployee?.departmentId,
        selectedRoleId ? selectedRoleId : editingEmployee?.roleId,
        selectedTeamId ? selectedTeamId : editingEmployee?.teamId,
        editingEmployee?.employeeId
      );
      if (response.statusCode === 200) {
        const fetchallUser = await fetchAllEmployeesByTeamLeaderId(true);
        setEmployees(fetchallUser.data.employeeData);
        toast.success("Employee data updated successfully!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {deactivateModal && (
        <div className="modal-backdrop">
          <div className="warning-modal">
            <div className="warning-content">
              <h3>Warning!</h3>
              <p>Are you sure you want to deactivate this user?</p>
              <div className="warning-buttons">
                <button
                  className="no-btn"
                  onClick={() => setDeactivateModal(null)}
                >
                  No
                </button>
                <button
                  className="yes-btn"
                  onClick={async () => {
                    try {
                      const resp = await lockUserProfile(
                        deactivateModal.employeeId
                      );
                      if (resp.statusCode === 200) {
                        toast.success("User deactivated successfully!");

                        const fetchallusers =
                          await fetchAllEmployeesByTeamLeaderId();
                        setEmployees(fetchallusers.data.employeeData);

                        setDeactivateModal(null);
                      }
                    } catch (error) {
                      console.error("Error deactivating user:", error);
                      alert("Failed to deactivate user. Please try again.");
                    }
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        className="add-activity-btn"
        style={{ marginLeft: "auto" }}
        onClick={() => {
          router.push("/signup");
          return;
        }}
      >
        <span className="plus-icon">+ </span>Add New Employee
      </button>
      <div className="filter-buttons">
        {department.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setFilter(dept?.departmentName)}
            className={`filter-btn ${
              filter === dept?.departmentName ? "active" : ""
            }`}
          >
            {dept?.departmentName}
          </button>
        ))}
      </div>

      <div className="employee-list">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="employee-card">
            <div className="employee-info">
              <img
                src={
                  emp?.image?.trim()
                    ? emp?.image
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${emp?.name}`
                }
                alt={emp.name}
                className="profile-img"
              />
              <div className="employee-details">
                <div>
                  <h2 className="employee-name">{emp.name}</h2>
                  <p className="employee-role">{emp.designation}</p>
                </div>
                <div className="employee-contact email">📧 {emp.email}</div>
                <div className="employee-contact phone">📞 {emp.phoneNo}</div>
                <div className="employee-contact dept">
                  🏢 {emp.department?.departmentName}
                </div>
              </div>
            </div>

            <button
              className="edit-btn"
              onClick={() => setEditingEmployee(emp)}
            >
              <Pencil size={18} />
            </button>
            <button
              className="deactivate-btn"
              onClick={() => setDeactivateModal(emp)}
            >
              <ImBlocked />
            </button>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingEmployee && (
        <div className="modal-backdrop">
          <div className="modal-box small-modal">
            <div className="modal-header">
              <h3>Edit Employee</h3>
              <button
                onClick={() => setEditingEmployee(null)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Profile Image */}
              <div className="form-row center-content">
                <img
                  src={
                    editingEmployee?.image?.trim()
                      ? editingEmployee?.image
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${editingEmployee?.name}`
                  }
                  alt="Profile"
                  className="profile-preview"
                />
              </div>
              <div className="form-row">
                <label>Change Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    handleImageChange(e);
                  }}
                />
              </div>

              {/* Name */}
              <div className="form-row">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editingEmployee.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleEditChange(e);
                  }}
                />
              </div>

              {/* Designation */}
              <div className="form-row">
                <label>Designation:</label>
                <input
                  type="text"
                  name="designation"
                  value={editingEmployee.designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                    handleEditChange(e);
                  }}
                />
              </div>

              {/* Email */}
              <div className="form-row">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editingEmployee.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleEditChange(e);
                  }}
                />
              </div>

              {/* Phone No */}
              <div className="form-row">
                <label>Phone No:</label>
                <input
                  type="text"
                  name="phoneNo"
                  value={editingEmployee.phoneNo}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    handleEditChange(e);
                  }}
                />
              </div>

              <div className="form-row">
                <label>Department:</label>
                <select
                  name="departmentId"
                  onChange={(e) => {
                    setSelectedDepartmentId(e.target.value);
                    handleEditChange(e);
                  }}
                >
                  <option value="">Select</option>
                  {department.map((dept, index) => (
                    <option key={index} value={dept.id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>Role:</label>
                <select
                  name="roleId"
                  onChange={(e) => {
                    setSelectedRoleId(e.target.value);
                    handleEditChange(e);
                  }}
                >
                  <option value="">Select</option>
                  {role.map((role, index) => (
                    <option key={index} value={role.id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>Team:</label>
                <select
                  name="teamId"
                  onChange={(e) => {
                    setSelectedTeamId(e.target.value);
                    handleEditChange(e);
                  }}
                >
                  <option value="">Select</option>
                  {team.map((team, index) => (
                    <option key={index} value={team.id}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Save Button */}
              <button
                className="submit-btn"
                onClick={async () => {
                  handleEditSubmit();
                  await submiteAllData();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
