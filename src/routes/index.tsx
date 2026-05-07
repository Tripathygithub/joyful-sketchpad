import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

type Card = { name: string; role: string; roleColor: string; views: string; img: string };

const cards: Card[] = [
  { name: "Liam Silva", role: "STRIKER", roleColor: "text-primary-fixed-dim bg-primary-fixed-dim/10", views: "24.5K", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTRF8elXKjCEIUHugViB1T3p0DkJvxtwqWUlqyl-aK479BWGzeOKr4S8tBULe3chkpE0ZHcDiaazgpNZmElarh-LRDYykxyYHjEehRfPk4vsoBcvXv2lhBtiFKMWriz0cBTWUgOVeKxhOu6jJAREMpe0ZM58VqXgTOwLFW6XEKN2GFW3DhEzdWNOrc7xlvv0qyj2Mz2ia4pQkbYhB5hqy5pJFiCPdnv8mcEbIBU661MS_5o8z3E-IC_b0KXDUd8uwz-102aYidyro9" },
  { name: "Marcus Reed", role: "POINT GUARD", roleColor: "text-accent-purple bg-accent-purple/10", views: "18.2K", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5Tc8MVaJud2PaZe8S-vfq4ovEHJFerL2ny-_DLPdyKc8cXkObcN8vqXtKFK51V0Zzn96BeG3ue_cZW4iY4ArdsKlAYVLql8bgwDl8kYCQ0007bqUdi0gUlFqyE12cbIl8aD7GF7SKqoQqUMyTCmulqZsPfRGTWyvLH9e8SVhDyL0NtykxpsxXbJEr5HmjHowM3SX349EIhIyFAAofAbdV7bVPoagvDkKKNkAIsNVyUoLfEFneZazkhNIzo6PdikPrYNhGClfgCvta" },
  { name: "Elena Rostova", role: "MIDFIELDER", roleColor: "text-accent-orange bg-accent-orange/10", views: "42.1K", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB41-UMcT-jMy14iTLt2S_y_AQR-kuxplVvYRXDd5NzxVH_Qw5pvDZGOd7h7EYByLzwnFdEY1yU7KGE331e-H7IwNDElVXGui3sN5UQecsQ_BcDucNTcaxxxvk-30-2SI1Dd5P2NHuee-Da4kzk1FQ5sx6GwX8WWtWfyCrFTPaAsK_kz8XaTwK_VUbxtnY-ps4RxOi2tVXyq1frNpe3wiA5Q27e6ATnLB2suJkaPNqgeLoT6dviMUxwZ2My-EUjqn2HsybwuJzAhupc" },
  { name: "David Chen", role: "DEFENDER", roleColor: "text-secondary-fixed-dim bg-secondary-fixed-dim/10", views: "12.8K", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwsgBs6OpU4zLmWcXhl7yHZTDCHLdZ_tCI13E2WG6A1629k4sEh2Y-46oVGpYPOfeSauXEUDbgXb3R77P5UXViuEgj6T_WBP0xn3DqP0TNeuadggT4tALNxnwEZ6QpqFo25t7IZ9C_jf7I7pw_BUq7WADl5mVaGDh_MyKqbOA82mwWHDoWJPDo-4l2r3p6bRoPl5DDuzNTEI37w9gR13pXD80_QQmnP8tgNUveDg2vTftGX8yvHzWPRKpQz65a35jiszxqCIKo2D3O" },
  { name: "Samira Cole", role: "GOALKEEPER", roleColor: "text-accent-gold bg-accent-gold/10", views: "8.9K", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBzEIPijZ_69KoF4p0Km7PV1SI2L847C2ioaepSvUC8p5Dq2RKRZsrSgE_rhkhNS6Av93i2m9i16xMwsHpeRr_jT2W74feFY1JPdPJJoAN9J0evzgjV8K_4ub9cPM98Kzceqe5z0wYJ66Bae8mHa6Bqfb5fxphuOlk_hrjqaT-Fn4CwcgFDjWsx1o23PA6FarptOem8INz22dCmFvfayOkM3Nz6w2pZ6Queij9gLFhNlauj2DdjNuhJkO4Rze7dUJtGJzVlGzj25wA" },
];

const aiFeatures = [
  { icon: "psychology", title: "AI Scoring", desc: "Predictive performance metrics based on historical data.", color: "text-primary-container" },
  { icon: "handshake", title: "Matchmaking", desc: "Automated scout-to-talent pairing using advanced algorithms.", color: "text-secondary-fixed-dim" },
  { icon: "movie_filter", title: "Highlight Reels", desc: "Auto-generated clips of key moments from full match videos.", color: "text-accent-purple" },
  { icon: "analytics", title: "Analytics", desc: "Deep dive into physical and tactical data points.", color: "text-accent-orange" },
  { icon: "local_fire_department", title: "Heatmaps", desc: "Visual representation of player positioning and movement.", color: "text-error" },
  { icon: "contract", title: "Smart Contracts", desc: "Blockchain-verified agreements for secure, instant transfers.", color: "text-primary-dark" },
];

function Index() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Video Feed Preview */}
      <section className="py-section-padding px-gutter-mobile md:px-gutter-desktop overflow-hidden border-b border-border-subtle">
        <div className="max-w-container-max mx-auto mb-12">
          <h2 className="font-display-hero text-display-hero text-primary-container mb-4">TALENT IN ACTION</h2>
          <p className="font-sub-heading text-sub-heading text-on-surface-variant max-w-2xl">
            Watch, discover, and shortlist — right from the feed.
          </p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar pl-gutter-mobile md:pl-0 mx-auto max-w-container-max">
          {cards.map((c) => (
            <div key={c.name} className="min-w-[240px] w-[240px] h-[400px] rounded-xl overflow-hidden relative snap-center group flex-shrink-0 border border-outline-variant/30 hover:border-primary-container transition-colors duration-300">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-primary-container/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-4xl">play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="font-sub-heading text-lg text-text-primary font-bold">{c.name}</h3>
                    <span className={`font-ui-label text-ui-label px-2 py-1 rounded ${c.roleColor}`}>{c.role}</span>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary-container transition-colors" aria-label="Bookmark">
                    <span className="material-symbols-outlined">bookmark</span>
                  </button>
                </div>
                <div className="flex items-center text-on-surface-variant font-ui-label text-ui-label">
                  <span className="material-symbols-outlined text-[14px] mr-1">visibility</span>
                  {c.views}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Features */}
      <section className="py-section-padding px-gutter-mobile md:px-gutter-desktop relative overflow-hidden bg-surface">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-container-max mx-auto relative z-10">
          <h2 className="font-display-hero text-display-hero text-text-primary mb-16 text-center md:text-left">
            POWERED BY AI. BUILT FOR PROFESSIONALS.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-desktop items-center">
            <div className="space-y-6">
              {aiFeatures.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/30">
                  <div className={`p-3 rounded-lg bg-surface-container-highest shrink-0 ${f.color}`}>
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-sub-heading text-lg text-text-primary mb-1">{f.title}</h3>
                    <p className="font-body-main text-body-main text-text-secondary">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mockup Dashboard */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-md bg-bg-elevated rounded-2xl p-8 border border-border-subtle shadow-[0_0_30px_rgba(11,245,164,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-container shadow-[0_0_10px_#0bf5a4] z-20" />
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <img className="w-16 h-16 rounded-full border-2 border-primary-container object-cover" alt="J. Doe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtEwM7BEycSwVZ5azL747iC7UqAgN0G0OdwxFm0MfmMyeP6q6RKUn46kRRwzUTVs27L9r5Wv3lSbvJ5fm5l7gMWrg_ZtriP7QJuYYjlX-LkZyurSsbDoScZNJeJkD07lorYWfPOwStAjmXXzuNhYuEZ66GYzDnDYIaVvBwiZhN9H78aM9L1ZvBuEwKndg9VhrvIB88AEZVYe2Rb2pPMJrB6XG4dRxs30SgMCG5JjfrllwGLqed24J--EJX7VPy7tZ4KaD4w9gZUVon" />
                    <div>
                      <h4 className="font-sub-heading text-xl text-text-primary">J. Doe Profile</h4>
                      <span className="font-ui-label text-ui-label text-text-secondary">Scouting Report</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary-container">verified</span>
                </div>
                <div className="text-center mb-8 relative">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-surface-container-high relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="64" cy="64" fill="none" r="60" stroke="#232c26" strokeWidth="8" />
                      <circle className="opacity-80" cx="64" cy="64" fill="none" r="60" stroke="#0bf5a4" strokeDasharray="377" strokeDashoffset="22" strokeWidth="8" />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span className="font-stat-number text-stat-number text-text-primary">94%</span>
                      <span className="font-ui-label text-ui-label text-primary-container">MATCH SCORE</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Pace", color: "bg-primary-container", w: "90%" },
                    { label: "Shooting", color: "bg-accent-purple", w: "85%" },
                    { label: "Passing", color: "bg-secondary-fixed-dim", w: "78%" },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between items-center text-sm">
                      <span className="font-body-main text-text-secondary">{s.label}</span>
                      <div className="w-48 h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full ${s.color}`} style={{ width: s.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tripartite */}
      <section className="py-section-padding px-gutter-mobile md:px-gutter-desktop bg-surface-container border-t border-border-subtle">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display-hero text-display-hero text-text-primary mb-4">SIGN. PAY. TRACK. — ALL ON-PLATFORM.</h2>
            <p className="font-sub-heading text-sub-heading text-text-secondary max-w-2xl mx-auto">
              Seamless tripartite agreements protecting everyone's interests.
            </p>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto mb-20 gap-8 md:gap-0">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-border-subtle -translate-y-1/2 z-0" />
            <div className="relative z-10 flex flex-col items-center bg-bg-surface p-6 rounded-2xl border border-outline-variant/50 w-48 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mb-4 border border-primary-container/30">
                <span className="material-symbols-outlined text-primary-container text-3xl">sports_soccer</span>
              </div>
              <span className="font-ui-label text-ui-label text-text-primary tracking-widest uppercase">Talent</span>
            </div>
            <span className="material-symbols-outlined text-border-subtle md:hidden rotate-90">arrow_forward</span>
            <div className="relative z-10 flex flex-col items-center bg-bg-elevated p-6 rounded-2xl border border-primary-container w-48 shadow-[0_0_20px_rgba(11,245,164,0.15)]">
              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-primary-container text-3xl">travel_explore</span>
              </div>
              <span className="font-ui-label text-ui-label text-primary-container tracking-widest uppercase">Scout</span>
            </div>
            <span className="material-symbols-outlined text-border-subtle md:hidden rotate-90">arrow_forward</span>
            <div className="relative z-10 flex flex-col items-center bg-bg-surface p-6 rounded-2xl border border-outline-variant/50 w-48 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mb-4 border border-accent-gold/30">
                <span className="material-symbols-outlined text-accent-gold text-3xl">stadium</span>
              </div>
              <span className="font-ui-label text-ui-label text-text-primary tracking-widest uppercase">Club</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-surface-container-highest p-8 rounded-2xl border border-border-subtle hover:border-primary-container/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-primary-container text-2xl">lock</span>
                <h3 className="font-sub-heading text-xl text-text-primary">Secure Escrow</h3>
              </div>
              <p className="font-body-main text-text-secondary mb-6">
                Funds are held safely until all parties fulfill contractual obligations, ensuring trust and transparency.
              </p>
              <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-primary-container w-full" />
              </div>
            </div>
            <div className="bg-surface-container-highest p-8 rounded-2xl border border-border-subtle hover:border-accent-purple/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-accent-purple text-2xl">pie_chart</span>
                <h3 className="font-sub-heading text-xl text-text-primary">Revenue Split</h3>
              </div>
              <p className="font-body-main text-text-secondary mb-6">
                Automated disbursements based on pre-agreed terms directly to connected wallets or accounts.
              </p>
              <div className="flex items-center gap-2 font-ui-label text-ui-label">
                <div className="flex flex-col flex-1">
                  <div className="h-2 w-full bg-primary-container rounded-l-full mb-1" />
                  <span className="text-primary-container">10% SCOUT</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="h-2 w-full bg-accent-purple mb-1" />
                  <span className="text-accent-purple">15% PLATFORM</span>
                </div>
                <div className="flex flex-col flex-[3]">
                  <div className="h-2 w-full bg-accent-gold rounded-r-full mb-1" />
                  <span className="text-accent-gold">75% TALENT/CLUB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
