import { useState } from "react";
import { FaBell, FaInfoCircle, FaCheck, FaExclamationCircle } from "react-icons/fa";
import { playClick, playSuccess } from "../../utils/audio";

const INITIAL_ALERTS = [
  { id: 1, title: "Database Exfiltration Spike", source: "DB-Cluster-02", severity: "CRITICAL", desc: "Outbound egress data spike of 8.2 GB detected within 30 seconds. Potential SQL dump exfiltration.", timestamp: "1 min ago" },
  { id: 2, title: "Admin Portal Brute Bypass", source: "Auth-Gateway", severity: "HIGH", desc: "15 consecutive failed login attempts on 'admin' within 5s, followed by a successful auth from unmatched IP.", timestamp: "3 mins ago" },
  { id: 3, title: "Phishing Endpoint DNS Callout", source: "WS-User-92", severity: "MEDIUM", desc: "Local workstation connected to known blacklisted command & control server domain dynamicdns.top.", timestamp: "12 mins ago" }
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [investigatingAlert, setInvestigatingAlert] = useState(null);

  const handleResolve = (id) => {
    playSuccess();
    setAlerts(prev => prev.filter(a => a.id !== id));
    if (investigatingAlert && investigatingAlert.id === id) {
      setInvestigatingAlert(null);
    }
  };

  const handleInvestigate = (alert) => {
    playClick();
    setInvestigatingAlert(alert);
  };

  return (
    <div className="card blue-card alerts-monitor-card">
      <div className="card-header">
        <div className="header-left">
          <FaBell className="header-icon red-text animate-pulse" />
          <h3>Critical Alarm Hub</h3>
        </div>
        <span className="badge counter-badge">{alerts.length} PENDING</span>
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="alerts-empty-state">
            <FaCheck className="success-icon" />
            <p>ALL INCIDENT QUEUES CLEAR / ZERO ALARMS</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`alert-box severity-${alert.severity.toLowerCase()}`}
            >
              <div className="alert-meta">
                <FaExclamationCircle className="alert-state-icon" />
                <span className="alert-title">{alert.title}</span>
                <span className="alert-time">{alert.timestamp}</span>
              </div>
              
              <div className="alert-brief">
                <span>Sector: <strong>{alert.source}</strong></span>
              </div>

              <div className="alert-actions">
                <button 
                  className="alert-btn investigate" 
                  onClick={() => handleInvestigate(alert)}
                >
                  <FaInfoCircle /> ANALYZE
                </button>
                <button 
                  className="alert-btn resolve" 
                  onClick={() => handleResolve(alert.id)}
                >
                  <FaCheck /> RESOLVE
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Investigation Details Modal simulation */}
      {investigatingAlert && (
        <div className="investigate-modal-overlay animate-fade-in">
          <div className="investigate-modal">
            <div className="modal-header">
              <span className={`modal-badge ${investigatingAlert.severity.toLowerCase()}`}>
                {investigatingAlert.severity} THREAT INCIDENT
              </span>
              <button 
                className="close-modal-btn" 
                onClick={() => { playClick(); setInvestigatingAlert(null); }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <h3>{investigatingAlert.title}</h3>
              <p className="modal-desc">{investigatingAlert.desc}</p>
              
              <div className="technical-details">
                <h5>GATEWAY REPORT DIAGNOSTICS:</h5>
                <ul>
                  <li><strong>Incident Node:</strong> {investigatingAlert.source}</li>
                  <li><strong>Security Level:</strong> Category 4 Cyber Threat</li>
                  <li><strong>Trigger Rule:</strong> Sig ID 40992 (Abnormal payload size)</li>
                  <li><strong>Suggested Defense:</strong> Disconnect Node interface or Deploy Egress Firewall Block Rule on destination IPs.</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="modal-action-btn mitigate"
                onClick={() => handleResolve(investigatingAlert.id)}
              >
                DEPLOY SYSTEM SHIELD MITIGATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}