import Navbar from "../components/Navbar";
import TechCanvas from "../components/TechCanvas";

import ThreatMonitor from "../components/BlueTeam/ThreatMonitor";
import LogViewer from "../components/BlueTeam/LogViewer";
import VulnerabilityScanner from "../components/BlueTeam/VulnerabilityScanner";
import Alerts from "../components/BlueTeam/Alerts";
import FirewallRules from "../components/BlueTeam/FirewallRules";

import IPTracer from "../components/RedTeam/IPTracer";
import PortScanner from "../components/RedTeam/PortScanner";
import ReconTools from "../components/RedTeam/ReconTools";
import PayloadLab from "../components/RedTeam/PayloadLab";
import ReportGenerator from "../components/RedTeam/ReportGenerator";

import { FaShieldAlt, FaTerminal, FaHdd, FaClock, FaHeartbeat, FaSearch, FaBug, FaBiohazard, FaServer } from "react-icons/fa";

export default function Dashboard({ team, goBack, soundEnabled, onSoundToggle }) {
  return (
    <div className={team === "blue" ? "blue-theme dashboard-page" : "red-theme dashboard-page"}>
      {/* Immersive background canvas aligned to selected team */}
      <TechCanvas theme={team === "blue" ? "blue" : "red"} />
      
      {/* Scanlines layer for immersive retro-tech effect */}
      <div className="scanlines"></div>

      <Navbar 
        goHome={goBack} 
        soundEnabled={soundEnabled} 
        onSoundToggle={onSoundToggle} 
        team={team} 
      />

      <div className="dashboard-content">
        <header className="dashboard-header animate-fade-in">
          <div className="header-badge-wrapper">
            <span className={`status-dot pulse ${team === "blue" ? "blue" : "red"}`}></span>
            <span className="system-identity">
              {team === "blue" ? "DEFENSIVE OPERATIONS SECURE HUB" : "OFFENSIVE PENETRATION RADAR CONTROL"}
            </span>
          </div>
          <h1>
            {team === "blue" ? (
              <>🛡 BLUE TEAM <span className="light-accent">SECURITY CENTER</span></>
            ) : (
              <>⚔ RED TEAM <span className="light-accent">ASSESSMENT COMMAND</span></>
            )}
          </h1>
          <p className="sector-subtext">
            SYSTEM NODE: LIMITLESS_SECURE_GRID_7 // AUTHORIZED ACCESS ONLY
          </p>
        </header>

        {team === "blue" && (
          <>
            {/* Blue Team Dynamic Stats */}
            <div className="overview-cards animate-fade-in">
              <div className="overview-card">
                <div className="card-top">
                  <FaShieldAlt className="stat-icon blue-text" />
                  <h3>Shield Coverage</h3>
                </div>
                <span>98.4%</span>
                <p className="stat-desc">All firewalls active</p>
              </div>

              <div className="overview-card">
                <div className="card-top">
                  <FaHdd className="stat-icon blue-text" />
                  <h3>Active Alerts</h3>
                </div>
                <span>3 Threats</span>
                <p className="stat-desc">Pending triage review</p>
              </div>

              <div className="overview-card">
                <div className="card-top">
                  <FaServer className="stat-icon blue-text" />
                  <h3>Mitigated Host IPs</h3>
                </div>
                <span>1,402</span>
                <p className="stat-desc">Blacklist synchronized</p>
              </div>

              <div className="overview-card">
                <div className="card-top">
                  <FaHeartbeat className="stat-icon blue-text" />
                  <h3>Integrity Index</h3>
                  <span className="badge-small online">ONLINE</span>
                </div>
                <span>99.9%</span>
                <p className="stat-desc">All main nodes normal</p>
              </div>

              <div className="overview-card">
                <div className="card-top">
                  <FaClock className="stat-icon blue-text" />
                  <h3>Cycle Speed</h3>
                </div>
                <span>0.8ms</span>
                <p className="stat-desc">DNS response latency</p>
              </div>
            </div>

            {/* Blue Team Main Grid */}
            <div className="blue-team main-grid-layout">
              <div className="grid-col-primary">
                <ThreatMonitor />
                <LogViewer />
              </div>
              <div className="grid-col-secondary">
                <Alerts />
                <FirewallRules />
                <VulnerabilityScanner />
              </div>
            </div>
          </>
        )}

        {team === "red" && (
          <>
            {/* Red Team Dynamic Stats */}
            <div className="overview-cards animate-fade-in">
              <div className="overview-card">
                <div className="card-top">
                  <FaSearch className="stat-icon red-text" />
                  <h3>Target Subnets</h3>
                </div>
                <span>12 Subnets</span>
                <p className="stat-desc">Mapping complete</p>
              </div>

              <div className="overview-card">
                <div className="card-top">
                  <FaBug className="stat-icon red-text" />
                  <h3>Audited Ports</h3>
                </div>
                <span>127 Scans</span>
                <p className="stat-desc">Active scan pool queue</p>
              </div>

              <div className="overview-card">
                <div className="card-top">
                  <FaBiohazard className="stat-icon red-text" />
                  <h3>Weak Exploits</h3>
                </div>
                <span>18 Vectors</span>
                <p className="stat-desc">Exploits hot-loaded</p>
              </div>

              <div className="overview-card">
                <div className="card-top">
                  <FaTerminal className="stat-icon red-text" />
                  <h3>Active Shells</h3>
                  <span className="badge-small breach">BREACHED</span>
                </div>
                <span>4 Shells</span>
                <p className="stat-desc">Egress tunnels active</p>
              </div>

              <div className="overview-card">
                <div className="card-top">
                  <FaClock className="stat-icon red-text" />
                  <h3>Assigned Reports</h3>
                </div>
                <span>14 Logs</span>
                <p className="stat-desc">Ready for encryption</p>
              </div>
            </div>

            {/* Red Team Main Grid */}
            <div className="red-team main-grid-layout">
              <div className="grid-col-primary">
                <IPTracer />
                <PortScanner />
                <PayloadLab />
              </div>
              <div className="grid-col-secondary">
                <ReconTools />
                <ReportGenerator />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
