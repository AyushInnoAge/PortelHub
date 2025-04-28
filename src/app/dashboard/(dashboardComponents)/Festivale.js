import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import CommentBox from "@/app/dashboard/(dashboardComponents)/CommentSection";
import { LikeSubmite, CommentAdd } from "@/_api_/dashboard";
import { AuthContext } from "@/context/AuthContext";
const CompanyEvent = ({
  PostId,
  PostImageUrl,
  PostLike,
  PostComment,
  PostTitle,
  PostDescription,
  Postcreated_At,
}) => {
  const { user } = useContext(AuthContext);
  const [hoverDirection, setHoverDirection] = useState({ x: 0, y: 0 });
  const [Like, setLike] = useState(PostLike);
  const [commentsDisplay, setCommentsDisplay] = useState(PostComment);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState(false);
  const [likeButtonDisable, setLikeButtonDisable] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const words = PostDescription?.split(" ");
  const shouldTruncate = words?.length > 20;
  const displayedText = expanded
    ? PostDescription
    : words?.slice(0, 20).join(" ") + (shouldTruncate ? "..." : "");

  const timing = new Date(Postcreated_At);
  const time = `${timing.getDate()}-${
    timing.getMonth() + 1
  }-${timing.getFullYear()}`;

  useEffect(() => {
    if (Like.length !== 0) {
      setLikeButtonDisable(Like.some((like) => like.userId == user.id)); 
    }
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    setHoverDirection({ x, y });
  };

 
  const setLikeSubmit = async () => {
    try {
      setLikeButtonDisable(true);
      const likedData = { postId: PostId, userId: user.id };
      await LikeSubmite(likedData);
      setLike((prev = []) => [...prev, user.id]); 
    } catch (error) {
      console.error(error);
    }
  };

 
  const setCommentSubmit = async () => {
    if (!commentValue.trim()) return;
    try {
      const commentData = {
        postId: PostId,
        commentMessage: commentValue,
        userName: user?.name,
      };
      setCommentsDisplay((prev = []) => [commentData, ...prev]);
      await CommentAdd(commentData);
      setCommentValue("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 w-full max-w-[40rem] mx-auto shadow-md">
      <motion.div
        className="relative w-full bg-white rounded-lg overflow-hidden cursor-pointer p-4 sm:p-6"
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
      >

        {PostImageUrl && (
          <motion.img
            src={PostImageUrl}
            alt="img"
            className="w-full h-auto object-cover rounded-md"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
          />
        )}

        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-black mb-2">
            {PostTitle}
          </h2>
          <p className="text-black text-base mt-2 font-medium">
          {displayedText}{shouldTruncate && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="text-blue-400  "
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "View Less" : "View More"}
              </motion.button>
            )}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            className={`flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors ${
              likeButtonDisable && "cursor-not-allowed opacity-50"
            }`}
            aria-label="Like post"
            disabled={likeButtonDisable}
            onClick={setLikeSubmit}
          >
            <ThumbsUp size={30} />
            <span>Like {Like.length}</span>
          </button>
          <button
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Comment on post"
            onClick={() => setComments(!comments)}
          >
            <MessageCircle size={30} />
            <span>Comment</span>
          </button>
        </div>

        {comments && (
          <div className="p-4 bg-white shadow-md">
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                className="w-full p-2 outline-none text-black"
                placeholder="Write a comment..."
              />
              <button
                className="bg-blue-500 text-white px-3 py-2 text-sm hover:bg-blue-600 transition"
                onClick={setCommentSubmit}
              >
                Submit
              </button>
            </div>
            <CommentBox comments={commentsDisplay} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompanyEvent;
