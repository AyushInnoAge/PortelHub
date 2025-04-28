import { useState, useContext } from "react";
import { Image, X, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import { DashboardStatus } from "../page.js";
import {
  DashboardDataFetch,
  UploadPoll,
  UploadPost,
} from "@/_api_/dashboard.js";

const PostInput = ({ UserProfileImage }) => {
  const { user } = useContext(AuthContext);
  const { setDashboardData, setLoading, setLastFetchedDate,  setHasMoreData } = useContext(DashboardStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [postDescription, setPostDescription] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [pollTitle, setPollTitle] = useState("");
  const [pollDescription, setPollDescription] = useState("");
  const [image, setImage] = useState(null);
  const [actualImageFile, setActualImageFile] = useState(null);
  const [postButtonDisable, setPostButtonDisable] = useState(false);
  const [pollButtonDisable, setPollButtonDisable] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPostTitle("");
    setPostDescription("");
    setImage(null);
  };

  const openPollModal = () => setIsPollModalOpen(true);
  const closePollModal = () => {
    setIsPollModalOpen(false);
    setPollTitle("");
    setPollDescription("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setActualImageFile(file);
    }
  };


  const handleSavePost = async () => {
    setPostButtonDisable(true);
    const formData = new FormData();
    formData.append("type", "Post");
    formData.append("type", "Post");
    formData.append("title", postTitle);
    formData.append("description", postDescription);
    formData.append("userId", user.id);
    formData.append("created_at", new Date().toISOString());
    if (actualImageFile) {
      formData.append("image", actualImageFile);
    }

    try {
      await UploadPost(formData);
      closeModal();
      setDashboardData([]);
      const res = await DashboardDataFetch();
      const response = res.message.dashboardData;
      setDashboardData(response);
      let time = response[response.length - 1]?.nominationData
        ? response[response.length - 1]?.nominationData?.verifiedAt
        : response[response.length - 1]?.postData?.created_at;
      setLastFetchedDate(time);
      response.length > 0? setHasMoreData(true):setHasMoreData(false);
    } catch (error) {
      throw new error.message();
    }finally{
      setPostButtonDisable(false);
    }
  };

  const handelSavePoll = async () => {
    setPollButtonDisable(true);
    const formDataToSend = new FormData();
    formDataToSend.append("Type", "Poll");
    formDataToSend.append("image", "");
    formDataToSend.append("title", pollTitle);
    formDataToSend.append("description", pollDescription);
    formDataToSend.append("userId", user.id);
    formDataToSend.append("created_at", new Date().toISOString());

    try {
      await UploadPoll(formDataToSend);
      closePollModal();
      setDashboardData([]);
      const res = await DashboardDataFetch();
      const response = res.message.dashboardData;
      setDashboardData(response);
      let time = response[response.length - 1]?.nominationData
        ? response[response.length - 1]?.nominationData?.verifiedAt
        : response[response.length - 1]?.postData?.created_at;
      setLastFetchedDate(time);
      response.length > 0? setHasMoreData(true):setHasMoreData(false);
    } catch (error) {
      throw new error.message();
    }finally{
      setPollButtonDisable(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-[40rem] mx-auto">
      <div className="flex items-center space-x-4">
        <button onClick={() => window.open(UserProfileImage, "_blank")}>
          <img
            src={UserProfileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </button>
        <input
          type="text"
          placeholder="Start a post"
          className="w-full border rounded-full px-4 py-2 focus:outline-none cursor-pointer"
          onClick={openModal}
          readOnly
        />
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={openModal}
          className="flex items-center space-x-2 text-blue-500"
        >
          <Image size={20} />
          <span>Media</span>
        </button>
        <button
          onClick={openPollModal}
          className="flex items-center space-x-2 text-blue-500"
        >
          <Image size={20} />
          <span>Poll</span>
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-all"
              >
                <X size={24} />
              </button>

              <h2 className="text-lg font-semibold text-center text-black">
                Create Post
              </h2>

              <textarea
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Title of You Post (option)"
                className="w-full mt-4 p-2 border rounded-lg resize-none text-black"
              />

              <textarea
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full mt-4 p-2 border rounded-lg resize-none text-black"
              />

              {image && (
                <div className="mt-4">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full rounded-lg max-h-40 object-cover"
                  />
                </div>
              )}

              <label className="flex items-center space-x-2 cursor-pointer text-blue-500 mt-4">
                <Image size={20} />
                <span>Upload Image</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleSavePost}
                  disabled={
                    (!postTitle && !postDescription && !image) ||
                    postButtonDisable
                  }
                  className={`px-4 py-2 rounded-lg w-full ${((!postTitle && !postDescription && !image) ||postButtonDisable)
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-blue-500 text-white"
                    }`}
                >
                  Post
                </button>
                <button
                  onClick={closeModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPollModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                onClick={closePollModal}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-all"
              >
                <X size={24} />
              </button>

              <h2 className="text-lg font-semibold text-center text-black">
                Create Polls and Surveys:
              </h2>

              <input
                type="text"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
                placeholder="Description"
              />

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handelSavePoll}
                  disabled={(!pollTitle && !pollDescription)||pollButtonDisable}
                  className={`px-4 py-2 rounded-lg w-full ${((!pollTitle && !pollDescription)|| pollButtonDisable)
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-blue-500 text-white"
                    }`}
                >
                  Post
                </button>
                <button
                  onClick={closePollModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostInput;
