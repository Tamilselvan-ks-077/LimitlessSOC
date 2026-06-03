import { useState, useEffect, useRef } from "react";
import { FaTerminal, FaPlay, FaPause, FaTrash, FaFilter } from "react-icons/fa";
import { playClick, playKeyboard } from "../../utils/audio";

const LOG_TEMPLATES = [
  { type: "INFO", message: "SSH session established for user 'root' from 10.0.4.15" },
  { type: "SUCCESS", message: "Integrity check passed on system files: hash 0x7E3A9" },
  { type: "WARNING", message: "High volume of UDP connections detected on Port 53" },
  { type: "ALERT", message: "Unauthenticated payload execution attempt on webserver" },
  { type: "INFO", message: "Egress firewall rules reloaded successfully" },
  { type: "SUCCESS", message: "Database replication synchronized with Secondary Node" },
  { type: "WARNING", message: "CPU Core #3 temperature exceeded threshold (78C)" },
  { type: "ALERT", message: "File integrity monitor detected change in /etc/shadow" },
  { type: "INFO", message: "Intrusion Detection System signature database updated (v4.89)" },
  { type: "SUCCESS", message: "Patch matrix 2.15 deployed to security gateways" }
];

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const logEndRef = useRef(null);

  // Initialize with some logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 8 }).map((_, idx) => {
      const template = LOG_TEMPLATES[idx % LOG_TEMPLATES.length];
      const time = new Date(Date.now() - (8 - idx) * 5000);
      return {
        id: idx,
        timestamp: time.toLocaleTimeString(),
        type: template.type,
        message: template.message
      };
    });
    setLogs(initialLogs);
  }, []);

  // Scroll to bottom when new logs arrive
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Dynamic log generator
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const now = new Date();
      
      const newLog = {
        id: Date.now(),
        timestamp: now.toLocaleTimeString(),
        type: template.type,
        message: template.message
      };

      setLogs(prev => [...prev.slice(-30), newLog]); // Keep last 30 logs
      
      // Subtle keyboard tick sound
      playKeyboard();
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePauseToggle = () => {
    playClick();
    setIsPaused(!isPaused);
  };

  const handleClear = () => {
    playClick();
    setLogs([]);
  };

  const handleFilterChange = (newFilter) => {
    playClick();
    setFilter(newFilter);
  };

  const filteredLogs = logs.filter(log => {
    if (filter === "ALL") return true;
    if (filter === "ALERTS") return log.type === "ALERT" || log.type === "WARNING";
    if (filter === "INFO") return log.type === "INFO" || log.type === "SUCCESS";
    return true;
  });

  return (
    <div className="card blue-card log-viewer-card">
      <div className="card-header">
        <div className="header-left">
          <FaTerminal className="header-icon blue-text" />
          <h3>Security Log Viewer</h3>
        </div>
        <div className="log-controls">
          <button 
            className={`log-btn ${isPaused ? "play" : "pause"}`} 
            onClick={handlePauseToggle}
            title={isPaused ? "Resume Logging" : "Pause Logging"}
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
          <button 
            className="log-btn clear-btn" 
            onClick={handleClear}
            title="Clear Terminal Output"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Log Filters */}
      <div className="log-filters">
        <span className="filter-label"><FaFilter /> FILTER:</span>
        {["ALL", "ALERTS", "INFO"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => handleFilterChange(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Terminal Screen */}
      <div className="terminal-display">
        <div className="terminal-inner">
          {filteredLogs.length === 0 ? (
            <div className="terminal-empty">NO ACTIVE CONNECTION FEED / IDLE</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className={`log-line type-${log.type.toLowerCase()}`}>
                <span className="log-time">[{log.timestamp}]</span>{" "}
                <span className={`log-tag ${log.type.toLowerCase()}`}>[{log.type}]</span>{" "}
                <span className="log-message">{log.message}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}