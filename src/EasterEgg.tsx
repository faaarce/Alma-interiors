import { useEffect, useMemo, useState } from "react";
import photo from "./assets/alma-faris.jpg";

/* ------------------------------------------------------------------ *
 *  Alma Interior — easter egg
 *  Two triggers, both deliberate, neither reachable by accident:
 *    1. the hidden route  /kiby
 *    2. typing "kiby" anywhere on the site (ignored while typing in a field)
 * ------------------------------------------------------------------ */

const PETAL_TINTS = ["#F7C9D8", "#EDA3BE", "#E07FA6", "#FBE1EA"];
const SECRET = "kiby";

/* ---------------------------- petals ------------------------------ */

function Petals({ count = 26 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 7 + Math.random() * 6,
        size: 9 + Math.random() * 13,
        drift: (Math.random() - 0.5) * 180,
        spin: Math.random() * 720 - 360,
        tint: PETAL_TINTS[i % PETAL_TINTS.length] as string,
      })),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <style>{`
        @keyframes petal-fall {
          0%   { transform: translate3d(0, -12vh, 0) rotate(0deg); opacity: 0; }
          8%   { opacity: 1; }
          100% { transform: translate3d(var(--drift), 108vh, 0) rotate(var(--spin)); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .petal { animation: none !important; opacity: .35; }
        }
      `}</style>

      {petals.map((p) => (
        <span
          key={p.id}
          className="petal absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.72,
            background: p.tint,
            borderRadius: "100% 0 100% 0",
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
            ["--spin" as string]: `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------- the secret page ------------------------ */

const SPEC: Array<[string, string]> = [
  ["Item", "Alma Artistika"],
  ["Colour", "Pink. Always has been"],
  ["Size", "Exactly right. Change nothing"],
  ["Care", "Daily messages. Call first. Without being asked"],
  ["Warranty", "Lifetime, no conditions"],
];

export function SecretPage() {
  return (
    <main className="relative min-h-screen bg-[#FBF8F5] px-6 py-16 text-[#2B2724] antialiased">
      {/* drafting-paper grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(#E6DFD8 1px, transparent 1px), linear-gradient(90deg, #E6DFD8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Petals />

      <div className="relative mx-auto max-w-xl">
        <header className="flex items-baseline justify-between border-b border-[#2B2724] pb-3">
          <span className="text-sm tracking-wide">Alma Interior</span>
          <span className="text-sm text-[#E07FA6]">Spec 001</span>
        </header>

        <figure className="mt-10">
          <img
            src={photo}
            alt="Alma dan Faris"
            width={900}
            height={1190}
            className="w-full rounded-sm border border-[#E6DFD8] object-cover"
          />
          <figcaption className="mt-3 text-sm text-[#8A817A]">
            Reference photo. Not getting replaced.
          </figcaption>
        </figure>

        <p className="mt-12 font-serif text-3xl leading-[1.35] text-balance">
          I built this site for you.
          <br />
          Every other page is for showing people. This one isn't.
        </p>

        <dl className="mt-12 border-t border-[#E6DFD8]">
          {SPEC.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[7rem_1fr] gap-4 border-b border-[#E6DFD8] py-3 text-sm"
            >
              <dt className="text-[#8A817A]">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-12 font-serif text-xl leading-relaxed">
          The other pages I just wrote. This one took the longest, because this
          one had to be honest. It's not in the menu and nothing links to it.
          You're the only one who knows the address, and that's exactly how I
          wanted it.
        </p>

        <div className="mt-12 space-y-5 border-t border-[#E6DFD8] pt-10 font-serif text-lg leading-relaxed">
          <p>Alma, I'm sorry.</p>
          <p>
            I haven't been the person you wanted me to be. You told me more than
            once, and I was slow to get it.
          </p>
          <p>
            I'm not going to make big promises anymore. But when things are okay
            again, I want to make up for all of it not with words, but with the
            small things you used to ask for and I never gave. I'm sorry for
            making you wait this long.
          </p>
          <p>
            And thank you. For the laughs you shared, for turning ordinary days
            into something else. I remember all of it even the parts you thought
            I wasn't paying attention to.
          </p>
        </div>

        <p className="mt-10 font-serif text-2xl leading-[1.4] text-balance">
          just remember, i always love u no matter what happened.
        </p>

        <div className="mt-10 flex items-baseline justify-between border-t border-[#E6DFD8] pt-4 text-sm text-[#8A817A]">
          <span>Say hi to Kiko and Taby for me.</span>
          <span className="text-[#E07FA6]">— F</span>
        </div>
      </div>
    </main>
  );
}

/* --------------------- type "kiby" anywhere ----------------------- */

export function KeyboardEgg() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let buffer = "";

    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
      if (e.key.length !== 1) return;

      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer === SECRET) setOpen(true);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2724]/40 px-6">
      <Petals count={34} />
      <div className="relative max-w-sm rounded-sm bg-[#FBF8F5] px-8 py-10 text-center text-[#2B2724] shadow-xl">
        <p className="font-serif text-2xl leading-snug">Found it.</p>
        <p className="mt-4 text-base leading-relaxed text-[#6B635C]">
          I hid this on purpose so you'd be the one to find it.
        </p>
        <p className="mt-4 font-serif text-lg leading-relaxed">
          just remember, i always love u no matter what happened.
        </p>
        <p className="mt-4 text-sm text-[#E07FA6]">— F</p>
        <button
          onClick={() => setOpen(false)}
          className="mt-8 border-b border-[#E07FA6] pb-0.5 text-sm text-[#E07FA6] focus:outline-2 focus:outline-offset-4 focus:outline-[#E07FA6]"
        >
          Close
        </button>
      </div>
    </div>
  );
}