import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Contact from "./Contact";

/* ───────── Types ───────── */
interface Project {
  title: string;
  category: string;
  image: string;
  alt: string;
}

/* ───────── Project Data ───────── */
const projects: Project[] = [
  {
    title: "Modern Living Room",
    category: "Living Room",
    image: "/images/livingroom.jpeg",
    alt: "Modern living room interior design",
  },
  {
    title: "Custom Kitchen Set",
    category: "Kitchen",
    image: "/images/kitchen.jpeg",
    alt: "Custom kitchen interior design",
  },
  {
    title: "Professional Office",
    category: "Office",
    image: "/images/office.jpeg",
    alt: "Professional office interior",
  },
  {
    title: "Elegant Bedroom",
    category: "Bedroom",
    image: "/images/bedroom.jpeg",
    alt: "Elegant bedroom interior design",
  },
  {
    title: "Playful Kids Room",
    category: "Kids Room",
    image: "/images/kidsroom.jpeg",
    alt: "Colorful kids room interior",
  },
  {
    title: "Walk-in Closet",
    category: "Walking Closet",
    image: "/images/walkingcloset.jpeg",
    alt: "Walk-in closet custom furniture",
  },
  {
    title: "University Interior",
    category: "Universitas",
    image: "/images/universitas.jpeg",
    alt: "University interior design project",
  },
  {
    title: "Decorative Wall Panel",
    category: "Wall Panel",
    image: "/images/wallpanel.jpeg",
    alt: "Decorative wall panel design",
  },
];

const categories = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.category))),
];

const leftHeights = ["h-[420px]", "h-[300px]", "h-[360px]", "h-[280px]", "h-[340px]"];
const rightHeights = ["h-[300px]", "h-[400px]", "h-[280px]", "h-[380px]", "h-[320px]"];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop";

/* ───────── Main Page Component ───────── */
export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const gridRef = useRef<HTMLElement>(null);

  /* ── Filtered projects (React state-driven!) ── */
  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const leftProjects = filtered.filter((_, i) => i % 2 === 0);
  const rightProjects = filtered.filter((_, i) => i % 2 !== 0);

  /* ── Scroll reveal observer ── */
  const setupObserver = useCallback(() => {
    if (!gridRef.current) return;

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

    gridRef.current
      .querySelectorAll(".pp-reveal, .pp-card")
      .forEach((el) => observer.observe(el));

    return observer;
  }, []);

  useEffect(() => {
    const observer = setupObserver();
    return () => observer?.disconnect();
  }, [setupObserver]);

  /* ── Re-observe cards when filter changes (new DOM elements!) ── */
  useEffect(() => {
    if (!gridRef.current) return;

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

    // Small delay so React finishes rendering new cards first
    const timer = setTimeout(() => {
      gridRef.current
        ?.querySelectorAll(".pp-card")
        .forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeFilter]);

  return (
    <div className="font-sans">
      <Header
        navLinks={[
          { label: "Works", href: "/work" },
          { label: "Contact", href: "/#contact" },
        ]}
        ctaLabel="Book"
        lightSections={[]}
      />

      {/* ═══ HERO BANNER ═══ */}
      <section className="relative flex h-[50vh] min-h-[400px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Projects banner"
            className="pp-hero-bg h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="absolute top-24 left-12 z-[2]">
          <div className="pp-line-h h-[1px] w-16 bg-[#C5A572]/30"></div>
          <div className="pp-line-v h-16 w-[1px] bg-[#C5A572]/30"></div>
        </div>
        <div className="absolute right-12 bottom-12 z-[2]">
          <div
            className="pp-line-h ml-auto h-[1px] w-16 bg-[#C5A572]/30"
            style={{ transformOrigin: "right" }}
          ></div>
          <div
            className="pp-line-v ml-auto h-16 w-[1px] bg-[#C5A572]/30"
            style={{ transformOrigin: "bottom" }}
          ></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="pp-hero-heading mb-6 font-serif text-6xl font-bold text-white md:text-7xl">
            Projects
          </h1>
          <div className="pp-hero-breadcrumb flex items-center justify-center gap-3">
            <Link
              to="/"
              className="text-white/60 transition-colors duration-300 hover:text-white"
            >
              Home
            </Link>
            <span className="text-[#C5A572]">/</span>
            <span className="text-white">Projects</span>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="pp-hero-line h-[2px] w-0 bg-gradient-to-r from-transparent via-[#C5A572] to-transparent"></div>
          </div>
        </div>
      </section>

      {/* ═══ FILTER + PROJECTS GRID ═══ */}
      <section
        id="pp-grid"
        ref={gridRef}
        className="relative overflow-hidden bg-white py-24"
      >
        <div className="pp-float pointer-events-none absolute top-40 right-0 h-80 w-80 rounded-full border border-[#C5A572]/5"></div>
        <div className="pp-float-reverse pointer-events-none absolute bottom-60 left-0 h-56 w-56 rounded-full border border-[#C5A572]/5"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-8">
          {/* Category Filter Buttons */}
          <div className="pp-reveal mb-20 flex flex-wrap items-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pp-filter-btn rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeFilter === cat
                    ? "border-[#3A3A3A] bg-[#3A3A3A] text-white"
                    : "border-[#3A3A3A]/15 bg-transparent text-[#3A3A3A]/70 hover:border-[#C5A572] hover:text-[#C5A572]"
                }`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid — re-renders based on filtered projects */}
          <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-24">
              {leftProjects.map((project, index) => (
                <ProjectCard
                  key={project.image}
                  project={project}
                  index={index * 2 + 1}
                  side="left"
                  heightClass={leftHeights[index % leftHeights.length]}
                />
              ))}
            </div>

            {/* Right Column (offset) */}
            <div className="mt-8 space-y-24 md:mt-32">
              {rightProjects.map((project, index) => (
                <ProjectCard
                  key={project.image}
                  project={project}
                  index={index * 2 + 2}
                  side="right"
                  heightClass={rightHeights[index % rightHeights.length]}
                />
              ))}
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <p className="py-20 text-center text-xl text-[#6B6B6B]">
              No projects found for this category.
            </p>
          )}
        </div>
      </section>

      <Contact />
    </div>
  );
}

/* ───────── ProjectCard Sub-component ───────── */
interface ProjectCardProps {
  project: Project;
  index: number;
  side: "left" | "right";
  heightClass: string;
}

function ProjectCard({ project, index, side, heightClass }: ProjectCardProps) {
  return (
    <div
      className="pp-card group cursor-pointer"
      data-side={side}
      data-category={project.category}
    >
      <div
        className={`relative mb-6 overflow-hidden rounded-2xl bg-gray-100 ${heightClass}`}
      >
        <div className="pp-img-clip h-full w-full">
          <img
            src={project.image}
            alt={project.alt}
            className="pp-img-zoom h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        <div
          className="pp-badge absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
          style={{ transform: "rotate(-90deg)" }}
        >
          {String(index).padStart(2, "0")}
        </div>

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

        <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          {project.category}
        </div>
      </div>

      <div className="pp-text">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mb-2 flex items-center text-2xl font-bold text-[#3A3A3A] transition-colors duration-300 group-hover:text-[#C5A572]">
              <span className="pp-dot mr-0 h-2 w-0 rounded-full bg-[#C5A572] transition-all duration-500" />
              {project.title}
            </h3>
            <p className="text-[#6B6B6B]">{project.category}</p>
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