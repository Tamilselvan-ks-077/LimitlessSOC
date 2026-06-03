import { useState } from "react";
import { FaEye, FaSearch, FaDna, FaEnvelopeOpen, FaSitemap } from "react-icons/fa";
import { playClick, playSuccess, playKeyboard } from "../../utils/audio";

const LEAKED_DATA_MOCKS = {
  dns: [
    { type: "A", name: "victimcorp.org", value: "198.51.100.12" },
    { type: "MX", name: "mail.victimcorp.org", value: "10 mail-exchange.google.com" },
    { type: "TXT", name: "victimcorp.org", value: "v=spf1 include:_spf.google.com -all" },
    { type: "CNAME", name: "ftp.victimcorp.org", value: "ftp-backup.victimcorp.org" }
  ],
  subdomains: [
    { host: "staging.victimcorp.org", ip: "198.51.100.15", status: "Active (Jenkins Dev Portal)" },
    { host: "dev-db.victimcorp.org", ip: "198.51.100.22", status: "Active (Unsecured Postgres Port)" },
    { host: "vpn.victimcorp.org", ip: "198.51.100.8", status: "Active (PulseSecure VPN Client)" }
  ],
  emails: [
    { email: "t.ceo@victimcorp.org", department: "Executive Board", source: "LinkedIn Breach 2024" },
    { email: "sysadmin-core@victimcorp.org", department: "IT Security Ops", source: "Github Public Gist Leak" },
    { email: "billing@victimcorp.org", department: "Accounts Payable", source: "Adobe Breach Leak" }
  ]
};

export default function ReconTools() {
  const [activeTab, setActiveTab] = useState("subdomains");
  const [domain, setDomain] = useState("victimcorp.org");
  const [isScanning, setIsScanning] = useState(false);
  const [harvestedData, setHarvestedData] = useState(null);

  const handleReconRun = (e) => {
    e.preventDefault();
    if (!domain) return;

    playClick();
    setIsScanning(true);
    setHarvestedData(null);

    // Simulate active scraping
    let tickCount = 0;
    const interval = setInterval(() => {
      playKeyboard();
      tickCount++;
      if (tickCount >= 5) {
        clearInterval(interval);
        setIsScanning(false);
        playSuccess();
        setHarvestedData(LEAKED_DATA_MOCKS[activeTab]);
      }
    }, 400);
  };

  return (
    <div className="card red-card recon-tools-card">
      <div className="card-header">
        <div className="header-left">
          <FaEye className="header-icon red-text animate-pulse" />
          <h3>Offensive Reconnaissance Deck</h3>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="recon-tabs">
        <button 
          className={`tab-btn ${activeTab === "subdomains" ? "active" : ""}`}
          onClick={() => { playClick(); setActiveTab("subdomains"); setHarvestedData(null); }}
          disabled={isScanning}
        >
          <FaSitemap /> SUBDOMAINS
        </button>
        <button 
          className={`tab-btn ${activeTab === "dns" ? "active" : ""}`}
          onClick={() => { playClick(); setActiveTab("dns"); setHarvestedData(null); }}
          disabled={isScanning}
        >
          <FaDna /> DNS MAP
        </button>
        <button 
          className={`tab-btn ${activeTab === "emails" ? "active" : ""}`}
          onClick={() => { playClick(); setActiveTab("emails"); setHarvestedData(null); }}
          disabled={isScanning}
        >
          <FaEnvelopeOpen /> EMAIL HARVEST
        </button>
      </div>

      <form onSubmit={handleReconRun} className="recon-form">
        <div className="form-group">
          <label>Target Domain Sector Domain</label>
          <div className="input-with-btn">
            <input 
              type="text" 
              value={domain}
              onChange={e => setDomain(e.target.value)}
              disabled={isScanning}
              placeholder="e.g. targetcompany.com"
              required
            />
            <button type="submit" className="execute-recon-btn" disabled={isScanning}>
              <FaSearch /> {isScanning ? "HARVESTING..." : "RUN RECON"}
            </button>
          </div>
        </div>
      </form>

      {isScanning && (
        <div className="recon-scraping-visual">
          <span className="scraping-indicator animate-pulse">EXTRACTING TARGET TELEMETRY...</span>
          <div className="scraping-terminal-loader"></div>
        </div>
      )}

      {harvestedData && !isScanning && (
        <div className="recon-results-panel animate-fade-in">
          <h4>DATA HARVEST RESULTS ({harvestedData.length})</h4>

          {activeTab === "subdomains" && (
            <div className="subdomain-results">
              {harvestedData.map((sub, idx) => (
                <div key={idx} className="sub-row">
                  <span className="sub-host font-mono">{sub.host}</span>
                  <span className="sub-ip font-mono">{sub.ip}</span>
                  <span className="sub-status text-red">{sub.status}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "dns" && (
            <div className="dns-results">
              <table className="dns-table">
                <thead>
                  <tr>
                    <th>TYPE</th>
                    <th>RECORD NAME</th>
                    <th>TARGET VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {harvestedData.map((record, idx) => (
                    <tr key={idx}>
                      <td className="dns-type">{record.type}</td>
                      <td className="font-mono">{record.name}</td>
                      <td className="font-mono text-red">{record.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "emails" && (
            <div className="email-results">
              {harvestedData.map((e, idx) => (
                <div key={idx} className="email-row">
                  <div className="email-main">
                    <span className="email-address font-mono">{e.email}</span>
                    <span className="email-dept">{e.department}</span>
                  </div>
                  <span className="email-breach-source font-mono">{e.source}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}