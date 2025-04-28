
import { motion } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { PollUpdate } from "@/_api_/dashboard";
const PollCard = (
  PostId
 
) => {
  const {
    PostTitle,
    PostUser,
    PostTotalYes,
    PostTotalNo,
    PostType,
    Postcreated_At,
    PostUserProfile,
  } = PostId;
  
  const { user } = useContext(AuthContext);
 
  const timing = new Date(Postcreated_At);
  const time = `${timing.getDate()}-${
    timing.getMonth() + 1
  }-${timing.getFullYear()}`;
  const [options, setOptions] = useState([
    { label: "Yes", votes: 0, voted: false },
    { label: "No", votes: 0, voted: false },
  ]);

  const [totalYesSet, setTotalYesSet] = useState(PostTotalYes);
  const [totalNoSet, setTotalNoSet] = useState(PostTotalNo);
  const [totalyes, setTotalYes] = useState(totalYesSet?.length || 0);
  const [totalno, setTotalNo] = useState(totalNoSet?.length || 0);
  const [totalVotes, setTotalVotes] = useState(
    (PostTotalYes?.length || 0) + (PostTotalNo?.length || 0)
  ); 

  
  useEffect(() => {
    if (PostTotalNo?.length > 0 || PostTotalYes?.length > 0) {
      const yes = PostTotalYes.some((item) => item.userId === user.id);
      const no = PostTotalNo.some((item) => item.userId === user.id);
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.label === "Yes"
            ? { ...option, voted: yes }
            : { ...option, voted: no }
        )
      );
    }
  }, []);

  
  const handleVote = async (index) => {
    if (options[index].voted) return;

    setOptions((prevOptions) =>
      prevOptions.map((option, i) => {
        if (i === index) {
          return { ...option, votes: 1, voted: true };
        }
        return { ...option, votes: 0, voted: false };
      })
    );

    const userIdData = { userId: user.id };

    
    if (options[index].label === "No") {
     

      setTotalNoSet((prev) => [...prev, userIdData]);
      setTotalNo((prev) => prev + 1);
      const yes =
        totalYesSet.length > 0
          ? totalYesSet.some((item) => item.userId === user.id)
          : false;
      if (yes) {
        setTotalYesSet((prev) =>
          prev.filter((item) => item.userId !== user.id)
        );
        setTotalYes((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } else {
      setTotalYesSet((prev) => [...prev, userIdData]);
      setTotalYes((prev) => prev + 1);
      const no =
        totalNoSet.length > 0
          ? totalNoSet.some((item) => item.userId === user.id)
          : false;
      if (no) {
        setTotalNoSet((prev) => prev.filter((item) => item.userId !== user.id));
        setTotalNo((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }

   
    const data = {
      userId: user.id,
      postId: PostId.PostId,
      voteType: index === 0 ? "Yes" : "No",
    };

    try {
      await PollUpdate(data);
    } catch (error) {
      console.error("Vote update failed: ", error);
    }
  };

  return (
    <div className="bg-white text-black rounded-lg p-4 w-full max-w-[40rem] mx-auto shadow-lg border border-gray-300">
      <motion.div
        className="relative w-full bg-white rounded-lg overflow-hidden p-4 sm:p-6"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
      >
        {/* Profile Section */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={
              PostUserProfile ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${PostUser}`
            }
            alt={`Profile`}
            className="w-10 h-10 rounded-full object-cover border border-gray-400"
          />
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-base sm:text-lg">
              {PostUser}
            </span>
            <span className="text-black text-sm sm:text-xs">{time}</span>
          </div>
        </div>

        {/* Poll Title */}
        <h2 className="text-xl font-semibold text-black mb-2">{PostTitle}</h2>

        {/* Total Votes */}
        <p className="text-black text-base mb-2">Total Yes: {totalyes}</p>
        <p className="text-black text-base mb-2">Total No: {totalno}</p>

        {/* Poll Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleVote(index)}
            >
              <div className="w-5 h-5 border border-gray-500 rounded-full flex items-center justify-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    option.voted ? "bg-blue-500" : "bg-transparent"
                  }`}
                ></div>
              </div>
              <div className="w-full">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{option.label}</span>
                  <span>{option.voted ? "" : ""}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${option.voted ? "100%" : "0%"}` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PollCard;
