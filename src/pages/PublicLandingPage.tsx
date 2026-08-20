import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, MapPin, Phone, Mail, X } from "lucide-react";

const INK = "#241F1B";
const CREAM = "#FBF7EF";
const SAGE = "#5F7355";
const SAGE_DEEP = "#3C4A36";
const HONEY = "#C0824A";

type UseCase = {
  key: string;
  label: string;
  headline: string;
  body: string;
  points: string[];
  photo: string;
  alt: string;
};

const USE_CASES: UseCase[] = [
  {
    key: "food",
    label: "Restaurant or bar",
    headline: "A dining room that already has a ceiling worth looking at",
    body:
      "The floor is one long open run, so seating, bar and back-of-house can go wherever the concept wants them. Additional plumbing is already in the building and there are two restrooms.",
    points: [
      "Additional plumbing in place",
      "Men's and women's restrooms already built out",
      "Sprinkled building",
      "Basement for dry storage and kegs, no rent charged on it",
    ],
    photo: "/main-floor.webp",
    alt: "Open main floor with pressed-tin ceiling and hanging fixtures",
  },
  {
    key: "retail",
    label: "Shop or showroom",
    headline: "Twenty-four feet of glass facing the sidewalk",
    body:
      "The front is nearly all window under a deep awning, which means daylight inside and a display line that reads from a moving car. Fixtures can float in the middle of the room instead of hugging the walls.",
    points: [
      "Full-width storefront glass with low bulkhead",
      "Deep awning for shade and signage",
      "Wide open sales floor, few fixed walls",
      "Street parking directly in front",
    ],
    photo: "/front-windows.webp",
    alt: "Front of the space looking out through the storefront windows",
  },
  {
    key: "studio",
    label: "Studio or gallery",
    headline: "Tall ceilings, hard floors, and nothing in the middle",
    body:
      "Heart-pine floors, tall ceilings and a mezzanine rail make this an easy fit for a yoga or dance studio, a photo studio, a gallery, or an event room. Track lighting is already run along both sides.",
    points: [
      "Tall ceiling with pressed-tin detail",
      "Existing track lighting on both walls",
      "Mezzanine overlook at the rear",
      "Hard wood floor throughout",
    ],
    photo: "/open-room.webp",
    alt: "Long open room with track lighting and mezzanine rail",
  },
  {
    key: "office",
    label: "Office or workshop",
    headline: "Character your team will actually want to come downtown for",
    body:
      "Reclaimed wood walls, a sink and cabinet run for a break area, and enough square footage for a studio-style office with room to spare. Build a couple of private rooms and leave the rest open.",
    points: [
      "Existing kitchenette with sink and cabinets",
      "Reclaimed wood partition walls in place",
      "Men's and women's restrooms already built out",
      "4,000 SF plus a full basement",
    ],
    photo: "/kitchenette.webp",
    alt: "Kitchenette counter and cabinets along the side wall",
  },
];

const LEDGER: [string, React.ReactNode][] = [
  ["Address", "310 S Campbell Ave, Springfield, MO 65806"],
  ["Space available", "4,000 SF on the ground floor"],
  ["Rent", "$13.00 / SF / year — about $4,333 per month"],
  ["Lease type", "Modified gross"],
  ["Term", "2–5 years, negotiable"],
  ["Available", "Now"],
  ["Basement", "Large, included for storage — no rent charged on it"],
  ["Restrooms", "Two — men's and women's, behind the reclaimed wood wall"],
  ["Fire protection", "Sprinkled"],
  ["Plumbing", "Additional plumbing beyond the restrooms"],
  ["Building", "Built 1884, updated in the early 2000s · storefront retail / office · zoned INC"],
  ["Who pays what", "Tenant covers interior maintenance and repairs; landlord covers building insurance and real estate taxes"],
  [
    "Next door",
    <a key="next-door" href="https://www.314scampbell.com" className="underline">
      314 S Campbell — 2,150 SF also available
    </a>,
  ],
];

const GALLERY = [
  { src: "/long-view.webp", alt: "Long view down the main floor toward the front", caption: "Looking down the length of the floor" },
  { src: "/wood-wall.webp", alt: "Reclaimed wood partition wall with doorways to the restrooms", caption: "Reclaimed wood partition — men's and women's restrooms behind it" },
  { src: "/main-floor.webp", alt: "Main floor with columns and pressed-tin ceiling", caption: "Pressed tin overhead, heart pine underfoot" },
  { src: "/front-windows.webp", alt: "Front windows and window seating ledges", caption: "The window line, from inside" },
  { src: "/kitchenette.webp", alt: "Sink and cabinet run", caption: "Sink and cabinets, ready for a break area" },
  { src: "/storefront.webp", alt: "The storefront from across S Campbell Ave", caption: "The storefront from across the street" },
];

function Rule({ color = "#E2DACB" }: { color?: string }) {
  return <div className="h-px w-full" style={{ background: color }} />;
}


function Lightbox({
  index,
  onClose,
  onChange,
}: {
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const count = GALLERY.length;

  const go = useCallback(
    (delta: number) => onChange((index + delta + count) % count),
    [index, count, onChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  const shot = GALLERY[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(26,22,19,0.94)" }}
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        if (start === null) return;
        const dx = e.changedTouches[0].clientX - start;
        if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6" style={{ color: CREAM }}>
        <span className="text-[13px]" style={{ fontFamily: "'DM Mono', monospace" }}>
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
          className="flex size-10 items-center justify-center rounded-[3px]"
          style={{ border: "1px solid rgba(251,247,239,0.28)" }}
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-3 pb-2 sm:px-16">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label="Previous photo"
          className="absolute left-2 z-10 flex size-11 items-center justify-center rounded-full sm:left-5"
          style={{ background: "rgba(251,247,239,0.14)", color: CREAM }}
        >
          <ChevronLeft className="size-6" />
        </button>

        <img
          src={shot.src}
          alt={shot.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-[3px] object-contain"
          style={{ maxHeight: "calc(100vh - 170px)" }}
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label="Next photo"
          className="absolute right-2 z-10 flex size-11 items-center justify-center rounded-full sm:right-5"
          style={{ background: "rgba(251,247,239,0.14)", color: CREAM }}
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      <div className="px-5 pb-6 pt-3 text-center sm:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="mx-auto max-w-[60ch] text-[14.5px] leading-relaxed" style={{ color: "#E6DFD3" }}>
          {shot.caption}
        </p>
        <p className="mt-1 hidden text-[12.5px] sm:block" style={{ color: "#9A9086" }}>
          310 S Campbell Ave · use the arrows, the arrow keys, or swipe
        </p>
      </div>
    </div>
  );
}

export function PublicLandingPage() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const uc = USE_CASES[active];

  return (
    <div
      className="flex-1"
      style={{ background: CREAM, color: INK, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* ---------- HERO: collage ---------- */}
      <header className="mx-auto w-full max-w-[1180px] px-5 pt-6 pb-3 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
            className="text-[19px] sm:text-[21px]"
          >
            310 S Campbell Ave
          </div>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: SAGE_DEEP }}>
            <MapPin className="size-4" />
            Downtown Springfield, Missouri
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="overflow-hidden rounded-[3px]" style={{ border: "1px solid #E2DACB" }}>
            <img
              src="/storefront.webp"
              alt="The green-awning storefront at 310 S Campbell Ave"
              className="block h-[240px] w-full object-cover sm:h-[340px] lg:h-[460px]"
            />
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div>
              <h1
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 0.98,
                }}
                className="text-[38px] sm:text-[52px] lg:text-[56px]"
              >
                4,000 square feet
                <br />
                <span style={{ color: SAGE }}>of downtown,</span>
                <br />
                open and waiting.
              </h1>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed sm:text-[16px]" style={{ color: "#4A423B" }}>
                An 1884 storefront with pressed-tin ceilings, heart-pine floors and a
                full wall of glass on the sidewalk, updated in the early 2000s. One open
                floor, almost no walls in the way, and a basement thrown in for storage.
              </p>
            </div>

            <div className="grid grid-cols-2 overflow-hidden rounded-[3px]" style={{ border: "1px solid #E2DACB" }}>
              <img src="/main-floor.webp" alt="Main floor interior" className="block h-[110px] w-full object-cover sm:h-[150px]" />
              <img src="/open-room.webp" alt="Open room with track lighting" className="block h-[110px] w-full object-cover sm:h-[150px]" />
            </div>
          </div>
        </div>

        {/* fact strip */}
        <div
          className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] sm:grid-cols-4"
          style={{ background: "#E2DACB", border: "1px solid #E2DACB" }}
        >
          {[
            ["4,000 SF", "ground floor, open plan"],
            ["$13 / SF / yr", "≈ $4,333 per month"],
            ["Modified gross", "2–5 year term"],
            ["Available now", "basement included"],
          ].map(([big, small]) => (
            <div key={big} className="px-4 py-4" style={{ background: CREAM }}>
              <div
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, letterSpacing: "-0.02em" }}
                className="text-[19px] sm:text-[21px]"
              >
                {big}
              </div>
              <div className="mt-0.5 text-[12.5px]" style={{ color: "#6B6058" }}>
                {small}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="#tour"
            className="inline-flex items-center gap-2 rounded-[3px] px-5 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: SAGE_DEEP }}
          >
            Schedule a walkthrough
            <ArrowUpRight className="size-4" />
          </a>
          <a
            href="#particulars"
            className="inline-flex items-center gap-2 rounded-[3px] px-5 py-3 text-[15px] font-semibold"
            style={{ border: `1px solid ${SAGE_DEEP}`, color: SAGE_DEEP }}
          >
            See the particulars
          </a>
        </div>
      </section>

      {/* ---------- USE CASE SWITCHER (signature) ---------- */}
      <section className="mx-auto mt-16 w-full max-w-[1180px] px-5 sm:mt-24 sm:px-8">
        <h2
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}
          className="text-[28px] sm:text-[36px]"
        >
          What would you put in it?
        </h2>
        <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: "#4A423B" }}>
          The room is deliberately unfinished in the middle, which is what makes it
          flexible. Pick the closest thing to your business and see what is already
          here for you.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {USE_CASES.map((u, i) => (
            <button
              key={u.key}
              onClick={() => setActive(i)}
              className="rounded-[3px] px-4 py-2 text-[14px] font-semibold transition-colors"
              style={
                i === active
                  ? { background: SAGE_DEEP, color: "#fff", border: `1px solid ${SAGE_DEEP}` }
                  : { background: "transparent", color: SAGE_DEEP, border: "1px solid #D9D0BF" }
              }
            >
              {u.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[3px]" style={{ border: "1px solid #E2DACB" }}>
            <img src={uc.photo} alt={uc.alt} loading="lazy" className="block h-[240px] w-full object-cover sm:h-[360px]" />
          </div>
          <div>
            <h3
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, letterSpacing: "-0.025em" }}
              className="text-[23px] leading-tight sm:text-[28px]"
            >
              {uc.headline}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "#4A423B" }}>
              {uc.body}
            </p>
            <ul className="mt-5 space-y-0">
              {uc.points.map((p) => (
                <li key={p} className="flex gap-4 py-2.5 text-[14.5px]" style={{ borderTop: "1px solid #E7DFD1" }}>
                  <span style={{ color: HONEY, fontFamily: "'DM Mono', monospace" }}>—</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- GALLERY ---------- */}
      <section className="mt-16 sm:mt-24" style={{ background: "#F3EEE3" }}>
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-20">
          <h2
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}
            className="text-[28px] sm:text-[36px]"
          >
            The room, honestly
          </h2>
          <p className="mt-2 max-w-[60ch] text-[15px]" style={{ color: "#4A423B" }}>
            Photographed empty and unstaged. What you see is what you would be
            signing for.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((g, i) => (
              <figure key={g.src} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  aria-label={`Open larger photo: ${g.caption}`}
                  className="group relative block w-full overflow-hidden rounded-[3px]"
                  style={{ border: "1px solid #E2DACB", aspectRatio: "4 / 3" }}
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-[3px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ background: "rgba(36,31,27,0.72)", color: CREAM }}
                  >
                    <Expand className="size-4" />
                  </span>
                </button>
                <figcaption className="mt-2.5 text-[13px] leading-snug sm:min-h-[2.6em]" style={{ color: "#6B6058" }}>
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- LEDGER ---------- */}
      <section id="particulars" className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}
              className="text-[28px] sm:text-[36px]"
            >
              The particulars
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "#4A423B" }}>
              Straight from the listing, no rounding. If a number matters to your
              plan, ask and we will put it in writing.
            </p>
            <div className="mt-6 rounded-[3px] p-5" style={{ background: "#F3EEE3", border: "1px solid #E2DACB" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", color: SAGE_DEEP }} className="text-[12.5px]">
                RENT MATH
              </div>
              <div className="mt-2 space-y-1.5 text-[14px]" style={{ fontFamily: "'DM Mono', monospace" }}>
                <div className="flex justify-between gap-4">
                  <span>4,000 SF × $13.00</span>
                  <span>$52,000 / yr</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>÷ 12 months</span>
                  <span>$4,333 / mo</span>
                </div>
                <div className="flex justify-between gap-4" style={{ color: SAGE }}>
                  <span>basement storage</span>
                  <span>$0</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            {LEDGER.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[190px_1fr] sm:gap-6" style={{ borderTop: "1px solid #E2DACB" }}>
                <div className="text-[12.5px] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "#6B6058", letterSpacing: "0.04em" }}>
                  {k}
                </div>
                <div className="text-[15px]">{v}</div>
              </div>
            ))}
            <Rule />
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section id="tour" style={{ background: SAGE_DEEP, color: "#FBF7EF" }}>
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <h2
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.03 }}
                className="text-[30px] sm:text-[42px]"
              >
                Walk the floor before
                <br />
                someone else does.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed" style={{ color: "#DCE3D6" }}>
                Ten minutes inside tells you more than any listing photo. Call or
                email to set a time — evenings and weekends are fine.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="tel:+14178481842"
                  className="inline-flex items-center gap-2 rounded-[3px] px-5 py-3 text-[15px] font-semibold"
                  style={{ background: CREAM, color: SAGE_DEEP }}
                >
                  <Phone className="size-4" />
                  417-848-1842
                </a>
                <a
                  href="mailto:todd@chambersrealestate.com?subject=310%20S%20Campbell%20Ave%20%E2%80%94%20walkthrough%20request&body=Hi%20Todd%2C%0A%0AI%27d%20like%20to%20see%20the%20space%20at%20310%20S%20Campbell.%20A%20little%20about%20my%20business%3A%0A%0A"
                  className="inline-flex items-center gap-2 rounded-[3px] px-5 py-3 text-[15px] font-semibold"
                  style={{ border: "1px solid #8C9C84", color: CREAM }}
                >
                  <Mail className="size-4" />
                  Email Todd
                </a>
              </div>
            </div>

            <div className="rounded-[3px] p-5" style={{ background: "#46543F", border: "1px solid #6E7F66" }}>
              <div className="flex items-center gap-4">
                <img src="/broker.webp" alt="Todd Chambers" className="size-16 rounded-[3px] object-cover" loading="lazy" />
                <div>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }} className="text-[17px]">
                    Todd Chambers, CCIM
                  </div>
                  <div className="text-[13.5px]" style={{ color: "#DCE3D6" }}>
                    Chambers Real Estate Services, LLC
                  </div>
                  <a
                    href="mailto:todd@chambersrealestate.com"
                    className="text-[13px] underline underline-offset-2"
                    style={{ color: "#C9D6C1" }}
                  >
                    todd@chambersrealestate.com
                  </a>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed" style={{ color: "#DCE3D6" }}>
                Listing contact for the space. Ask about term length, tenant
                improvements, and what the landlord will consider for a build-out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <Lightbox
          index={lightbox}
          onClose={() => setLightbox(null)}
          onChange={(i) => setLightbox(i)}
        />
      )}

      <footer className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-2 text-[12.5px]" style={{ color: "#6B6058" }}>
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <div>310 S Campbell Ave, Springfield, MO 65806 · 4,000 SF retail / office for lease</div>
            <div>
              Next door:{" "}
              <a href="https://www.314scampbell.com" className="underline">
                314 S Campbell — 2,150 SF also for lease
              </a>
            </div>
          </div>
          <div>All information deemed reliable but not guaranteed. Tenant to verify.</div>
        </div>
      </footer>
    </div>
  );
}
