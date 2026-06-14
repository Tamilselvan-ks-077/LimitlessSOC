import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playWarning, playClick } from "../utils/audio";

const LOCATIONS = [
  { name: "Beijing, CN", x: 650, y: 140, ip: "114.242.22.4" },
  { name: "Moscow, RU", x: 490, y: 100, ip: "95.108.181.25" },
  { name: "Frankfurt, DE", x: 420, y: 120, ip: "46.165.201.2" },
  { name: "Seoul, KR", x: 680, y: 145, ip: "210.123.44.88" },
  { name: "Singapore, SG", x: 620, y: 230, ip: "175.156.9.15" },
  { name: "Sydney, AU", x: 710, y: 340, ip: "120.147.22.1" },
  { name: "Sao Paulo, BR", x: 300, y: 300, ip: "200.180.2.14" },
  { name: "Seattle, US", x: 120, y: 120, ip: "67.183.19.22" },
  { name: "London, UK", x: 390, y: 110, ip: "82.165.1.42" }
];

const TARGETS = [
  { name: "SOC HQ - Washington DC", x: 210, y: 130 },
  { name: "Cloud Node - Frankfurt", x: 420, y: 120 },
  { name: "APAC Hub - Tokyo", x: 690, y: 135 }
];

const ATTACK_TYPES = [
  "DDoS Flooding Packet",
  "SQL Injection Exploit",
  "SSH Brute Force",
  "Ransomware Payload",
  "Zero-Day Buffer Overflow",
  "APTs Egress Sync"
];

export default function ThreatMap() {
  const [activeAttacks, setActiveAttacks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [radarRotation, setRadarRotation] = useState(0);
  const mapRef = useRef(null);

  // Radar sweep animation
  useEffect(() => {
    let frame;
    const animateRadar = () => {
      setRadarRotation((prev) => (prev + 1) % 360);
      frame = requestAnimationFrame(animateRadar);
    };
    frame = requestAnimationFrame(animateRadar);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Simulate threat attacks popping up
  useEffect(() => {
    const triggerAttack = () => {
      const source = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
      const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
      const attackId = Date.now();

      const newAttack = {
        id: attackId,
        source,
        target,
        type,
        timestamp: new Date().toLocaleTimeString()
      };

      setActiveAttacks((prev) => [...prev, newAttack]);
      setLogs((prev) => [newAttack, ...prev.slice(0, 15)]);

      // Warning beep for critical events
      if (Math.random() > 0.6) {
        playWarning();
      }

      // Remove attack path after animation completes (3 seconds)
      setTimeout(() => {
        setActiveAttacks((prev) => prev.filter((a) => a.id !== attackId));
      }, 3000);
    };

    // Trigger first attack
    triggerAttack();
    
    // Set interval
    const interval = setInterval(triggerAttack, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card border-purple-500/20 bg-[#0a0f1a]/80 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden h-[480px] flex flex-col md:flex-row gap-6">
      {/* Corner indicators */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-purple-500/40" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/40" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-purple-500/40" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-purple-500/40" />

      {/* Main Map Viewport */}
      <div className="flex-1 relative border border-purple-500/10 rounded-xl bg-[#03060f] overflow-hidden flex items-center justify-center">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        {/* Radar Sweep Animation */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full border border-purple-500/5 pointer-events-none"
          style={{
            background: `conic-gradient(from ${radarRotation}deg, rgba(168, 85, 247, 0.15) 0deg, transparent 90deg, transparent 360deg)`
          }}
        />
        
        {/* Map Coordinates overlay */}
        <div className="absolute top-3 left-4 font-mono text-[9px] text-purple-400/40 tracking-wider">
          GRID MATRIX: 49.27.01 // LATENCY: 22ms // RADAR: ENGAGED
        </div>

        {/* Vector SVG World map grid dots */}
        <svg 
          ref={mapRef}
          viewBox="0 0 800 400" 
          className="w-full h-full opacity-60 z-10"
        >
          {/* Static Grid rings */}
          <circle cx="400" cy="200" r="100" fill="none" stroke="rgba(168, 85, 247, 0.05)" strokeDasharray="3 3" />
          <circle cx="400" cy="200" r="180" fill="none" stroke="rgba(168, 85, 247, 0.03)" strokeDasharray="5 5" />
          
          {/* Abstract landmass representation (SVG outline/dot style) */}
          <g fill="rgba(168, 85, 247, 0.08)">
            {/* North America */}
            <circle cx="150" cy="120" r="25" />
            <circle cx="180" cy="140" r="20" />
            <circle cx="110" cy="110" r="15" />
            {/* South America */}
            <circle cx="280" cy="280" r="18" />
            <circle cx="300" cy="320" r="15" />
            {/* Europe */}
            <circle cx="410" cy="110" r="15" />
            <circle cx="430" cy="120" r="20" />
            {/* Africa */}
            <circle cx="440" cy="240" r="22" />
            <circle cx="460" cy="280" r="14" />
            {/* Asia */}
            <circle cx="580" cy="110" r="30" />
            <circle cx="640" cy="130" r="25" />
            <circle cx="620" cy="180" r="20" />
            {/* Australia */}
            <circle cx="700" cy="320" r="18" />
            <circle cx="720" cy="340" r="15" />
          </g>

          {/* Target Nodes */}
          {TARGETS.map((t, idx) => (
            <g key={`t-${idx}`}>
              {/* Pulsing ring */}
              <motion.circle
                cx={t.x}
                cy={t.y}
                r={12}
                fill="none"
                stroke="#00e5ff"
                strokeWidth={1}
                animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
              <circle cx={t.x} cy={t.y} r={4} fill="#00e5ff" />
              <text x={t.x + 8} y={t.y + 4} fill="#00e5ff" fontSize="8" fontFamily="monospace" opacity="0.8">
                {t.name.split("-")[1] || t.name}
              </text>
            </g>
          ))}

          {/* Active Attack Arcs & Source/Target highlights */}
          {activeAttacks.map((atk) => {
            const dx = atk.target.x - atk.source.x;
            const dy = atk.target.y - atk.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.2; // Arc radius

            // Path for attack line
            const pathData = `M ${atk.source.x} ${atk.source.y} A ${dr} ${dr} 0 0 1 ${atk.target.x} ${atk.target.y}`;

            return (
              <g key={atk.id}>
                {/* Pulsing attacker source */}
                <motion.circle
                  cx={atk.source.x}
                  cy={atk.source.y}
                  r={10}
                  fill="none"
                  stroke="#ff2a2a"
                  strokeWidth={1}
                  animate={{ scale: [1, 2, 1], opacity: [0.8, 0.1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <circle cx={atk.source.x} cy={atk.source.y} r={3.5} fill="#ff2a2a" />

                {/* Cyber attack spline arc line */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke="rgba(239, 68, 68, 0.2)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Animated dash representing the packet moving along the path */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="8 20"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Live Activity Feed Sidebar overlay */}
      <div className="w-full md:w-[280px] flex flex-col font-mono">
        <div className="border-b border-purple-500/20 pb-2 mb-3 flex items-center justify-between">
          <span className="text-xs text-purple-400 font-bold font-hud tracking-widest uppercase">
            LIVE MAP FEEDS
          </span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin text-[11px] leading-relaxed max-h-[350px]">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-2 border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 rounded transition-colors"
              >
                <div className="flex justify-between text-red-400 font-bold mb-1">
                  <span>{log.type}</span>
                  <span className="text-red-500/50">{log.timestamp}</span>
                </div>
                <div className="text-purple-300/80">
                  SRC: <span className="text-white font-bold">{log.source.ip}</span> ({log.source.name.split(",")[0]})
                </div>
                <div className="text-purple-300/80">
                  DST: <span className="text-cyan-400">{log.target.name.replace("SOC HQ - ", "")}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="text-purple-400/40 text-center py-8">
              WAITING FOR TELEMETRY...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
