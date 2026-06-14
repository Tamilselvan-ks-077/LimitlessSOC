import { useState, useEffect, useRef } from "react";
import Dashboard from "./pages/Dashboard";
import TechCanvas from "./components/TechCanvas";
import BootScreen from "./components/BootScreen";
import { playHover, playClick, toggleSound, isSoundEnabled } from "./utils/audio";
import { FaShieldAlt, FaSkullCrossbones, FaVolumeUp, FaVolumeMute, FaLock, FaGlobe, FaServer } from "react-icons/fa";

/* ── Typing animation hook ───────────────────────────────────────────────── */
function useTyping(strings, speed = 60, pause = 1800) {
  const [display, setDisplay] = useState("");
  const idx    = useRef(0);
  const charI  = useRef(0);
  const deleting = useRef(false);
  const timer  = useRef(null);

  useEffect(() => {
    function tick() {
      const current = strings[idx.current];
      if (!deleting.current) {
        setDisplay(current.slice(0, charI.current + 1));
        charI.current++;
        if (charI.current === current.length) {
          deleting.current = true;
          timer.current = setTimeout(tick, pause);
          return;
        }
      } else {
        setDisplay(current.slice(0, charI.current - 1));
        charI.current--;
        if (charI.current === 0) {
          deleting.current = false;
          idx.current = (idx.current + 1) % strings.length;
        }
      }
      timer.current = setTimeout(tick, deleting.current ? speed / 2 : speed);
    }
    timer.current = setTimeout(tick, speed);
    return () => clearTimeout(timer.current);
  }, []); // eslint-disable-line

  return display;
}

/* ── 3-D tilt pod hook ───────────────────────────────────────────────────── */
function useTilt(strength = 12) {
  const ref  = useRef(null);
  const raf  = useRef(null);

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    const rx =  (y / rect.height) * strength;
    const ry = -(x / rect.width)  * strength;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (ref.current)
        ref.current.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  return { ref, onMove, onLeave };
}

/* ── Counter component ───────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.floor(to / 40));
    const t = setInterval(() => {
      n = Math.min(n + step, to);
      setVal(n);
      if (n >= to) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

/* ══════════════════════════════════════════════════════════════════════════ */
function App() {
  const [booting, setBooting] = useState(true);
  const [team, setTeam]       = useState("");
  const [sound, setSound]     = useState(isSoundEnabled);
  const [time, setTime]       = useState("");

  const subtitles = useTyping([
    "COGNITIVE THREAT ANALYSIS & OFFENSIVE SIMULATION",
    "MILITARY-GRADE CYBER DEFENSE COMMAND CENTER",
    "REAL-TIME SIEM | RED TEAM | THREAT INTELLIGENCE",
    "POWERED BY AI · SECURED BY DESIGN",
  ], 55, 2000);

  const blueTilt = useTilt(10);
  const redTilt  = useTilt(10);

  useEffect(() => {
    const tick = () => setTime(
      new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC"
    );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const handleSoundToggle = () => {
    const next = !sound;
    setSound(next);
    toggleSound(next);
    if (next) setTimeout(playClick, 50);
  };

  if (booting) return <BootScreen onComplete={() => setBooting(false)} />;

  if (!team) {
    return (
      <div className="sel-page">
        <TechCanvas theme="purple" />
        <div className="scanlines" />

        {/* ── Top HUD bar ── */}
        <header className="sel-hud">
          <div className="sel-hud-left">
            <span className="sel-hud-dot" />
            <span className="sel-hud-label">LIMITLESS SECURE LINK // ACTIVE</span>
          </div>
          <div className="sel-hud-right">
            <span className="sel-hud-time">{time}</span>
            <button
              className={`sel-sound-btn${sound ? " active" : ""}`}
              onClick={handleSoundToggle}
              onMouseEnter={playHover}
              title={sound ? "Mute" : "Unmute"}
            >
              {sound ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="sel-body">

          {/* Hero title */}
          <div className="sel-hero">
            <div className="sel-logo-ring" />
            <h1 className="sel-logo" data-text="LIMITLESSSOC">
              LIMITLESS<span>SOC</span>
            </h1>
            <p className="sel-subtitle">
              {subtitles}<span className="sel-cursor" />
            </p>
          </div>

          {/* Holographic deck */}
          <div className="sel-deck">

            {/* ── SIEM / Blue pod ── */}
            <div
              className="sel-pod sel-pod--blue"
              ref={blueTilt.ref}
              onMouseMove={blueTilt.onMove}
              onMouseLeave={blueTilt.onLeave}
              onMouseEnter={playHover}
              onClick={() => { playClick(); setTeam("blue"); }}
            >
              <div className="sel-pod-glow sel-pod-glow--blue" />
              <div className="sel-pod-header">
                <FaShieldAlt className="sel-pod-icon sel-pod-icon--blue" />
                <span className="sel-pod-badge sel-pod-badge--blue">DEFENSIVE SYSTEM</span>
              </div>
              <h2 className="sel-pod-title">SIEM</h2>
              <p className="sel-pod-desc">
                Deploy security counter-measures, analyze incoming telemetry, patch software vulnerabilities, and monitor firewalls in real-time.
              </p>
              <ul className="sel-pod-stats">
                <li>
                  <span>SHIELD STATUS</span>
                  <span className="sel-stat--blue"><Counter to={98} suffix=".4%" /></span>
                </li>
                <li>
                  <span>THREATS BLOCKED</span>
                  <span className="sel-stat--blue"><Counter to={14832} /></span>
                </li>
                <li>
                  <span>ACTIVE COUNTERPLOTS</span>
                  <span className="sel-stat--blue"><Counter to={12} suffix=" Active" /></span>
                </li>
              </ul>
              <button className="sel-pod-btn sel-pod-btn--blue">
                INITIALIZE COGNITIVE SHIELD
              </button>
              <div className="sel-pod-corner sel-pod-corner--tl" />
              <div className="sel-pod-corner sel-pod-corner--br" />
            </div>

            {/* ── Center terminal ── */}
            <div className="sel-center">
              <div className="sel-terminal">
                <div className="sel-terminal-bar">
                  <span className="sel-dot sel-dot--red" />
                  <span className="sel-dot sel-dot--yellow" />
                  <span className="sel-dot sel-dot--green" />
                  <span className="sel-terminal-title">core_selector.sh</span>
                </div>
                <div className="sel-terminal-body">
                  <div className="sel-img-wrap">
                    <img
                      src="/matrix-choice.png"
                      alt="SIEM vs Red Team"
                      className="sel-img"
                    />
                    {/* Glitch layers */}
                    <div className="sel-img-glitch sel-img-glitch--r" />
                    <div className="sel-img-glitch sel-img-glitch--b" />
                    <div className="sel-scanner" />
                  </div>
                  <div className="sel-diag">
                    <div className="sel-diag-row">
                      <FaLock className="sel-diag-icon" />
                      <span>SECURE CORRIDOR: ESTABLISHED</span>
                    </div>
                    <div className="sel-diag-row">
                      <FaGlobe className="sel-diag-icon" />
                      <span>GATEWAY HOPS: 4 (PROXIED)</span>
                    </div>
                    <div className="sel-diag-row">
                      <FaServer className="sel-diag-icon" />
                      <span>HOST INTEGRITY: SECURE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Red Team pod ── */}
            <div
              className="sel-pod sel-pod--red"
              ref={redTilt.ref}
              onMouseMove={redTilt.onMove}
              onMouseLeave={redTilt.onLeave}
              onMouseEnter={playHover}
              onClick={() => { playClick(); setTeam("red"); }}
            >
              <div className="sel-pod-glow sel-pod-glow--red" />
              <div className="sel-pod-header">
                <FaSkullCrossbones className="sel-pod-icon sel-pod-icon--red" />
                <span className="sel-pod-badge sel-pod-badge--red">OFFENSIVE LAYER</span>
              </div>
              <h2 className="sel-pod-title">RED TEAM</h2>
              <p className="sel-pod-desc">
                Execute network reconnaissance, launch non-destructive exploit simulations, test egress filters, and audit overall security posture.
              </p>
              <ul className="sel-pod-stats">
                <li>
                  <span>EXPLOIT STATUS</span>
                  <span className="sel-stat--red">READY</span>
                </li>
                <li>
                  <span>TARGETS ACQUIRED</span>
                  <span className="sel-stat--red"><Counter to={12} suffix=" Active" /></span>
                </li>
                <li>
                  <span>PAYLOAD LAB</span>
                  <span className="sel-stat--red">COMPILED</span>
                </li>
              </ul>
              <button className="sel-pod-btn sel-pod-btn--red">
                ENGAGE OFFENSIVE SYSTEM
              </button>
              <div className="sel-pod-corner sel-pod-corner--tl" />
              <div className="sel-pod-corner sel-pod-corner--br" />
            </div>

          </div>
        </main>

        {/* ── Security ticker ── */}
        <div className="sel-ticker">
          <span className="sel-ticker-label">LIVE SOC LOGS</span>
          <div className="sel-ticker-text">
            [ALERT] Blocked port scan from 198.51.100.42 &nbsp;•&nbsp;
            [INFO] Vulnerability scan completed on cluster_B &nbsp;•&nbsp;
            [SECURE] System integrity verified at 100% &nbsp;•&nbsp;
            [WARN] Egress traffic spike detected on Node-12 &nbsp;•&nbsp;
            [ALERT] Zero-day mitigation patch deployed to Web-Proxy &nbsp;•&nbsp;
            [INFO] Red Team simulation cycle 7 complete &nbsp;•&nbsp;
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      team={team}
      goBack={() => { playClick(); setTeam(""); }}
      soundEnabled={sound}
      onSoundToggle={handleSoundToggle}
    />
  );
}

export default App;