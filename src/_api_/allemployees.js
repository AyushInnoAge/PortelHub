import axios from "axios";
import { fetchAllEmployeesByTeamLeaderId } from "./nomination";

const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const SubmiteEmployeeData = async (
  Name, email, phoneNumber, designation,
  image, selectedDepartmentId, selectedRoleId, selectedTeamId, Empid
) => {
  try {
    const patchData = [
      { op: "replace", path: "/Email", value: email },
      { op: "replace", path: "/PhoneNo", value: phoneNumber },
      { op: "replace", path: "/Name", value: Name },
      { op: "replace", path: "/Designation", value: designation },
      { op: "replace", path: "/DepartmentId", value: selectedDepartmentId },
      { op: "replace", path: "/RoleId", value: selectedRoleId },
      { op: "replace", path: "/TeamLeaderId", value: selectedTeamId },
    ];
    
    const formData = new FormData();
    formData.append("patchDoc", JSON.stringify(patchData));
    if (image) {
      formData.append("imageFile", image);
    }

    const token = getToken();
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}User/UpdateUserProfile/${Empid}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
  return response.data;
  
  } catch (error) {
    console.error("Update failed:", error.message);
  }
};
