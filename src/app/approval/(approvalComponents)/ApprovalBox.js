"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import { submiteNomination } from "@/_api_/nomination";
import { toast, ToastContainer } from "react-toastify";
import ApprovalStarTable from "./ApprovalStarsGet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ApprovalData } from "../page";
import { SubmitedApproval } from "@/_api_/approval";

export const Ratings = createContext();

export default function ApprovalBox({
  ManagerRating,
  HrRating,
  ManagerReson,
  HrReason,
  NominatedName,
  NominatedBy,
  NominatedEmployeeId,
}) {
  const { user } = useContext(AuthContext);
  const { setApprovalModeActivated, setSubnmiteData, approvalModeActivated } =
    useContext(ApprovalData);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [disablebutton, setDisableButton] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Star of the month");
  const [ratings, setRatings] = useState({});
  const [hrRating, setHrRating] = useState(HrRating);
  const [managerRating, setManagerRating] = useState(ManagerRating);

  const submitedShoutout = async () => {
    try {
      setDisableButton(true);
      let data = {
        UserId: NominatedEmployeeId,
        Reason: reason,
        Rating: ratings,
      };

      const response = await SubmitedApproval(data, user?.userRole);
      response.data.success ? setSubnmiteData(data) : null;
      setReason("");
      setRatings({});
      response.data.success
        ? toast.success("Approval Submite")
        : toast.error("Approval not submit");
      setApprovalModeActivated(false);
    } catch (error) {
      console.error(error);
    } finally {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (approvalModeActivated == false) {
      setReason("");
      setRatings({});
    }
  }, [approvalModeActivated]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 shadow-md overflow-auto scrollbar-hide">
      <ToastContainer position="top-right" autoClose={3000} />

      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 bg-white rounded-2xl shadow-2xl border mt-6 scrollbar-hide">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-3"
        >
          {`Star of the month approval`}
          <Button
            onClick={() => {
              setApprovalModeActivated(false);
            }}
          >
            <X size={20} />
          </Button>
        </motion.h2>

        <CardContent className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block font-medium text-gray-700">
              Nomination Category:
            </label>
            <Input
              className="w-full mt-1 text-black"
              value="Star of the month"
              disabled
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block font-medium text-gray-700">
              Nominated Employee:
            </label>
            <Input
              className="w-full mt-1 text-black"
              value={NominatedName}
              disabled
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block font-medium text-gray-700">
              Nominated By:
            </label>
            <Input
              className="w-full mt-1 text-black"
              value={NominatedBy}
              disabled
            />
          </motion.div>

          <Ratings.Provider
            value={{
              ratings,
              setRatings,
              hrRating,
              setHrRating,
              managerRating,
              setManagerRating,
            }}
          >
            <ApprovalStarTable />
          </Ratings.Provider>

          {user?.userRole === 1 && ManagerReson != null && HrReason != null ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block font-medium text-gray-700">
                Manager Reason:
              </label>
              <p className="text-black">{ManagerReson}</p>

              <label className="block font-medium text-gray-700 mt-4">
                HR Reason:
              </label>
              <p className="text-black">{HrReason}</p>
            </motion.div>
          ) : user?.userRole === 1 &&
            HrReason != null &&
            ManagerReson == null ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block font-medium text-gray-700">
                HR Reason:
              </label>
              <p className="text-black">{HrReason}</p>
            </motion.div>
          ) : user?.userRole === 2 && ManagerReson != null ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block font-medium text-gray-700">
                Manager Reason:
              </label>
              <p className="text-black">{ManagerReson}</p>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label className="block font-medium text-gray-700">
              Reason for Nomination:
            </label>
            <Textarea
              placeholder="Write your reason here..."
              className="w-full mt-1 text-black"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={submitedShoutout}
              disabled={
                !reason || disablebutton || Object.keys(ratings)?.length !== 9
              }
            >
              Submit
            </button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
