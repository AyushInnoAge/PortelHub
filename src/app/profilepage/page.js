"use client";
import { useContext, useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { RiImageEditFill } from "react-icons/ri";
import { RiCoinsFill } from "react-icons/ri";
import "./profilepage.css";
import Navbar from "../navbar/page";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { updateUserProfile } from "@/_api_/profilepage";

export default function ProfilePage() {
  const { user, login } = useContext(AuthContext);
  const [badges, setBadges] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(user?.image)
  const [email, setEmail] = useState(user?.email)
  const [phoneNo, setPhoneNo] = useState(user?.phoneNo)
  const [address, setAddress] = useState(user?.address)
  const starOfTheMonthCount = user?.achievements
  .split(",")
  .filter(a => a.trim().startsWith("Star of the month"))
  .length;

const shoutoutCount = user?.achievements
  .split(",")
  .filter(a => a.trim().startsWith("Shoutout"))
  .length;

const starOfTheMonthDates = (user?.achievements
  ?.split(",")
  .filter(a => a.trim().startsWith("Star of the month"))
  .map(a => {
    const datePart = a.split(" - ")[2]; // Take the date part
    const date = new Date(datePart?.trim());
    return isNaN(date.getTime()) ? null : date.toLocaleString("default", { month: "long", year: "numeric" });
  })
  .filter(month => month !== null)) || []; // Filter out invalid months

const achievementsCount = starOfTheMonthDates?.length || 0;
const achievementsMonths = [...new Set(starOfTheMonthDates)].join(", ");

// Generate badges based on counts
useEffect(() => {
  const badgeData = [];
  if (starOfTheMonthCount > 0) {
    badgeData.push({ name: `${starOfTheMonthCount} Star${starOfTheMonthCount > 1 ? "s" : ""} of the Month`, color: "badge-red" });
  }
  if (shoutoutCount > 0) {
    badgeData.push({ name: `${shoutoutCount} Shoutout${shoutoutCount > 1 ? "s" : ""}`, color: "badge-yellow" });
  }
  setBadges(badgeData);
}, [starOfTheMonthCount, shoutoutCount]);


  const handleEditClick = () => {
    if (!editMode) {
      setEmail(user?.email || "");
      setPhoneNo(user?.phoneNo || "");
      setAddress(user?.address || "");
      setImage(user?.image || "");
    } else {
      handleSubmit(); // Call API when saving
    }
    setEditMode(!editMode);
  };

  const handleSubmit = async () => {
    if (editMode) {
      // Save Mode: Call API to update profile
      try {
        const res = await updateUserProfile(user.employeeId, email, phoneNo, address, image);

     
        if (res.statusCode == 200) {
          const updateImage=  res.result?.imageUrl;
          toast.success("User Profile updated successfully!");
          const newUser = {
            address: address,

            department: user.department,

            designation: user.designation,

            dob
              : user.dob,
            doj
              :
              user.doj,
            email
              :
              email,
            employeeId
              :
              user.employeeId,
            id
              :
              user.id,
            image
              :image
              ,
            name
              :
              user.name,
            phoneNo
              :
              phoneNo,
            teamLeaderEmail
              :
              user.teamLeaderEmail,
            teamLeaderId
              :
              user.teamLeaderId,
            teamLeaderName
              :
              user.teamLeaderName,
            userRole
              :
              user.userRole,
            achievements: user.achievements

          }
          if(updateImage){
            newUser.image=updateImage;
          }
          localStorage.removeItem("user");
          login(newUser);

        }

      } catch (error) {
        console.error(error);
        toast.error("User Updation Failed!");
      }
    }
    // Toggle edit mode
    setEditMode(!editMode);
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <div className="profile-card">
          <div className="xps-icon">
            <RiCoinsFill className="icon1" />
            <a href="/available-xps" className="xps-text">
              Available XPs
            </a>
          </div>
          <div className="profile-left">

            <div className="profile-img-wrapper">
              <img
                src={
                  user?.image.length > 0
                    ? user.image
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`
                }
                alt="Profile"
                width={160}
                height={160}
                className="profile-img"
              />
              {editMode && (
                <label className="image-edit-label">
                  <RiImageEditFill className="image-edit-icon" />
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} hidden />
                </label>
              )}
            </div>
            <h2 className="profile-name">{user?.name}</h2>
            {/* <p className="profile-role">{user?.userRole}</p> */}
            <p className="profile-designation">{user?.designation}</p>
            <p className="profile-designation">{user?.department}</p>
            {/* <p className="profile-address">{user?.address}</p> */}
            <div className="badges">
              <h3 className="badge-title">Badges Earned</h3>
              <div className="badge-list">
                {badges.map((badge, index) => (
                  <span key={index} className={`badge ${badge.color}`}>
                    {badge.name}
                  </span>
                ))}
              </div>

            </div>
          </div>
          <div className="profile-right">
            <div className="profile-info">
              <h3 className="section-title">Personal Information</h3>
              <div className="info-row">
                <label>Full Name</label>

                <p>{user?.name}</p>

              </div>
              <div className="info-row">
                <label>Employee ID</label>
                <p>{user?.employeeId}</p>
              </div>
              <div className="info-row">
                <label>Team</label>
                <p>{user?.department}</p>
              </div>

              <div className="info-row">
                <label>Email</label>
                {editMode ? (
                  <input
                    type="text"
                    name="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <p>{user?.email}</p>
                )}
              </div>
              <div className="info-row">
                <label>Phone</label>
                {editMode ? (
                  <input
                    type="text"
                    name="Phone"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                ) : (
                  <p>{user?.phoneNo}</p>
                )}
              </div>

              <div className="info-row">
                <label>Address</label>
                {editMode ? (
                  <input
                    type="text"
                    name={address}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                ) : (
                  <p>{user?.address}</p>
                )}
              </div>
              <button className="edit-btn" onClick={handleEditClick}>
                <FaEdit /> {editMode ? "Save" : "Edit"}
              </button>
            </div>
            <div className="achievements">
              <h3 className="section-title">Achievements in Last 6 Months</h3>
              <ul className="achievements-list">
                {shoutoutCount > 0 && (
                  <li className="achievement-item">
                    🎤 Received {shoutoutCount} {shoutoutCount > 1 ? "Shoutouts" : "Shoutout"}
                  </li>
                )}
                {achievementsCount > 0 && (
                  <li className="achievement-item">
                    🌟 Won {achievementsCount} {achievementsCount > 1 ? "Stars of the Month" : "Star of the Month"} in {achievementsMonths}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
