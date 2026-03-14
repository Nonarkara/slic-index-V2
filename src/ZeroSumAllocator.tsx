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

/* ───────── SVG radar chart ───────── */

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

const SpiderWebChart: FC<{
  pillars: PillarAllocation[];
  total: number;
  size?: number;
  draggingIndex: number | null;
}> = ({ pillars, total, size = 320, draggingIndex }) => {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = pillars.length;
  const step = 360 / n;
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
      {/* Background rings */}
      {rings.map((frac) => (
        <polygon
          key={frac}
          points={Array.from({ length: n }, (_, i) => {
            const p = polarToCartesian(cx, cy, maxR * frac, i * step);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}
      {/* Axis lines */}
      {pillars.map((_, i) => {
        const end = polarToCartesian(cx, cy, maxR, i * step);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        );
      })}
      {/* Filled area */}
      <path
        d={radarPath(cx, cy, maxR, pillars.map((p) => p.value), total)}
        fill="rgba(99,179,237,0.18)"
        stroke="rgba(99,179,237,0.6)"
        strokeWidth={2}
      />
      {/* Vertex dots + labels */}
      {pillars.map((p, i) => {
        const r = (p.value / total) * maxR;
        const pt = polarToCartesian(cx, cy, r, i * step);
        const labelPt = polarToCartesian(cx, cy, maxR + 22, i * step);
        const isDragging = draggingIndex === i;
        return (
          <g key={p.id}>
            {/* Draggable handle */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isDragging ? 10 : 7}
              fill={p.color}
              stroke="#fff"
              strokeWidth={2}
              style={{ cursor: "grab", transition: isDragging ? "none" : "all 0.15s" }}
              data-index={i}
            />
            {/* Label */}
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontWeight={isDragging ? 700 : 500}
              fill={isDragging ? p.color : "rgba(255,255,255,0.85)"}
            >
              {p.label}
            </text>
            {/* Value badge */}
            <text
              x={pt.x}
              y={pt.y - 14}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill={p.color}
            >
              {p.value}
            </text>
          </g>
        );
      })}
      {/* Center total */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={20}
        fontWeight={800}
        fill="rgba(255,255,255,0.5)"
      >
        {total}
      </text>
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
  size = 320,
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = useCallback(
    (index: number, newValue: number) => {
      const clamped = Math.max(min, Math.min(max, Math.round(newValue)));
      const old = pillars[index].value;
      const delta = clamped - old;
      if (delta === 0) return;

      // Proportionally adjust other pillars
      const others = pillars.filter((_, i) => i !== index);
      const othersTotal = others.reduce((s, p) => s + p.value, 0);

      const updated = pillars.map((p, i) => {
        if (i === index) return { ...p, value: clamped };
        if (othersTotal === 0) {
          // Distribute deficit equally
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
        // Add/subtract from the largest non-dragged pillar
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
    [pillars, onChange, total, min, max]
  );

  // Drag handling on SVG
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as SVGElement;
      const idx = target.getAttribute("data-index");
      if (idx !== null) {
        setDraggingIndex(parseInt(idx));
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }
    },
    []
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
      const maxR = rect.width * 0.38;
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* Radar chart with drag */}
      <div
        ref={svgRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none", userSelect: "none" }}
      >
        <SpiderWebChart
          pillars={pillars}
          total={total}
          size={size}
          draggingIndex={draggingIndex}
        />
      </div>

      {/* Slider controls */}
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
        {pillars.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: p.color,
                flexShrink: 0,
              }}
            />
            <span style={{ width: 90, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
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
                height: 6,
              }}
            />
            <span
              style={{
                width: 32,
                textAlign: "right",
                fontSize: 14,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
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
