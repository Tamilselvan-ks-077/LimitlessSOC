import { FaHome, FaVolumeUp, FaVolumeMute, FaShieldAlt, FaTerminal, FaCog, FaFileAlt } from "react-icons/fa";
import { playHover, playClick } from "../utils/audio";

export default function Navbar({ goHome, soundEnabled, onSoundToggle, team }) {
  return (
    <nav className="navbar">
      <div
        className="logo"
        onClick={() => {
          playClick();
          goHome();
        }}
        onMouseEnter={playHover}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
      >
        {team === "blue" ? (
          <FaShieldAlt className="logo-icon blue-text animate-pulse" />
        ) : (
          <FaTerminal className="logo-icon red-text animate-pulse" />
        )}
        <span>CYBER</span>
        <span className={team === "blue" ? "blue-text font-bold" : "red-text font-bold"}>
          {team === "blue" ? "SHIELD" : "CORE"}
        </span>
      </div>

      <ul className="nav-links">
        <li 
          onClick={() => { 
            playClick(); 
            goHome(); 
          }} 
          onMouseEnter={playHover}
          className="nav-item"
        >
          <FaHome className="nav-icon" /> Sectors
        </li>
        <li 
          onMouseEnter={playHover} 
          onClick={() => playClick()}
          className="nav-item"
        >
          <FaFileAlt className="nav-icon" /> Reports
        </li>
        <li 
          onMouseEnter={playHover} 
          onClick={() => playClick()}
          className="nav-item"
        >
          <FaCog className="nav-icon" /> Settings
        </li>
        <li className="nav-sound-wrapper">
          <button 
            className={`sound-toggle-btn navbar-sound ${soundEnabled ? "active" : ""}`} 
            onClick={onSoundToggle}
            onMouseEnter={playHover}
            title={soundEnabled ? "Mute sound synthesis" : "Unmute sound synthesis"}
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
        </li>
      </ul>
    </nav>
  );
}