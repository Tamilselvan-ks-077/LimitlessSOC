import { useState } from "react";
import { FaNetworkWired, FaPlay, FaExclamationTriangle, FaTerminal, FaUnlock } from "react-icons/fa";
import { playClick, playSuccess, playWarning, playKeyboard } from "../../utils/audio";

const SCANNED_PORT_TEMPLATES = [
  { port: 21, service: "FTP", status: "CLOSED", banner: "-" },
  { port: 22, service: "SSH", status: "OPEN", banner: "OpenSSH 7.2p2 (VULNERABLE)" },
  { port: 25, service: "SMTP", status: "CLOSED", banner: "-" },
  { port: 80, service: "HTTP", status: "OPEN", banner: "Apache 2.4.18 (Ubuntu)" },
  { port: 111, service: "RPC", status: "CLOSED", banner: "-" },
  { port: 443, service: "HTTPS", status: "OPEN", banner: "OpenSSL 1.0.2g (Outdated)" },
  { port: 3306, service: "MySQL", status: "CLOSED", banner: "-" },
  { port: 8080, service: "HTTP-Alt", status: "OPEN", banner: "Tomcat 8.5 (Default Admin Accs)" }
];

export default function PortScanner() {
  const [target, setTarget] = useState("192.168.1.55");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPorts, setScannedPorts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [exploitLog, setExploitLog] = useState(null);

  const handleScan = () => {
    playClick();
    setIsScanning(true);
    setScannedPorts([]);
    setProgress(0);
    setExploitLog(null);

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < SCANNED_PORT_TEMPLATES.length) {
        setScannedPorts(prev => [...prev, SCANNED_PORT_TEMPLATES[currentIdx]]);
        setProgress(Math.floor(((currentIdx + 1) / SCANNED_PORT_TEMPLATES.length) * 100));
        playKeyboard();
        
        if (SCANNED_PORT_TEMPLATES[currentIdx].status === "OPEN") {
          playWarning();
        }
        
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        playSuccess();
      }
    }, 450);
  };

  const handleTriggerExploit = (port, banner) => {
    playClick();
    setExploitLog(`[SYSTEM] Initializing injection attack payload on Port ${port}...`);
    
    setTimeout(() => {
      playWarning();
      setExploitLog(prev => `${prev}\n[EXPLOIT] Bypassing ${banner} controls...`);
    }, 800);

    setTimeout(() => {
      playSuccess();
      setExploitLog(prev => `${prev}\n[SUCCESS] Shell established! Gained UID=0 (root) access!`);
    }, 1800);
  };

  return (
    <div className="card red-card port-scanner-card">
      <div className="card-header">
        <div className="header-left">
          <FaNetworkWired className="header-icon red-text" />
          <h3>Port Vulnerability Scanner</h3>
        </div>
      </div>

      <div className="scanner-inputs">
        <div className="input-group">
          <label>Target Subnet Node IP</label>
          <div className="input-with-btn">
            <input 
              type="text" 
              value={target}
              onChange={e => setTarget(e.target.value)}
              disabled={isScanning}
              placeholder="e.g. 10.0.0.42"
            />
            <button 
              className="scan-btn" 
              onClick={handleScan}
              disabled={isScanning || !target}
            >
              {isScanning ? `SCANNING ${progress}%` : "RUN NETWORK SCAN"}
            </button>
          </div>
        </div>
      </div>

      {isScanning && (
        <div className="progress-bar-container red-progress">
          <div className="progress-bar-fill red" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {scannedPorts.length > 0 && (
        <div className="ports-table-wrapper animate-fade-in">
          <table className="ports-table">
            <thead>
              <tr>
                <th>PORT</th>
                <th>SERVICE</th>
                <th>STATUS</th>
                <th>SERVICE VERSION / BANNER</th>
                <th>EXPLOIT LINK</th>
              </tr>
            </thead>
            <tbody>
              {scannedPorts.map((p) => (
                <tr key={p.port} className={p.status === "OPEN" ? "port-open" : "port-closed"}>
                  <td className="font-mono">{p.port}</td>
                  <td>{p.service}</td>
                  <td>
                    <span className={`status-badge ${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="font-mono banner-text">{p.banner}</td>
                  <td>
                    {p.status === "OPEN" ? (
                      <button 
                        className="exploit-trigger-btn"
                        onClick={() => handleTriggerExploit(p.port, p.service)}
                      >
                        <FaUnlock /> ATTACK
                      </button>
                    ) : (
                      <span className="locked-label">SECURE</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {exploitLog && (
        <div className="exploit-terminal-console animate-fade-in">
          <div className="console-title-bar">
            <span>remote_shell_port.session</span>
            <button className="close-console-btn" onClick={() => { playClick(); setExploitLog(null); }}>&times;</button>
          </div>
          <pre className="exploit-output">{exploitLog}</pre>
        </div>
      )}
    </div>
  );
}