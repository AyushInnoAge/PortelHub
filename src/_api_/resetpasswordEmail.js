import API_ENDPOINTS from "../app/config/apiconfig";

export const sendResetPasswordOtp = async (email) => {
  try {
    const response = await fetch(API_ENDPOINTS.RESET_PASSWORD_PAGE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP.");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Network error. Please try again.");
  }
};


export const verifyOtpAndUpdatePassword = async (email, otp, newPassword) => {
  try {
    const response = await fetch(API_ENDPOINTS.RESET_PASSWORD_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Token: otp, NewPassword: newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update password.");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Network error. Please try again.");
  }
};