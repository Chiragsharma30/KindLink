import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");

  // 🔥 ERROR MESSAGE STATE
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 Clear autofill
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  // 🔥 Auto-hide error
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => setErrorMsg(""), 2500);
    }
  }, [errorMsg]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setErrorMsg("User data not found!");
        return;
      }

      const data = docSnap.data();

      // 🔥 Role mismatch
      if (data.role !== role) {
        setErrorMsg(`You selected ${role}, but your account is ${data.role}`);
        return;
      }

      // 🔥 Redirect
      if (data.role === "ngo") {
        navigate("/ngo-dashboard");
      } else {
        navigate("/volunteer-dashboard");
      }

    } catch (error) {
      setErrorMsg("Wrong email or password");
    }
  };

  // 🎨 Styles
  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "1px solid #ccc"
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
      <form 
        onSubmit={handleLogin}
        autoComplete="off"
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          width: "320px",
          textAlign: "center"
        }}
      >
        <h2>Login</h2>

        {/* 🔥 ERROR MESSAGE UI */}
        {errorMsg && (
          <p style={{
            background: "#f8d7da",
            color: "red",
            padding: "10px",
            borderRadius: "8px"
          }}>
            {errorMsg}
          </p>
        )}

        {/* Autofill hack */}
        <input type="text" name="fake-user" style={{ display: "none" }} />
        <input type="password" name="fake-pass" style={{ display: "none" }} />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
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

        <button type="submit" style={buttonStyle}>
          Login
        </button>

        <p style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;