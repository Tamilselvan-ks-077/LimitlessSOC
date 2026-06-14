import { useState, useEffect } from "react";
import { FaShieldAlt, FaToggleOn, FaToggleOff, FaPlus, FaTrashAlt, FaCheckCircle, FaBan } from "react-icons/fa";
import { playClick, playSuccess } from "../../utils/audio";

export default function FirewallRules() {
  const [rules, setRules] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    port: "",
    protocol: "TCP",
    action: "BLOCK",
    target: "ANY"
  });

  // Fetch rules from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/firewall")
      .then(res => res.json())
      .then(data => setRules(data))
      .catch(err => console.error("Failed to load firewall rules", err));
  }, []);

  const handleToggleActive = async (id) => {
    playClick();
    try {
      const res = await fetch(`http://localhost:5000/api/firewall/${id}`, { method: "PUT" });
      if (res.ok) {
        setRules(prev => prev.map(r => (r.id === id ? { ...r, active: !r.active } : r)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveRule = async (id) => {
    playClick();
    try {
      const res = await fetch(`http://localhost:5000/api/firewall/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRules(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRule.name || !newRule.port) return;

    try {
      const res = await fetch("http://localhost:5000/api/firewall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRule)
      });
      
      if (res.ok) {
        const createdRule = await res.json();
        playSuccess();
        setRules(prev => [...prev, createdRule]);
        setNewRule({ name: "", port: "", protocol: "TCP", action: "BLOCK", target: "ANY" });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card blue-card firewall-rules-card">
      <div className="card-header">
        <div className="header-left">
          <FaShieldAlt className="header-icon blue-text" />
          <h3>Active Firewall Rules</h3>
        </div>
        <button 
          className="add-rule-toggle-btn"
          onClick={() => { playClick(); setShowAddForm(!showAddForm); }}
        >
          <FaPlus style={{ marginRight: "4px" }} /> {showAddForm ? "CLOSE FORM" : "ADD RULE"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddRule} className="firewall-add-form animate-fade-in">
          <h4>Configure New Gate Policy</h4>
          
          <div className="form-group">
            <label>Policy Identifier Name</label>
            <input 
              type="text" 
              placeholder="e.g. Block External API Access" 
              value={newRule.name}
              onChange={e => setNewRule({ ...newRule, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Target Port</label>
              <input 
                type="text" 
                placeholder="e.g. 8080" 
                value={newRule.port}
                onChange={e => setNewRule({ ...newRule, port: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group half">
              <label>Protocol</label>
              <select 
                value={newRule.protocol} 
                onChange={e => setNewRule({ ...newRule, protocol: e.target.value })}
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Action Policy</label>
              <select 
                value={newRule.action} 
                onChange={e => setNewRule({ ...newRule, action: e.target.value })}
              >
                <option value="BLOCK">BLOCK (DROP)</option>
                <option value="ALLOW">ALLOW (ACCEPT)</option>
              </select>
            </div>

            <div className="form-group half">
              <label>Target Segment / IP</label>
              <input 
                type="text" 
                value={newRule.target} 
                onChange={e => setNewRule({ ...newRule, target: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="submit-rule-btn">
            COMMIT RULE TO SECURITY GATEWAY
          </button>
        </form>
      )}

      <div className="rules-list">
        {rules.map((rule) => (
          <div 
            key={rule.id} 
            className={`rule-item ${rule.active ? "active" : "inactive"} action-${rule.action.toLowerCase()}`}
          >
            <div className="rule-badge-col">
              {rule.action === "ALLOW" ? (
                <span className="action-tag allow"><FaCheckCircle /> ALLOW</span>
              ) : (
                <span className="action-tag block"><FaBan /> BLOCK</span>
              )}
            </div>

            <div className="rule-info-col">
              <span className="rule-name">{rule.name}</span>
              <div className="rule-specs">
                <span className="protocol">{rule.protocol}</span>
                <span className="port">PORT {rule.port}</span>
                <span className="divider">•</span>
                <span className="target">SRC: {rule.target}</span>
              </div>
            </div>

            <div className="rule-actions-col">
              <button 
                className="toggle-rule-btn" 
                onClick={() => handleToggleActive(rule.id)}
                title={rule.active ? "Disable Firewall Rule" : "Enable Firewall Rule"}
              >
                {rule.active ? (
                  <FaToggleOn className="toggle-icon on blue-text" />
                ) : (
                  <FaToggleOff className="toggle-icon off" />
                )}
              </button>
              <button 
                className="delete-rule-btn" 
                onClick={() => handleRemoveRule(rule.id)}
                title="Purge Policy"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}