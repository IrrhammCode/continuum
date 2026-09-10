import { Film, GitGraph } from "lucide-react";
import { ContinuumLogo } from "./ContinuumLogo";

interface HeaderProps {
  view: "director" | "graph";
  onViewChange: (view: "director" | "graph") => void;
}

export default function Header({ view, onViewChange }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <ContinuumLogo size="sm" showTagline={true} />
      </div>

      <div className="header-actions">
        <div className="tabs">
          <button
            id="tab-director"
            className={`tab ${view === "director" ? "active" : ""}`}
            onClick={() => onViewChange("director")}
          >
            <Film size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
            Director
          </button>
          <button
            id="tab-graph"
            className={`tab ${view === "graph" ? "active" : ""}`}
            onClick={() => onViewChange("graph")}
          >
            <GitGraph size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
            DKG Graph
          </button>
        </div>
      </div>
    </header>
  );
}
