"use client";
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ApprovalData } from "../page";
import { RejectApproval, SubmitedApproval } from "@/_api_/approval";

const EventCard = ({
  NominationType,
  NominationReason,
  NominatedName,
  userId,
  NominatedBy,
  NominationId,
  Role,
}) => {
  const [expanded, setExpanded] = useState(false);
  const {
    setNominatedEmployee,
    nominatedEmployee,
    setApprovalModeData,
    setApprovalModeActivated,
  } = useContext(ApprovalData);

  const words = NominationReason?.split(" ");
  const shouldTruncate = words?.length > 20;
  const displayedText = expanded
    ? NominationReason
    : words?.slice(0, 20).join(" ") + (shouldTruncate ? "..." : "");

  const submitedApproval = async () => {
    try {
      setApprovalModeData(NominationId);
      setApprovalModeActivated(true);
    } catch (error) {
      throw error;
    }
  };

  const submiteReject = async () => {
    try {
      setNominatedEmployee((prev) =>
        prev.filter((item) => item.employeeName?.id !== userId)
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden w-[380px] h-[338px] flex flex-col"
    >
      <div className="p-4 flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        <motion.h3
          className="text-2xl font-bold mb-2 text-blue-600"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {NominationType}
        </motion.h3>
        <p className="text-md font-semibold mt-2 text-black">
          {" "}
          {NominatedName}{" "}
        </p>
        <p className="text-gray-600 text-md flex-grow overflow-y-auto scrollbar-hide mt-2">
          {displayedText}
          {shouldTruncate && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-blue-400  "
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "View Less" : "View More"}
            </motion.button>
          )}
        </p>
        <p className="text-md font-semibold mt-2 text-black">
          Nominated By : {NominatedBy}{" "}
        </p>
      </div>
      <div className="p-4 flex justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={submitedApproval}
        >
          {Role == 1 ? "Approve" : "Review"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={submiteReject}
        >
          Reject
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventCard;
