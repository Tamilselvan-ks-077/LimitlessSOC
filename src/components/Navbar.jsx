export default function Navbar({ goHome }) {
  return (
    <nav className="navbar">
      <div
        className="logo"
        onClick={goHome}
        style={{ cursor: "pointer" }}
      >
        CYBERSHIELD
      </div>

      <ul className="nav-links">
        <li onClick={goHome}>Dashboard</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </nav>
  );
}