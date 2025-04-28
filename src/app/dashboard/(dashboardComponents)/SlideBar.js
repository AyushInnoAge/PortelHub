import { Card } from "../../../components/ui/card";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../../components/ui/tooltip";
import { useRouter } from "next/navigation";

// Badge image mapping based on achievement name and category
const badgeImages = {
  "Star of the month": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745212967/uploads/ShoutoutCatagory/StarOfTheMonth.png",
  "Team Player": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745211980/uploads/ShoutoutCatagory/TeamPlayer.png",
  "Going Above & Beyond": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745212127/uploads/ShoutoutCatagory/GoingAboveAndBeyond.png",
  "Knowledge Sharer": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745212408/uploads/ShoutoutCatagory/KnowledgeSharer.png",
  "Customer Champion": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745212517/uploads/ShoutoutCatagory/CustomerChampion.png",
  "Problem Solver": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745213040/uploads/ShoutoutCatagory/ProblemSolver.png",
  "Innovation & Ideas": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745213156/uploads/ShoutoutCatagory/InnovationIdeas.png",
  "Dependability": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745213384/uploads/ShoutoutCatagory/Dependability.png",
  "Positive Attitude": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745213585/uploads/ShoutoutCatagory/PositiveAttitude.png",
  "Timely Delivery": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745213510/uploads/ShoutoutCatagory/TimelyDelivery.png",
  "Cross-Team Collaboration": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745213651/uploads/ShoutoutCatagory/CrossTeamCollaboration.png",
  "Crisis Support": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745214068/uploads/ShoutoutCatagory/CrisiSupport.png",
  "New Joiner Buddy": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745214129/uploads/ShoutoutCatagory/NewJoiningBuddy.png",
  "Leadership in Action": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745214425/uploads/ShoutoutCatagory/LeaderShipInAction.png",
  "Living the Values": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745214352/uploads/ShoutoutCatagory/LivingTheValues.png",
  "Behind-the-Scenes Hero": "https://res.cloudinary.com/dnx8ycr6n/image/upload/v1745214186/uploads/ShoutoutCatagory/mj2enke5ty8eumthnnki.png",
};

export default function SidebarProfile2({
  UserProfileImage,
  UserName,
  Designation,
  achievements = [],
}) {
  const router = useRouter();

  // Parse achievement string: "AchievementName - Category - Date"
  const parsedAchievements = achievements.map((achievementStr) => {
    const [name, category, date] = achievementStr.split(" - ");
    return {
      name: name.trim(),
      category: category.trim(),
      date: date.trim(),
    };
  });

  // Count duplicate achievements by a unique key
  const achievementCounts = parsedAchievements.reduce((acc, a) => {
    const key = `${a.name}-${a.category}`;
    acc[key] = (acc[key] || { ...a, count: 0 });
    acc[key].count += 1;
    return acc;
  }, {});

  const uniqueAchievements = Object.values(achievementCounts);

  const getBadgeImage = (achievement) => {
    // Star of the Month always has its own badge
    if (achievement.name === "Star of the month") {
      return badgeImages["Star of the month"];
    }

    // For shoutouts or other types, use the category to determine image
    return badgeImages[achievement.category] || "/badges/default.png";
  };

  return (
    <TooltipProvider>
      <Card className="w-full p-5 shadow-lg rounded-2xl bg-white">
        <style jsx global>{`
          @keyframes shineEffect {
            0% {
              background-position: -100% center;
            }
            100% {
              background-position: 200% center;
            }
          }
          .achievement-count {
            background: linear-gradient(
              90deg,
              #ffd700 0%,
              #fff7cc 25%,
              #ffd700 50%,
              #fff7cc 75%,
              #ffd700 100%
            );
            background-size: 200% auto;
            color: #000;
            text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
          }
          .achievement-count:hover {
            animation: shineEffect 2s linear infinite;
            box-shadow: 0 0 10px #ffd700;
          }
        `}</style>

        <div className="flex flex-col items-center text-center">
          <Avatar
            src={UserProfileImage}
            className="w-16 h-16 mb-3 border-4 border-gray-300"
          />
          <h2 className="text-xl font-semibold text-black">{UserName}</h2>
          <p className="mt-1 text-base text-gray-900 text-center">
            {Designation}
          </p>
        </div>

        {uniqueAchievements.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">
              Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {uniqueAchievements.map((achievement, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger className="relative transition-transform hover:scale-150">
                    <img
                      src={getBadgeImage(achievement)}
                      alt={`${achievement.name} badge`}
                      className="w-12 h-12 object-contain"
                    />
                    {achievement.count > 1 && (
                      <span className="achievement-count absolute -top-2 -right-2 text-xs rounded-full px-2 py-1 font-bold border border-yellow-400">
                        x{achievement.count}
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="p-3 bg-gray-800 text-white rounded-lg shadow-md">
                    <p className="text-xs mt-1">
                      {achievement.name}
                      {achievement.category !== "N/A"
                        ? ` - ${achievement.category}`
                        : ""}
                      {achievement.count > 1 ? ` (×${achievement.count})` : ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/profilepage")}
          >
            Profile
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
}
