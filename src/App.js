import { Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import VolunteerDashboard from "./VolunteerDashboard";
import NGODashboard from "./NGODashboard";
import PostNeed from "./PostNeed";

function Home() {
  const navigate = useNavigate();

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
        padding: "40px",
        borderRadius: "15px",
        textAlign: "center"
      }}>
        
        <h1>KindLink 🤝</h1>
        <p>Connecting Needs with Helping Hands</p>

        <button onClick={() => navigate("/login")}>
          Login
        </button>

        <br /><br />

        <button onClick={() => navigate("/signup")}>
          Signup
        </button>

      </div>
    </div>
  );
}

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/ngo-dashboard" element={<NGODashboard />} />
        <Route path="/post-need" element={<PostNeed />} />
      </Routes>
   
  );
}

export default App;