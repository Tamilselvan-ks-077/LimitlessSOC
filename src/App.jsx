import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import TechCanvas from "./components/TechCanvas";
import { playHover, playClick, toggleSound, isSoundEnabled } from "./utils/audio";
import { FaShieldAlt, FaSkullCrossbones, FaVolumeUp, FaVolumeMute, FaLock, FaGlobe, FaSlidersH, FaServer } from "react-icons/fa";

function App() {
  const [team, setTeam] = useState("");
  const [sound, setSound] = useState(isSoundEnabled());
  const [systemTime, setSystemTime] = useState("");

  useEffect(() => {
    // Generate simulated dynamic time in UTC
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const nextState = !sound;
    setSound(nextState);
    toggleSound(nextState);
    if (nextState) {
      // Play a quick test sound
      setTimeout(() => playClick(), 50);
    }
  };

  const handleSelectTeam = (selectedTeam) => {
    playClick();
    setTeam(selectedTeam);
  };

  if (!team) {
    return (
      <div className="selection-page">
        {/* Futuristic animated background canvas */}
        <TechCanvas theme="purple" />

        {/* HUD Header */}
        <header className="hud-header">
          <div className="hud-left">
            <span className="hud-indicator pulse"></span>
            <span className="hud-title">LIMITLESS SECURE LINK // ACTIVE</span>
          </div>
          <div className="hud-right">
            <span className="hud-timestamp">{systemTime}</span>
            <button 
              className={`sound-toggle-btn ${sound ? "active" : ""}`} 
              onClick={handleSoundToggle}
              onMouseEnter={playHover}
              title={sound ? "Mute Synthesizer" : "Unmute Synthesizer"}
            >
              {sound ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
          </div>
        </header>

        {/* Scanlines overlay for CRT effect */}
        <div className="scanlines"></div>

        <div className="selection-content">
          <h1 className="cyber-glow-title">
            LIMITLESS<span className="accent-color">SOC</span>
          </h1>
          <p className="cyber-subheading">
            COGNITIVE THREAT ANALYSIS & SYNERGISTIC OFFENSIVE SIMULATOR
          </p>

          {/* Main Interactive Deck */}
          <div className="holographic-deck">
            {/* Blue Team Selection Pod */}
            <div 
              className="selection-pod blue-pod"
              onMouseEnter={() => {
                playHover();
              }}
              onClick={() => handleSelectTeam("blue")}
            >
              <div className="pod-header">
                <FaShieldAlt className="pod-icon blue-glow-icon" />
                <span className="pod-badge blue-badge">DEFENSIVE SYSTEM</span>
              </div>
              
              <div className="pod-body">
                <h2>BLUE TEAM</h2>
                <p>Deploy security counter-measures, analyze incoming telemetry, patch software vulnerabilities, and monitor firewalls in real-time.</p>
                
                <ul className="pod-metrics">
                  <li><span>SHIELD STATUS:</span> <span className="blue-text font-bold">98.4%</span></li>
                  <li><span>IDS STATUS:</span> <span className="blue-text font-bold">MONITORING</span></li>
                  <li><span>ACTIVE COUNTERPLOTS:</span> <span className="blue-text font-bold">12 Active</span></li>
                </ul>
              </div>

              <div className="pod-footer">
                <button className="cyber-btn blue-btn">
                  INITIALIZE COGNITIVE SHIELD
                </button>
              </div>
            </div>

            {/* Matrix Choice Visual Pod */}
            <div className="matrix-center-card">
              <div className="terminal-screen">
                <div className="terminal-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                  <span className="terminal-title">core_selector.sh</span>
                </div>
                <div className="terminal-body">
                  <div className="matrix-visual-wrapper">
                    <img
                      src="/matrix-choice.png"
                      alt="Blue Team vs Red Team"
                      className="matrix-image"
                    />
                    <div className="scanner-line"></div>
                  </div>
                  <div className="system-diagnostics">
                    <div className="diag-row">
                      <FaLock className="diag-icon" />
                      <span>SECURE CORRIDOR: ESTABLISHED</span>
                    </div>
                    <div className="diag-row">
                      <FaGlobe className="diag-icon" />
                      <span>GATEWAY HOPS: 4 (PROXIED)</span>
                    </div>
                    <div className="diag-row">
                      <FaServer className="diag-icon" />
                      <span>HOST INTEG: SECURE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Red Team Selection Pod */}
            <div 
              className="selection-pod red-pod"
              onMouseEnter={() => {
                playHover();
              }}
              onClick={() => handleSelectTeam("red")}
            >
              <div className="pod-header">
                <FaSkullCrossbones className="pod-icon red-glow-icon" />
                <span className="pod-badge red-badge">OFFENSIVE LAYER</span>
              </div>
              
              <div className="pod-body">
                <h2>RED TEAM</h2>
                <p>Execute network reconnaissance, launch non-destructive exploit simulations, test egress filters, and audit overall security posture.</p>
                
                <ul className="pod-metrics">
                  <li><span>EXPLOIT STATUS:</span> <span className="red-text font-bold">READY</span></li>
                  <li><span>TARGET ACQUISITION:</span> <span className="red-text font-bold">12 Targets</span></li>
                  <li><span>PAYLOAD LAB:</span> <span className="red-text font-bold">COMPILED</span></li>
                </ul>
              </div>

              <div className="pod-footer">
                <button className="cyber-btn red-btn">
                  ENGAGE OFFENSIVE SYSTEM
                </button>
              </div>
            </div>
          </div>

          {/* Footer Security Ticker */}
          <div className="security-ticker">
            <div className="ticker-wrapper">
              <span className="ticker-label">LIVE SOC SECURITY LOGS:</span>
              <div className="ticker-text">
                [ALERT] Blocked port scan from 198.51.100.42 • [INFO] Vulnerability scan completed on cluster_B • [SECURE] System integrity verified at 100% • [WARN] Egress traffic spike detected on Node-12 • [ALERT] Zero-day mitigation patch deployed to Web-Proxy •
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      team={team}
      goBack={() => {
        playClick();
        setTeam("");
      }}
      soundEnabled={sound}
      onSoundToggle={handleSoundToggle}
    />
  );
}

export default App;