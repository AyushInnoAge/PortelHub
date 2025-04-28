"use client";
import { useState, useEffect,useContext } from "react";
import "./page.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addSocialActivity, getSocialActivities } from "@/_api_/socialactivity";
import { AuthContext } from "@/context/AuthContext";
const categoryMapping = {
  All: "All",
  "Team Lunch And Outings": 1,
  "Social": 2,
  "Festivals": 3,
  "Sports": 4,
};

const categories = [
  "All",
  "Team Lunch And Outings",
  "Social",
  "Festivals",
  "Sports",
];
const categories_display = [
  "All",
  "TeamLunchAndOutings",
  "Social",
  "Festivals",
  "Sports",
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user,login } = useContext(AuthContext);
  useEffect(() => {
    fetchActivities();
  }, [selectedCategory]);
  const [newEvent, setNewEvent] = useState({
    activityName: "",
    description: "",
    date: "",
    timing: "",
    organisers: "",
    category: "",
    image: null,
  });

  const fetchActivities = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSocialActivities(1, "All", 30);

      setEvents(response.data.data);
      
    } catch (err) {
      setError("Failed to fetch activities. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter(
          (event) =>
            String(event.category) == String(categoryMapping[selectedCategory])
        );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formattedEvent = {
        ...newEvent,
        date: new Date(newEvent.date).toISOString(),
        organisers: newEvent.organisers.split(",").map((email) => email.trim()),
      };
      const response = await addSocialActivity(
        formattedEvent.activityName,
        formattedEvent.description,
        formattedEvent.date,
        formattedEvent.timing,
        formattedEvent.organisers,
        formattedEvent.category,
        formattedEvent.image
      );
      
      if (response.statusCode == 200) {
        toast.success("New Activity Added successfully!");
        const response = await getSocialActivities(1, "All", 30);

        // Convert object to array
        setEvents(response.data.data);
        setShowForm(false);
        setNewEvent({
          activityName: "",
          description: "",
          date: "",
          timing: "",
          organisers: "",
          category: "",
          image: null,
        });
      }
    } catch (err) {
      setError("Failed to add activity. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="header-container">
        <div style={{ flex: 1 }}></div>
        {(user?.userRole && (user.userRole === 1 || user.userRole === 2)) &&(
        <button
          className="add-activity-btn"
          onClick={() => setShowForm(true)}
          style={{ marginLeft: "auto" }}
        >
          <span className="plus-icon">+ </span>Add Activity
        </button>)}
      </div>

      {showForm && (
        <div className="form-popup">
          <form onSubmit={handleSubmit} className="activity-form">
            <input
              type="text"
              placeholder="Activity Name"
              value={newEvent.activityName}
              onChange={(e) =>
                setNewEvent({ ...newEvent, activityName: e.target.value })
              }
              required
            />
           <div className="image-upload-container">
              {/* Image preview container */}
              <div id="imagePreview" style={{ 
                maxWidth: '200px', 
                maxHeight: '200px',
                marginBottom: '10px',
                display: 'none' // Initially hidden
              }}>
                <img 
                  id="preview"
                  src={null}
                  alt="Preview" 
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setNewEvent({ ...newEvent, image: file });
                  
                  // Handle image preview
                  const preview = document.getElementById('preview');
                  const previewContainer = document.getElementById('imagePreview');
                  
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                      preview.src = e.target.result;
                      previewContainer.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                  } else {
                    previewContainer.style.display = 'none';
                  }
                }}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              required
            />
            <input
              type="time"
              value={newEvent.timing}
              onChange={(e) =>
                setNewEvent({ ...newEvent, timing: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Organisers (comma separated)"
              value={newEvent.organisers}
              onChange={(e) =>
                setNewEvent({ ...newEvent, organisers: e.target.value })
              }
              required
            />
            <select
              value={newEvent.category}
              onChange={(e) =>
                setNewEvent({ ...newEvent, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {categories_display.slice(1).map((cat, index) => (
                <option key={cat} value={index+1}>
                  {cat}
                </option>
              ))}
            </select>
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Event"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      )}

      <div className={showForm ? "blur-background" : ""}>
        <div className="categories">
          {categories.map((categories) => (
            <button
              key={categories}
              className={
                selectedCategory === categories ? "active" : "inactive"
              }
              onClick={() => setSelectedCategory(categories)}
            >
              {categories}
            </button>
          ))}
        </div>

        <div className="events-grid">
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className="event-card"
              data-date={new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })}
            >
              <img src={event.image} alt={event.activityName} />
              <h2>{event.activityName}</h2>
              <p>{event.description}</p>
              <div className="event-timing">
                <span>{new Date(event.date).toDateString()}</span>
                <span>{event.timing}</span>
              </div>
              <p className="organisers">
                <strong>Organiser:</strong>{" "}
                {event.organisers ? event.organisers : "No Organiser"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
