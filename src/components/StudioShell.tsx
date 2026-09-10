import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { ContinuumLogo } from "./ContinuumLogo";

export type IconName =
  | "grid"
  | "spark"
  | "layers"
  | "users"
  | "map"
  | "wave"
  | "graph"
  | "settings"
  | "plus"
  | "play"
  | "arrow"
  | "chevron"
  | "menu"
  | "close"
  | "check"
  | "more"
  | "lock";

export function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    spark: (
      <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c.7-3.4 2.7-5 6-5s5.3 1.6 6 5M16 5.2a3 3 0 0 1 0 5.6M18 15.3c1.6.5 2.6 1.8 3 3.7" />
      </>
    ),
    map: (
      <>
        <path d="m9 18-5-2.5V5l5 2.5L15 5l5 2.5V18l-5-2.5L9 18Z" />
        <path d="M9 7.5V18M15 5v10.5" />
      </>
    ),
    wave: <path d="M3 12c2-8 4 8 6 0s4 8 6 0 4 8 6 0" />,
    graph: (
      <>
        <circle cx="5" cy="5" r="2" />
        <circle cx="19" cy="6" r="2" />
        <circle cx="11" cy="19" r="2" />
        <path d="m6.7 6.1 10.6-.2M6.2 6.8l3.7 10.1m7.8-9.1-5.3 9.3" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.2 2.2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3.2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.2-2.2.1-.1A1.7 1.7 0 0 0 6.6 15a1.7 1.7 0 0 0-1.5-1H5v-3.2h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.2-2.2.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3.2v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.2 2.2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    play: <path d="m8 5 11 7-11 7V5Z" fill="currentColor" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

interface NavEntry {
  icon: IconName;
  label: string;
  path: string;
  badge?: string;
  shortcut?: string;
}

interface NavSection {
  title: string;
  entries: NavEntry[];
}

const navSections: NavSection[] = [
  {
    title: "PRODUCTION",
    entries: [
      { icon: "grid", label: "Director Studio", path: "/studio", shortcut: "⌘K" },
      { icon: "layers", label: "Episodes & storyboards", path: "/episodes" },
      { icon: "spark", label: "Script to scene", path: "/script" },
    ],
  },
  {
    title: "LIVING ASSET VAULT",
    entries: [
      { icon: "users", label: "Characters", path: "/vault" },
      { icon: "wave", label: "Voice & sound", path: "/sound", badge: "12" },
      { icon: "map", label: "Sets & environments", path: "/sets" },
      { icon: "layers", label: "Props & lore", path: "/props" },
    ],
  },
  {
    title: "PROVENANCE",
    entries: [
      { icon: "graph", label: "Knowledge graph", path: "/graph" },
      { icon: "lock", label: "DKG asset registry", path: "/registry" },
    ],
  },
];

export function StudioShell() {
  const [sideOpen, setSideOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      {/* ── Fixed Studio Topbar ── */}
      <header className="topbar">
        <button
          className="icon-button mobile-only"
          onClick={() => setSideOpen(true)}
          aria-label="Open navigation"
        >
          <Icon name="menu" />
        </button>

        <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          <ContinuumLogo size="sm" showTagline={true} />
        </Link>

        <div className="top-actions">
          <span className="sync">
            <i></i>DKG SYNCHRONIZED
          </span>
          <button className="credits">
            LP&nbsp; 99.97 <span>credits</span>
          </button>
          <button className="avatar">AA</button>
        </div>
      </header>

      {/* ── Fixed Studio Sidebar ── */}
      <aside className={`sidebar ${sideOpen ? "open" : ""}`}>
        <div className="side-mobile-head">
          <span>STUDIO NAVIGATION</span>
          <button className="icon-button" onClick={() => setSideOpen(false)}>
            <Icon name="close" />
          </button>
        </div>

        {navSections.map((group) => (
          <section className="nav-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.entries.map((item) => {
              const isSelected =
                location.pathname === item.path ||
                (item.path === "/studio" && location.pathname === "/");
              return (
                <button
                  className={`nav-item ${isSelected ? "selected" : ""}`}
                  key={item.label}
                  onClick={() => {
                    setSideOpen(false);
                    navigate(item.path);
                  }}
                >
                  <Icon name={item.icon} size={17} />
                  <span>{item.label}</span>
                  {item.shortcut && <b>{item.shortcut}</b>}
                  {item.badge && <small>{item.badge}</small>}
                </button>
              );
            })}
          </section>
        ))}

        <div className="sidebar-foot">
          <button
            className={`nav-item ${location.pathname === "/settings" ? "selected" : ""}`}
            onClick={() => {
              setSideOpen(false);
              navigate("/settings");
            }}
          >
            <Icon name="settings" size={17} />
            <span>Studio settings</span>
          </button>
          <div className="compute">
            <span className="pulse"></span>
            <div>
              <small>LIVEPEER GATEWAY</small>
              <strong>Compute ready</strong>
            </div>
            <Icon name="chevron" size={14} />
          </div>
        </div>
      </aside>

      {sideOpen && (
        <button
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ── Main Studio Page Content ── */}
      <Outlet />
    </div>
  );
}
