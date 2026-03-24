import { useCallback, useRef, useState } from "react";
import type { FC } from "react";

/* ───────── types ───────── */

export interface PillarAllocation {
  id: string;
  label: string;
  color: string;
  value: number;
}

interface ZeroSumAllocatorProps {
  pillars: PillarAllocation[];
  onChange: (pillars: PillarAllocation[]) => void;
  total?: number;
  min?: number;
  max?: number;
  size?: number;
}

/* ───────── SVG helpers ───────── */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function radarPath(cx: number, cy: number, maxR: number, values: number[], total: number): string {
  const n = values.length;
  const step = 360 / n;
  const pts = values.map((v, i) => {
    const r = (v / total) * maxR;
    return polarToCartesian(cx, cy, r, i * step);
  });
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
}

/* ───────── spider chart ───────── */

const SpiderWebChart: FC<{
  pillars: PillarAllocation[];
  total: number;
  size?: number;
  draggingIndex: number | null;
  hasInteracted: boolean;
}> = ({ pillars, total, size = 360, draggingIndex, hasInteracted }) => {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const n = pillars.length;
  const step = 360 / n;
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
      <defs>
        {/* Glow filter for active dragging */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Gradient fill for the radar shape */}
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(99,179,237,0.35)" />
          <stop offset="100%" stopColor="rgba(99,179,237,0.08)" />
        </radialGradient>
        {/* Pulse animation for drag hint */}
        {!hasInteracted && (
          <style>{`
            @keyframes pulseHint {
              0%, 100% { opacity: 0.3; r: 12; }
              50% { opacity: 0.7; r: 18; }
            }
            .drag-hint-pulse { animation: pulseHint 2s ease-in-out infinite; }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .hint-text { animation: fadeIn 1s ease-in 0.5s both; }
          `}</style>
        )}
      </defs>

      {/* Background rings with subtle labels */}
      {rings.map((frac) => (
        <g key={frac}>
          <polygon
            points={Array.from({ length: n }, (_, i) => {
              const p = polarToCartesian(cx, cy, maxR * frac, i * step);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={frac === 1.0 ? 1.5 : 0.8}
            strokeDasharray={frac < 1.0 ? "3 3" : "none"}
          />
          {/* Ring value label */}
          <text
            x={cx + 4}
            y={cy - maxR * frac + 3}
            fontSize={8}
            fill="rgba(255,255,255,0.15)"
            fontFamily="'JetBrains Mono', monospace"
            style={{ pointerEvents: "none" }}
          >
            {Math.round(frac * total)}
          </text>
        </g>
      ))}

      {/* Axis lines — colored per pillar */}
      {pillars.map((p, i) => {
        const end = polarToCartesian(cx, cy, maxR, i * step);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke={p.color}
            strokeWidth={0.8}
            strokeOpacity={0.2}
          />
        );
      })}

      {/* Filled radar area */}
      <path
        d={radarPath(cx, cy, maxR, pillars.map((p) => p.value), total)}
        fill="url(#radarFill)"
        stroke="rgba(99,179,237,0.7)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        style={{ transition: draggingIndex !== null ? "none" : "d 0.2s ease" }}
      />

      {/* Colored segment fills — wedge from center to vertex */}
      {pillars.map((p, i) => {
        const r = (p.value / total) * maxR;
        const pt = polarToCartesian(cx, cy, r, i * step);
        const nextIdx = (i + 1) % n;
        const nextR = (pillars[nextIdx].value / total) * maxR;
        const nextPt = polarToCartesian(cx, cy, nextR, nextIdx * step);
        return (
          <path
            key={`wedge-${p.id}`}
            d={`M ${cx} ${cy} L ${pt.x} ${pt.y} L ${nextPt.x} ${nextPt.y} Z`}
            fill={p.color}
            fillOpacity={0.06}
            style={{ transition: draggingIndex !== null ? "none" : "d 0.2s ease" }}
          />
        );
      })}

      {/* Vertex dots + labels */}
      {pillars.map((p, i) => {
        const r = (p.value / total) * maxR;
        const pt = polarToCartesian(cx, cy, r, i * step);
        const labelR = maxR + 28;
        const labelPt = polarToCartesian(cx, cy, labelR, i * step);
        const isDragging = draggingIndex === i;

        return (
          <g key={p.id}>
            {/* Drag hint pulse ring — only before first interaction */}
            {!hasInteracted && i === 0 && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={14}
                fill={p.color}
                fillOpacity={0.15}
                className="drag-hint-pulse"
              />
            )}

            {/* Glow ring when dragging */}
            {isDragging && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={18}
                fill={p.color}
                fillOpacity={0.15}
                filter="url(#glow)"
              />
            )}

            {/* Connection line from handle to label */}
            <line
              x1={pt.x}
              y1={pt.y}
              x2={polarToCartesian(cx, cy, maxR + 8, i * step).x}
              y2={polarToCartesian(cx, cy, maxR + 8, i * step).y}
              stroke={p.color}
              strokeWidth={isDragging ? 1.5 : 0.8}
              strokeOpacity={isDragging ? 0.6 : 0.2}
              strokeDasharray="2 2"
            />

            {/* Invisible larger hit target for easier grabbing */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={20}
              fill="transparent"
              style={{ cursor: "grab" }}
              data-index={i}
            />

            {/* Visible handle */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isDragging ? 11 : 8}
              fill={p.color}
              stroke="#fff"
              strokeWidth={isDragging ? 3 : 2}
              style={{
                cursor: "grab",
                transition: isDragging ? "none" : "all 0.2s ease",
                filter: isDragging ? "url(#glow)" : "none",
              }}
              data-index={i}
            />

            {/* Label with pillar name */}
            <text
              x={labelPt.x}
              y={labelPt.y - 7}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
              fontWeight={isDragging ? 800 : 600}
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="0.03em"
              fill={isDragging ? p.color : "rgba(255,255,255,0.85)"}
            >
              {p.label}
            </text>

            {/* Value badge below label */}
            <text
              x={labelPt.x}
              y={labelPt.y + 8}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontWeight={800}
              fontFamily="'JetBrains Mono', monospace"
              fill={p.color}
            >
              {p.value}
            </text>
          </g>
        );
      })}

      {/* Center — total display */}
      <circle cx={cx} cy={cy} r={22} fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={18}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        fill="rgba(255,255,255,0.6)"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 11}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={7}
        fontWeight={500}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.12em"
        fill="rgba(255,255,255,0.25)"
      >
        TOTAL
      </text>

      {/* Drag hint text — only before first interaction */}
      {!hasInteracted && (
        <text
          x={cx}
          y={size - 12}
          textAnchor="middle"
          fontSize={11}
          fontFamily="'JetBrains Mono', monospace"
          fill="rgba(255,255,255,0.35)"
          className="hint-text"
        >
          drag a point to set your priorities
        </text>
      )}
    </svg>
  );
};

/* ───────── main component ───────── */

const ZeroSumAllocator: FC<ZeroSumAllocatorProps> = ({
  pillars,
  onChange,
  total = 100,
  min = 0,
  max = 50,
  size = 360,
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = useCallback(
    (index: number, newValue: number) => {
      const clamped = Math.max(min, Math.min(max, Math.round(newValue)));
      const old = pillars[index].value;
      const delta = clamped - old;
      if (delta === 0) return;

      if (!hasInteracted) setHasInteracted(true);

      // Proportionally adjust other pillars
      const others = pillars.filter((_, i) => i !== index);
      const othersTotal = others.reduce((s, p) => s + p.value, 0);

      const updated = pillars.map((p, i) => {
        if (i === index) return { ...p, value: clamped };
        if (othersTotal === 0) {
          return { ...p, value: Math.max(min, Math.round((total - clamped) / (pillars.length - 1))) };
        }
        const share = p.value / othersTotal;
        const newVal = Math.max(min, Math.round(p.value - delta * share));
        return { ...p, value: newVal };
      });

      // Correct rounding errors
      const currentTotal = updated.reduce((s, p) => s + p.value, 0);
      const diff = total - currentTotal;
      if (diff !== 0) {
        const adjustIdx = updated
          .map((p, i) => ({ i, v: p.value }))
          .filter((x) => x.i !== index)
          .sort((a, b) => b.v - a.v)[0]?.i;
        if (adjustIdx !== undefined) {
          updated[adjustIdx] = {
            ...updated[adjustIdx],
            value: Math.max(min, Math.min(max, updated[adjustIdx].value + diff)),
          };
        }
      }

      onChange(updated);
    },
    [pillars, onChange, total, min, max, hasInteracted]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as SVGElement;
      const idx = target.getAttribute("data-index");
      if (idx !== null) {
        setDraggingIndex(parseInt(idx));
        (e.target as Element).setPointerCapture?.(e.pointerId);
        if (!hasInteracted) setHasInteracted(true);
      }
    },
    [hasInteracted]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingIndex === null || !svgRef.current) return;
      const svg = svgRef.current.querySelector("svg");
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const mx = e.clientX - rect.left - cx;
      const my = e.clientY - rect.top - cy;
      const dist = Math.sqrt(mx * mx + my * my);
      const maxR = rect.width * 0.36;
      const fraction = Math.max(0, Math.min(1, dist / maxR));
      const newValue = Math.round(fraction * total);
      handleSliderChange(draggingIndex, newValue);
    },
    [draggingIndex, handleSliderChange, total]
  );

  const handlePointerUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {/* Radar chart with drag */}
      <div
        ref={svgRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none", userSelect: "none", width: "100%", maxWidth: size }}
      >
        <SpiderWebChart
          pillars={pillars}
          total={total}
          size={size}
          draggingIndex={draggingIndex}
          hasInteracted={hasInteracted}
        />
      </div>

      {/* Slider controls — compact */}
      <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 4 }}>
        {pillars.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 6, height: 6, background: p.color, flexShrink: 0,
            }} />
            <span style={{
              width: 80,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(255,255,255,0.7)",
            }}>
              {p.label}
            </span>
            <input
              type="range"
              min={min}
              max={max}
              value={p.value}
              onChange={(e) => handleSliderChange(i, parseInt(e.target.value))}
              style={{
                flex: 1,
                accentColor: p.color,
                height: 4,
              }}
            />
            <span
              style={{
                width: 28,
                textAlign: "right",
                fontSize: 13,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "'JetBrains Mono', monospace",
                color: p.color,
              }}
            >
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZeroSumAllocator;
