import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function NGODashboard() {
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 MESSAGE STATE (NEW)
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

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

    return () => unsubscribe();
  }, []);

  // 🔥 REAL-TIME VOLUNTEERS
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      let data = [];

      snapshot.forEach((doc) => {
        const user = doc.data();

        if (user.role === "volunteer" && user.availability === "Available") {
          data.push({ id: doc.id, ...user });
        }
      });

      setVolunteers(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 DELETE TASK
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteDoc(doc(db, "tasks", id));
      setMessage("Task Deleted ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🔥 REMOVE VOLUNTEER
  const removeVolunteer = async (id) => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        status: "pending",
        acceptedByName: "",
        acceptedByEmail: "",
        acceptedByLocation: ""
      });

      setMessage("Volunteer removed ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "20px",
      background: "linear-gradient(to right, #667eea, #764ba2)"
    }}>
      <div style={{
        maxWidth: "650px",
        margin: "auto",
        background: "#fff",
        padding: "25px",
        borderRadius: "15px"
      }}>
        <h2 style={{ textAlign: "center" }}>NGO Dashboard 🏢</h2>

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

        {/* 🔥 POST NEED */}
        <button
          onClick={() => navigate("/post-need")}
          style={{
            width: "100%",
            padding: "12px",
            margin: "15px 0",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          + Post New Need
        </button>

        {/* 🔥 LOADING */}
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <>
            {/* 🔥 TASKS */}
            <h3>All Posted Needs</h3>

            {tasks.length === 0 ? (
              <p style={{ textAlign: "center", color: "gray" }}>
                No tasks yet
              </p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} style={{
                  background: "#f9f9f9",
                  padding: "15px",
                  margin: "10px 0",
                  borderRadius: "10px"
                }}>
                  <p><b>{task.title}</b></p>
                  <p>📍 {task.location}</p>

                  <p>
                    Status:{" "}
                    <span style={{
                      color: task.status === "accepted" ? "green" : "orange",
                      fontWeight: "bold"
                    }}>
                      {task.status}
                    </span>
                  </p>

                  {/* 🔥 VOLUNTEER INFO */}
                  {task.acceptedByName && (
                    <div>
                      <p>👤 {task.acceptedByName}</p>
                      <p>📧 {task.acceptedByEmail}</p>

                      {/* 🔥 GMAIL BUTTON */}
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${task.acceptedByEmail}&su=Help Request&body=Hello ${task.acceptedByName}, we need your help for ${task.title}`}
                        target="_blank"
                        style={{
                          display: "inline-block",
                          marginTop: "8px",
                          padding: "6px 10px",
                          background: "#667eea",
                          color: "white",
                          borderRadius: "6px",
                          textDecoration: "none"
                        }}
                      >
                        Contact Volunteer
                      </a>

                      <br />

                      <button
                        onClick={() => removeVolunteer(task.id)}
                        style={{
                          marginTop: "8px",
                          padding: "6px 10px",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "6px"
                        }}
                      >
                        Remove Volunteer
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(task.id)}
                    style={{
                      marginTop: "10px",
                      padding: "8px 12px",
                      background: "black",
                      color: "white",
                      border: "none",
                      borderRadius: "8px"
                    }}
                  >
                    Delete Task
                  </button>
                </div>
              ))
            )}

            {/* 🔥 VOLUNTEERS */}
            <h3 style={{ marginTop: "20px" }}>Available Volunteers</h3>

            {volunteers.map((v) => (
              <div key={v.id} style={{
                background: "#eef",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "10px"
              }}>
                <p><b>{v.name}</b></p>
                <p>🛠 {v.skills || "Not set"}</p>
                <p>📍 {v.location || "Not set"}</p>
                <p style={{ color: "green" }}>Available</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default NGODashboard;