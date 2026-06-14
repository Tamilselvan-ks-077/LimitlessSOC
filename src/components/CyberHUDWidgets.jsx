import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, Tooltip } from "recharts";

// Count Up component
export function CountUp({ end, duration = 1.5, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endNum = parseInt(end, 10);
    if (isNaN(endNum)) {
      setCount(end);
      return;
    }

    if (start === endNum) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / endNum), 30);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= endNum) {
        clearInterval(timer);
        setCount(endNum);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

// System Health Indicator SVG
export function SystemHealthIndicator({ percentage = 98.6 }) {
  const radius = 50;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          stroke="rgba(168, 85, 247, 0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Animated Active Glowing Circle */}
        <circle
          stroke="url(#purpleGlow)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
        </defs>
      </svg>
      {/* Centered Percentage */}
      <div className="absolute font-mono text-xs font-bold text-white tracking-tighter">
        <CountUp end={percentage} duration={1} suffix="%" />
      </div>
    </div>
  );
}

// 1. Threat Detection Line Chart (Neon Blue/Purple)
export function ThreatChart() {
  const data = [
    { time: "08:00", threats: 12 },
    { time: "10:00", threats: 24 },
    { time: "12:00", threats: 18 },
    { time: "14:00", threats: 35 },
    { time: "16:00", threats: 48 },
    { time: "18:00", threats: 29 },
    { time: "20:00", threats: 15 },
    { time: "22:00", threats: 8 }
  ];

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={9} 
            fontFamily="monospace"
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={9} 
            fontFamily="monospace"
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              background: "rgba(10,15,26,0.95)", 
              border: "1px solid rgba(0, 229, 255, 0.4)",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "10px",
              color: "#fff"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="threats" 
            stroke="#00e5ff" 
            strokeWidth={2}
            dot={{ r: 3, stroke: "#00e5ff", strokeWidth: 1, fill: "#03060f" }}
            activeDot={{ r: 5, stroke: "#ffffff", fill: "#00e5ff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 2. Firewall Analytics Ingress Area Chart (Neon Red/Pink)
export function FirewallChart() {
  const data = [
    { time: "00s", incoming: 120, blocked: 80 },
    { time: "10s", incoming: 220, blocked: 190 },
    { time: "20s", incoming: 170, blocked: 130 },
    { time: "30s", incoming: 310, blocked: 270 },
    { time: "40s", incoming: 290, blocked: 240 },
    { time: "50s", incoming: 420, blocked: 390 },
    { time: "60s", incoming: 380, blocked: 320 }
  ];

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBlk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff2a2a" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#ff2a2a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={9} 
            fontFamily="monospace"
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={9} 
            fontFamily="monospace"
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              background: "rgba(15,5,5,0.95)", 
              border: "1px solid rgba(255, 42, 42, 0.4)",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "10px",
              color: "#fff"
            }}
          />
          <Area 
            type="monotone" 
            dataKey="incoming" 
            stroke="#00e5ff" 
            fillOpacity={1} 
            fill="url(#colorInc)" 
            strokeWidth={1.5}
          />
          <Area 
            type="monotone" 
            dataKey="blocked" 
            stroke="#ff2a2a" 
            fillOpacity={1} 
            fill="url(#colorBlk)" 
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. Red Team Assessment Radar Chart (Neon Purple/Pink)
export function AssessmentChart() {
  const data = [
    { subject: "Initial Access", value: 85, fullMark: 100 },
    { subject: "Egress Bypass", value: 70, fullMark: 100 },
    { subject: "Priv Escalation", value: 95, fullMark: 100 },
    { subject: "Persistence", value: 60, fullMark: 100 },
    { subject: "Lateral Move", value: 80, fullMark: 100 },
    { subject: "Exfiltration", value: 75, fullMark: 100 }
  ];

  return (
    <div className="w-full h-44 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" radius="70%" data={data}>
          <PolarGrid stroke="rgba(168, 85, 247, 0.15)" />
          <PolarAngleAxis 
            dataKey="subject" 
            stroke="rgba(255, 255, 255, 0.6)" 
            fontSize={8} 
            fontFamily="monospace" 
          />
          <Radar 
            name="Assessment Vectors" 
            dataKey="value" 
            stroke="#a855f7" 
            fill="#a855f7" 
            fillOpacity={0.25} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
