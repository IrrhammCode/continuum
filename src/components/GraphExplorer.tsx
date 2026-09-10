import { useRef, useEffect, useMemo } from "react";
import { Network } from "lucide-react";
import type { GraphData, GraphNode } from "@shared/types";

interface GraphExplorerProps {
  graph: GraphData | null;
}

// Color map per type
const TYPE_COLORS: Record<string, string> = {
  character: "#8b5cf6",
  leitmotif: "#f59e0b",
  set: "#2dd4bf",
  scene: "#f43f5e",
};

const TYPE_ICONS: Record<string, string> = {
  character: "",
  leitmotif: "",
  set: "",
  scene: "",
};

// Simple force-directed layout (no external deps)
function layoutNodes(nodes: GraphNode[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const groups: Record<string, GraphNode[]> = {};
  for (const n of nodes) {
    (groups[n.type] ??= []).push(n);
  }

  const typeOrder = ["character", "leitmotif", "set", "scene"];
  const positions: Record<string, { x: number; y: number }> = {};
  const radius = Math.min(width, height) * 0.32;

  let globalIdx = 0;
  const total = nodes.length;

  for (const type of typeOrder) {
    const group = groups[type] ?? [];
    for (const node of group) {
      const angle = (globalIdx / total) * Math.PI * 2 - Math.PI / 2;
      positions[node.id] = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      };
      globalIdx++;
    }
  }

  return positions;
}

export default function GraphExplorer({ graph }: GraphExplorerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const WIDTH = 800;
  const HEIGHT = 460;

  const positions = useMemo(() => {
    if (!graph) return {};
    return layoutNodes(graph.nodes, WIDTH, HEIGHT);
  }, [graph]);

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="graph-container fade-in">
        <div className="graph-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Network size={14} style={{ color: "var(--teal)" }} />
            <span className="mono" style={{ color: "var(--teal)" }}>Knowledge Graph Explorer</span>
          </div>
        </div>
        <div
          className="graph-canvas"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: HEIGHT,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Network size={32} style={{ color: "var(--text-3)", marginBottom: 8, opacity: 0.5 }} />
            <div className="mono" style={{ color: "var(--text-3)" }}>
              Render scenes to populate the Knowledge Graph
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="graph-container fade-in">
      <div className="graph-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Network size={14} style={{ color: "var(--teal)" }} />
          <span className="mono" style={{ color: "var(--teal)" }}>
            Knowledge Graph — {graph.nodes.length} nodes · {graph.edges.length} edges
          </span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {Object.entries(TYPE_ICONS).map(([type, icon]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 3,
                  background: TYPE_COLORS[type],
                }}
              />
              <span className="mono" style={{ fontSize: 8, color: "var(--text-3)" }}>
                {icon} {type}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="graph-canvas" style={{ position: "relative", minHeight: HEIGHT }}>
        {/* SVG edges */}
        <svg
          ref={svgRef}
          width={WIDTH}
          height={HEIGHT}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        >
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="rgba(255,255,255,0.15)" />
            </marker>
          </defs>
          {graph.edges.map((edge, i) => {
            const from = positions[edge.source];
            const to = positions[edge.target];
            if (!from || !to) return null;
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1.5}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {graph.nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          return (
            <div
              key={node.id}
              className={`graph-node ${node.type}`}
              style={{
                left: pos.x - 50,
                top: pos.y - 16,
              }}
              title={`${node.id}\n${JSON.stringify(node.data, null, 2)}`}
            >
              <span>{TYPE_ICONS[node.type]}</span>
              {node.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
