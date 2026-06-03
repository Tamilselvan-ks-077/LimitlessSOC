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

  const handleTrace = (e) => {
    e.preventDefault();
    if (!ip) return;

    playClick();
    setIsTracing(true);
    setTraceLog([]);
    setResult(null);

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < TRACE_STEPS.length) {
        setTraceLog(prev => [...prev, `[TRACER] ${TRACE_STEPS[stepIdx]}`]);
        playKeyboard();
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsTracing(false);
        playSuccess();
        
        // Load target intelligence dossier
        setResult({
          hostname: "ns3.corporate-vault.net",
          isp: "Spectra Security Fiber LLC",
          location: "Geneva, Switzerland (46.2044° N, 6.1432° E)",
          os: "CentOS Linux 7.4 (Kernel 3.10 - VULNERABLE)",
          threatIndex: "HIGH (8.7/10)",
          activePorts: "22/TCP, 80/TCP, 443/TCP, 8080/TCP"
        });
      }
    }, 800);
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