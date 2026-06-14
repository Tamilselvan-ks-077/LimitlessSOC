import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import TechCanvas from "../components/TechCanvas";
import ThreatMap from "../components/ThreatMap";
import RedTeamConsole from "../components/RedTeamConsole";

// Import custom analytical HUD widgets
import {
  CountUp,
  SystemHealthIndicator,
  ThreatChart,
  FirewallChart,
  AssessmentChart
} from "../components/CyberHUDWidgets";

// Import Blue Team subcomponents
import ThreatMonitor from "../components/BlueTeam/ThreatMonitor";
import LogViewer from "../components/BlueTeam/LogViewer";
import VulnerabilityScanner from "../components/BlueTeam/VulnerabilityScanner";
import AttackFeed from "../components/BlueTeam/AttackFeed";
import FirewallRules from "../components/BlueTeam/FirewallRules";

// Import Red Team subcomponents
import IPTracer from "../components/RedTeam/IPTracer";
import PortScanner from "../components/RedTeam/PortScanner";
import HashCracker from "../components/RedTeam/HashCracker";
import ReconTools from "../components/RedTeam/ReconTools";
import ReportGenerator from "../components/RedTeam/ReportGenerator";

import { playHover, playClick, playWarning } from "../utils/audio";
import { 
  Shield, 
  Terminal as TermIcon, 
  Globe, 
  Activity, 
  AlertTriangle, 
  Network, 
  Lock, 
  Layers, 
  Server, 
  Flame, 
  ShieldAlert, 
  Cpu,
  Clock
} from "lucide-react";

export default function Dashboard({ team, goBack, soundEnabled, onSoundToggle }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "defense" | "offense" | "map"
  const [systemTime, setSystemTime] = useState("");
  const [threatLevel, setThreatLevel] = useState("ELEVATED");
  const [threatPercent, setThreatPercent] = useState(48);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect calculations
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 60;
    const moveY = (clientY - window.innerHeight / 2) / 60;
    setMousePos({ x: moveX, y: moveY });
  };

  // Simulating threat level fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
      setThreatPercent((prev) => {
        const next = Math.max(10, Math.min(99, prev + change));
        if (next > 75) {
          setThreatLevel("CRITICAL");
        } else if (next > 45) {
          setThreatLevel("ELEVATED");
        } else {
          setThreatLevel("STANDBY");
        }
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "overview") {
      gsap.fromTo(
        ".overview-metric-card",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const selectTab = (tabId) => {
    playClick();
    setActiveTab(tabId);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`min-height-screen relative overflow-hidden select-none bg-[#05040a] ${
        activeTab === "defense" ? "blue-theme" : activeTab === "offense" ? "red-theme" : "purple-theme"
      }`}
    >
      {/* Dynamic Grid Background canvas */}
      <TechCanvas theme={activeTab === "defense" ? "blue" : activeTab === "offense" ? "red" : "purple"} />
      
      {/* Curvature scan lines for CRT texture */}
      <div className="scanlines" />

      {/* Top Main Navigation Header */}
      <Navbar 
        goHome={goBack} 
        soundEnabled={soundEnabled} 
        onSoundToggle={onSoundToggle} 
        team={activeTab === "defense" ? "blue" : activeTab === "offense" ? "red" : "purple"} 
      />

      {/* Integrated HUD sub-nav selector bar */}
      <div className="relative z-10 max-w-[1650px] mx-auto px-6 mt-4">
        <div className="flex flex-wrap items-center justify-between border border-purple-500/15 bg-[#0a0615]/75 backdrop-blur-md rounded-xl p-2.5">
          {/* Left indicator */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-purple-400/80 pl-2">
            <span className={`w-2 h-2 rounded-full bg-purple-500 animate-pulse`} />
            <span className="tracking-widest uppercase">COMMAND NODE: L-SOC-GRID-7</span>
          </div>

          {/* Sub Tab buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            <button
              onClick={() => selectTab("overview")}
              onMouseEnter={playHover}
              className={`px-4 py-2 rounded-lg font-hud text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "overview" 
                  ? "bg-purple-600/20 text-white border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
                  : "bg-transparent text-purple-300/60 border border-transparent hover:text-white"
              }`}
            >
              GLOBAL HUD
            </button>
            <button
              onClick={() => selectTab("defense")}
              onMouseEnter={playHover}
              className={`px-4 py-2 rounded-lg font-hud text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "defense" 
                  ? "bg-cyan-500/20 text-white border border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.3)]" 
                  : "bg-transparent text-purple-300/60 border border-transparent hover:text-white"
              }`}
            >
              DEFENSE SYSTEMS
            </button>
            <button
              onClick={() => selectTab("offense")}
              onMouseEnter={playHover}
              className={`px-4 py-2 rounded-lg font-hud text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "offense" 
                  ? "bg-red-500/20 text-white border border-red-500 shadow-[0_0_15px_rgba(255,42,42,0.3)]" 
                  : "bg-transparent text-purple-300/60 border border-transparent hover:text-white"
              }`}
            >
              OFFENSIVE CORE
            </button>
            <button
              onClick={() => selectTab("map")}
              onMouseEnter={playHover}
              className={`px-4 py-2 rounded-lg font-hud text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "map" 
                  ? "bg-fuchsia-600/20 text-white border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)]" 
                  : "bg-transparent text-purple-300/60 border border-transparent hover:text-white"
              }`}
            >
              THREAT MAP
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard HUD content */}
      <div 
        className="max-w-[1650px] mx-auto px-6 py-6 relative z-10 transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
      >
        <AnimatePresence mode="wait">
          {/* TAB 1: GLOBAL HUBOVERVIEW */}
          {activeTab === "overview" && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* SECTION 1: HERO SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Logo Glitch */}
                <div className="cyber-card-purple rounded-2xl p-5 flex flex-col justify-between h-36 border border-purple-500/20 relative overflow-hidden">
                  <div className="corner-trim top-left" />
                  <div className="corner-trim top-right" />
                  <div className="corner-trim bottom-left" />
                  <div className="corner-trim bottom-right" />
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-mono">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>SYSTEM IDENT STATUS: OK</span>
                  </div>
                  <h1 
                    className="cyber-glitch text-3xl font-extrabold text-white tracking-widest font-hud text-shadow-purple"
                    data-text="LIMITLESS SOC"
                  >
                    LIMITLESS SOC
                  </h1>
                  <span className="text-[10px] text-purple-400/60 font-mono tracking-wider">
                    COGNITIVE DEEP SEARCH THREAT CONSOLE
                  </span>
                </div>

                {/* Clock UTC */}
                <div className="cyber-card-purple rounded-2xl p-5 flex flex-col justify-between h-36 border border-purple-500/20 relative overflow-hidden">
                  <div className="corner-trim top-left" />
                  <div className="corner-trim top-right" />
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-mono">
                    <Clock className="w-4 h-4 text-purple-400 animate-spin" />
                    <span>SYNCHRONIZER FEED: SATELLITE</span>
                  </div>
                  <div className="text-xl md:text-2xl font-mono text-cyan-400 text-shadow-blue tracking-widest font-bold">
                    {systemTime || "LOADING CLOCK..."}
                  </div>
                  <span className="text-[10px] text-purple-400/60 font-mono tracking-wider">
                    UTC STANDARDIZED TELEMETRY TIMESTAMP
                  </span>
                </div>

                {/* Threat level indicator */}
                <div className="cyber-card-purple rounded-2xl p-5 flex flex-col justify-between h-36 border border-purple-500/20 relative overflow-hidden">
                  <div className="corner-trim top-left" />
                  <div className="corner-trim top-right" />
                  <div className="flex items-center justify-between text-purple-400 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
                      <span>THREAT DETECTED</span>
                    </div>
                    <span className="text-red-500 font-bold">{threatPercent}%</span>
                  </div>
                  <div className={`text-2xl font-hud font-extrabold tracking-widest ${
                    threatLevel === "CRITICAL" ? "text-red-500 text-shadow-red animate-pulse" : "text-amber-500"
                  }`}>
                    LEVEL: {threatLevel}
                  </div>
                  <div className="w-full h-1 bg-purple-950/60 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        threatLevel === "CRITICAL" ? "bg-red-500" : "bg-purple-500"
                      }`}
                      style={{ width: `${threatPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: REAL-TIME METRICS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="cyber-card-purple overview-metric-card rounded-xl p-4 border border-purple-500/15 flex items-center justify-between hover-neon-purple transition-all duration-300">
                  <div className="font-mono">
                    <div className="text-[10px] text-purple-400/50">ACTIVE ALERTS</div>
                    <div className="text-2xl font-hud font-bold text-white mt-1">
                      <CountUp end={14} />
                    </div>
                  </div>
                  <ShieldAlert className="w-8 h-8 text-purple-400 opacity-60" />
                </div>

                <div className="cyber-card-purple overview-metric-card rounded-xl p-4 border border-purple-500/15 flex items-center justify-between hover-neon-purple transition-all duration-300">
                  <div className="font-mono">
                    <div className="text-[10px] text-purple-400/50">ATTACKS IN PROGRESS</div>
                    <div className="text-2xl font-hud font-bold text-red-400 mt-1">
                      <CountUp end={8432} duration={2} />
                    </div>
                  </div>
                  <Flame className="w-8 h-8 text-red-400 opacity-60" />
                </div>

                <div className="cyber-card-purple overview-metric-card rounded-xl p-4 border border-purple-500/15 flex items-center justify-between hover-neon-purple transition-all duration-300">
                  <div className="font-mono">
                    <div className="text-[10px] text-purple-400/50">CVE VULNERABILITIES</div>
                    <div className="text-2xl font-hud font-bold text-amber-400 mt-1">
                      <CountUp end={28} />
                    </div>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-amber-500 opacity-60" />
                </div>

                <div className="cyber-card-purple overview-metric-card rounded-xl p-4 border border-purple-500/15 flex items-center justify-between hover-neon-purple transition-all duration-300 font-sans">
                  <div className="font-mono">
                    <div className="text-[10px] text-purple-400/50">SYSTEM HEALTH</div>
                    <div className="text-sm font-hud font-bold text-white mt-1">
                      CORE: COMPRESSED
                    </div>
                  </div>
                  <SystemHealthIndicator percentage={98.6} />
                </div>
              </div>

              {/* SECTION 4: LIVE THREAT MAP & STATS */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <ThreatMap />
                </div>
                
                {/* Diagnostics / Radar info panel */}
                <div className="cyber-card-purple rounded-2xl p-5 border border-purple-500/20 relative overflow-hidden flex flex-col justify-between h-[480px]">
                  <div className="corner-trim top-left" />
                  <div className="corner-trim top-right" />
                  <div className="corner-trim bottom-left" />
                  <div className="corner-trim bottom-right" />
                  
                  <div>
                    <div className="flex items-center gap-2 border-b border-purple-500/15 pb-2 mb-4 font-hud text-[11px] text-purple-400 font-bold tracking-widest">
                      <Network className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span>COGNITIVE GATEWAY ROUTING</span>
                    </div>

                    <div className="flex flex-col gap-3.5 font-mono text-[11.5px] text-purple-300/80">
                      <div className="flex justify-between items-center bg-purple-950/10 p-2 border border-purple-500/10 rounded">
                        <span>NEURAL CONNECTIONS</span>
                        <span className="text-cyan-400 font-bold">45 Active Paths</span>
                      </div>
                      <div className="flex justify-between items-center bg-purple-950/10 p-2 border border-purple-500/10 rounded">
                        <span>SAT UPLINK HOP</span>
                        <span className="text-cyan-400 font-bold">Node-09 (GEO-Sync)</span>
                      </div>
                      <div className="flex justify-between items-center bg-purple-950/10 p-2 border border-purple-500/10 rounded">
                        <span>DECRYPTION LAYER</span>
                        <span className="text-emerald-400 font-bold">TLS_AES_256_GCM</span>
                      </div>
                      <div className="flex justify-between items-center bg-purple-950/10 p-2 border border-purple-500/10 rounded">
                        <span>AIRGAP ISOLATOR</span>
                        <span className="text-emerald-400 font-bold">SHIELD ACTIVE (99.9%)</span>
                      </div>
                    </div>
                  </div>

                  {/* High Tech HUD Meter */}
                  <div className="mt-4 border-t border-purple-500/15 pt-4">
                    <div className="flex justify-between text-[10px] text-purple-400/60 font-mono mb-2">
                      <span>INTELLIGENCE RADAR CAPACITY</span>
                      <span>{Math.round(threatPercent * 1.3)} / 150 Nodes</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-4 flex-1 rounded-sm border border-purple-500/10 transition-colors duration-500 ${
                            i < (threatPercent / 7) ? "bg-purple-500/60 shadow-[0_0_8px_#a855f7]" : "bg-purple-950/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* TELEMETRIES ROW: DEFENSIVE TELEMETRY vs OFFENSIVE TELEMETRY */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Defensive Ingress Area */}
                <div className="cyber-card-purple rounded-2xl p-5 border border-purple-500/20 relative overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-purple-500/15 pb-2 mb-4 font-hud text-[11px] text-cyan-400 font-bold tracking-widest">
                    <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>DEFENSIVE INGRESS (NORMAL VS ATTACK attempt)</span>
                  </div>
                  <FirewallChart />
                </div>

                {/* Offensive Radar Assessment */}
                <div className="cyber-card-purple rounded-2xl p-5 border border-purple-500/20 relative overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-purple-500/15 pb-2 mb-4 font-hud text-[11px] text-red-400 font-bold tracking-widest">
                    <TermIcon className="w-4 h-4 text-red-400 animate-pulse" />
                    <span>RED TEAM AUDIT VECTOR MATRIX</span>
                  </div>
                  <AssessmentChart />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DEFENSIVE OPERATIONS */}
          {activeTab === "defense" && (
            <motion.div
              key="tab-defense"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Detailed charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="cyber-card-blue rounded-2xl p-5 border border-cyan-500/20 relative overflow-hidden holo-scan">
                  <div className="corner-trim top-left" />
                  <div className="corner-trim top-right" />
                  <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-2 mb-4 font-hud text-[11px] text-cyan-400 font-bold tracking-widest">
                    <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>FIREWALL TELEMETRY LOGS (INBOUND)</span>
                  </div>
                  <FirewallChart />
                </div>

                <div className="cyber-card-blue rounded-2xl p-5 border border-cyan-500/20 relative overflow-hidden holo-scan">
                  <div className="corner-trim top-left" />
                  <div className="corner-trim top-right" />
                  <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-2 mb-4 font-hud text-[11px] text-cyan-400 font-bold tracking-widest">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>IDS/IPS THREAT DETECTION GRAPH</span>
                  </div>
                  <ThreatChart />
                </div>
              </div>

              {/* Blue Team Main Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 flex flex-col gap-6">
                  <ThreatMonitor />
                  <LogViewer />
                </div>
                <div className="flex flex-col gap-6">
                  <AttackFeed />
                  <FirewallRules />
                  <VulnerabilityScanner />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: OFFENSIVE OPERATIONS */}
          {activeTab === "offense" && (
            <motion.div
              key="tab-offense"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Interactive hacker console and payload builder */}
              <RedTeamConsole />

              {/* Red Team subcomponents */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 flex flex-col gap-6">
                  <IPTracer />
                  <PortScanner />
                  <HashCracker />
                </div>
                <div className="flex flex-col gap-6">
                  <ReconTools />
                  <ReportGenerator />
                  
                  {/* Extra Radar Chart */}
                  <div className="cyber-card-red rounded-xl p-5 border border-red-500/20 relative overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-red-500/15 pb-2 mb-4 font-hud text-[11px] text-red-500 font-bold tracking-widest">
                      <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                      <span>ASSESSMENT TELEMETRY</span>
                    </div>
                    <AssessmentChart />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: THREAT MAP FULLSCREEN */}
          {activeTab === "map" && (
            <motion.div
              key="tab-map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-6"
            >
              <div className="cyber-card-purple rounded-2xl p-6 border border-purple-500/25 relative overflow-hidden holo-scan">
                <div className="corner-trim top-left" />
                <div className="corner-trim top-right" />
                <div className="corner-trim bottom-left" />
                <div className="corner-trim bottom-right" />
                
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-400 animate-pulse" />
                    <div>
                      <h2 className="font-hud text-base text-white tracking-widest font-extrabold">
                        TACTICAL THREAT MAP FEED
                      </h2>
                      <span className="text-[10px] text-purple-400/50 font-mono tracking-wider">
                        REAL-TIME GEO-IP ATTACK TRACKING RADAR
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-purple-300 bg-purple-950/20 border border-purple-500/25 px-3 py-1 rounded">
                    SYS LEVEL: {threatLevel} ({threatPercent}%)
                  </div>
                </div>

                {/* Main large map */}
                <div className="h-[520px]">
                  <ThreatMap />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
