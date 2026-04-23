import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("volunteer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 message state (clean UI)
  const [message, setMessage] = useState("");

  // 🔥 auto hide message
  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 2000);
    }
  }, [message]);

  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role
      });

      // ❌ removed alert
      setMessage("Signup Successful ✅");

      setName("");
      setEmail("");
      setPassword("");
      setRole("volunteer");

      // 🔥 redirect
      if (role === "ngo") {
        navigate("/ngo-dashboard");
      } else {
        navigate("/volunteer-dashboard");
      }

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Account already exists. Please login.");
        navigate("/login");
      } else {
        alert(error.message); // keep error alert
      }
    }
  };

  // 🎨 UI
  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "14px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "none",
    borderRadius: "10px",
    background: "#667eea",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #667eea, #764ba2)"
    }}>
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "15px",
        width: "320px",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}>
        <h2>Signup</h2>

        {/* 🔥 MESSAGE UI */}
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
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="new-email"
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          style={inputStyle}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="volunteer">Volunteer</option>
          <option value="ngo">NGO</option>
        </select>

        <button onClick={handleSignup} style={buttonStyle}>
          Signup
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <p style={{ fontSize: "12px", color: "gray" }}>
          Selected Role: {role}
        </p>
      </div>
    </div>
  );
}

export default Signup;