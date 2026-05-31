import { useState } from "react";
import Dashboard from "./pages/Dashboard";

function App() {
  const [team, setTeam] = useState("");

if (!team) {
  return (
    <div className="selection-page">
      <h1>LimitlessSOC Dashboard</h1>

      <div className="image-container">
        <img
          src="/matrix-choice.png"
          alt="Blue Team vs Red Team"
          className="matrix-image"
        />

        <button
          className="blue-select"
          onClick={() => setTeam("blue")}
        >
          🛡 BLUE TEAM
        </button>

        <button
          className="red-select"
          onClick={() => setTeam("red")}
        >
          ⚔ RED TEAM
        </button>
      </div>
    </div>
  );
}

  return (
    <Dashboard
      team={team}
      goBack={() => setTeam("")}
    />
  );
}

export default App;