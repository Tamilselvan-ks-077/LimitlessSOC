import { useState, useEffect } from "react";
import { FaExclamationTriangle, FaSkull } from "react-icons/fa";
import { playClick, playWarning } from "../../utils/audio";

export default function AttackFeed() {
  const [attacks, setAttacks] = useState([]);

  // Poll backend every 10 seconds for new attacks
  useEffect(() => {
    const fetchAttacks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attacks");
        const data = await res.json();
        setAttacks(data);
      } catch (err) {
        console.error("Failed to fetch attacks", err);
      }
    };
    fetchAttacks();
    const interval = setInterval(fetchAttacks, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (attack) => {
    playClick();
    // Future: expand details modal
    alert(`Attack ID: ${attack.id}\nIP: ${attack.ip}\nType: ${attack.type}\nTime: ${new Date(attack.timestamp).toLocaleString()}`);
  };

  return (
    <div className="card blue-card attack-feed-card">
      <div className="card-header">
        <div className="header-left">
          <FaExclamationTriangle className="header-icon blue-text animate-pulse" />
          <h3>Live Threat Feed</h3>
        </div>
      </div>

      <div className="attack-list">
        {attacks.length === 0 && (
          <p className="no-threats">No active attacks detected.</p>
        )}
        {attacks.map((atk) => (
          <div key={atk.id} className="attack-item" onClick={() => handleClick(atk)}>
            <FaSkull className="attack-icon red-text" />
            <span className="attack-ip">{atk.ip}</span>
            <span className="attack-type">{atk.type}</span>
            <span className="attack-time">{new Date(atk.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
