import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

/* ───────── Types ───────── */
interface Project {
  title: string;
  category: string;
  image: string;
  alt: string;
}

interface ProjectsProps {
  sectionLabel?: string;
  heading?: string;
  projects?: Project[];
  ctaLabel?: string;
}

/* ───────── Defaults ───────── */
const defaultProjects: Project[] = [
  {
    title: "Living Room",
    category: "Interior Design",
    image: "/images/livingroom.jpeg",
    alt: "Modern living room interior design",
  },
  {
    title: "Kitchen Set",
    category: "Custom Furniture",
    image: "/images/kitchen.jpeg",
    alt: "Custom kitchen interior design",
  },
  {
    title: "Office Space",
    category: "Interior Design",
    image: "/images/office.jpeg",
    alt: "Professional office interior",
  },
  {
    title: "Bedroom",
    category: "Interior Design",
    image: "/images/bedroom.jpeg",
    alt: "Elegant bedroom interior design",
  },
  {
    title: "Kids Room",
    category: "Interior Design",
    image: "/images/kidsroom.jpeg",
    alt: "Colorful kids room interior",
  },
  {
    title: "Walking Closet",
    category: "Custom Furniture",
    image: "/images/walkingcloset.jpeg",
    alt: "Walk-in closet custom furniture",
  },
  {
    title: "Universitas",
    category: "Architecture Plan",
    image: "/images/universitas.jpeg",
    alt: "University interior design project",
  },
  {
    title: "Wall Panel",
    category: "Custom Furniture",
    image: "/images/wallpanel.jpeg",
    alt: "Decorative wall panel design",
  },
];

const leftHeights = ["h-[380px]", "h-[260px]", "h-[320px]", "h-[280px]"];
const rightHeights = ["h-[280px]", "h-[340px]", "h-[260px]", "h-[360px]"];

/* ───────── Component ───────── */
export default function Projects({
  sectionLabel = "WORKS",
  heading = "Our Projects &<br />Designs",
  projects = defaultProjects,
  ctaLabel = "View All Projects",
}: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const setupObservers = useCallback(() => {
    if (!sectionRef.current) return;

    /* ── Heading + CTA: immediate reveal ── */
    const revealObserver = new IntersectionObserver(
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
      .querySelectorAll(".prj-reveal, .prj-cta")
      .forEach((el) => revealObserver.observe(el));

    /* ── Cards: staggered one-by-one ──
       When a batch of cards enters the viewport at once,
       we delay each by 150ms so they cascade in sequence.
       Each card is unobserved after reveal (one-time animation). */
    const cardObserver = new IntersectionObserver(
      (entries) => {
        const newlyVisible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement);

        newlyVisible.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add("visible");
          }, i * 150);
          cardObserver.unobserve(card);
        });
      },
      { threshold: 0.08 }
    );

    sectionRef.current
      .querySelectorAll(".prj-card")
      .forEach((el) => cardObserver.observe(el));

    return { revealObserver, cardObserver };
  }, []);

  useEffect(() => {
    const obs = setupObservers();
    return () => {
      obs?.revealObserver.disconnect();
      obs?.cardObserver.disconnect();
    };
  }, [setupObservers]);

  const leftProjects = projects.filter((_, i) => i % 2 === 0);
  const rightProjects = projects.filter((_, i) => i % 2 !== 0);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24"
    >
      {/* Floating decorative shapes */}
      <div className="prj-float pointer-events-none absolute top-40 right-0 h-80 w-80 rounded-full border border-[#C5A572]/5"></div>
      <div className="prj-float-reverse pointer-events-none absolute bottom-60 left-0 h-56 w-56 rounded-full border border-[#C5A572]/5"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="mb-16 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {/* ═══ Left Column ═══ */}
          <div>
            <div className="prj-reveal">
              <p className="prj-label mb-4 text-sm font-semibold tracking-wider text-[#C5A572]">
                {sectionLabel}
              </p>
              <h2
                className="prj-heading mb-4 font-serif text-6xl font-bold leading-tight text-[#3A3A3A]"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
              <div className="prj-head-line mb-16 h-[2px] w-0 bg-gradient-to-r from-[#C5A572] to-transparent"></div>
            </div>

            <div className="space-y-32">
              {leftProjects.map((project, index) => (
                <ProjectCard
                  key={`left-${index}`}
                  project={project}
                  index={index * 2 + 1}
                  side="left"
                  heightClass={leftHeights[index % leftHeights.length]}
                />
              ))}
            </div>
          </div>

          {/* ═══ Right Column (offset down) ═══ */}
          <div className="mt-8 space-y-32 md:mt-24">
            {rightProjects.map((project, index) => (
              <ProjectCard
                key={`right-${index}`}
                project={project}
                index={index * 2 + 2}
                side="right"
                heightClass={rightHeights[index % rightHeights.length]}
              />
            ))}
          </div>
        </div>

        {/* CTA Button → /work page */}
        <Link
          to="/work"
          className="prj-cta relative inline-flex items-center space-x-2 overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A572] px-8 py-4 text-lg text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-[#C5A572] hover:to-[#D4AF37]"
        >
          <span className="relative z-10">{ctaLabel}</span>
          <svg
            className="prj-cta-arrow relative z-10 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
          <div className="prj-cta-shimmer absolute inset-0"></div>
        </Link>
      </div>
    </section>
  );
}

/* ───────── ProjectCard sub-component — Enhanced Design ───────── */
interface ProjectCardProps {
  project: Project;
  index: number;
  side: "left" | "right";
  heightClass: string;
}

function ProjectCard({ project, index, side, heightClass }: ProjectCardProps) {
  return (
    <div className="prj-card group cursor-pointer" data-side={side}>
      {/* Image container */}
      <div
        className={`relative mb-6 overflow-hidden rounded-2xl bg-gray-100 ${heightClass}`}
      >
        {/* Curtain reveal + Ken Burns */}
        <div className="prj-img-clip h-full w-full">
          <img
            src={project.image}
            alt={project.alt}
            className="prj-img-zoom h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Enhanced overlay — richer gradient */}
        <div className="prj-overlay absolute inset-0"></div>

        {/* Number badge (rotated → spins straight on hover) */}
        <div
          className="prj-badge absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white opacity-0 backdrop-blur-sm"
          style={{ transform: "rotate(-90deg)" }}
        >
          {String(index).padStart(2, "0")}
        </div>

        {/* Category tag — slides down on hover */}
        <div className="prj-category-tag absolute top-4 right-4 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          {project.category}
        </div>

        {/* Arrow button — slides up on hover */}
        <div className="prj-arrow-btn absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A572] text-white shadow-lg">
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

      {/* Text */}
      <div className="prj-text">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mb-2 flex items-center text-2xl font-bold text-[#3A3A3A] transition-colors duration-300 group-hover:text-[#C5A572]">
              <span className="prj-dot mr-0 h-2 w-0 rounded-full bg-[#C5A572] transition-all duration-500" />
              {project.title}
            </h3>
            <p className="text-[#6B6B6B] transition-colors duration-300 group-hover:text-[#3A3A3A]">
              {project.category}
            </p>
          </div>
          <div className="text-[#C5A572] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}