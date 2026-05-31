import Navbar from "../components/Navbar";

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

export default function Dashboard({ team, goBack }) {
  return (
    <div className={team === "blue" ? "blue-theme" : "red-theme"}>
      <Navbar goHome={goBack} />

      {team === "blue" && (
        <>
          <div className="overview-cards">
            <div className="overview-card">
              <h3>Threats Detected</h3>
              <span>127</span>
            </div>

            <div className="overview-card">
              <h3>Active Alerts</h3>
              <span>23</span>
            </div>

            <div className="overview-card">
              <h3>Blocked IPs</h3>
              <span>42</span>
            </div>

            <div className="overview-card">
              <h3>System Health</h3>
              <span>98%</span>
            </div>

            <div className="overview-card">
              <h3>Last Scan</h3>
              <span>2 mins ago</span>
            </div>
          </div>

          <div className="blue-team">
            <h2>🛡 Blue Team Security Operations Center</h2>

            <ThreatMonitor />
            <LogViewer />
            <FirewallRules />
            <VulnerabilityScanner />
            <Alerts />
          </div>
        </>
      )}

      {team === "red" && (
        <>
          <div className="overview-cards">
            <div className="overview-card">
              <h3>Targets</h3>
              <span>12</span>
            </div>

            <div className="overview-card">
              <h3>Open Ports</h3>
              <span>89</span>
            </div>

            <div className="overview-card">
              <h3>Vulnerabilities</h3>
              <span>17</span>
            </div>

            <div className="overview-card">
              <h3>Attack Simulations</h3>
              <span>9</span>
            </div>

            <div className="overview-card">
              <h3>Reports Generated</h3>
              <span>14</span>
            </div>
          </div>

          <div className="red-team">
            <h2>⚔ Red Team Security Assessment Center</h2>

            <IPTracer />
            <PortScanner />
            <ReconTools />
            <PayloadLab />
            <ReportGenerator />
          </div>
        </>
      )}
    </div>
  );
}
