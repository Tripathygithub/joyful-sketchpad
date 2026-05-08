import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  PlayerPitch,
  RadarChart,
  CountUp,
  StatBar,
  GradeBadge,
} from "@/components/player/PitchAndCharts";
import Avatar3D from "@/components/player/Avatar3D";

export const Route = createFileRoute("/player/$playerId")({
  head: () => ({
    meta: [
      { title: "Arjun Mehta — Centre Forward · ScoutX" },
      { name: "description", content: "Full scouting profile: stats, heatmap, radar, video highlights, and career timeline for Arjun Mehta." },
      { property: "og:title", content: "Arjun Mehta — Scout Profile · ScoutX" },
      { property: "og:description", content: "AI-graded scouting profile with pitch heatmap, performance stats and 3D avatar." },
    ],
  }),
  component: PlayerProfile,
});

const SECTIONS = [
  { id: "identity", label: "Identity & Info" },
  { id: "avatar", label: "3D Avatar & Body" },
  { id: "pitch", label: "Pitch & Heatmap" },
  { id: "stats", label: "Performance Stats" },
  { id: "radar", label: "Radar & Grades" },
  { id: "matches", label: "Match Analysis" },
  { id: "videos", label: "Video Highlights" },
  { id: "gallery", label: "Photo Gallery" },
  { id: "career", label: "Career History" },
  { id: "scout", label: "Scout Evaluations" },
];

const QUICK_STATS = [
  { label: "Goals", v: 14 },
  { label: "Assists", v: 9 },
  { label: "Matches", v: 22 },
  { label: "Pass Acc.", v: 87, suffix: "%" },
  { label: "Sprint", v: 32.4, dec: 1, suffix: " km/h" },
  { label: "Dribble", v: 71, suffix: "%" },
];

const RADAR = [
  { axis: "PACE", value: 92 },
  { axis: "SHOOT", value: 85 },
  { axis: "PASS", value: 78 },
  { axis: "DRIB", value: 88 },
  { axis: "DEF", value: 55 },
  { axis: "PHYS", value: 76 },
];

const RADAR_AVG = [
  { axis: "PACE", value: 74 },
  { axis: "SHOOT", value: 70 },
  { axis: "PASS", value: 72 },
  { axis: "DRIB", value: 71 },
  { axis: "DEF", value: 60 },
  { axis: "PHYS", value: 70 },
];

const ATTRS = [
  {
    group: "PACE",
    items: [
      { label: "Sprint Speed", v: 92, g: "A+" },
      { label: "Acceleration", v: 88, g: "A" },
    ],
  },
  {
    group: "SHOOTING",
    items: [
      { label: "Finishing", v: 85, g: "A" },
      { label: "Long Shots", v: 74, g: "B+" },
      { label: "Volleys", v: 79, g: "B+" },
      { label: "Penalties", v: 90, g: "A+" },
    ],
  },
  {
    group: "PASSING",
    items: [
      { label: "Short Passing", v: 87, g: "A" },
      { label: "Long Passing", v: 71, g: "B" },
      { label: "Vision", v: 83, g: "A-" },
      { label: "Crossing", v: 66, g: "B-" },
    ],
  },
  {
    group: "DRIBBLING",
    items: [
      { label: "Ball Control", v: 88, g: "A" },
      { label: "Dribbling", v: 85, g: "A" },
      { label: "Agility", v: 91, g: "A+" },
      { label: "Balance", v: 83, g: "A-" },
    ],
  },
  {
    group: "DEFENDING",
    items: [
      { label: "Awareness", v: 58, g: "C+" },
      { label: "Tackling", v: 52, g: "C" },
    ],
  },
  {
    group: "PHYSICAL",
    items: [
      { label: "Strength", v: 72, g: "B" },
      { label: "Jumping", v: 76, g: "B+" },
      { label: "Stamina", v: 80, g: "B+" },
      { label: "Reactions", v: 87, g: "A" },
    ],
  },
];

const STAT_GROUPS = [
  {
    title: "ATTACKING",
    color: "#00E676",
    rows: [
      ["Goals", "14", "↑+3"],
      ["Goals per 90", "0.64"],
      ["Shots", "87"],
      ["Shots on Target", "52 (59.8%)"],
      ["Shot Accuracy", "59.8%"],
      ["Expected Goals (xG)", "12.4"],
      ["Goals Over xG", "+1.6 ✅"],
      ["Header Goals", "3"],
      ["Free Kick Goals", "1"],
      ["Penalty Goals", "2 / 2"],
      ["First-Touch Shots", "6"],
      ["Volley Goals", "1"],
    ],
  },
  {
    title: "PASSING & CREATIVITY",
    color: "#3DB8FF",
    rows: [
      ["Assists", "9"],
      ["Expected Assists (xA)", "7.8"],
      ["Key Passes", "34"],
      ["Key Passes / 90", "1.55"],
      ["Total Passes", "612"],
      ["Pass Accuracy", "87.3%"],
      ["Forward Passes", "241"],
      ["Through Balls", "18"],
      ["Through Ball Acc.", "72%"],
      ["Cross Attempts", "44"],
      ["Cross Accuracy", "41%"],
      ["Long Balls", "68 (54%)"],
    ],
  },
  {
    title: "DRIBBLING & TECHNIQUE",
    color: "#FFD700",
    rows: [
      ["Dribble Attempts", "112"],
      ["Successful Dribbles", "79 (70.5%)"],
      ["Carries (Total)", "342"],
      ["Carry Distance", "2.4 km/game"],
      ["Progressive Carries", "88"],
      ["Touches in Box", "4.2/game"],
      ["Ball Retention", "91.2%"],
      ["1v1 Situations", "67"],
      ["1v1 Win Rate", "62.7%"],
      ["Fouls Won", "38"],
      ["Skills", "Roulette · Chop"],
    ],
  },
  {
    title: "DEFENSIVE CONTRIBUTION",
    color: "#A855F7",
    rows: [
      ["Pressures Applied", "404"],
      ["Pressure Success", "31%"],
      ["Tackles Attempted", "18"],
      ["Tackles Won", "11 (61%)"],
      ["Interceptions", "7"],
      ["Aerial Duels Won", "54%"],
      ["Ground Duels Won", "61%"],
      ["Fouls Committed", "22"],
      ["Yellow Cards", "3"],
      ["Red Cards", "0"],
      ["Off-Ball Runs", "22/game"],
    ],
  },
  {
    title: "PHYSICAL (GPS / TRACKING)",
    color: "#FF8C00",
    rows: [
      ["Avg Distance / Match", "10.8 km"],
      ["Sprint Distance", "1.24 km"],
      ["Max Speed", "32.4 km/h"],
      ["High-Intensity Runs", "22.4/game"],
      ["Sprints (>25 km/h)", "8.4/game"],
      ["Accelerations", "42/game"],
      ["Decelerations", "38/game"],
      ["Explosive Starts", "14/game"],
      ["Work Rate", "9.1 / 10"],
      ["Fitness Score", "94 / 100"],
      ["Availability", "95.4%"],
    ],
  },
  {
    title: "SCORING ZONES",
    color: "#FF3D57",
    rows: [
      ["Inside Box Goals", "12"],
      ["Outside Box Goals", "2"],
      ["Right Foot Goals", "11"],
      ["Left Foot Goals", "1"],
      ["Header Goals", "3"],
      ["Goals per Shot", "0.16"],
      ["Best Zone", "Right Channel"],
      ["Conversion Rate", "16.1%"],
    ],
  },
];

const MATCHES = [
  { n: 22, date: "12 Apr", opp: "Mumbai City", res: "W 3-1", min: 90, g: 2, a: 1, sh: 5, kp: 3, dr: 6, tk: 1, r: 8.9, mom: true },
  { n: 21, date: "05 Apr", opp: "Bengaluru FC", res: "D 1-1", min: 90, g: 0, a: 1, sh: 3, kp: 2, dr: 4, tk: 2, r: 7.2, mom: false },
  { n: 20, date: "29 Mar", opp: "Kerala Blasters", res: "W 2-0", min: 88, g: 1, a: 0, sh: 4, kp: 1, dr: 5, tk: 0, r: 8.1, mom: false },
  { n: 19, date: "22 Mar", opp: "Goa", res: "L 0-2", min: 75, g: 0, a: 0, sh: 2, kp: 1, dr: 3, tk: 1, r: 5.8, mom: false },
  { n: 18, date: "15 Mar", opp: "ATK", res: "W 4-2", min: 90, g: 3, a: 0, sh: 6, kp: 2, dr: 4, tk: 0, r: 9.4, mom: true },
  { n: 17, date: "08 Mar", opp: "Hyderabad", res: "W 1-0", min: 90, g: 1, a: 0, sh: 3, kp: 4, dr: 2, tk: 1, r: 7.9, mom: false },
  { n: 16, date: "01 Mar", opp: "Jamshedpur", res: "D 2-2", min: 90, g: 1, a: 1, sh: 4, kp: 3, dr: 5, tk: 1, r: 8.0, mom: false },
  { n: 15, date: "23 Feb", opp: "Punjab", res: "W 2-1", min: 90, g: 1, a: 0, sh: 3, kp: 2, dr: 3, tk: 2, r: 7.6, mom: false },
  { n: 14, date: "16 Feb", opp: "Odisha", res: "L 1-3", min: 82, g: 1, a: 0, sh: 4, kp: 1, dr: 2, tk: 0, r: 6.4, mom: false },
  { n: 13, date: "09 Feb", opp: "NorthEast", res: "W 3-0", min: 90, g: 2, a: 1, sh: 5, kp: 4, dr: 6, tk: 1, r: 9.1, mom: true },
];

const VIDEOS = [
  { title: "Hat-trick vs ATK", dur: "1:24", views: "184K", img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400" },
  { title: "Solo run vs Goa", dur: "0:42", views: "92K", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400" },
  { title: "Free kick screamer", dur: "0:18", views: "76K", img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400" },
  { title: "Diving header", dur: "0:22", views: "61K", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400" },
  { title: "Skill show vs Mumbai", dur: "0:55", views: "44K", img: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=400" },
];

const GALLERY = [
  { img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800", h: 320, cat: "Action" },
  { img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800", h: 220, cat: "Action" },
  { img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800", h: 380, cat: "Training" },
  { img: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=800", h: 260, cat: "Celebration" },
  { img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800", h: 340, cat: "Action" },
  { img: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800", h: 240, cat: "Press" },
  { img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800", h: 300, cat: "Awards" },
  { img: "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800", h: 280, cat: "Training" },
  { img: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800", h: 360, cat: "Action" },
];

const CAREER = [
  {
    badge: "🛡️",
    club: "FC Bengal Warriors",
    period: "Jan 2023 – Present",
    note: "Current Club · #9 Starting Striker",
    apps: 58, g: 32, a: 18,
    trophy: "State League Winner 2024 · Top Scorer 2023–24 ⭐",
    accent: "#00E676",
  },
  {
    badge: "🦁",
    club: "East Bengal Youth",
    period: "2020 – 2022 · Academy / Loan",
    note: "Reserve & senior debut",
    apps: 34, g: 18, a: 11,
    trophy: "Youth League Runner-up 2021",
    accent: "#3DB8FF",
  },
  {
    badge: "🇮🇳",
    club: "India U-19",
    period: "2021 – 2022",
    note: "SAFF U-19 Championship",
    apps: 12, g: 7, a: 4,
    trophy: "SAFF Bronze Medal",
    accent: "#FFD700",
  },
];

const EVALS = [
  {
    scout: "Deepak Roy", verified: true, club: "Mohun Bagan SC", date: "Nov 2024",
    rating: 4.2,
    text: "Exceptional pace and clinical finishing. Needs to improve defensive tracking and weak-foot consistency. High potential for ISL-level play.",
    strengths: "Speed, Aerial, Box Instinct",
    weaknesses: "Left foot, Tracking back",
    rec: "RECOMMEND FOR TRIAL",
  },
  {
    scout: "Anita Verma", verified: true, club: "Kerala Blasters", date: "Sep 2024",
    rating: 4.5,
    text: "Predator inside the box. Composure under pressure is rare for his age. Could develop into a national-team striker within two seasons.",
    strengths: "Composure, Off-ball runs, Finishing",
    weaknesses: "Aerial timing on set pieces",
    rec: "STRONG RECOMMEND",
  },
];

function PlayerProfile() {
  const [active, setActive] = useState("identity");

  // Scroll spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-[#060A0F] text-[#EDF2F7] min-h-screen pb-32" style={{ fontFamily: "Barlow, sans-serif" }}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 h-[60px] border-b border-[#1A2E42] bg-[rgba(6,10,15,0.9)] backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#7A9BB5] hover:text-[#EDF2F7] transition-colors text-sm">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="font-[Barlow_Condensed] uppercase tracking-wider">Back to Discover</span>
          </Link>
          <div className="hidden md:block font-[Barlow_Condensed] font-semibold text-base">
            ARJUN MEHTA · CF
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden md:inline-flex items-center gap-1 border border-[#1A2E42] rounded-full px-3 py-1.5 text-xs text-[#7A9BB5] hover:text-white hover:border-[#3D5468] transition-colors">
              <span className="material-symbols-outlined text-[14px]">favorite</span> Watchlist
            </button>
            <button className="hidden md:inline-flex items-center gap-1 border border-[#1A2E42] rounded-full px-3 py-1.5 text-xs text-[#7A9BB5] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[14px]">share</span>
            </button>
            <button className="inline-flex items-center gap-1.5 bg-[#00E676] text-[#060A0F] font-[Barlow_Condensed] font-bold tracking-wider text-xs px-4 py-2 rounded-full hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] transition-shadow">
              <span className="material-symbols-outlined text-[14px]">add_task</span> Add to Pipeline
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[560px] overflow-hidden border-b border-[#1A2E42]">
        <img
          src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060A0F] via-[#060A0F]/70 to-[#060A0F]/40" />
        <div
          aria-hidden
          className="absolute left-4 md:left-12 top-12 font-[Bebas_Neue] text-[180px] md:text-[280px] leading-none text-white/[0.04] select-none pointer-events-none"
        >
          9
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-12 md:pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#C8102E] grid place-items-center font-[Bebas_Neue] text-xl">FC</div>
                <span className="text-2xl">🇮🇳</span>
                <span className="px-3 py-1 rounded-full border border-[#00E676]/40 bg-[#00E676]/10 text-[#00E676] text-[11px] font-[Barlow_Condensed] tracking-widest uppercase">⚽ Football</span>
                <span className="px-3 py-1 rounded-full border border-[#3DB8FF]/40 bg-[#3DB8FF]/10 text-[#3DB8FF] text-[11px] font-[Barlow_Condensed] tracking-widest uppercase">Speed: Elite</span>
              </div>

              <h1 className="font-[Bebas_Neue] text-[44px] md:text-[88px] leading-none tracking-wide">ARJUN MEHTA</h1>
              <div className="font-[Barlow_Condensed] text-lg md:text-2xl text-[#00E676] tracking-wider mt-2">
                CENTRE FORWARD &nbsp;·&nbsp; #9
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  ["VERIFIED TALENT ✓", "#00E676"],
                  ["PRO MEMBER 🏅", "#FFD700"],
                  ["TOP 10% IN REGION 🔥", "#FF8C00"],
                ].map(([t, c]) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-md text-[11px] font-[Barlow_Condensed] tracking-widest uppercase border"
                    style={{ borderColor: `${c}55`, color: c, background: `${c}11` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-sm text-[#7A9BB5] space-y-1 font-[Barlow]">
                <div>Current Club: <span className="text-[#EDF2F7] font-semibold">FC Bengal Warriors</span></div>
                <div>Nationality: 🇮🇳 India · Age: 22 · Kolkata, WB</div>
              </div>
            </div>

            {/* Scout score badge */}
            <div className="bg-[#122030] border border-[#FFD700]/50 rounded-2xl p-6 text-center min-w-[220px] shadow-[0_0_24px_rgba(255,215,0,0.2)]">
              <div className="font-[Bebas_Neue] text-[88px] leading-none text-[#FFD700]">87</div>
              <div className="text-[11px] tracking-widest text-[#7A9BB5] font-[Barlow_Condensed] uppercase">Overall Score</div>
              <div className="mt-3 h-1 bg-[#1A2E42] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFD700]" style={{ width: "87%" }} />
              </div>
              <div className="mt-2 text-[10px] tracking-widest text-[#FFD700]/80 font-[Barlow_Condensed] uppercase">AI Scout Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="bg-[#0C1420] border-b border-[#1A2E42]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 grid grid-cols-3 md:grid-cols-6 gap-4">
          {QUICK_STATS.map((s) => (
            <div key={s.label} className="text-center md:text-left md:border-l md:first:border-l-0 border-[#1A2E42] md:pl-4">
              <div className="font-[Bebas_Neue] text-3xl md:text-[44px] text-[#00E676] leading-none">
                <CountUp end={s.v} decimals={s.dec ?? 0} suffix={s.suffix ?? ""} />
              </div>
              <div className="text-[10px] tracking-widest font-[Barlow_Condensed] text-[#3D5468] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex gap-8 mt-10">
        {/* Sidebar */}
        <aside className="hidden xl:block w-[260px] shrink-0">
          <div className="sticky top-[80px]">
            <div className="bg-[#0C1420] border border-[#1A2E42] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#122030] grid place-items-center font-[Bebas_Neue]">AM</div>
                <div>
                  <div className="font-[Barlow_Condensed] font-bold">Arjun Mehta</div>
                  <div className="text-[11px] text-[#7A9BB5]">CF · FC Bengal · ⭐87</div>
                </div>
              </div>
            </div>
            <nav className="bg-[#0C1420] border border-[#1A2E42] rounded-xl py-2">
              {SECTIONS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-[Barlow_Condensed] tracking-wide transition-colors border-l-2 ${
                    active === s.id
                      ? "border-[#00E676] text-white bg-[#122030]"
                      : "border-transparent text-[#7A9BB5] hover:text-white hover:bg-[#122030]/50"
                  }`}
                >
                  <span className="text-[10px] text-[#3D5468] font-[JetBrains_Mono]">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="bg-[#0C1420] border border-[#1A2E42] rounded-lg py-2 text-xs text-[#7A9BB5] hover:text-white">♡ Save</button>
              <button className="bg-[#0C1420] border border-[#1A2E42] rounded-lg py-2 text-xs text-[#7A9BB5] hover:text-white">+ Pipeline</button>
              <button className="bg-[#0C1420] border border-[#1A2E42] rounded-lg py-2 text-xs text-[#7A9BB5] hover:text-white">📤 Share</button>
              <button className="bg-[#0C1420] border border-[#1A2E42] rounded-lg py-2 text-xs text-[#7A9BB5] hover:text-white">⚑ Flag</button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 space-y-24">
          {/* ===== IDENTITY ===== */}
          <section id="identity" className="scroll-mt-20">
            <div className="pp-section-label mb-3">01 / Player Identity</div>
            <h2 className="pp-h2 mb-8">Biography & Personal Information</h2>
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <p className="font-[Source_Serif_4] italic text-[#7A9BB5] text-base leading-relaxed">
                  Arjun Mehta is a dynamic centre forward known for his explosive pace, clinical finishing,
                  and intelligent off-the-ball movement. Having developed through the academy system at FC Bengal
                  Warriors, he has emerged as one of the most promising young strikers in Eastern India. His ability
                  to find space in congested boxes and convert half-chances has drawn attention from ISL clubs.
                </p>

                <InfoCard title="Personal Information" rows={[
                  ["Full Name", "Arjun Dev Mehta"],
                  ["Date of Birth", "14 March 2003"],
                  ["Age", "22 years"],
                  ["Nationality", "🇮🇳 India"],
                  ["Place of Birth", "Kolkata, WB"],
                  ["Languages", "Hindi · Bengali · English"],
                  ["Marital Status", "Single"],
                ]} />

                <InfoCard title="Football Identity" rows={[
                  ["Primary Position", "Centre Forward"],
                  ["Secondary", "Right Winger"],
                  ["Tertiary", "Attacking Midfielder"],
                  ["Jersey No.", "#9"],
                  ["Playing Style", "Target Man / Box Predator"],
                  ["Foot", "Right (92% usage)"],
                  ["Boots", "Nike Mercurial · UK 9"],
                ]} />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <InfoCard title="Physical Profile" rows={[
                  ["Height", "5'11\" / 180 cm"],
                  ["Weight", "74 kg / 163 lbs"],
                  ["Body Type", "Athletic / Lean"],
                  ["Dominant Foot", "Right"],
                  ["Weak Foot", "★★★☆☆"],
                  ["Wingspan", "182 cm"],
                  ["BMI", "22.8 (Optimal)"],
                ]} />
                <InfoCard title="Representation" rows={[
                  ["Agent", "Rahul Kapoor"],
                  ["Agency", "ProTalent India"],
                  ["Contact", "🔒 Verified scouts only"],
                  ["Availability", "✅ Open to Offers"],
                  ["Contract End", "June 2026"],
                  ["Market Value", "₹45L – ₹80L"],
                ]} accent="#FFD700" />
              </div>
            </div>
          </section>

          {/* ===== AVATAR ===== */}
          <section id="avatar" className="scroll-mt-20">
            <div className="pp-section-label mb-3">02 / Body & Avatar Analysis</div>
            <h2 className="pp-h2 mb-8">3D Avatar & Athletic Metrics</h2>
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left metrics */}
              <Card className="lg:col-span-3">
                <CardTitle>Athletic Metrics</CardTitle>
                <div className="space-y-3">
                  <StatBar label="Sprint Speed" value={92} suffix="" />
                  <StatBar label="Acceleration" value={88} />
                  <StatBar label="Jumping Reach" value={78} />
                  <StatBar label="Agility" value={84} />
                  <StatBar label="Stamina" value={78} />
                  <StatBar label="Strength" value={72} />
                  <StatBar label="Balance" value={80} />
                </div>
                <div className="mt-6 pt-4 border-t border-[#1A2E42]">
                  <div className="text-[11px] font-[Barlow_Condensed] tracking-widest text-[#7A9BB5] uppercase mb-2">Injury History</div>
                  <div className="text-xs space-y-1 text-[#EDF2F7]">
                    <div>🟢 Last 12 months: <span className="text-[#00E676]">0 major</span></div>
                    <div>🟡 Career total: 2 minor</div>
                    <div className="text-[#7A9BB5]">Last: Hamstring (2022)</div>
                    <div className="text-[#00E676]">✅ 100% Fit</div>
                  </div>
                </div>
              </Card>

              {/* Center avatar - 3D */}
              <Card className="lg:col-span-6 flex flex-col items-center" padding="p-6">
                <Avatar3D />
              </Card>

              {/* Right metrics */}
              <Card className="lg:col-span-3">
                <CardTitle>Foot Usage</CardTitle>
                <div className="space-y-4 mb-6">
                  <FootDial label="RIGHT FOOT" pct={92} stars="★★★★★" color="#00E676" />
                  <FootDial label="LEFT FOOT" pct={8} stars="★★★☆☆" color="#3DB8FF" />
                </div>
                <div className="border-t border-[#1A2E42] pt-4">
                  <div className="text-[11px] font-[Barlow_Condensed] tracking-widest text-[#7A9BB5] uppercase mb-3">Body Composition</div>
                  <div className="space-y-2">
                    <StatBar label="Muscle Mass" value={72} suffix="%" color="#00E676" />
                    <StatBar label="Body Fat" value={12} max={30} suffix="%" color="#FF8C00" />
                    <StatBar label="Water" value={16} max={30} suffix="%" color="#3DB8FF" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#1A2E42]">
                  <div className="text-[11px] font-[Barlow_Condensed] tracking-widest text-[#7A9BB5] uppercase mb-2">Fitness Score</div>
                  <div className="flex items-end gap-1 h-12">
                    {[60, 68, 72, 78, 82, 88, 91, 94].map((v, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-[#00E676]/20 to-[#00E676] rounded-sm" style={{ height: `${v}%` }} />
                    ))}
                  </div>
                  <div className="text-[#00E676] text-xs mt-2 font-[JetBrains_Mono]">Current: 94/100</div>
                </div>
              </Card>
            </div>
          </section>

          {/* ===== PITCH ===== */}
          <section id="pitch" className="scroll-mt-20">
            <div className="pp-section-label mb-3">03 / Pitch Analysis & Positioning</div>
            <h2 className="pp-h2 mb-8">Pitch Heatmap & Positioning Map</h2>
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <PlayerPitch />
              </div>
              <Card className="lg:col-span-4">
                <CardTitle>Positioning Intelligence</CardTitle>
                <KvList items={[
                  ["Avg X (left)", "34.2 m"],
                  ["Avg Y (goal)", "8.6 m"],
                  ["Zone", "Right Half-Space"],
                ]} />
                <div className="mt-5">
                  <div className="text-[11px] font-[Barlow_Condensed] tracking-widest text-[#7A9BB5] uppercase mb-2">Time in Zones</div>
                  <StatBar label="Attacking Third" value={48} suffix="%" color="#00E676" />
                  <div className="h-2" />
                  <StatBar label="Middle Third" value={37} suffix="%" color="#3DB8FF" />
                  <div className="h-2" />
                  <StatBar label="Defensive Third" value={15} suffix="%" color="#FF8C00" />
                </div>
                <div className="mt-5 pt-4 border-t border-[#1A2E42]">
                  <div className="text-[11px] font-[Barlow_Condensed] tracking-widest text-[#7A9BB5] uppercase mb-2">Pressing Intensity</div>
                  <KvList items={[
                    ["PPDA", "7.2 (High)"],
                    ["Pressures / 90", "18.4"],
                    ["Press Success", "31%"],
                  ]} />
                </div>
                <div className="mt-5 pt-4 border-t border-[#1A2E42]">
                  <div className="text-[11px] font-[Barlow_Condensed] tracking-widest text-[#7A9BB5] uppercase mb-2">Movement</div>
                  <KvList items={[
                    ["Distance / Game", "10.8 km"],
                    ["High-Speed Runs", "22 / game"],
                    ["Sprints", "8.4 / game"],
                    ["Sprint Distance", "1.24 km"],
                  ]} />
                </div>
              </Card>
            </div>
          </section>

          {/* ===== PERFORMANCE STATS ===== */}
          <section id="stats" className="scroll-mt-20">
            <div className="pp-section-label mb-3">04 / Performance Statistics</div>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <h2 className="pp-h2">Season Performance Breakdown</h2>
              <div className="flex gap-1">
                {["2024–25", "2023–24", "2022–23", "Career"].map((s, i) => (
                  <button
                    key={s}
                    className={`px-3 py-1.5 text-xs rounded-md font-[Barlow_Condensed] tracking-wider border ${
                      i === 0 ? "bg-[#00E676] text-[#060A0F] border-[#00E676]" : "border-[#1A2E42] text-[#7A9BB5] hover:text-white hover:border-[#3D5468]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {STAT_GROUPS.map((g) => (
                <Card key={g.title} accent={g.color}>
                  <CardTitle accent={g.color}>{g.title}</CardTitle>
                  <div className="space-y-2.5">
                    {g.rows.map(([k, v, delta]) => (
                      <div key={k} className="flex justify-between items-baseline text-sm border-b border-[#1A2E42]/60 pb-1.5 last:border-b-0">
                        <span className="text-[#7A9BB5]">{k}</span>
                        <span className="font-[JetBrains_Mono] text-[#EDF2F7] flex items-center gap-2">
                          {v}
                          {delta && <span className="text-[10px] text-[#00E676]">{delta}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ===== RADAR ===== */}
          <section id="radar" className="scroll-mt-20">
            <div className="pp-section-label mb-3">05 / Attribute Radar & Grades</div>
            <h2 className="pp-h2 mb-8">Radar Chart + Attribute Grades</h2>
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <Card className="lg:col-span-5 flex flex-col items-center">
                <RadarChart data={RADAR} compare={RADAR_AVG} />
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {["This Season", "Career Best", "vs League", "vs Position"].map((b, i) => (
                    <button
                      key={b}
                      className={`px-3 py-1.5 text-[11px] font-[Barlow_Condensed] tracking-wider rounded-md border ${
                        i === 0 ? "bg-[#00E676] text-[#060A0F] border-[#00E676]" : "border-[#1A2E42] text-[#7A9BB5]"
                      }`}
                    >
                      {b.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 text-[11px] font-[JetBrains_Mono] text-[#7A9BB5]">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#00E676] rounded-sm" />Player</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 border border-[#3DB8FF]" />League Avg</div>
                </div>
              </Card>

              <div className="lg:col-span-7 space-y-6">
                <Card>
                  <div className="space-y-5">
                    {ATTRS.map((g) => (
                      <div key={g.group}>
                        <div className="text-[11px] font-[Barlow_Condensed] tracking-widest uppercase text-[#00E676] mb-2 flex items-center gap-2">
                          <span className="w-1 h-3 bg-[#00E676]" /> {g.group}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {g.items.map((it) => (
                            <div key={it.label} className="flex items-center gap-3 text-sm">
                              <div className="text-[#7A9BB5] flex-1">{it.label}</div>
                              <div className="font-[Bebas_Neue] text-lg w-8 text-right">{it.v}</div>
                              <GradeBadge grade={it.g} />
                              <div className="w-20 h-1 bg-[#1A2E42] rounded-full overflow-hidden">
                                <div className="h-full" style={{ width: `${it.v}%`, background: it.v >= 90 ? "#00E676" : it.v >= 70 ? "#7EE8A2" : it.v >= 55 ? "#FF8C00" : "#FF3D57" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="text-center" accent="#FFD700">
                  <div className="font-[Bebas_Neue] text-[64px] leading-none text-[#FFD700]">87</div>
                  <div className="font-[Barlow_Condensed] text-2xl tracking-wider">OVERALL · A-</div>
                  <div className="text-xs text-[#7A9BB5] mt-2 font-[JetBrains_Mono]">TOP 12% IN INDIA · #3 STRIKER U-23</div>
                </Card>
              </div>
            </div>
          </section>

          {/* ===== MATCHES ===== */}
          <section id="matches" className="scroll-mt-20">
            <div className="pp-section-label mb-3">06 / Match Analysis</div>
            <h2 className="pp-h2 mb-8">Match-by-Match Breakdown</h2>

            {/* Charts row */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardTitle>Goals & Assists · Last 10</CardTitle>
                <ChartGA matches={MATCHES} />
              </Card>
              <Card>
                <CardTitle>Player Rating</CardTitle>
                <ChartRating matches={MATCHES} />
              </Card>
              <Card>
                <CardTitle>xG vs Actual Goals</CardTitle>
                <ChartXG matches={MATCHES} />
                <div className="text-xs text-[#00E676] mt-2 font-[JetBrains_Mono]">Outperforming xG by +1.6</div>
              </Card>
            </div>

            {/* Match log table */}
            <Card padding="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] tracking-widest text-[#7A9BB5] font-[Barlow_Condensed] uppercase border-b border-[#1A2E42]">
                      {["#", "Date", "Opp", "Result", "Min", "G", "A", "Sh", "KP", "Drb", "Tk", "Rating", "MotM"].map((h) => (
                        <th key={h} className="text-left p-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-[JetBrains_Mono]">
                    {MATCHES.map((m) => {
                      const result = m.res.startsWith("W") ? "#00E676" : m.res.startsWith("L") ? "#FF3D57" : "#FF8C00";
                      return (
                        <tr key={m.n} className="border-b border-[#1A2E42]/50 hover:bg-[#122030]/50" style={{ borderLeft: `3px solid ${result}` }}>
                          <td className="p-3 text-[#7A9BB5]">{m.n}</td>
                          <td className="p-3">{m.date}</td>
                          <td className="p-3 font-[Barlow] font-semibold">{m.opp}</td>
                          <td className="p-3" style={{ color: result }}>{m.res}</td>
                          <td className="p-3">{m.min}</td>
                          <td className="p-3 text-[#00E676]">{m.g}</td>
                          <td className="p-3 text-[#3DB8FF]">{m.a}</td>
                          <td className="p-3">{m.sh}</td>
                          <td className="p-3">{m.kp}</td>
                          <td className="p-3">{m.dr}</td>
                          <td className="p-3">{m.tk}</td>
                          <td className="p-3">
                            <span
                              className="px-2 py-0.5 rounded text-xs font-bold"
                              style={{
                                background: m.r >= 8 ? "#FFD700" : m.r < 6 ? "#FF3D57" : "#1A2E42",
                                color: m.r >= 8 || m.r < 6 ? "#060A0F" : "#EDF2F7",
                              }}
                            >
                              {m.r.toFixed(1)}
                            </span>
                          </td>
                          <td className="p-3">{m.mom ? "⭐" : ""}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-4 text-center">
                <button className="text-[#7A9BB5] hover:text-white text-xs tracking-widest font-[Barlow_Condensed]">LOAD MORE MATCHES →</button>
              </div>
            </Card>
          </section>

          {/* ===== VIDEOS ===== */}
          <section id="videos" className="scroll-mt-20">
            <div className="pp-section-label mb-3">07 / Video Highlights & Reels</div>
            <h2 className="pp-h2 mb-8">Featured Clips</h2>
            <div className="grid lg:grid-cols-5 gap-6 mb-6">
              <Card padding="p-0" className="lg:col-span-3 overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <img src={VIDEOS[0].img} alt={VIDEOS[0].title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <button className="absolute inset-0 grid place-items-center group">
                    <span className="w-20 h-20 rounded-full bg-[#00E676]/90 group-hover:bg-[#00E676] grid place-items-center transition-colors">
                      <span className="material-symbols-outlined text-[#060A0F] text-5xl">play_arrow</span>
                    </span>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="font-[Barlow_Condensed] text-xl">{VIDEOS[0].title}</div>
                    <div className="text-xs text-[#7A9BB5] flex gap-3 mt-1 font-[JetBrains_Mono]">
                      <span>vs ATK · 15 Mar</span>
                      <span>👁 {VIDEOS[0].views}</span>
                      <span>♥ 4.1K</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {["#Goal", "#Finishing", "#BoxPlay"].map((t) => (
                        <span key={t} className="text-[10px] bg-[#00E676]/15 text-[#00E676] px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              <div className="lg:col-span-2 space-y-3">
                {VIDEOS.slice(1).map((v) => (
                  <div key={v.title} className="flex gap-3 bg-[#0C1420] border border-[#1A2E42] rounded-lg overflow-hidden hover:border-[#3D5468] cursor-pointer transition">
                    <img src={v.img} alt="" className="w-32 h-20 object-cover" />
                    <div className="py-2 pr-2 flex-1">
                      <div className="font-[Barlow] font-semibold text-sm">{v.title}</div>
                      <div className="text-[10px] text-[#7A9BB5] font-[JetBrains_Mono] mt-1">{v.dur} · {v.views} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {["ALL", "GOALS", "ASSISTS", "DRIBBLES", "FREE KICKS", "HEADERS", "TRAINING"].map((c, i) => (
                <button key={c} className={`px-3 py-1.5 text-xs font-[Barlow_Condensed] tracking-wider rounded-md border ${i === 0 ? "bg-[#00E676] text-[#060A0F] border-[#00E676]" : "border-[#1A2E42] text-[#7A9BB5] hover:text-white"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {VIDEOS.concat(VIDEOS).slice(0, 6).map((v, i) => (
                <div key={i} className="aspect-[9/16] relative rounded-lg overflow-hidden border border-[#1A2E42] group cursor-pointer">
                  <img src={v.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent" />
                  <div className="absolute top-2 right-2 bg-black/70 text-[10px] px-1.5 py-0.5 rounded font-[JetBrains_Mono]">{v.dur}</div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs font-[Barlow] font-semibold">{v.title}</div>
                    <div className="text-[10px] text-[#7A9BB5]">{v.views} views</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== GALLERY ===== */}
          <section id="gallery" className="scroll-mt-20">
            <div className="pp-section-label mb-3">08 / Player Gallery</div>
            <h2 className="pp-h2 mb-6">Photo Gallery</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {["ALL", "ACTION", "TRAINING", "CELEBRATIONS", "PRESS", "AWARDS"].map((c, i) => (
                <button key={c} className={`px-3 py-1.5 text-xs font-[Barlow_Condensed] tracking-wider rounded-md border ${i === 0 ? "bg-[#00E676] text-[#060A0F] border-[#00E676]" : "border-[#1A2E42] text-[#7A9BB5] hover:text-white"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
              {GALLERY.map((g, i) => (
                <div key={i} className="relative break-inside-avoid rounded-lg overflow-hidden border border-[#1A2E42] group cursor-pointer">
                  <img src={g.img} alt="" loading="lazy" className="w-full block group-hover:scale-105 transition-transform duration-500" style={{ height: g.h }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div>
                      <span className="text-[10px] tracking-widest font-[Barlow_Condensed] uppercase text-[#00E676]">{g.cat}</span>
                      <div className="text-sm font-[Barlow] font-semibold">Match action</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== CAREER ===== */}
          <section id="career" className="scroll-mt-20">
            <div className="pp-section-label mb-3">09 / Career Timeline</div>
            <h2 className="pp-h2 mb-10">Career History</h2>
            <div className="relative pl-6 md:pl-0">
              <div className="absolute left-2 md:left-1/2 top-0 bottom-0 w-px bg-[#1A2E42]" />
              <div className="space-y-10">
                {CAREER.map((e, i) => (
                  <div key={e.club} className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}>
                    <div className="absolute left-2 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2" style={{ background: "#0C1420", borderColor: e.accent }} />
                    <Card className="ml-8 md:ml-0" accent={e.accent}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">{e.badge}</div>
                        <div>
                          <div className="font-[Barlow_Condensed] text-xl">{e.club}</div>
                          <div className="text-xs text-[#7A9BB5] font-[JetBrains_Mono]">{e.period}</div>
                        </div>
                      </div>
                      <div className="text-sm text-[#7A9BB5] mb-3">{e.note}</div>
                      <div className="grid grid-cols-3 gap-2 text-center mb-3">
                        <Stat label="Apps" v={e.apps} />
                        <Stat label="Goals" v={e.g} />
                        <Stat label="Assists" v={e.a} />
                      </div>
                      <div className="text-xs text-[#FFD700] font-[Barlow] italic">🏆 {e.trophy}</div>
                    </Card>
                    <div className="hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
            <Card className="mt-12" accent="#FFD700">
              <div className="text-center">
                <div className="text-[11px] tracking-widest font-[Barlow_Condensed] text-[#7A9BB5] uppercase mb-2">🇮🇳 India · International Career</div>
                <div className="font-[Barlow_Condensed] text-lg">U-17 World Cup 2020 · U-19 SAFF 2021 · Senior Team: 3 caps</div>
              </div>
            </Card>
            <Card className="mt-6">
              <CardTitle>Career Statistics Summary</CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <Stat label="Matches" v={115} big />
                <Stat label="Goals" v={57} big />
                <Stat label="Assists" v={34} big />
                <Stat label="Goals/Match" v={0.5} dec={2} big />
                <Stat label="Avg Rating" v={7.6} dec={1} big />
              </div>
            </Card>
          </section>

          {/* ===== SCOUT EVALUATIONS ===== */}
          <section id="scout" className="scroll-mt-20">
            <div className="pp-section-label mb-3">10 / Scout Evaluations</div>
            <h2 className="pp-h2 mb-2">Scout Evaluation Panel</h2>
            <div className="bg-gradient-to-r from-[#00E676]/10 to-transparent border-l-4 border-[#00E676] p-4 mb-6 rounded">
              <div className="font-[JetBrains_Mono] text-sm">
                <span className="text-[#FFD700] font-bold">4.1</span> AVG SCORE · 14 Total · <span className="text-[#00E676]">11 Recommended</span> · 2 On Watchlist
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {EVALS.map((ev) => (
                  <Card key={ev.scout}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-[Barlow_Condensed] font-bold">
                          {ev.scout} {ev.verified && <span className="text-[#00E676] text-xs">✓ Verified</span>}
                        </div>
                        <div className="text-xs text-[#7A9BB5]">{ev.club} · {ev.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#FFD700] tracking-wider">{"★".repeat(Math.round(ev.rating))}<span className="text-[#1A2E42]">{"★".repeat(5 - Math.round(ev.rating))}</span></div>
                        <div className="text-xs text-[#7A9BB5] font-[JetBrains_Mono]">{ev.rating}/5</div>
                      </div>
                    </div>
                    <p className="font-[Source_Serif_4] italic text-[#EDF2F7] text-sm leading-relaxed mb-4">"{ev.text}"</p>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs mb-4">
                      <div>
                        <div className="text-[10px] tracking-widest font-[Barlow_Condensed] text-[#00E676] uppercase mb-1">Strengths</div>
                        <div className="text-[#EDF2F7]">{ev.strengths}</div>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-widest font-[Barlow_Condensed] text-[#FF3D57] uppercase mb-1">Weaknesses</div>
                        <div className="text-[#EDF2F7]">{ev.weaknesses}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#1A2E42] pt-3">
                      <span className="bg-[#00E676]/15 text-[#00E676] px-2 py-1 rounded text-[11px] font-[Barlow_Condensed] tracking-wider">✅ {ev.rec}</span>
                      <div className="flex gap-3 text-xs text-[#7A9BB5]">
                        <button className="hover:text-white">♥ 12</button>
                        <button className="hover:text-white">Reply</button>
                        <button className="hover:text-white">Report</button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Add evaluation */}
              <Card>
                <CardTitle>Submit Evaluation</CardTitle>
                <div className="space-y-3">
                  <Field label="Overall Rating">
                    <div className="flex gap-1 text-2xl text-[#1A2E42]">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} className="hover:text-[#FFD700]">★</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Recommendation">
                    <div className="flex flex-wrap gap-2">
                      {["Recommend", "Monitor", "Pass"].map((r) => (
                        <button key={r} className="px-3 py-1.5 text-xs rounded-md border border-[#1A2E42] text-[#7A9BB5] hover:text-white hover:border-[#00E676]">
                          {r}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Strengths">
                    <textarea rows={2} className="w-full bg-[#060A0F] border border-[#1A2E42] rounded-md p-2 text-sm focus:border-[#00E676] outline-none" placeholder="What stands out…" />
                  </Field>
                  <Field label="Weaknesses">
                    <textarea rows={2} className="w-full bg-[#060A0F] border border-[#1A2E42] rounded-md p-2 text-sm focus:border-[#00E676] outline-none" placeholder="Areas to improve…" />
                  </Field>
                  <button className="w-full bg-[#00E676] text-[#060A0F] font-[Barlow_Condensed] font-bold tracking-wider rounded-md py-2.5 hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] transition-shadow">
                    SUBMIT EVALUATION
                  </button>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#122030]/95 backdrop-blur border-t-2 border-[#00E676] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#C8102E] grid place-items-center font-[Bebas_Neue] shrink-0">9</div>
            <div className="min-w-0">
              <div className="font-[Barlow_Condensed] font-bold truncate">Arjun Mehta · CF</div>
              <div className="text-[11px] text-[#7A9BB5] truncate">⭐ 87 Overall · ✅ Open to Offers</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button className="hidden sm:inline-flex border border-[#1A2E42] text-[#7A9BB5] hover:text-white px-3 py-2 rounded-md text-xs font-[Barlow_Condensed] tracking-wider">💬 MESSAGE</button>
            <button className="hidden md:inline-flex border border-[#3DB8FF]/50 text-[#3DB8FF] hover:bg-[#3DB8FF]/10 px-3 py-2 rounded-md text-xs font-[Barlow_Condensed] tracking-wider">+ PIPELINE</button>
            <button className="hidden lg:inline-flex border border-[#FF8C00]/50 text-[#FF8C00] hover:bg-[#FF8C00]/10 px-3 py-2 rounded-md text-xs font-[Barlow_Condensed] tracking-wider">📁 FULL REPORT</button>
            <button className="bg-[#00E676] text-[#060A0F] font-[Barlow_Condensed] font-bold tracking-wider px-4 py-2 rounded-full text-xs hover:shadow-[0_0_20px_rgba(0,230,118,0.5)] transition-shadow">
              🤝 INITIATE CONTRACT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= helpers =============

function Card({
  children, className = "", padding = "p-5", accent,
}: {
  children: React.ReactNode; className?: string; padding?: string; accent?: string;
}) {
  return (
    <div
      className={`bg-[#0C1420] border border-[#1A2E42] rounded-xl ${padding} hover:border-[#3D5468] transition-colors ${className}`}
      style={accent ? { boxShadow: `0 0 0 1px ${accent}22, 0 4px 24px rgba(0,0,0,0.4)` } : undefined}
    >
      {children}
    </div>
  );
}

function CardTitle({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="text-[11px] font-[Barlow_Condensed] tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: accent ?? "#7A9BB5" }}>
      <span className="w-2 h-2 rounded-full" style={{ background: accent ?? "#00E676" }} />
      {children}
    </div>
  );
}

function InfoCard({ title, rows, accent }: { title: string; rows: [string, string][]; accent?: string }) {
  return (
    <div className="bg-[#0C1420] border border-[#1A2E42] rounded-xl p-5 mt-6" style={accent ? { borderColor: `${accent}66` } : undefined}>
      <CardTitle accent={accent}>{title}</CardTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-[#1A2E42]/50 pb-1.5">
            <span className="text-[#7A9BB5]">{k}</span>
            <span className="text-[#EDF2F7] font-[Barlow] font-semibold text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KvList({ items }: { items: [string, string][] }) {
  return (
    <div className="space-y-1.5 text-sm">
      {items.map(([k, v]) => (
        <div key={k} className="flex justify-between border-b border-[#1A2E42]/50 pb-1">
          <span className="text-[#7A9BB5]">{k}</span>
          <span className="font-[JetBrains_Mono] text-[#EDF2F7]">{v}</span>
        </div>
      ))}
    </div>
  );
}

function FootDial({ label, pct, stars, color }: { label: string; pct: number; stars: string; color: string }) {
  return (
    <div className="border border-[#1A2E42] rounded-lg p-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] tracking-widest font-[Barlow_Condensed] uppercase text-[#7A9BB5]">{label}</span>
        <span className="font-[Bebas_Neue] text-2xl" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#1A2E42] rounded-full overflow-hidden mb-1">
        <div className="h-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-[10px] text-[#FFD700]">{stars}</div>
    </div>
  );
}

function Stat({ label, v, dec = 0, big }: { label: string; v: number; dec?: number; big?: boolean }) {
  return (
    <div className="bg-[#060A0F] border border-[#1A2E42] rounded-lg py-3">
      <div className={`font-[Bebas_Neue] text-[#00E676] leading-none ${big ? "text-3xl" : "text-2xl"}`}>
        <CountUp end={v} decimals={dec} />
      </div>
      <div className="text-[10px] tracking-widest font-[Barlow_Condensed] text-[#7A9BB5] uppercase mt-1">{label}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] tracking-widest font-[Barlow_Condensed] uppercase text-[#7A9BB5] mb-1.5">{label}</div>
      {children}
    </div>
  );
}

// ============= mini charts =============

function ChartGA({ matches }: { matches: typeof MATCHES }) {
  const data = [...matches].reverse();
  const W = 260, H = 120, pad = 10;
  const max = 3;
  const x = (i: number) => pad + (i * (W - pad * 2)) / (data.length - 1);
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const path = (key: "g" | "a") => data.map((m, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(m[key])}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <path d={`${path("g")} L ${x(data.length - 1)} ${H - pad} L ${pad} ${H - pad} Z`} fill="rgba(0,230,118,0.15)" />
      <path d={path("g")} stroke="#00E676" strokeWidth={2} fill="none" />
      <path d={path("a")} stroke="#3DB8FF" strokeWidth={2} fill="none" strokeDasharray="4 3" />
      {data.map((m, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(m.g)} r={2.5} fill="#00E676" />
          <circle cx={x(i)} cy={y(m.a)} r={2.5} fill="#3DB8FF" />
        </g>
      ))}
    </svg>
  );
}

function ChartRating({ matches }: { matches: typeof MATCHES }) {
  const data = [...matches].reverse();
  const W = 260, H = 120, pad = 10;
  const bw = (W - pad * 2) / data.length - 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={pad} x2={W - pad} y1={H - pad - (7.8 / 10) * (H - pad * 2)} y2={H - pad - (7.8 / 10) * (H - pad * 2)} stroke="#7A9BB5" strokeDasharray="3 3" />
      {data.map((m, i) => {
        const h = (m.r / 10) * (H - pad * 2);
        const c = m.r >= 8 ? "#00E676" : m.r >= 6.5 ? "#FFD700" : "#FF3D57";
        return <rect key={i} x={pad + i * (bw + 4)} y={H - pad - h} width={bw} height={h} fill={c} rx={2} />;
      })}
    </svg>
  );
}

function ChartXG({ matches }: { matches: typeof MATCHES }) {
  // fake xG values: actual goals minus small noise
  const data = [...matches].reverse().map((m) => ({ ...m, xg: Math.max(0, m.g - 0.3 + (m.n % 3) * 0.2) }));
  const W = 260, H = 120, pad = 10;
  const max = 3.2;
  const bw = (W - pad * 2) / data.length / 2 - 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {data.map((m, i) => {
        const baseX = pad + i * ((W - pad * 2) / data.length);
        const hG = (m.g / max) * (H - pad * 2);
        const hX = (m.xg / max) * (H - pad * 2);
        return (
          <g key={i}>
            <rect x={baseX} y={H - pad - hX} width={bw} height={hX} fill="#00E676" opacity={0.35} rx={1} />
            <rect x={baseX + bw + 1} y={H - pad - hG} width={bw} height={hG} fill="#00E676" rx={1} />
          </g>
        );
      })}
    </svg>
  );
}
