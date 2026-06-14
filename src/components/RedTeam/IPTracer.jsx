import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaGlobe, FaCrosshairs, FaSkull, FaServer } from "react-icons/fa";
import { playClick, playSuccess, playKeyboard } from "../../utils/audio";

const TRACE_STEPS = [
  "Initializing remote geolocation packet ping...",
  "Routing packets through 3 global proxy relays...",
  "Retrieving WHOIS record credentials...",
  "Locating autonomous system number (ASN-14022)...",
  "Triangulating physical gateway latitude coordinates...",
  "Target signature acquired!"
];

export default function IPTracer() {
  const [ip, setIp] = useState("198.51.100.82");
  const [isTracing, setIsTracing] = useState(false);
  const [traceLog, setTraceLog] = useState([]);
  const [result, setResult] = useState(null);

  const handleTrace = async (e) => {
    e.preventDefault();
    if (!ip) return;

    playClick();
    setIsTracing(true);
    setTraceLog([]);
    setResult(null);

    setTraceLog(["[TRACER] Initializing remote geolocation packet ping...", "[TRACER] Routing packets through global proxy relays..."]);
    playKeyboard();

    try {
      const response = await fetch(`http://localhost:5000/api/trace/${ip}`);
      const data = await response.json();
      
      setIsTracing(false);
      playSuccess();

      if (data.status === "success") {
        setResult({
          hostname: data.org || "Unknown Domain",
          isp: data.isp || "Unknown ISP",
          location: `${data.city}, ${data.country} (${data.lat}, ${data.lon})`,
          os: "Unknown (Awaiting OS Fingerprint)",
          threatIndex: "PENDING SCAN",
          activePorts: "REQUIRES PORT SCAN"
        });
      } else {
        setResult({
          hostname: "RESOLUTION FAILED",
          isp: "UNKNOWN",
          location: "UNKNOWN",
          os: "UNKNOWN",
          threatIndex: "N/A",
          activePorts: "N/A"
        });
      }
    } catch (err) {
      console.error(err);
      setIsTracing(false);
      setTraceLog(prev => [...prev, "[ERROR] Connection to backend tracing server failed!"]);
    }
  };

  return (
    <div className="card red-card ip-tracer-card">
      <div className="card-header">
        <div className="header-left">
          <FaMapMarkerAlt className="header-icon red-text animate-pulse" />
          <h3>Target Node IP Tracer</h3>
        </div>
      </div>

      <form onSubmit={handleTrace} className="ip-tracer-form">
        <div className="form-group">
          <label>Target Domain / IPv4 Address</label>
          <div className="input-with-btn">
            <input 
              type="text" 
              placeholder="e.g. 198.51.100.82" 
              value={ip}
              onChange={e => setIp(e.target.value)}
              disabled={isTracing}
              required
            />
            <button type="submit" className="trace-btn" disabled={isTracing}>
              <FaCrosshairs /> {isTracing ? "LOCATING..." : "TRACE NODE"}
            </button>
          </div>
        </div>
      </form>

      {/* Triangulation Step Logs */}
      {isTracing && (
        <div className="tracer-logs-console">
          {traceLog.map((log, idx) => (
            <div key={idx} className="tracer-log-line">
              <span className="log-arrow">&gt;</span> {log}
            </div>
          ))}
          <div className="tracer-loader"></div>
        </div>
      )}

      {/* Target Intelligence Dossier Results */}
      {result && !isTracing && (
        <div className="ip-tracer-results animate-fade-in">
          <h4>
            <FaSkull className="danger-icon animate-pulse" /> TARGET DOSSIER COMPILED
          </h4>

          <div className="dossier-grid">
            <div className="dossier-cell">
              <span className="cell-label">HOSTNAME</span>
              <span className="cell-val font-mono">{result.hostname}</span>
            </div>
            
            <div className="dossier-cell">
              <span className="cell-label">ISP OVERLAY</span>
              <span className="cell-val">{result.isp}</span>
            </div>

            <div className="dossier-cell">
              <span className="cell-label">PHYSICAL LOCATION</span>
              <span className="cell-val">{result.location}</span>
            </div>

            <div className="dossier-cell">
              <span className="cell-label">OPERATING SYSTEM</span>
              <span className="cell-val red-text font-bold"><FaServer /> {result.os}</span>
            </div>

            <div className="dossier-cell">
              <span className="cell-label">VULNERABILITY INDEX</span>
              <span className="cell-val glow-red">{result.threatIndex}</span>
            </div>

            <div className="dossier-cell">
              <span className="cell-label">IDENTIFIED PORTS</span>
              <span className="cell-val font-mono">{result.activePorts}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}