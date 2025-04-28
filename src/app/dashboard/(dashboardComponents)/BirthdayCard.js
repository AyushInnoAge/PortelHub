import { motion } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, PersonStanding } from "lucide-react";
import CommentBox from "./CommentSection";
import { AuthContext } from "@/context/AuthContext";
import { CommentAdd, LikeSubmite } from "@/_api_/dashboard";
const balloonVariants = {
  initial: { y: 300, opacity: 0 },
  animate: {
    y: -300,
    opacity: 1,
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    },
  },
};

const sparkVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: [0, 1, 0],
    scale: [0.5, 1.5, 0.5],
    transition: { duration: 1.5, repeat: Infinity },
  },
};

const BirthdayCard = ({
  PostId,
  PostUser,
  PostImageUrl,
  PostLike,
  PostComment,
  PostType,
  PostTitle,
  PostDescription,
  Postcreated_At,
  PostUserDetailed
}) => {
  const { user } = useContext(AuthContext);
  const [Like, setLike] = useState(PostLike);
  const [commentsDisplay, setCommentsDisplay] = useState(PostComment);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState(false);
  const [likeButtonDisable, setLikeButtonDisable] = useState(false);
  const {userDOJ, userName} = PostUserDetailed;
  const [birthdayImage, setBirthdayImage] = useState("https://res.cloudinary.com/dnx8ycr6n/image/upload/v1744284255/uploads/ConstntImage/HappyBirthday.png");
  const [anniversaryImage, setAnniversaryImage] = useState("https://res.cloudinary.com/dnx8ycr6n/image/upload/v1744261082/uploads/ConstntImage/WorkAnnirversary.png");

  const getYearGap = (date) => new Date().getFullYear() - new Date(date).getFullYear();
  const Time =getYearGap(userDOJ);
  const [grammer, setGrammer]=useState(["st", "nd", "rd", "th", "th", "th", "th", "th", "th" , "th"]); //temp
  useEffect(() => {
    if (Like.length !== 0) {
      setLikeButtonDisable(Like.some((like) => like.userId == user.id)); 
    }
  }, []); 

 
  const setLikeSubmit = async () => {
    try {
      setLikeButtonDisable(true);
      const likeData = { postId: PostId, userId: user.id }; 
      await LikeSubmite(likeData);
      setLike((prev) => [...prev, user.id]);
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
    <div className="relative bg-white rounded-lg p-6 w-full max-w-[40rem] mx-auto shadow-xl overflow-hidden border-2 border-gray-200">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute top-${i * 10} left-${
            (i % 2) * 20
          } text-red-400 text-6xl`}
          variants={balloonVariants}
          initial="initial"
          animate="animate"
        >
          🎈
        </motion.div>
      ))}

      <motion.div
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-yellow-400 text-4xl"
        variants={sparkVariants}
        initial="initial"
        animate="animate"
      >
        ✨
      </motion.div>
      <motion.img
        src={PostType=="Anniversary"? anniversaryImage : birthdayImage}
        alt="Image"
        className="w-full rounded-lg shadow-lg border-4 border-gray-300"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
      />
      <h2 className="text-xl font-extrabold text-gray-900 text-center mt-4">
        {PostType=="Anniversary"? `Congratulations On ${Time}${grammer[Time-1]} ${PostTitle}, ${userName}`: `${PostTitle}, ${userName}`}
      </h2>
      <p className="text-black text-base text-center mt-2 font-medium">
        {PostDescription}
      </p>

      <div className="flex items-center justify-between mt-4">
        <button
          className={`flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors ${
            likeButtonDisable && "cursor-not-allowed opacity-50"
          }`}
          disabled={likeButtonDisable}
          onClick={setLikeSubmit}
        >
          <ThumbsUp size={30} />
          <span>Like {Like.length}</span>
        </button>
        <button
          className="flex items-center space-x-2 text-gray-500"
          onClick={() => setComments(!comments)}
        >
          <MessageCircle size={30} />
          <span>Comment</span>
        </button>
      </div>

      {comments && (
        <div className="p-4 bg-white shadow-md mt-4 w-full">
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
    </div>
  );
};

export default BirthdayCard;
