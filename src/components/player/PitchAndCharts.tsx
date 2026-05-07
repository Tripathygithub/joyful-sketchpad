import { useEffect, useMemo, useRef, useState } from "react";

type Tab = "HEATMAP" | "POSITIONS" | "PASS NETWORK" | "RUN PATHS" | "3D VIEW";

const TABS: Tab[] = ["HEATMAP", "POSITIONS", "PASS NETWORK", "RUN PATHS", "3D VIEW"];

// Pitch dimensions (SVG viewBox)
const W = 800;
const H = 520;

function PitchMarkings({ stripes = 10 }: { stripes?: number }) {
  const stripeW = W / stripes;
  return (
    <g>
      {/* Stripes */}
      {Array.from({ length: stripes }).map((_, i) => (
        <rect
          key={i}
          x={i * stripeW}
          y={0}
          width={stripeW}
          height={H}
          className={i % 2 === 0 ? "pp-pitch-stripe-a" : "pp-pitch-stripe-b"}
        />
      ))}
      <g stroke="rgba(255,255,255,0.75)" strokeWidth={2} fill="none">
        <rect x={6} y={6} width={W - 12} height={H - 12} />
        <line x1={W / 2} y1={6} x2={W / 2} y2={H - 6} />
        <circle cx={W / 2} cy={H / 2} r={60} />
        <circle cx={W / 2} cy={H / 2} r={3} fill="rgba(255,255,255,0.75)" />
        {/* Left penalty area */}
        <rect x={6} y={H / 2 - 110} width={130} height={220} />
        <rect x={6} y={H / 2 - 50} width={50} height={100} />
        <circle cx={96} cy={H / 2} r={3} fill="rgba(255,255,255,0.75)" />
        <path d={`M 136 ${H / 2 - 40} A 50 50 0 0 1 136 ${H / 2 + 40}`} />
        {/* Right penalty area */}
        <rect x={W - 136} y={H / 2 - 110} width={130} height={220} />
        <rect x={W - 56} y={H / 2 - 50} width={50} height={100} />
        <circle cx={W - 96} cy={H / 2} r={3} fill="rgba(255,255,255,0.75)" />
        <path d={`M ${W - 136} ${H / 2 - 40} A 50 50 0 0 0 ${W - 136} ${H / 2 + 40}`} />
        {/* Corner arcs */}
        <path d={`M 6 18 A 12 12 0 0 1 18 6`} />
        <path d={`M ${W - 18} 6 A 12 12 0 0 1 ${W - 6} 18`} />
        <path d={`M 6 ${H - 18} A 12 12 0 0 0 18 ${H - 6}`} />
        <path d={`M ${W - 18} ${H - 6} A 12 12 0 0 0 ${W - 6} ${H - 18}`} />
      </g>
      {/* 3D-ish goal frames */}
      <g stroke="rgba(255,255,255,0.85)" strokeWidth={1.5} fill="rgba(255,255,255,0.04)">
        <rect x={-14} y={H / 2 - 36} width={20} height={72} />
        <rect x={W - 6} y={H / 2 - 36} width={20} height={72} />
      </g>
    </g>
  );
}

function HeatmapLayer() {
  // Hot spots near right channel + attacking third
  const spots = [
    { x: 580, y: 240, r: 110, c: "rgba(255,61,87,0.55)" },
    { x: 620, y: 180, r: 80, c: "rgba(255,140,0,0.55)" },
    { x: 540, y: 320, r: 70, c: "rgba(255,140,0,0.5)" },
    { x: 460, y: 260, r: 90, c: "rgba(255,215,0,0.45)" },
    { x: 400, y: 200, r: 70, c: "rgba(255,215,0,0.35)" },
    { x: 350, y: 320, r: 60, c: "rgba(255,215,0,0.25)" },
    { x: 250, y: 260, r: 80, c: "rgba(255,255,0,0.18)" },
  ];
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs>
        {spots.map((s, i) => (
          <radialGradient id={`heat-${i}`} key={i}>
            <stop offset="0%" stopColor={s.c} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        ))}
      </defs>
      {spots.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={`url(#heat-${i})`} />
      ))}
      <g className="pp-heat-pulse">
        <circle cx={580} cy={240} r={14} fill="#FF3D57" opacity={0.9} />
      </g>
      <text x={600} y={244} fill="#fff" fontFamily="JetBrains Mono" fontSize={12} fontWeight={700}>
        38% MOST ACTIVE
      </text>
    </g>
  );
}

function PositionsLayer() {
  return (
    <g fontFamily="Barlow Condensed" fontWeight={700}>
      <circle cx={620} cy={H / 2} r={42} fill="rgba(0,230,118,0.35)" stroke="#00E676" strokeWidth={2} />
      <text x={620} y={H / 2 + 6} textAnchor="middle" fill="#fff" fontSize={20}>CF</text>
      <text x={620} y={H / 2 + 64} textAnchor="middle" fill="#00E676" fontSize={11} letterSpacing="0.1em">PRIMARY</text>

      <circle cx={560} cy={140} r={32} fill="rgba(61,184,255,0.3)" stroke="#3DB8FF" strokeWidth={2} />
      <text x={560} y={146} textAnchor="middle" fill="#fff" fontSize={16}>RW</text>
      <text x={560} y={186} textAnchor="middle" fill="#3DB8FF" fontSize={11}>SECONDARY</text>

      <circle cx={460} cy={300} r={26} fill="rgba(255,140,0,0.3)" stroke="#FF8C00" strokeWidth={2} />
      <text x={460} y={306} textAnchor="middle" fill="#fff" fontSize={14}>AM</text>
      <text x={460} y={342} textAnchor="middle" fill="#FF8C00" fontSize={11}>TERTIARY</text>

      <g stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeDasharray="4 4" fill="none">
        <path d={`M 560 140 Q 590 200 620 ${H / 2 - 42}`} />
        <path d={`M 460 300 Q 540 290 ${620 - 42} ${H / 2}`} />
      </g>
    </g>
  );
}

function PassNetworkLayer() {
  const nodes = [
    { id: 9, x: 620, y: 240, label: "9" },
    { id: 10, x: 460, y: 220, label: "10" },
    { id: 7, x: 540, y: 110, label: "7" },
    { id: 8, x: 360, y: 280, label: "8" },
    { id: 6, x: 240, y: 240, label: "6" },
    { id: 11, x: 540, y: 380, label: "11" },
  ];
  const edges = [
    { a: 9, b: 10, w: 5, c: "#00E676" },
    { a: 9, b: 7, w: 4, c: "#00E676" },
    { a: 9, b: 11, w: 3, c: "#FF8C00" },
    { a: 10, b: 8, w: 3, c: "#00E676" },
    { a: 8, b: 6, w: 4, c: "#00E676" },
    { a: 6, b: 9, w: 2, c: "#FF3D57" },
  ];
  const get = (id: number) => nodes.find((n) => n.id === id)!;
  return (
    <g>
      {edges.map((e, i) => {
        const a = get(e.a);
        const b = get(e.b);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={e.c} strokeWidth={e.w} opacity={0.85} />;
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={18} fill="#0C1420" stroke="#00E676" strokeWidth={2} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#fff" fontFamily="Bebas Neue" fontSize={18}>
            {n.label}
          </text>
        </g>
      ))}
    </g>
  );
}

function RunPathsLayer() {
  const paths = [
    { d: "M 460 320 C 520 280 580 240 660 200", c: "#00E676", label: "Diagonal Run · 29.8 km/h" },
    { d: "M 500 240 C 560 220 600 230 700 240", c: "#3DB8FF", label: "Channel Drift · 18.4 km/h" },
    { d: "M 600 260 C 540 320 460 360 360 380", c: "#FF8C00", label: "Defensive Track · 14.1 km/h" },
  ];
  return (
    <g fill="none" strokeWidth={3.5} strokeLinecap="round">
      <defs>
        <marker id="arrow-g" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#00E676" />
        </marker>
        <marker id="arrow-b" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#3DB8FF" />
        </marker>
        <marker id="arrow-o" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#FF8C00" />
        </marker>
      </defs>
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.c}
          strokeDasharray="8 6"
          markerEnd={`url(#${i === 0 ? "arrow-g" : i === 1 ? "arrow-b" : "arrow-o"})`}
          opacity={0.95}
        />
      ))}
      <g fontFamily="JetBrains Mono" fontSize={11}>
        <text x={520} y={195} fill="#00E676">Diagonal · 29.8 km/h</text>
        <text x={560} y={232} fill="#3DB8FF">Channel · 18.4</text>
        <text x={400} y={395} fill="#FF8C00">Track back · 14.1</text>
      </g>
    </g>
  );
}

function ThreeDLayer() {
  // Fake isometric tilt overlay
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="url(#iso-grad)" opacity={0.2} />
      <defs>
        <linearGradient id="iso-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </linearGradient>
      </defs>
      <g>
        <ellipse cx={620} cy={250} rx={60} ry={20} fill="rgba(0,230,118,0.2)" stroke="#00E676" strokeDasharray="4 3" />
        <circle cx={620} cy={240} r={10} fill="#00E676" />
        <text x={640} y={232} fill="#fff" fontFamily="Barlow Condensed" fontSize={14}>#9 ARJUN</text>
        <text x={640} y={250} fill="#7A9BB5" fontFamily="JetBrains Mono" fontSize={11}>EFFECTIVE ZONE</text>
      </g>
    </g>
  );
}

export function PlayerPitch() {
  const [tab, setTab] = useState<Tab>("HEATMAP");
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-[Barlow_Condensed] tracking-widest text-xs px-4 py-2 rounded-md border transition-all ${
                active
                  ? "bg-[#00E676] text-[#060A0F] border-[#00E676]"
                  : "border-[#1A2E42] text-[#7A9BB5] hover:text-white hover:border-[#3D5468]"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl overflow-hidden border border-[#1A2E42] shadow-[0_0_40px_rgba(0,230,118,0.05)] bg-[#0C1420]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Football pitch analysis">
          <PitchMarkings />
          {tab === "HEATMAP" && <HeatmapLayer />}
          {tab === "POSITIONS" && <PositionsLayer />}
          {tab === "PASS NETWORK" && <PassNetworkLayer />}
          {tab === "RUN PATHS" && <RunPathsLayer />}
          {tab === "3D VIEW" && <ThreeDLayer />}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-[JetBrains_Mono] text-[#7A9BB5]">
        {tab === "HEATMAP" && (
          <>
            <span>Intensity:</span>
            <div className="flex items-center gap-1">
              <span className="w-6 h-3 bg-[rgba(255,255,0,0.4)]" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-3 bg-[rgba(255,140,0,0.6)]" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-3 bg-[rgba(255,61,87,0.8)]" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-3 bg-[#FF3D57]" />
              <span>Peak</span>
            </div>
          </>
        )}
        {tab === "PASS NETWORK" && (
          <>
            <span className="flex items-center gap-1"><span className="inline-block w-6 h-[3px] bg-[#00E676]" /> Frequent</span>
            <span className="flex items-center gap-1"><span className="inline-block w-6 h-[3px] bg-[#FF8C00]" /> Long Ball</span>
            <span className="flex items-center gap-1"><span className="inline-block w-6 h-[3px] bg-[#FF3D57]" /> Risky</span>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- RADAR CHART ----------
type RadarPoint = { axis: string; value: number };

export function RadarChart({
  data,
  compare,
  size = 380,
}: {
  data: RadarPoint[];
  compare?: RadarPoint[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 60;
  const angle = (i: number) => (Math.PI * 2 * i) / data.length - Math.PI / 2;
  const point = (i: number, v: number) => {
    const r = (v / 100) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };
  const polygon = (vals: RadarPoint[]) =>
    vals.map((p, i) => point(i, p.value).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[420px]">
      {/* Concentric guides */}
      {[20, 40, 60, 80, 100].map((p) => (
        <polygon
          key={p}
          points={data.map((_, i) => point(i, p).join(",")).join(" ")}
          fill="none"
          stroke="rgba(122,155,181,0.18)"
          strokeWidth={1}
        />
      ))}
      {/* Axes */}
      {data.map((d, i) => {
        const [x, y] = point(i, 100);
        return <line key={d.axis} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(122,155,181,0.2)" />;
      })}
      {/* Compare */}
      {compare && (
        <polygon
          points={polygon(compare)}
          fill="rgba(61,184,255,0.08)"
          stroke="#3DB8FF"
          strokeWidth={1.2}
          strokeDasharray="4 3"
        />
      )}
      {/* Player */}
      <polygon
        points={polygon(data)}
        fill="rgba(0,230,118,0.22)"
        stroke="#00E676"
        strokeWidth={2}
      />
      {/* Vertices values */}
      {data.map((d, i) => {
        const [x, y] = point(i, d.value);
        return <circle key={i} cx={x} cy={y} r={4} fill="#00E676" />;
      })}
      {/* Labels */}
      {data.map((d, i) => {
        const [x, y] = point(i, 118);
        return (
          <text
            key={d.axis}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Barlow Condensed"
            fontSize={13}
            fontWeight={700}
            fill="#EDF2F7"
          >
            {d.axis} <tspan fontFamily="Bebas Neue" fontSize={16} fill="#00E676">{d.value}</tspan>
          </text>
        );
      })}
    </svg>
  );
}

// ---------- COUNT-UP ----------
export function CountUp({ end, duration = 1200, decimals = 0, suffix = "" }: { end: number; duration?: number; decimals?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setVal(end * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

// ---------- BAR ----------
export function StatBar({ label, value, max = 100, suffix = "", color }: { label: string; value: number; max?: number; suffix?: string; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const c = color ?? (value >= 90 ? "#00E676" : value >= 70 ? "#7EE8A2" : value >= 55 ? "#FF8C00" : "#FF3D57");
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-[Barlow_Condensed] uppercase tracking-wider text-[#7A9BB5]">{label}</span>
        <span className="font-[JetBrains_Mono] text-[#EDF2F7]">{value}{suffix}</span>
      </div>
      <div className="h-1.5 bg-[#1A2E42] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} />
      </div>
    </div>
  );
}

export function GradeBadge({ grade }: { grade: string }) {
  const map: Record<string, string> = {
    "A+": "bg-[#00E676] text-[#060A0F]",
    "A": "bg-[#00E676]/90 text-[#060A0F]",
    "A-": "bg-[#7EE8A2] text-[#060A0F]",
    "B+": "bg-[#7EE8A2]/80 text-[#060A0F]",
    "B": "bg-[#3DB8FF] text-[#060A0F]",
    "B-": "bg-[#3DB8FF]/80 text-[#060A0F]",
    "C+": "bg-[#FF8C00] text-[#060A0F]",
    "C": "bg-[#FF8C00]/80 text-[#060A0F]",
    "D": "bg-[#FF3D57] text-white",
  };
  return (
    <span className={`inline-block font-[Barlow_Condensed] font-bold text-[12px] px-2 py-0.5 rounded ${map[grade] ?? "bg-[#1A2E42] text-white"}`}>
      {grade}
    </span>
  );
}
