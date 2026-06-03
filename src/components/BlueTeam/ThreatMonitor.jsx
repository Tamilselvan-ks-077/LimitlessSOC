import { useState, useEffect } from "react";
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaCrosshairs } from "react-icons/fa";
import { playSuccess, playWarning } from "../../utils/audio";

const INITIAL_THREATS = [
  { id: 1, source: "185.220.101.5", country: "RU", attackType: "Brute Force SSH", severity: "HIGH", status: "Active" },
  { id: 2, source: "45.146.165.12", country: "CN", attackType: "SQL Injection Attempt", severity: "CRITICAL", status: "Active" },
  { id: 3, source: "193.106.191.43", country: "NL", attackType: "DDoS Flood (SYN)", severity: "HIGH", status: "Active" },
  { id: 4, source: "91.241.19.88", country: "UA", attackType: "Port Scanning", severity: "MEDIUM", status: "Active" },
];

export default function ThreatMonitor() {
  const [threats, setThreats] = useState(INITIAL_THREATS);

  // Auto-generate threats over time
  useEffect(() => {
    const attackTypes = [
      "XSS Injection",
      "LFI Directory Traversal",
      "RDP Brute Force",
      "Phishing URL Click",
      "MALWARE Callout DNS",
      "API Exploit Attempt"
    ];
    const countries = ["CN", "RU", "NL", "US", "DE", "BR", "RO", "KP"];
    const severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

    const interval = setInterval(() => {
      // 30% chance to spawn a new threat if count is less than 6
      if (Math.random() < 0.35 && threats.filter(t => t.status === "Active").length < 6) {
        const newThreat = {
          id: Date.now(),
          source: `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          country: countries[Math.floor(Math.random() * countries.length)],
          attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          status: "Active"
        };
        
        setThreats(prev => [newThreat, ...prev.slice(0, 5)]);
        
        // Play alert sound if severity is high/critical
        if (newThreat.severity === "HIGH" || newThreat.severity === "CRITICAL") {
          playWarning();
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [threats]);

  const handleMitigate = (id) => {
    playSuccess();
    setThreats(prev =>
      prev.map(t => (t.id === id ? { ...t, status: "Mitigated" } : t))
    );
  };

  return (
    <div className="card blue-card threat-monitor-card">
      <div className="card-header">
        <div className="header-left">
          <FaShieldAlt className="header-icon blue-text animate-pulse" />
          <h3>Threat Intelligence Feed</h3>
        </div>
        <span className="badge live-badge">LIVE FEED</span>
      </div>

      <div className="threats-list">
        {threats.map((threat) => (
          <div 
            key={threat.id} 
            className={`threat-item severity-${threat.severity.toLowerCase()} ${threat.status === "Mitigated" ? "mitigated" : ""}`}
          >
            <div className="threat-meta">
              <span className={`severity-tag ${threat.severity.toLowerCase()}`}>
                {threat.severity}
              </span>
              <span className="threat-source">{threat.source}</span>
              <span className="threat-country">({threat.country})</span>
            </div>

            <div className="threat-details">
              <span className="threat-type">{threat.attackType}</span>
              <span className="threat-time">Just Now</span>
            </div>

            <div className="threat-actions">
              {threat.status === "Active" ? (
                <button 
                  className="mitigate-btn" 
                  onClick={() => handleMitigate(threat.id)}
                >
                  <FaCrosshairs style={{ marginRight: "4px" }} /> MITIGATE
                </button>
              ) : (
                <span className="mitigated-label">
                  <FaCheckCircle style={{ marginRight: "4px" }} /> SECURED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}