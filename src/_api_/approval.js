import axios from "axios";

const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const SubmitedApproval = async (subData, userRole) => {
  try {
    const token = getToken();
    var Role = userRole == 1 ? "Admin" : "HR";
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/verify_Nominations?Role=${Role}`,
      subData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {}
};

const fetchAllApproval = async (userRole) => {
  try {
    const token = getToken();
    var Role = userRole == 1 ? "Admin" : "HR";
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}users/fetch_nominated_employees?Role=${Role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {}
};

const RejectApproval = async (NominationId) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/postreject`,
      { NominationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export { SubmitedApproval, fetchAllApproval, RejectApproval };
