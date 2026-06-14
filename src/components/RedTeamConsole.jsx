import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playKeyboard, playSuccess, playClick, playWarning } from "../utils/audio";
import { Terminal, ShieldAlert, Cpu, Binary, Zap } from "lucide-react";

const COMMAND_OUTPUTS = {
  nmap: [
    "limitless-soc@root:~# nmap -sS -A -T4 10.0.12.0/24",
    "Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-14 UTC",
    "Nmap scan report for subnet-node-12.internal (10.0.12.9)",
    "Host is up (0.0082s latency).",
    "Not shown: 996 closed tcp ports (reset)",
    "PORT     STATE SERVICE VERSION",
    "22/tcp   open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1",
    "80/tcp   open  http    nginx 1.18.0",
    "443/tcp  open  ssl/http nginx 1.18.0",
    "8080/tcp open  http    Apache Tomcat 9.0.43",
    "Device type: general purpose",
    "Running: Linux 5.X",
    "OS details: Linux 5.10",
    "Network Distance: 1 hop",
    "Nmap done: 256 IP addresses (1 host active) scanned in 2.82 seconds"
  ],
  msfconsole: [
    "limitless-soc@root:~# msfconsole -q -r shellcode_inject.rc",
    "[*] Compiling payload stack offset calculations...",
    "[*] Using target exploit: exploit/linux/http/tomcat_mgr_deploy",
    "[*] Exploit payload configured: linux/x64/meterpreter/reverse_tcp",
    "[*] LHOST = 198.51.100.42, LPORT = 4444",
    "[*] Triggering exploit attack vector...",
    "[*] Sending stage (300843 bytes) to 10.0.12.9",
    "[*] Meterpreter session 1 opened (198.51.100.42:4444 -> 10.0.12.9:54320) at 2026-06-14",
    "meterpreter > sysinfo",
    "Computer     : tomcat-server-core",
    "OS           : Ubuntu 20.04.2 LTS (Linux Kernel 5.4.0-73)",
    "Architecture : x64",
    "Meterpreter  : x64/linux",
    "meterpreter > shell_sync completed."
  ],
  hydra: [
    "limitless-soc@root:~# hydra -l root -P darkweb_pass.txt ssh://10.0.12.9",
    "Hydra v9.1-dev (c) 2020 by van Hauser/THC - for legal purposes only",
    "Hydra starting on ssh://10.0.12.9 (using 16 parallel tasks)",
    "[DATA] 482 passwords loaded from dictionary file.",
    "[STATUS] attack running... 120 attempts completed...",
    "[STATUS] attack running... 240 attempts completed...",
    "[STATUS] attack running... 360 attempts completed...",
    "[22][ssh] host: 10.0.12.9   login: root   password: admin_secret_key_99",
    "1 of 1 target successfully completed, 1 valid password found",
    "Hydra completed. Session saved to hydra.restore"
  ],
  egress: [
    "limitless-soc@root:~# ssh-egress-tunnel -D 8080 relay@198.51.100.12",
    "Initializing Dynamic Port Forwarding Egress Tunnel...",
    "Authenticating tunnel credentials with peer relay...",
    "Established SSH session v2 with transport cipher chacha20-poly1305@openssh.com",
    "Local SOCKS proxy listener opened on localhost:8080",
    "Route verification: localhost:8080 -> 198.51.100.12 -> WAN",
    "[SUCCESS] Secure egress tunnel activated and verified."
  ]
};

export default function RedTeamConsole() {
  const [terminalLines, setTerminalLines] = useState([
    "limitless-soc@root:~# _"
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileLogs, setCompileLogs] = useState([]);
  
  // Compiler config
  const [payloadType, setPayloadType] = useState("Reverse TCP Shell");
  const [arch, setArch] = useState("x86_64");
  const [encoding, setEncoding] = useState("Polymorphic XOR");

  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  const runHackerCommand = async (cmdKey) => {
    if (isRunning) return;
    playClick();
    setIsRunning(true);
    setTerminalLines((prev) => [...prev.slice(0, -1), `limitless-soc@root:~# [RUNNING COMMAND...]`]);

    const lines = COMMAND_OUTPUTS[cmdKey];
    for (let i = 0; i < lines.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 150 + Math.random() * 250));
      playKeyboard();
      setTerminalLines((prev) => {
        // Remove the loading indicator or last prompt
        const list = prev.filter(l => !l.includes("RUNNING COMMAND") && !l.endsWith("_"));
        return [...list, lines[i]];
      });
    }

    playSuccess();
    setTerminalLines((prev) => [...prev, "limitless-soc@root:~# _"]);
    setIsRunning(false);
  };

  const handleCompile = async () => {
    if (compiling) return;
    playClick();
    setCompiling(true);
    setCompileProgress(0);
    setCompileLogs(["[SYSTEM] Allocating dynamic compile buffers..."]);

    const steps = [
      { progress: 15, log: `[SYSTEM] Generating shellcode signature for type: ${payloadType}` },
      { progress: 35, log: `[SYSTEM] Applying polymorphic encoder: ${encoding}` },
      { progress: 55, log: `[SYSTEM] Target architecture offset mapping: Linux ${arch}` },
      { progress: 75, log: "[SYSTEM] Injecting random NOP sled loops (128 bytes padding)..." },
      { progress: 90, log: "[SYSTEM] Encrypting executable payload structures..." },
      { progress: 100, log: "[SUCCESS] Payload compilation completed. Binary output: payload.elf" }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 500));
      setCompileProgress(steps[i].progress);
      setCompileLogs((prev) => [...prev, steps[i].log]);
      playKeyboard();
    }

    playWarning(); // Trigger alert warning chime for payload completion
    setCompiling(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* 1. Terminal Console Panel */}
      <div className="cyber-terminal rounded-xl p-5 border border-purple-500/20 relative overflow-hidden flex flex-col h-[420px]">
        {/* Holographic Header Bar */}
        <div className="flex justify-between items-center border-b border-purple-500/20 pb-3 mb-4 z-10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="font-hud text-[11px] text-purple-400 font-bold tracking-widest uppercase">
              RED TEAM SHELL CONSOLE
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              disabled={isRunning}
              onClick={() => runHackerCommand("nmap")}
              className="px-2 py-1 bg-purple-950/40 hover:bg-purple-950/80 border border-purple-500/30 text-purple-400 text-[10px] rounded transition-all cursor-pointer font-mono disabled:opacity-50"
            >
              RUN NMAP
            </button>
            <button 
              disabled={isRunning}
              onClick={() => runHackerCommand("msfconsole")}
              className="px-2 py-1 bg-purple-950/40 hover:bg-purple-950/80 border border-purple-500/30 text-purple-400 text-[10px] rounded transition-all cursor-pointer font-mono disabled:opacity-50"
            >
              RUN MSF
            </button>
            <button 
              disabled={isRunning}
              onClick={() => runHackerCommand("hydra")}
              className="px-2 py-1 bg-purple-950/40 hover:bg-purple-950/80 border border-purple-500/30 text-purple-400 text-[10px] rounded transition-all cursor-pointer font-mono disabled:opacity-50"
            >
              RUN HYDRA
            </button>
          </div>
        </div>

        {/* Command Output Feed */}
        <div className="flex-1 overflow-y-auto font-mono text-xs text-purple-400/90 leading-relaxed scrollbar-thin select-text">
          {terminalLines.map((line, idx) => {
            const isPrompt = line.startsWith("limitless-soc@root");
            const isSuccess = line.includes("[SUCCESS]") || line.includes("successfully");
            return (
              <div 
                key={idx} 
                className={`mb-1.5 ${isPrompt ? "text-cyan-400" : isSuccess ? "text-emerald-400 font-bold" : ""}`}
              >
                {line}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* 2. Payload Compiler Lab Panel */}
      <div className="cyber-card-purple rounded-xl p-5 border border-purple-500/20 relative overflow-hidden flex flex-col justify-between h-[420px] holo-scan">
        {/* Corner Decor */}
        <div className="corner-trim top-left" />
        <div className="corner-trim top-right" />
        <div className="corner-trim bottom-left" />
        <div className="corner-trim bottom-right" />

        <div className="z-10">
          <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3 mb-4">
            <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="font-hud text-[11px] text-purple-400 font-bold tracking-widest uppercase">
              PAYLOAD COMPILER LAB
            </span>
          </div>

          {/* Selectors Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-[10px]">
            <div>
              <label className="text-purple-400/60 block mb-1">VECTOR TYPE</label>
              <select 
                value={payloadType}
                onChange={(e) => { playClick(); setPayloadType(e.target.value); }}
                className="w-full bg-[#0a0f1a]/80 border border-purple-500/30 rounded p-1 text-purple-300 outline-none"
              >
                <option value="Reverse TCP Shell">Reverse TCP</option>
                <option value="Egress Bypass Injector">Egress Bypass</option>
                <option value="Buffer Overflow Exploit">Stack Buffer</option>
              </select>
            </div>
            <div>
              <label className="text-purple-400/60 block mb-1">ARCHITECTURE</label>
              <select 
                value={arch}
                onChange={(e) => { playClick(); setArch(e.target.value); }}
                className="w-full bg-[#0a0f1a]/80 border border-purple-500/30 rounded p-1 text-purple-300 outline-none"
              >
                <option value="x86_64">Linux x64</option>
                <option value="ARM64">ARM v8</option>
                <option value="WASM">WASM Engine</option>
              </select>
            </div>
            <div>
              <label className="text-purple-400/60 block mb-1">ENCODING</label>
              <select 
                value={encoding}
                onChange={(e) => { playClick(); setEncoding(e.target.value); }}
                className="w-full bg-[#0a0f1a]/80 border border-purple-500/30 rounded p-1 text-purple-300 outline-none"
              >
                <option value="Polymorphic XOR">XOR Poly</option>
                <option value="AES-256-CBC">AES Encrypt</option>
                <option value="No Encoding">None (Raw)</option>
              </select>
            </div>
          </div>

          {/* Compiler Terminal logs */}
          <div className="bg-black/40 border border-purple-500/10 rounded-lg p-3 h-40 overflow-y-auto scrollbar-thin font-mono text-[10px] text-purple-300/80 mb-4 flex flex-col gap-1">
            {compileLogs.map((log, idx) => (
              <div key={idx} className={log.includes("[SUCCESS]") ? "text-emerald-400 font-bold" : ""}>
                {log}
              </div>
            ))}
            {compiling && (
              <div className="text-purple-400/50 animate-pulse">&gt; COMPILED MODULE LINKING...</div>
            )}
            {compileLogs.length === 0 && (
              <div className="text-purple-500/30 text-center py-12">
                CHOOSE ATTRIBUTES & TRIGGER COMPILE RUN
              </div>
            )}
          </div>
        </div>

        {/* Compiler Button & Progress */}
        <div className="z-10 mt-auto">
          {compiling && (
            <div className="mb-2">
              <div className="flex justify-between text-[9px] text-purple-400 mb-1">
                <span>COMPILING SOURCE CODES...</span>
                <span>{compileProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-purple-950/50 rounded-full overflow-hidden border border-purple-500/20">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${compileProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleCompile}
            disabled={compiling}
            className="w-full py-3 bg-purple-600/10 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white rounded-lg font-hud text-xs tracking-widest cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
          >
            {compiling ? (
              <>
                <Binary className="w-4 h-4 animate-spin text-purple-400" />
                BUILDING POLYSHELL...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                COMPILE ATTACK PAYLOAD
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
