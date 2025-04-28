import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Card } from "../../../components/ui/card";

export default function CommentBox({ comments = [] }) {
  return (
    <div className="w-full">
      {/* Comment Header */}
      <div className="flex items-center justify-between border-b p-2">
        <h2 className="text-lg font-semibold text-blue-700">Comment</h2>
      </div>

      {/* Comments List (Scrollable) */}
      <div className="max-h-64 overflow-y-auto space-y-2 p-2">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Card
              key={index}
              className="p-3 border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
            >
              {/* Profile Image and Name */}
              <div className="flex items-center space-x-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {comment.userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {comment?.created_at || "Just now"}
                  </p>
                </div>
              </div>

              {/* Comment Text */}
              <p className="text-sm text-gray-700 mt-2">
                {comment?.commentMessage}
              </p>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">No Comment</p>
        )}
      </div>
    </div>
  );
}
