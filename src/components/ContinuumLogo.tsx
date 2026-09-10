import React from "react";

interface ContinuumLogoProps {
  size?: "sm" | "md" | "lg" | number;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  interactive?: boolean;
}

export const ContinuumLogo: React.FC<ContinuumLogoProps> = ({
  size = "md",
  showText = true,
  showTagline = true,
  className = "",
  interactive = true,
}) => {
  // Determine pixel sizes
  const markSize =
    typeof size === "number"
      ? size
      : size === "sm"
      ? 24
      : size === "lg"
      ? 36
      : 28;

  const textSize =
    typeof size === "number"
      ? size * 0.48
      : size === "sm"
      ? 12
      : size === "lg"
      ? 16
      : 13.5;

  return (
    <div
      className={`continuum-logo-lockup ${interactive ? "interactive" : ""} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${Math.max(8, markSize * 0.35)}px`,
        textDecoration: "none",
        color: "inherit",
        userSelect: "none",
      }}
    >
      {/* ── Continuum Triad SVG Mark ── */}
      <div
        className="continuum-mark-wrapper"
        style={{
          width: `${markSize}px`,
          height: `${markSize}px`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 40 40"
          width={markSize}
          height={markSize}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="continuum-mark-svg"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Gradients for Nodes */}
            <linearGradient id="node-violet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <linearGradient id="node-teal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>

            <linearGradient id="node-lavender" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Glowing Gradient for connecting flux loop */}
            <linearGradient id="continuum-flow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
            </linearGradient>

            {/* Ambient blur glow */}
            <filter id="mark-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connective Continuum Arc (Triadic Graph Loop) */}
          <path
            d="M 10 20 C 13 13, 21 9, 29 11 C 30 17, 30 23, 29 29 C 21 31, 13 27, 10 20 Z"
            fill="none"
            stroke="url(#continuum-flow)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="continuum-loop-track"
          />

          {/* Kinetic Energy Pulse Path (Animated Dash) */}
          <path
            d="M 10 20 C 13 13, 21 9, 29 11 C 30 17, 30 23, 29 29 C 21 31, 13 27, 10 20 Z"
            fill="none"
            stroke="url(#node-teal)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="8 36"
            className="continuum-pulse-path"
          />

          {/* Node 1: Left (Deep Violet / Continuum Canon & Lore) */}
          <g className="node-group node-violet">
            <circle
              cx="10"
              cy="20"
              r="4.2"
              fill="url(#node-violet)"
              filter="url(#mark-glow)"
              className="node-circle"
            />
            <circle cx="9" cy="18.8" r="1.3" fill="#ffffff" opacity="0.5" />
          </g>

          {/* Node 2: Top Right (Electric Teal / DKG Consensus & Mesh) */}
          <g className="node-group node-teal">
            <circle
              cx="29"
              cy="11"
              r="4.2"
              fill="url(#node-teal)"
              filter="url(#mark-glow)"
              className="node-circle"
            />
            <circle cx="28" cy="9.8" r="1.3" fill="#ffffff" opacity="0.5" />
          </g>

          {/* Node 3: Bottom Right (Soft Lavender / Neural Creative & Livepeer) */}
          <g className="node-group node-lavender">
            <circle
              cx="29"
              cy="29"
              r="4.2"
              fill="url(#node-lavender)"
              filter="url(#mark-glow)"
              className="node-circle"
            />
            <circle cx="28" cy="27.8" r="1.3" fill="#ffffff" opacity="0.5" />
          </g>
        </svg>
      </div>

      {/* ── Brand Typography Lockup ── */}
      {showText && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            className="continuum-wordmark"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: `${textSize}px`,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "#1a1924",
              display: "inline-block",
            }}
          >
            CONTINUUM
          </span>

          {showTagline && (
            <span
              className="continuum-tagline-pill"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: `${Math.max(8, textSize * 0.62)}px`,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "#747282",
                background: "rgba(118, 87, 216, 0.06)",
                border: "1px solid rgba(118, 87, 216, 0.15)",
                padding: "2px 7px",
                borderRadius: "3px",
                textTransform: "uppercase",
              }}
            >
              Episodic AI Studio
            </span>
          )}
        </div>
      )}
    </div>
  );
};
