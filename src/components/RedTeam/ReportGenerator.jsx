import { useState } from "react";
import { FaFileInvoice, FaLock, FaDownload, FaCheck, FaShieldAlt } from "react-icons/fa";
import { playClick, playSuccess, playKeyboard } from "../../utils/audio";

export default function ReportGenerator() {
  const [classification, setClassification] = useState("CONFIDENTIAL");
  const [scope, setScope] = useState("Full Perimeter Penetration Audit");
  const [summary, setSummary] = useState("Discovered multiple critical CVE vulnerabilities on external DB gateways. Secured SSH access points and mapped internal subnets.");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledReport, setCompiledReport] = useState(null);

  const handleCompile = (e) => {
    e.preventDefault();
    playClick();
    setIsCompiling(true);
    setCompiledReport(null);

    // Simulate cryptographic compilation
    let tick = 0;
    const interval = setInterval(() => {
      playKeyboard();
      tick++;
      if (tick >= 6) {
        clearInterval(interval);
        setIsCompiling(false);
        playSuccess();
        
        // Output compiled report structure
        setCompiledReport({
          id: `SEC-REP-${Math.floor(100000 + Math.random() * 900000)}`,
          timestamp: new Date().toUTCString(),
          checksum: "SHA256: " + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join(""),
          scope,
          classification,
          summary,
          riskScore: "8.4 / 10 (CRITICAL)",
          actionsTaken: "3 Open CVEs documented, 4 Port vectors exploited, 1 Root Shell established."
        });
      }
    }, 300);
  };

  return (
    <div className="card red-card report-generator-card">
      <div className="card-header">
        <div className="header-left">
          <FaFileInvoice className="header-icon red-text" />
          <h3>Red Team Security Reporting</h3>
        </div>
      </div>

      <form onSubmit={handleCompile} className="report-generator-form">
        <div className="form-row">
          <div className="form-group half">
            <label>Security Clearance Tag</label>
            <select 
              value={classification} 
              onChange={e => { playClick(); setClassification(e.target.value); }}
              disabled={isCompiling}
            >
              <option value="RESTRICTED">RESTRICTED USE</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL // RED TEAM ONLY</option>
              <option value="TOP SECRET">TOP SECRET // SENSITIVE CLASSIFIED</option>
            </select>
          </div>

          <div className="form-group half">
            <label>Exploit Scope Focus</label>
            <input 
              type="text" 
              value={scope} 
              onChange={e => setScope(e.target.value)}
              disabled={isCompiling}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Executive Actions Findings Summary</label>
          <textarea 
            rows="3" 
            value={summary}
            onChange={e => setSummary(e.target.value)}
            disabled={isCompiling}
            placeholder="Document threat parameters and exploitation logs..."
            required
          />
        </div>

        <button type="submit" className="compile-report-btn" disabled={isCompiling}>
          {isCompiling ? "COMPILING SECURE DOSSIER..." : "COMPILE EXECUTIVE SUMMARY"}
        </button>
      </form>

      {isCompiling && (
        <div className="report-generating-console">
          <span className="pulsing-hash">GENERATING CRYPTOGRAPHIC INTEGRITY SIGNATURES...</span>
          <div className="matrix-spinner"></div>
        </div>
      )}

      {compiledReport && !isCompiling && (
        <div className="compiled-report-view animate-fade-in">
          <div className="report-view-header">
            <h4><FaLock style={{ marginRight: "6px" }} /> SYSTEM EXPLOIT REPORT COMPILED</h4>
            <span className={`classification-badge ${compiledReport.classification.toLowerCase().replace(" ", "-")}`}>
              {compiledReport.classification}
            </span>
          </div>

          <div className="report-paper">
            <div className="report-paper-row">
              <span className="paper-label">REPORT ID:</span>
              <span className="paper-val font-mono">{compiledReport.id}</span>
            </div>
            
            <div className="report-paper-row">
              <span className="paper-label">TIMESTAMP:</span>
              <span className="paper-val">{compiledReport.timestamp}</span>
            </div>

            <div className="report-paper-row">
              <span className="paper-label">INTEGRITY HASH:</span>
              <span className="paper-val font-mono text-tiny break-all">{compiledReport.checksum}</span>
            </div>

            <hr className="report-divider" />

            <div className="report-paper-section">
              <h5>SCOPE TARGETS ASSIGNED:</h5>
              <p>{compiledReport.scope}</p>
            </div>

            <div className="report-paper-section">
              <h5>POSTURE RISK ASSESSMENT:</h5>
              <p className="red-text font-bold">{compiledReport.riskScore}</p>
            </div>

            <div className="report-paper-section">
              <h5>EXPLOIT ACTION LOGS:</h5>
              <p>{compiledReport.actionsTaken}</p>
            </div>

            <div className="report-paper-section">
              <h5>SUMMARY & REMEDIATION PLAN:</h5>
              <p className="font-italic">{compiledReport.summary}</p>
            </div>
          </div>

          <button 
            className="report-download-btn"
            onClick={() => { playSuccess(); alert("Report downloaded successfully to SOC-Archives!"); }}
          >
            <FaDownload /> EXPORT REPORT ENCRYPTED CONTAINER (.SEC)
          </button>
        </div>
      )}
    </div>
  );
}