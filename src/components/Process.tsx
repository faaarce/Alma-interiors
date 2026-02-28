import { useEffect, useRef, useCallback } from "react";

/* ───────── Types ───────── */
interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface ProcessProps {
  sectionLabel?: string;
  heading?: string;
  steps?: ProcessStep[];
}

/* ───────── Defaults ───────── */
const defaultSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Konsultasi",
    description:
      "Cukup kirimkan ukuran dan foto ruanganmu, nanti kami buatkan perkiraan budget dan mood board desainnya. Yuk, mulai wujudkan ruang impianmu.",
  },
  {
    number: "02",
    title: "Visit",
    description:
      "Kami akan datang langsung ke lokasi untuk survey dan berdiskusi santai mengenai konsep hunian yang ingin Anda wujudkan.",
  },
  {
    number: "03",
    title: "Design 3D Rendering",
    description:
      "7 hari setelah survey, Anda akan menerima rancangan desain lengkap dengan RAB yang telah disesuaikan dengan detail desain tersebut.",
  },
  {
    number: "04",
    title: "Revisi Design",
    description:
      "Diperlukan DP sebesar 30%. Kami memberikan fleksibilitas hingga 3 kali revisi untuk memastikan desain sesuai keinginan, dilanjutkan dengan persetujuan desain serta finalisasi anggaran.",
  },
  {
    number: "05",
    title: "Produksi",
    description:
      "Diperlukan pembayaran sebesar 50% dari total nilai proyek, terdiri dari booking fee dan DP 10% dari tahap awal.",
  },
  {
    number: "06",
    title: "Instalasi",
    description:
      "Pelunasan sisa pembayaran dilakukan H-1 sebelum pengiriman. Proses instalasi di lokasi berlangsung selama 1–2 hari kerja, menyesuaikan volume dan kompleksitas proyek.",
  },
];

/* ───────── Component ───────── */
export default function Process({
  sectionLabel = "SERVICES",
  heading = "Our Working<br />Process",
  steps = defaultSteps,
}: ProcessProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // IntersectionObserver — scroll reveal
  const setupObserver = useCallback(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRef.current
      .querySelectorAll(".proc-reveal, .proc-step")
      .forEach((el) => observer.observe(el));

    return observer;
  }, []);

  useEffect(() => {
    const observer = setupObserver();
    return () => observer?.disconnect();
  }, [setupObserver]);

  // Split steps into rows of 2 (untuk stagger delay per baris)
  const rows = [
    steps.slice(0, 2),
    steps.slice(2, 4),
    steps.slice(4, 6),
  ];
  const rowBaseDelays = [0.2, 0.5, 0.8];

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-[#2C2C2C] via-[#1C1C1C] to-[#2C2C2C] py-24"
    >
      {/* Floating decorative circles */}
      <div className="proc-float absolute top-20 right-20 h-64 w-64 rounded-full border border-[#C5A572]/5" />
      <div className="proc-float-reverse absolute bottom-32 left-16 h-40 w-40 rounded-full border border-[#C5A572]/5" />

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-3">

          {/* ═══ Heading — spans 2 rows ═══ */}
          <div className="proc-reveal md:row-span-2">
            <p className="proc-label mb-4 text-sm font-semibold tracking-wider text-[#C5A572]">
              {sectionLabel}
            </p>
            <h2
              className="proc-heading font-serif text-6xl font-bold leading-tight text-white"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
            <div className="proc-line mt-8 h-[2px] w-0 bg-gradient-to-r from-[#C5A572] to-transparent" />
          </div>

          {/* ═══ Step Cards — 2 per row, 3 rows ═══ */}
          {rows.map((row, rowIdx) =>
            row.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                delay={rowBaseDelays[rowIdx] + i * 0.15}
              />
            ))
          )}

        </div>
      </div>
    </section>
  );
}

/* ───────── StepCard sub-component ───────── */
interface StepCardProps {
  step: ProcessStep;
  delay: number;
}

function StepCard({ step, delay }: StepCardProps) {
  return (
    <div
      className="proc-step group"
      style={{ transitionDelay: `${delay}s` }}
    >
      {/* Number — ghost big + small overlay */}
      <div className="relative mb-6">
        <p className="proc-number font-serif text-6xl font-bold leading-none text-[#C5A572]/10">
          {step.number}
        </p>
        <p className="proc-number-small absolute top-1/2 left-0 -translate-y-1/2 text-sm font-semibold text-[#C5A572]">
          {step.number}
        </p>
      </div>

      {/* Divider line */}
      <div className="proc-step-line mb-6 h-[1px] w-0 bg-white/10" />

      {/* Title */}
      <h3 className="mb-4 font-serif text-2xl font-bold text-white transition-colors duration-300 group-hover:text-[#C5A572]">
        {step.title}
      </h3>

      {/* Description */}
      <p className="leading-relaxed text-white/60">{step.description}</p>
    </div>
  );
}