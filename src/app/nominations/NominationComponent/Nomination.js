"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Award, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import { submiteNomination } from "@/_api_/nomination";
import { toast, ToastContainer } from "react-toastify";
import StarTable from "./StarsGet";

export const Ratings = createContext();
export default function Nomination({
  AllEmployees,
  NominationHeading,
  ShoutoutRemaing,
  shoutoutCatagorys,
}) {
  const { user } = useContext(AuthContext);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [disablebutton, setDisableButton] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [emmployeeofteam, setEmployeeOfTeam] = useState([]);
  const [totalShoutOutRemaing, setTotalShoutOutRemaing] =
    useState(ShoutoutRemaing);
  const [ratings, setRatings] = useState({});
  const [shoutoutCatagory, setShoutoutCatagory] = useState("");

  useEffect(() => {
    if (user?.userRole != 3) {
      setSelectedCategory("Shoutout");
    }
  }, [user]);

  useEffect(() => {
    setTotalShoutOutRemaing(ShoutoutRemaing);
  }, [ShoutoutRemaing]);

  const submitedShoutout = async () => {
    try {
      setDisableButton(true);
      var data;
      if (
        (user?.userRole == 1 || user?.userRole == 2 || user?.userRole == 3) &&
        selectedCategory == "Star of the month"
      ) {
        data = {
          UserId: selectedId,
          ManagerIds: [user.id],
          Nomination_Type: selectedCategory,
        };
        user?.userRole == 1
          ? ((data.AdminReason = reason),
            (data.AdminRating =
              Object.keys(ratings).length > 0 ? ratings : undefined))
          : user?.userRole == 2
          ? ((data.HrReason = reason),
            (data.HrRating =
              Object.keys(ratings).length > 0 ? ratings : undefined))
          : ((data.ManagerReason = reason),
            (data.ManagerRating =
              Object.keys(ratings).length > 0 ? ratings : undefined));
      } else {
        data = {
          UserId: selectedId,
          ManagerIds: [user.id],
          Nomination_Type: "Shoutout",
          ShoutoutReason: reason,
          ShoutoutCatagory: shoutoutCatagory,
        };
      }

      const response = await submiteNomination(data);
      setSelectedEmployee(null);
      setSelectedId("");
      setReason("");
      setRatings({});
      setShoutoutCatagory("");
      response.data.success
        ? toast.success(`${selectedCategory} SuccessFully added`)
        : selectedCategory == "Star of the month" && !response.data.success
        ? toast.error(response.data.message)
        : null;
      if (selectedCategory === "Shoutout" && response.data.success) {
        setTotalShoutOutRemaing((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (user?.userRole == 3) {
      const filteredEmployees = AllEmployees.filter(
        (emp) => emp.teamLeaderId === user.id
      );
      setEmployeeOfTeam(filteredEmployees);
    }
  }, [user, AllEmployees]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 w-full bg-transparent">
      {/* Form */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Card className="w-full max-w-5xl p-8 bg-white rounded-2xl shadow-2xl border mt-6">
        <div className="flex items-center space-x-4 mb-4">
          {selectedCategory == "Shoutout" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="ml-auto flex items-center bg-yellow-400 text-gray-900 px-3 py-1 rounded-full shadow-md"
            >
              <Award size={18} className="mr-1" />{" "}
              {`Shoutout remaining ${totalShoutOutRemaing}`}
            </motion.div>
          )}
        </div>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-3"
        >
          {NominationHeading}
        </motion.h2>
        <CardContent className="space-y-6 mt-6">
          {/* Nomination Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block font-medium text-gray-700">
              Nomination Category:
            </label>
            {user?.userRole == 1 ||
            user?.userRole == 2 ||
            user?.userRole == 3 ? (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border p-2 rounded bg-white text-black"
              >
                <option value="">--Choose--</option>
                <option value="Shoutout">Shoutout</option>
                <option value="Star of the month">Star of the month</option>
              </select>
            ) : (
              <Input
                placeholder="Type a role..."
                className="w-full mt-1 text-black"
                value={selectedCategory}
                disabled
              />
            )}
          </motion.div>

          {/* Employee Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block font-medium text-gray-700">
              Search Employee:
            </label>
            {selectedCategory === "Star of the month" && user?.userRole == 3 ? (
              <div className="border p-2 rounded bg-white relative text-black">
                <select
                  onChange={(e) => {
                    const selectedOption = emmployeeofteam.find(
                      (emp) => emp.id === e.target.value
                    );
                    setSelectedEmployee(selectedOption || { id: "", name: "" });
                    setSelectedId(selectedOption?.id || "");
                  }}
                  value={selectedId}
                  className="w-full bg-transparent focus:outline-none"
                >
                  <option value="">Select an option</option>
                  {emmployeeofteam.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="border p-2 rounded bg-white relative text-black">
                <select
                  onChange={(e) => {
                    const selectedOption = AllEmployees.find(
                      (emp) => emp.id === e.target.value
                    );
                    setSelectedEmployee(selectedOption || { id: "", name: "" });
                    setSelectedId(selectedOption?.id || "");
                  }}
                  value={selectedId}
                  className="w-full bg-transparent focus:outline-none"
                >
                  <option value="">Select an option</option>
                  {AllEmployees.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </motion.div>

          {/* ShoutoutCatagry */}
          {selectedCategory === "Shoutout" ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label className="block font-medium text-gray-700 text-sm">
                Shoutout Category:
              </label>

              {/* Custom selected value UI */}
              <div className="border p-2 rounded bg-white relative text-black">
                <div className="mb-1 font-semibold">
                  {shoutoutCatagory || ""}
                </div>

                {/* Actual select */}
                <select
                  onChange={(e) => {
                    setShoutoutCatagory(e.target.value); // Only set category
                  }}
                  value={shoutoutCatagory}
                  className="w-full bg-white p-2 border rounded text-sm"
                >
                  <option value="">Select a category</option>
                  {shoutoutCatagorys?.map((item) => (
                    <option key={item.id} value={item.catagory}>
                      {`${item.catagory}: ${item.description}`}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          ) : null}

          {/* Manager Selection */}
          {user?.userRole == 3 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block font-medium text-gray-700">
                Nominated By:
              </label>
              <Input
                placeholder="Nominater..."
                className="w-full mt-1 text-black"
                value={user?.name ? user.name : ""}
                disabled
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block font-medium text-gray-700">
                Nominated By:
              </label>
              <Input
                placeholder="Nominater Name.."
                className="w-full mt-1 text-black"
                value={user?.name ? user.name : ""}
                disabled
              />
            </motion.div>
          )}

          {/* Stare Table */}
          {selectedCategory === "Star of the month" ? (
            <Ratings.Provider value={{ ratings, setRatings }}>
              <StarTable
                UserRole={
                  user?.userRole == 1
                    ? "Admin"
                    : user?.userRole == 2
                    ? "HR"
                    : "Manager"
                }
              />
            </Ratings.Provider>
          ) : null}

          {/* Reason for Nomination */}
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

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {selectedCategory == "Shoutout" ? (
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition 
            disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={submitedShoutout}
                disabled={
                  !selectedId ||
                  !reason ||
                  disablebutton ||
                  totalShoutOutRemaing <= 0 ||
                  selectedCategory != "Shoutout"
                  ||!shoutoutCatagory
                }
              >
                Submit
              </button>
            ) : (
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition 
          disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={submitedShoutout}
                disabled={
                  !selectedId ||
                  !reason ||
                  disablebutton ||
                  selectedCategory != "Star of the month" ||
                  Object.keys(ratings)?.length != 9
                }
              >
                Submit
              </button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
