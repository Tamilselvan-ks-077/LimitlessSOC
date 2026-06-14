const express = require("express");
const cors = require("cors");
const net = require("net");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// A real port scanner endpoint
app.post("/api/scan", async (req, res) => {
  const { ip, ports } = req.body;
  
  if (!ip || !ports || !Array.isArray(ports)) {
    return res.status(400).json({ error: "Invalid IP or ports array" });
  }

  const results = [];
  console.log(`Starting scan on ${ip} for ports: ${ports.join(', ')}`);

  // Function to check a single port
  const checkPort = (port) => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1500); // 1.5s timeout

      socket.on("connect", () => {
        socket.destroy();
        resolve({ port, status: "OPEN" });
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve({ port, status: "FILTERED/TIMEOUT" });
      });

      socket.on("error", (err) => {
        socket.destroy();
        resolve({ port, status: "CLOSED" });
      });

      socket.connect(port, ip);
    });
  };

  try {
    // Scan all ports concurrently
    const scanPromises = ports.map(port => checkPort(port));
    const scanResults = await Promise.all(scanPromises);
    
    // Add artificial delay to make the UI look cool if it's too fast
    await new Promise(r => setTimeout(r, 1000));
    
    res.json({ ip, results: scanResults });
  } catch (err) {
    res.status(500).json({ error: "Scan failed" });
  }
});

// A real IP tracer endpoint using a public API
app.get("/api/trace/:ip", async (req, res) => {
  const { ip } = req.params;
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to trace IP" });
  }
});

// --- FIREWALL RULES (In-Memory Database) ---
let firewallRules = [
  { id: 1, name: "Block SSH Root Access", port: "22", protocol: "TCP", action: "BLOCK", target: "ANY", active: true },
  { id: 2, name: "Allow HTTP Web Traffic", port: "80", protocol: "TCP", action: "ALLOW", target: "ANY", active: true },
  { id: 3, name: "Allow HTTPS Secure", port: "443", protocol: "TCP", action: "ALLOW", target: "ANY", active: true }
];

app.get("/api/firewall", (req, res) => {
  res.json(firewallRules);
});

app.post("/api/firewall", (req, res) => {
  const newRule = { id: Date.now(), ...req.body, active: true };
  firewallRules.push(newRule);
  res.json(newRule);
});

app.put("/api/firewall/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const rule = firewallRules.find(r => r.id === id);
  if (rule) {
    rule.active = !rule.active;
    res.json(rule);
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

app.delete("/api/firewall/:id", (req, res) => {
  const id = parseInt(req.params.id);
  firewallRules = firewallRules.filter(r => r.id !== id);
  res.json({ success: true });
});

// --- ATTACK SIMULATION (In-Memory) ---
let attacks = [];

// Simulate random attack events every 15 seconds
setInterval(() => {
  const randomIp = `10.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`;
  const types = ["Port Scan", "Brute Force Login", "Malware Upload", "DDoS Flood"];
  const attack = {
    id: Date.now(),
    ip: randomIp,
    type: types[Math.floor(Math.random()*types.length)],
    timestamp: new Date().toISOString()
  };
  attacks.push(attack);
  // keep only last 20 attacks
  if (attacks.length > 20) attacks.shift();
}, 15000);

app.get("/api/attacks", (req, res) => {
  res.json(attacks);
});

app.listen(PORT, () => {
  console.log(`Cybershield Backend Server running on http://localhost:${PORT}`);
});
