
import axios from "axios";

const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};


const DashboardDataFetch = async (lastFetchedDate) => {
  try {
    const token = getToken();
    const url = lastFetchedDate
      ? `apiDashboard/GetAllPostFromServices?lastFetchedDate=${lastFetchedDate}`
      : `apiDashboard/GetAllPostFromServices`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
    );
    return response.data;
  } catch (error) {
    throw new error.message();
  }
};

const LikeSubmite = async (likeData) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/InsertLike`,
      likeData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};

const CommentAdd = async (commentData) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/commentAdd`,
      commentData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};

const PollUpdate = async (PollData) => {
  try {
    const token = getToken();
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/Updatepoll`,
      PollData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};

const UploadPost = async (formData) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/InsertPost`,
      formData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};

const UploadPoll = async (formDataToSend) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/InsertPost`,
      formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};
export {
  DashboardDataFetch,
  LikeSubmite,
  CommentAdd,
  PollUpdate,
  UploadPost,
  UploadPoll,
};
