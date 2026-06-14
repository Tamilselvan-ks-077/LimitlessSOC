import { useState, useEffect, useRef } from "react";
import { FaKey, FaUnlockAlt, FaPlay, FaServer } from "react-icons/fa";
import { playClick, playSuccess, playKeyboard } from "../../utils/audio";

const TARGETS = [
  { id: 1, name: "Admin SSH Gateway", hash: "SHA-256: 8d969eef6ecad3c29a3a629280e686cf..." },
  { id: 2, name: "Main DB Root", hash: "MD5: 5ebe2294ecd0e0f08eab7690d2a6ee69" },
  { id: 3, name: "Web Proxy Service", hash: "BCRYPT: $2a$12$Kj/..." }
];

export default function HashCracker() {
  const [target, setTarget] = useState(TARGETS[0].id);
  const [isCracking, setIsCracking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [crackedPassword, setCrackedPassword] = useState(null);
  const logEndRef = useRef(null);

  const selectedTarget = TARGETS.find(t => t.id === target);

  // Auto-scroll logic for the password attempts
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [attempts]);

  useEffect(() => {
    if (!isCracking) return;

    setProgress(0);
    setAttempts([]);
    setCrackedPassword(null);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let currentProgress = 0;

    const crackInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 5) + 2;
      setProgress(Math.min(currentProgress, 100));

      // Generate 3 fake password attempts
      const newAttempts = Array.from({ length: 3 }).map(() => {
        let pass = "";
        for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
        return pass;
      });

      setAttempts(prev => [...prev, ...newAttempts].slice(-20)); // keep last 20

      if (currentProgress % 3 === 0) playKeyboard();

      if (currentProgress >= 100) {
        clearInterval(crackInterval);
        setIsCracking(false);
        playSuccess();
        
        // Output successful crack
        const passwords = ["admin123", "hunter2", "root_access", "qwerty2026"];
        setCrackedPassword(passwords[Math.floor(Math.random() * passwords.length)]);
      }
    }, 200);

    return () => clearInterval(crackInterval);
  }, [isCracking]);

  const handleStart = () => {
    playClick();
    setIsCracking(true);
  };

  return (
    <div className="card red-card hash-cracker-card">
      <div className="card-header">
        <div className="header-left">
          <FaKey className="header-icon red-text" />
          <h3>Cryptographic Hash Cracker</h3>
        </div>
      </div>

      <div className="cracker-inputs" style={{ marginBottom: "15px" }}>
        <div className="form-group">
          <label>Select Target Identity</label>
          <select 
            value={target} 
            onChange={(e) => { playClick(); setTarget(Number(e.target.value)); }}
            disabled={isCracking}
          >
            {TARGETS.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        
        <div className="target-hash-display" style={{ background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#64748b", marginTop: "10px" }}>
          Target Hash: <span style={{ color: "#e2e8f0" }}>{selectedTarget?.hash}</span>
        </div>
      </div>

      <button 
        className="cyber-btn red-btn"
        style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "15px" }}
        onClick={handleStart}
        disabled={isCracking}
      >
        {isCracking ? (
          <>RUNNING RAINBOW TABLES ({progress}%)</>
        ) : (
          <><FaPlay /> INITIATE BRUTE-FORCE ATTACK</>
        )}
      </button>

      {/* Progress Bar */}
      {isCracking && (
        <div className="progress-bar-container">
          <div className="progress-bar-fill red" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Attack Visualizer / Terminal */}
      <div className="terminal-display" style={{ height: "150px", marginTop: "10px" }}>
        {attempts.length === 0 && !crackedPassword && (
          <div className="terminal-empty">WAITING FOR ATTACK COMMAND...</div>
        )}
        
        <div className="terminal-inner">
          {attempts.map((attempt, index) => (
            <div key={index} className="log-line">
              <span className="log-time" style={{ color: "var(--red-primary)" }}>[ATTEMPT]</span> 
              <span className="log-message" style={{ marginLeft: "8px", opacity: 0.7 }}>
                Testing: {attempt}
              </span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Result Display */}
      {crackedPassword && !isCracking && (
        <div className="cracked-result animate-fade-in" style={{ marginTop: "15px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
          <FaUnlockAlt style={{ fontSize: "24px", color: "#22c55e", marginBottom: "10px" }} />
          <h4 style={{ color: "#22c55e", fontSize: "14px", margin: "0 0 5px 0" }}>HASH SUCCESSFULLY CRACKED</h4>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "#ffffff", fontWeight: "bold" }}>
            {crackedPassword}
          </div>
        </div>
      )}
    </div>
  );
}
