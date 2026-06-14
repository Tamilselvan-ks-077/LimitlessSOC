import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_CHECKS = [
  { id: 1, label: "Firewall Online",           delay: 600  },
  { id: 2, label: "Threat Intelligence Loaded", delay: 1100 },
  { id: 3, label: "SIEM Connected",             delay: 1600 },
  { id: 4, label: "Offensive Layer Ready",      delay: 2100 },
  { id: 5, label: "Cognitive Shield Active",    delay: 2600 },
];

const INIT_TEXT = "> INITIALIZING LIMITLESS SOC...";

export default function BootScreen({ onComplete }) {
  const [typedText, setTypedText]         = useState("");
  const [progress, setProgress]           = useState(0);
  const [checks, setChecks]               = useState([]);
  const [showLogo, setShowLogo]           = useState(false);
  const [glitching, setGlitching]         = useState(false);
  const [scanning, setScanning]           = useState(false);
  const [exiting, setExiting]             = useState(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // ── Phase 1: type the init string ────────────────────────────────────────
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTypedText(INIT_TEXT.slice(0, i + 1));
      i++;
      if (i >= INIT_TEXT.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, []);

  // ── Phase 2: progress bar 0 → 100 (starts 300ms after mount) ─────────────
  useEffect(() => {
    const start = setTimeout(() => {
      let p = 0;
      const t = setInterval(() => {
        p = Math.min(100, p + Math.floor(Math.random() * 6) + 3);
        setProgress(p);
        if (p >= 100) clearInterval(t);
      }, 60);
      return () => clearInterval(t);
    }, 300);
    return () => clearTimeout(start);
  }, []);

  // ── Phase 3: reveal checks one by one ────────────────────────────────────
  useEffect(() => {
    const timers = BOOT_CHECKS.map(({ id, label, delay }) =>
      setTimeout(() => {
        setChecks(prev => [...prev, { id, label }]);
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // ── Phase 4: glitch → logo → scan → exit ──────────────────────────────────
  useEffect(() => {
    // After last check + 400ms
    const t1 = setTimeout(() => setGlitching(true),  3000);
    const t2 = setTimeout(() => {
      setGlitching(false);
      setShowLogo(true);
    }, 3400);
    const t3 = setTimeout(() => setScanning(true),   3700);
    const t4 = setTimeout(() => setExiting(true),    5000);
    const t5 = setTimeout(() => onCompleteRef.current(), 5700);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className={`boot-root${glitching ? " boot-glitch" : ""}`}
        >
          {/* ── Animated hex grid background ── */}
          <div className="boot-hex-grid" />

          {/* ── CRT scanlines ── */}
          <div className="boot-crt" />

          {/* ── Floating particles ── */}
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="boot-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 8}s`,
              }}
            />
          ))}

          {/* ── Horizontal laser sweep ── */}
          {scanning && (
            <motion.div
              className="boot-scan-beam"
              initial={{ top: "-4px" }}
              animate={{ top: "102%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          )}

          {/* ── Central content ── */}
          <div className="boot-center">

            {/* Corner brackets */}
            <div className="boot-bracket boot-bracket--tl" />
            <div className="boot-bracket boot-bracket--tr" />
            <div className="boot-bracket boot-bracket--bl" />
            <div className="boot-bracket boot-bracket--br" />

            {/* Init string */}
            <p className="boot-init-text">
              {typedText}
              <span className="boot-cursor" />
            </p>

            {/* Progress bar */}
            <div className="boot-progress-wrap">
              <div className="boot-progress-labels">
                <span>SYSTEM INTEGRITY CHECK</span>
                <span>{progress}%</span>
              </div>
              <div className="boot-progress-track">
                <motion.div
                  className="boot-progress-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
                {/* Glowing tip */}
                <motion.div
                  className="boot-progress-tip"
                  animate={{ left: `calc(${progress}% - 2px)` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </div>

            {/* System checks */}
            <div className="boot-checks">
              {BOOT_CHECKS.map(({ id, label }) => {
                const done = checks.some(c => c.id === id);
                return (
                  <motion.div
                    key={id}
                    className={`boot-check-row${done ? " boot-check-row--done" : ""}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={done ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35 }}
                  >
                    <span className="boot-check-icon">{done ? "✓" : "○"}</span>
                    <span>{label}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Logo reveal */}
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  className="boot-logo-wrap"
                  initial={{ opacity: 0, scale: 0.85, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <h1 className="boot-logo" data-text="LIMITLESS SOC">
                    LIMITLESS<span>SOC</span>
                  </h1>
                  <p className="boot-logo-sub">COGNITIVE THREAT ANALYSIS & SYNERGISTIC OFFENSIVE SIMULATOR</p>
                  <div className="boot-logo-glow" />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
