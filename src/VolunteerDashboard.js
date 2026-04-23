import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";

function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 NEW: MESSAGE STATE
  const [message, setMessage] = useState("");

  // 🔥 AUTO HIDE MESSAGE
  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 2000);
    }
  }, [message]);

  // 🔥 REAL-TIME TASKS
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setTasks(data);
      setLoading(false);
    });

    fetchProfile();

    return () => unsubscribe();
  }, []);

  // 🔥 FETCH PROFILE
  const fetchProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const data = snap.data();
      setSkills(data.skills || "");
      setAvailability(data.availability || "");
      setLocation(data.location || "");
    }
  };

  // 🔥 SAVE PROFILE
  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;

      await updateDoc(doc(db, "users", user.uid), {
        skills,
        availability,
        location
      });

      setMessage("Profile Updated ✅");
    } catch (error) {
      alert(error.message); // only error alert
    }
  };

  // 🔥 RESET PROFILE
  const handleResetProfile = async () => {
    try {
      const user = auth.currentUser;

      await updateDoc(doc(db, "users", user.uid), {
        skills: "",
        availability: "",
        location: ""
      });

      setSkills("");
      setAvailability("");
      setLocation("");

      setMessage("Profile Reset ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🔥 ACCEPT TASK
  const handleAccept = async (id) => {
    try {
      const user = auth.currentUser;

      const userSnap = await getDoc(doc(db, "users", user.uid));
      const userData = userSnap.data();

      await updateDoc(doc(db, "tasks", id), {
        status: "accepted",
        acceptedByName: userData.name,
        acceptedByEmail: userData.email,
        acceptedByLocation: userData.location || "Not set"
      });

      setMessage("Task Accepted ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Volunteer Dashboard 🙋‍♂️</h2>

      {/* 🔥 MESSAGE UI */}
      {message && (
        <p style={{
          background: "#d4edda",
          color: "green",
          padding: "10px",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          {message}
        </p>
      )}

      {/* 🔥 PROFILE */}
      <div style={{
        background: "#e8f0fe",
        padding: "10px",
        borderRadius: "10px"
      }}>
        <h4>Your Profile</h4>
        <p>🛠 Skills: {skills || "Not set"}</p>
        <p>📍 Location: {location || "Not set"}</p>
        <p>
          Status:{" "}
          <b style={{ color: availability === "Available" ? "green" : "red" }}>
            {availability || "Not set"}
          </b>
        </p>
      </div>

      {/* 🔥 EDIT PROFILE */}
      <div style={{
        background: "#f5f5f5",
        padding: "15px",
        marginTop: "15px",
        borderRadius: "10px"
      }}>
        <h3>Edit Profile</h3>

        <input
          placeholder="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="">Select Availability</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
        </select>

        <br /><br />

        <button onClick={handleSaveProfile}>Save</button>
        <button onClick={handleResetProfile} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>

      {/* 🔥 TASKS */}
      <h3 style={{ marginTop: "20px" }}>NGO Needs</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "10px"
            }}
          >
            <p><b>{task.title}</b></p>
            <p>📍 {task.location}</p>

            {/* 🔥 PRIORITY */}
            <p>
              Priority:{" "}
              <span style={{
                color:
                  task.priority === "high"
                    ? "red"
                    : task.priority === "medium"
                    ? "orange"
                    : "green",
                fontWeight: "bold"
              }}>
                {task.priority || "low"}
              </span>
            </p>

            <p>Status: {task.status}</p>

            {task.status === "pending" && (
              <button onClick={() => handleAccept(task.id)}>
                Accept Task
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default VolunteerDashboard;