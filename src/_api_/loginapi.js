import API_ENDPOINTS from "../app/config/apiconfig";

const API_URL = API_ENDPOINTS.LOGIN_API;

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network error. Please try again.");
  }
};
