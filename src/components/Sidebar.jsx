import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Button from "./Button";

const links = [
  { to: "/", label: "Home" },
  { to: "/notes", label: "Notes" },
  { to: "/meetings", label: "Meetings" },
  { to: "/qa", label: "QA" },
  { to: "/ideas", label: "Ideas" },
];

function Sidebar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Flamingo</p>
        <h1 className="brand-title">Flamingo Lab</h1>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Button variant="ghost" onClick={toggleTheme}>
        {isDark ? "Switch to Light" : "Switch to Dark"}
      </Button>
    </aside>
  );
}

export default Sidebar;
