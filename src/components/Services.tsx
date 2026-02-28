import { useEffect, useRef, useCallback } from "react";

/* ───────── Types ───────── */
interface Service {
  title: string;
  description: string;
  image: string;
  alt: string;
}

interface ServicesProps {
  sectionLabel?: string;
  heading?: string;
  services?: Service[];
  ctaLabel?: string;
}

/* ───────── Defaults ───────── */
const defaultServices: Service[] = [
  {
    title: "Home Decoration",
    description:
      "Efficient use of space is crucial in home interior design. Consider the layout of furniture.",
    image: "/images/project4.jpg",
    alt: "Home Decoration",
  },
  {
    title: "Hospitality Decor",
    description:
      "Efficient use of space is crucial in home interior design. Consider the layout of furniture.",
    image: "/images/project8.jpg",
    alt: "Hospitality Decor",
  },
  {
    title: "Office Space Interior",
    description:
      "Efficient use of space is crucial in home interior design. Consider the layout of furniture.",
    image: "/images/project10.jpg",
    alt: "Office Space Interior",
  },
];

// Tinggi gambar beda-beda per card — bikin layout NGGAK RATA (visual interest!)
const cardHeights = ["h-[28rem]", "h-[24rem]", "h-[30rem]"];

/* ───────── Component ───────── */
export default function Services({
  sectionLabel = "SERVICES",
  heading = "Get your dream home<br />with expert help.",
  services = defaultServices,
  ctaLabel = "View All Services",
}: ServicesProps) {
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
      .querySelectorAll(".svc-reveal, .svc-card")
      .forEach((el) => observer.observe(el));

    return observer;
  }, []);

  useEffect(() => {
    const observer = setupObserver();
    return () => observer?.disconnect();
  }, [setupObserver]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#E8E4DC] to-white py-24"
    >
      <div className="mx-auto max-w-7xl px-8">

        {/* ═══ Header row: heading left + CTA right ═══ */}
        <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
          {/* Heading */}
          <div className="svc-reveal">
            <p className="svc-label mb-4 text-sm font-semibold tracking-wider text-[#C5A572]">
              {sectionLabel}
            </p>
            <h2
              className="svc-heading font-serif text-6xl font-bold leading-tight text-[#3A3A3A]"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          </div>

          {/* CTA Button */}
          <button
            className="svc-reveal svc-btn flex flex-shrink-0 items-center space-x-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A572] px-8 py-4 text-lg text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-[#C5A572] hover:to-[#D4AF37]"
            style={{ transitionDelay: "0.2s" }}
          >
            <span>{ctaLabel}</span>
            <span className="svc-arrow inline-block">↗</span>
          </button>
        </div>

        {/* ═══ Service Cards Grid ═══ */}
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
              heightClass={cardHeights[index % cardHeights.length]}
              delay={0.3 + 0.25 * index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ───────── ServiceCard sub-component ───────── */
interface ServiceCardProps {
  service: Service;
  index: number;
  heightClass: string;
  delay: number;
}

function ServiceCard({ service, index, heightClass, delay }: ServiceCardProps) {
  return (
    <div
      className={`svc-card group cursor-pointer ${index === 1 ? "-mt-16" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {/* Image container */}
      <div
        className={`relative mb-6 overflow-hidden rounded-2xl bg-gray-100 ${heightClass}`}
      >
        {/* Image with clip reveal */}
        <div className="svc-image-clip h-full w-full">
          <img
            src={service.image}
            alt={service.alt}
            className="svc-image-zoom h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Number badge (rotated → spins straight on hover) */}
        <div
          className="svc-badge absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:rotate-0 group-hover:opacity-100"
          style={{ transform: "rotate(-90deg)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Hover arrow */}
        <div className="absolute right-4 bottom-4 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-[#C5A572] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>

      {/* Text content */}
      <div className="svc-text">
        <div className="mb-3 flex items-center gap-3">
          <div className="svc-title-line h-[2px] w-0 bg-[#C5A572]" />
          <h3 className="font-serif text-2xl font-bold text-[#3A3A3A]">
            {service.title}
          </h3>
        </div>
        <p className="leading-relaxed text-[#6B6B6B]">{service.description}</p>
      </div>
    </div>
  );
}