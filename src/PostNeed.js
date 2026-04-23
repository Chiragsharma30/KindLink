import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function PostNeed() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("low");

  // 🔥 clean message (no alert)
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 2000);
    }
  }, [message]);

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "tasks"), {
        title,
        location,
        priority,        // ✅ FIXED
        status: "pending"
      });

      setMessage("Need Posted Successfully ✅");

      setTitle("");
      setLocation("");
      setPriority("low");

    } catch (error) {
      alert(error.message); // keep only error alert
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Post a Need</h2>

      {/* 🔥 message UI */}
      {message && (
        <p style={{
          background: "#d4edda",
          color: "green",
          padding: "10px",
          borderRadius: "8px"
        }}>
          {message}
        </p>
      )}

      <input 
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input 
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      {/* 🔥 PRIORITY DROPDOWN */}
      <select 
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Low 🟢</option>
        <option value="medium">Medium 🟡</option>
        <option value="high">High 🔴</option>
      </select>

      <br /><br />

      <button onClick={handleSubmit}>
        Post Need
      </button>
    </div>
  );
}

export default PostNeed;