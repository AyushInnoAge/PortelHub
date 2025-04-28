"use client";
import AnimatedPostCard from "./(dashboardComponents)/AnimatedPostCard";
import PostInput from "./(dashboardComponents)/PostInputSection";
import SidebarProfile from "./(dashboardComponents)/SlideBar";
import { useEffect, useState, useContext, useRef, createContext } from "react";
import PollCard from "./(dashboardComponents)/PollCard";
import BirthdayCard from "./(dashboardComponents)/BirthdayCard";
import AppreciationCard from "./(dashboardComponents)/AppreciationCard";
import { DashboardDataFetch } from "@/_api_/dashboard";
import { AuthContext } from "@/context/AuthContext";
import CompanyEvent from "./(dashboardComponents)/Festivale";
import ShoutoutLeaderboard from "@/components/InputDisplay";

export const DashboardStatus = createContext();
export default function Home() {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const lastPostRef = useRef(null);
  const [lastFetchedDate, setLastFetchedDate] = useState(null);
  const [hasMoredata, setHasMoreData] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [topshoutOutWinner, setTopShoutOutWinner] = useState([]);

  useEffect(() => {
    setPage(1);
    setDashboardData([]);
    setLastFetchedDate(null);
    setHasMoreData(true);
  }, []);

  useEffect(() => {
    if (page === 1) {
      setDashboardData([]);
      setLastFetchedDate(null);
      setHasMoreData(true);
    }
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    if (loading || !hasMoredata) return;
    setLoading(true);
    try {
      const res = await DashboardDataFetch(lastFetchedDate);
      const response = res.message.dashboardData;
      console.log("Dashboard Data", response);
      
      if (res.message.currentUserAchievements.length > 0) {
        setAchievements(res.message.currentUserAchievements);
      }
      if (res.message?.topShoutout) {
        setTopShoutOutWinner(res.message?.topShoutout);
      }

      if (response.length > 0) {
        setDashboardData((prev) => {
          const newPosts = response.filter(
            (post) => !prev.some((p) => p.postData?.id === post.postData?.id)
          );
          return [...prev, ...newPosts];
        });

        let time = response[response.length - 1]?.nominationData
          ? response[response.length - 1]?.nominationData?.verifiedAt
          : response[response.length - 1]?.postData?.created_at;
        setLastFetchedDate(time);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      });
    }

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (lastPostRef.current) {
        observerRef.current.unobserve(lastPostRef.current);
      }
    };
  }, [dashboardData, loading]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 w-full">
      {user != null ? (
        <div className="hidden [@media(min-width:1200px)]:flex w-1/5.5 p-4 bg-white shadow-md flex-col overflow-y-auto scrollbar-hide">
          <SidebarProfile
            UserProfileImage={
              user?.image?.trim()
                ? user.image
                : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`
            }
            UserName={user?.name || ""}
            Designation={user?.designation || ""}
            achievements={achievements}
          />
          {topshoutOutWinner?.length > 0 ? (
            <div className="pt-8">
              <ShoutoutLeaderboard shoutouts={topshoutOutWinner} />
            </div>
          ) : null}
        </div>
      ) : null}

      {user != null ? (
        <div className="w-full [@media(min-width:1300px)]:w-4/5 flex flex-col p-4 overflow-y-auto space-y-6 scrollbar-hide">
          (
          <div className="w-full max-w-4xl mx-auto">
            <DashboardStatus.Provider
              value={{
                setDashboardData,
                setLoading,
                setLastFetchedDate,
                setHasMoreData,
              }}
            >
              <PostInput
                UserProfileImage={
                  user?.image?.trim()
                    ? user.image
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`
                }
              />
            </DashboardStatus.Provider>
          </div>
          )
          {loading && dashboardData.length == 0 ? (
            <h1 className="text-black text-center text-3xl justify-center">
              Loading...
            </h1>
          ) : (
            <div className="w-full max-w-4xl mx-auto space-y-6">
              {dashboardData.length == 0 ? (
                <h1 className="text-black text-center text-3xl">Loading..</h1>
              ) : (
                dashboardData.map((post, index) => (
                  <div
                    key={index}
                    ref={
                      index === dashboardData.length - 1 ? lastPostRef : null
                    }
                  >
                    {post.postData != null && post.postData?.type === "Post" ? (
                      <AnimatedPostCard
                        PostId={post.postData?.id}
                        PostUser={post.userData?.userName}
                        PostUserProfile={post.userData?.profileImage}
                        PostImageUrl={post.postData?.image}
                        PostLike={post.postData?.postLikes}
                        PostComment={post.postData?.postComments}
                        PostType={post.postData?.type}
                        PostTitle={post.postData?.title}
                        PostDescription={post.postData?.description}
                        Postcreated_At={post.postData?.created_at}
                      />
                    ) : post.postData != null &&
                      post.postData?.type === "Poll" ? (
                      <PollCard
                        PostId={post.postData?.id}
                        PostUser={post?.userData?.userName}
                        PostUserProfile={post?.userData?.profileImage}
                        PostTotalYes={post?.postData?.totalYes}
                        PostTotalNo={post?.postData?.totalNo}
                        PostType={post.postData?.type}
                        PostTitle={post.postData.title}
                        Postcreated_At={post.postData?.created_at}
                      />
                    ) : post.postData != null &&
                      (post.postData?.type === "Birthday" ||
                        post.postData?.type === "Anniversary") ? (
                      <BirthdayCard
                        PostId={post.postData?.id}
                        PostImageUrl={post.postData?.image}
                        PostLike={post.postData?.postLikes}
                        PostComment={post.postData?.postComments}
                        PostType={post.postData?.type}
                        PostTitle={post.postData?.title}
                        PostDescription={post.postData?.description}
                        Postcreated_At={post.postData?.created_at}
                        PostUserDetailed={post?.userData}
                      />
                    ) : post.postData != null &&
                      post.postData?.type == "Company Event" ? (
                      <CompanyEvent
                        PostId={post.postData?.id}
                        PostImageUrl={post?.postData?.image}
                        PostLike={post.postData?.postLikes}
                        PostComment={post.postData?.postComments}
                        PostType={post.postData?.type}
                        PostTitle={post.postData?.title}
                        PostDescription={post.postData?.description}
                        Postcreated_At={post.postData?.created_at}
                      />
                    ) : post.postData != null &&
                      post.postData?.type == "New Joining" ? (
                      <AppreciationCard
                        PostId={post.postData?.id}
                        PostType={post.postData?.type}
                        PostDescription={post?.postData?.description}
                        PostLike={post.postData?.postLikes}
                        PostComment={post.postData?.postComments}
                        PostTitle={post.postData?.title}
                      />
                    ) : post.nominationData != null &&
                      (post.nominationData?.nomination_Type ===
                        "Star of the month" ||
                        post.nominationData?.nomination_Type === "Shoutout") ? (
                      <AppreciationCard
                        PostId={post.nominationData?.id}
                        NominatedUser={post.nominationData?.userId}
                        NominatedBy={post.nominationData?.nominated_By}
                        PostType={post.nominationData?.nomination_Type}
                        PostDescription={post.nominationData?.shoutoutReason}
                        PostLike={post.nominationData?.postLikes}
                        PostComment={post.nominationData?.postComments}
                        PostShoutoutCatagory={
                          post.nominationData?.shoutoutCatagory
                        }
                        PostImage={post.nominationData?.image}
                      />
                    ) : null}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
