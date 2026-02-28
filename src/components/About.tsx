import { useEffect, useRef, useCallback } from "react";

/* ───────── Types ───────── */
interface Stat {
  value: string;
  label: string;
  description: string;
}

interface GalleryImage {
  src: string;
  alt: string;
  widthClass: string;
  heightClass: string;
}

interface AboutProps {
  sectionLabel?: string;
  heading?: string;
  paragraphs?: string[];
  stats?: Stat[];
  galleryImages?: GalleryImage[];
}

/* ───────── Defaults ───────── */
const defaultParagraphs = [
  "Alma Interior hadir dengan All Integrated Service, dimulai dari pemilihan ide dan desain yang mengedepankan kebutuhan klien.",
  "Membangun rumah atau kantor bukan sekadar mendirikan bangunan — setiap ruang perlu ditata secara detail agar interior rumah dan office sesuai dengan impian Anda.",
  "Desain interior yang baik menciptakan hunian yang harmonis, fungsional, dan memiliki nilai estetika tinggi.",
];

const defaultStats: Stat[] = [
  { value: "1K+", label: "Proyek Terselesaikan", description: "Interior & furniture berkualitas sejak tahun 2005." },
  { value: "20+", label: "Tahun Pengalaman", description: "Mendesain ruang dengan detail dan perhatian penuh." },
  { value: "95%", label: "Kepuasan Klien", description: "Kualitas terpercaya dengan hasil akhir yang rapi." },
  { value: "R&K", label: "Beragam Proyek", description: "Rumah, kantor, klinik, universitas, RS & lainnya." },
];

const defaultGalleryImages: GalleryImage[] = [
  { src: "/images/livingroom.jpeg", alt: "Living room interior", widthClass: "w-64", heightClass: "h-96" },
  { src: "/images/kitchen.jpeg", alt: "Kitchen interior", widthClass: "w-[28rem]", heightClass: "h-80" },
  { src: "/images/bedroom.jpeg", alt: "Bedroom interior", widthClass: "w-72", heightClass: "h-[28rem]" },
  { src: "/images/office.jpeg", alt: "Office interior", widthClass: "w-80", heightClass: "h-72" },
  { src: "/images/walkingcloset.jpeg", alt: "Walking closet", widthClass: "w-96", heightClass: "h-64" },
];

/* ───────── Counter animation helper ───────── */
function animateCounter(el: HTMLElement) {
  const target = el.dataset.target || "0";
  const match = target.match(/^(\d+)(.*)/);
  if (!match) {
    el.textContent = target;
    return;
  }

  const endNum = parseInt(match[1], 10);
  const suffix = match[2] || "";
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * endNum);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.classList.add("done");
      setTimeout(() => el.classList.remove("done"), 400);
    }
  }

  requestAnimationFrame(update);
}

/* ───────── Component ───────── */
export default function About({
  sectionLabel = "ABOUT US",
  heading = "Alma<br />Interior.",
  paragraphs = defaultParagraphs,
  stats = defaultStats,
  galleryImages = defaultGalleryImages,
}: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Scroll-reveal observer ── */
  const setupRevealObserver = useCallback(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionRef.current
      .querySelectorAll(".abt-reveal, .abt-para, .abt-stat")
      .forEach((el) => observer.observe(el));

    return observer;
  }, []);

  /* ── Counter observer ── */
  const setupCounterObserver = useCallback(() => {
    if (!sectionRef.current) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target as HTMLElement);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRef.current
      .querySelectorAll(".counter")
      .forEach((el) => counterObserver.observe(el));

    return counterObserver;
  }, []);

  useEffect(() => {
    const revealObs = setupRevealObserver();
    const counterObs = setupCounterObserver();

    return () => {
      revealObs?.disconnect();
      counterObs?.disconnect();
    };
  }, [setupRevealObserver, setupCounterObserver]);

  /* Triple the gallery for infinite scroll illusion */
  const tripleGallery = [
    ...galleryImages,
    ...galleryImages,
    ...galleryImages,
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#E8E4DC] py-24"
    >
      {/* Floating decorative shapes */}
      <div className="abt-float pointer-events-none absolute top-32 right-12 h-72 w-72 rounded-full border border-[#C5A572]/10"></div>
      <div className="abt-float-reverse pointer-events-none absolute bottom-48 left-8 h-48 w-48 rounded-full border border-[#C5A572]/[0.08]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left column */}
          <div className="abt-reveal">
            <p className="abt-label mb-4 text-sm font-semibold tracking-wider text-[#C5A572]">
              {sectionLabel}
            </p>
            <h2
              className="abt-heading font-serif text-6xl font-bold leading-tight text-[#3A3A3A]"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
            {/* Decorative line */}
            <div className="abt-line mt-6 h-[2px] w-0 bg-gradient-to-r from-[#C5A572] to-transparent"></div>
          </div>

          {/* Right column — paragraphs */}
          <div className="flex flex-col justify-center">
            {paragraphs.map((text, i) => (
              <p
                key={i}
                className="abt-para mb-6 text-xl text-[#6B6B6B] last:mb-0"
                style={{ transitionDelay: `${0.3 + i * 0.15}s` }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Scrolling Gallery (full width, always moving) */}
      <div className="mb-20 overflow-hidden">
        <div className="animate-abt-scroll flex items-end space-x-6">
          {tripleGallery.map((img, idx) => (
            <div
              key={idx}
              className={`abt-gallery-item group relative flex-shrink-0 overflow-hidden rounded-2xl shadow-lg ${img.widthClass} ${img.heightClass}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="abt-stat group text-center"
              style={{ transitionDelay: `${0.1 * index}s` }}
            >
              {/* Ghost big number behind */}
              <div className="relative inline-block">
                <span className="abt-ghost-num pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 select-none font-serif text-8xl font-bold text-[#C5A572]/5">
                  {stat.value}
                </span>
                <h3
                  className="counter relative z-10 mb-4 text-6xl font-bold text-[#3A3A3A]"
                  data-target={stat.value}
                >
                  0
                </h3>
              </div>
              <div className="abt-stat-line mx-auto mb-4 h-[2px] w-0 bg-[#C5A572]/30"></div>
              <p className="mb-2 text-xl font-semibold text-[#3A3A3A]">
                {stat.label}
              </p>
              <p className="text-[#6B6B6B]">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}