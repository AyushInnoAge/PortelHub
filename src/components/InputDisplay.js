import { motion } from "framer-motion";
import { User, Trophy } from "lucide-react";
import { Card } from "./ui/card";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 12 },
  },
};

export default function ShoutoutLeaderboard({ shoutouts = [] }) {
  return (
    <motion.div
      className="w-full space-y-4"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-2 pb-1">
        <h2 className=" font-bold text-blue-600"style={{ fontSize: '18px' }}>Top Shoutouts</h2>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {shoutouts?.length > 0 ? (
          shoutouts.map((emp, i) => (
            <motion.div key={i} variants={cardVariant}>
              <Card className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
                {/* Profile image */}
                <img
                  src={
                    emp
                      .find((item) => item.name === "Users")
                      ?.value?.find((field) => field.name === "Image")?.value
                      ?.length > 0
                      ? emp
                          .find((item) => item.name === "Users")
                          ?.value?.find((field) => field.name === "Image")
                          ?.value
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${
                          emp
                            .find((item) => item.name === "Users")
                            ?.value?.find((field) => field.name === "Name")
                            ?.value
                        }`
                  }
                  alt={emp.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />

                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {
                      emp
                        .find((item) => item.name === "Users")
                        ?.value?.find((field) => field.name === "Name")?.value
                    }
                  </p>
                  <div className="flex items-center text-sm text-gray-600 gap-1 mt-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>
                      {emp.find((field) => field.name == "count")?.value}{" "}
                      Shoutout{emp.shoutoutCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Rank */}
                <span className="text-sm text-blue-600 font-bold">
                  #{i + 1}
                </span>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="text-base text-gray-500 text-center">No data available</p>
        )}
      </div>
    </motion.div>
  );
}
