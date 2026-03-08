import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Contact from "./Contact";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchProjects,
  createProject,
  deleteProject,
  uploadProjectImage,
  type ProjectData,
} from "../lib/backendless";

/* ───────── Hardcoded Defaults (fallback when DB is empty) ───────── */
const defaultProjects: ProjectData[] = [
  { title: "Modern Living Room", category: "Living Room", image_url: "/images/livingroom.jpeg", alt: "Modern living room interior design" },
  { title: "Custom Kitchen Set", category: "Kitchen", image_url: "/images/kitchen.jpeg", alt: "Custom kitchen interior design" },
  { title: "Professional Office", category: "Office", image_url: "/images/office.jpeg", alt: "Professional office interior" },
  { title: "Elegant Bedroom", category: "Bedroom", image_url: "/images/bedroom.jpeg", alt: "Elegant bedroom interior design" },
  { title: "Playful Kids Room", category: "Kids Room", image_url: "/images/kidsroom.jpeg", alt: "Colorful kids room interior" },
  { title: "Walk-in Closet", category: "Walking Closet", image_url: "/images/walkingcloset.jpeg", alt: "Walk-in closet custom furniture" },
  { title: "University Interior", category: "Universitas", image_url: "/images/universitas.jpeg", alt: "University interior design project" },
  { title: "Decorative Wall Panel", category: "Wall Panel", image_url: "/images/wallpanel.jpeg", alt: "Decorative wall panel design" },
];

const leftHeights = ["h-[420px]", "h-[300px]", "h-[360px]", "h-[280px]", "h-[340px]"];
const rightHeights = ["h-[300px]", "h-[400px]", "h-[280px]", "h-[380px]", "h-[320px]"];

const HERO_IMAGE = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop";

/* ───────── Main Page ───────── */
export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState<ProjectData[]>(defaultProjects);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const gridRef = useRef<HTMLElement>(null);
  const { isAuthenticated } = useAuth();

  /* ── Fetch projects from Backendless ── */
  useEffect(() => {
    async function load() {
      try {
        const dbProjects = await fetchProjects();
        if (dbProjects.length > 0) {
          setProjects([...dbProjects, ...defaultProjects]);
        }
      } catch {
        // Fallback to defaults silently
      } finally {
        setIsLoadingProjects(false);
      }
    }
    load();
  }, []);

  /* ── After adding a project, refresh list ── */
  const handleProjectAdded = useCallback(async () => {
    setShowAddModal(false);
    try {
      const dbProjects = await fetchProjects();
      setProjects([...dbProjects, ...defaultProjects]);
    } catch {
      /* keep existing */
    }
  }, []);

  /* ── Delete a project ── */
  const handleDelete = useCallback(async (objectId: string) => {
    if (!confirm("Hapus project ini?")) return;
    try {
      await deleteProject(objectId);
      setProjects((prev) => prev.filter((p) => p.objectId !== objectId));
    } catch {
      alert("Gagal menghapus project.");
    }
  }, []);

  /* ── Filtered projects ── */
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);
  const leftProjects = filtered.filter((_, i) => i % 2 === 0);
  const rightProjects = filtered.filter((_, i) => i % 2 !== 0);

  /* ── Scroll reveal ── */
  const setupObserver = useCallback(() => {
    if (!gridRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    gridRef.current.querySelectorAll(".pp-reveal, .pp-card").forEach((el) => observer.observe(el));
    return observer;
  }, []);

  useEffect(() => {
    const observer = setupObserver();
    return () => observer?.disconnect();
  }, [setupObserver]);

  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const timer = setTimeout(() => {
      gridRef.current?.querySelectorAll(".pp-card").forEach((el) => observer.observe(el));
    }, 50);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [activeFilter, projects]);

  return (
    <div className="font-sans">
      <Header navLinks={[{ label: "Works", href: "/work" }, { label: "Contact", href: "/#contact" }]} ctaLabel="Book" lightSections={[]} />

      {/* ═══ HERO BANNER ═══ */}
      <section className="relative flex h-[50vh] min-h-[400px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="Projects banner" className="pp-hero-bg h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        <div className="absolute top-24 left-12 z-[2]">
          <div className="pp-line-h h-[1px] w-16 bg-[#C5A572]/30"></div>
          <div className="pp-line-v h-16 w-[1px] bg-[#C5A572]/30"></div>
        </div>
        <div className="absolute right-12 bottom-12 z-[2]">
          <div className="pp-line-h ml-auto h-[1px] w-16 bg-[#C5A572]/30" style={{ transformOrigin: "right" }}></div>
          <div className="pp-line-v ml-auto h-16 w-[1px] bg-[#C5A572]/30" style={{ transformOrigin: "bottom" }}></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="pp-hero-heading mb-6 font-serif text-6xl font-bold text-white md:text-7xl">Projects</h1>
          <div className="pp-hero-breadcrumb flex items-center justify-center gap-3">
            <Link to="/" className="text-white/60 transition-colors duration-300 hover:text-white">Home</Link>
            <span className="text-[#C5A572]">/</span>
            <span className="text-white">Projects</span>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="pp-hero-line h-[2px] w-0 bg-gradient-to-r from-transparent via-[#C5A572] to-transparent"></div>
          </div>
        </div>
      </section>

      {/* ═══ FILTER + GRID ═══ */}
      <section id="pp-grid" ref={gridRef} className="relative overflow-hidden bg-white py-24">
        <div className="pp-float pointer-events-none absolute top-40 right-0 h-80 w-80 rounded-full border border-[#C5A572]/5"></div>
        <div className="pp-float-reverse pointer-events-none absolute bottom-60 left-0 h-56 w-56 rounded-full border border-[#C5A572]/5"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-8">
          {/* Filter + Admin Add Button */}
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

            {/* Admin: Add Project Button */}
            {isAuthenticated && (
              <button
                onClick={() => setShowAddModal(true)}
                className="ml-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A572] px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-[#C5A572] hover:to-[#D4AF37]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" />
                </svg>
                Add Project
              </button>
            )}
          </div>

          {/* Loading state */}
          {isLoadingProjects && (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C5A572] border-t-transparent" />
            </div>
          )}

          {/* Masonry Grid */}
          {!isLoadingProjects && (
            <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
              <div className="space-y-24">
                {leftProjects.map((project, index) => (
                  <ProjectCard
                    key={project.objectId || project.image_url}
                    project={project}
                    index={index * 2 + 1}
                    side="left"
                    heightClass={leftHeights[index % leftHeights.length]}
                    isAdmin={isAuthenticated}
                    onDelete={project.objectId ? () => handleDelete(project.objectId!) : undefined}
                  />
                ))}
              </div>
              <div className="mt-8 space-y-24 md:mt-32">
                {rightProjects.map((project, index) => (
                  <ProjectCard
                    key={project.objectId || project.image_url}
                    project={project}
                    index={index * 2 + 2}
                    side="right"
                    heightClass={rightHeights[index % rightHeights.length]}
                    isAdmin={isAuthenticated}
                    onDelete={project.objectId ? () => handleDelete(project.objectId!) : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && !isLoadingProjects && (
            <p className="py-20 text-center text-xl text-[#6B6B6B]">No projects found for this category.</p>
          )}
        </div>
      </section>

      <Contact />

      {/* ═══ Add Project Modal ═══ */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleProjectAdded}
        />
      )}
    </div>
  );
}

/* ───────── ProjectCard ───────── */
interface ProjectCardProps {
  project: ProjectData;
  index: number;
  side: "left" | "right";
  heightClass: string;
  isAdmin: boolean;
  onDelete?: () => void;
}

function ProjectCard({ project, index, side, heightClass, isAdmin, onDelete }: ProjectCardProps) {
  return (
    <div className="pp-card group cursor-pointer" data-side={side} data-category={project.category}>
      <div className={`relative mb-6 overflow-hidden rounded-2xl bg-gray-100 ${heightClass}`}>
        <div className="pp-img-clip h-full w-full">
          <img src={project.image_url} alt={project.alt} className="pp-img-zoom h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        <div className="pp-badge absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100" style={{ transform: "rotate(-90deg)" }}>
          {String(index).padStart(2, "0")}
        </div>

        <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          {project.category}
        </div>

        <div className="absolute right-4 bottom-4 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-[#C5A572] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>

        {/* Admin: Delete button */}
        {isAdmin && onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-red-600 group-hover:opacity-100"
            title="Hapus project"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
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
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Add Project Modal ───────── */
interface AddModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AddProjectModal({ onClose, onSuccess }: AddModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [alt, setAlt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!title || !category || !imageFile) {
      setError("Semua field harus diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Upload image
      const imageUrl = await uploadProjectImage(imageFile);

      // 2. Create project record
      await createProject({
        title,
        category,
        image_url: imageUrl,
        alt: alt || `${title} — ${category}`,
      });

      onSuccess();
    } catch {
      setError("Gagal menambahkan project. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#1C1C1C] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="mb-6 font-serif text-2xl font-bold text-white">Add New Project</h2>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#C5A572]">TITLE</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Modern Kitchen" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:border-[#C5A572]/50 focus:ring-1 focus:ring-[#C5A572]/20" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#C5A572]">CATEGORY</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Kitchen" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:border-[#C5A572]/50 focus:ring-1 focus:ring-[#C5A572]/20" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#C5A572]">ALT TEXT (optional)</label>
            <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Image description" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/25 outline-none transition-all focus:border-[#C5A572]/50 focus:ring-1 focus:ring-[#C5A572]/20" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-[#C5A572]">IMAGE</label>
            <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] py-8 transition-colors hover:border-[#C5A572]/30 hover:bg-white/[0.04]">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-32 rounded-lg object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="mx-auto mb-2 h-8 w-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-white/30">Klik untuk upload gambar</p>
                </div>
              )}
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A572] py-3.5 font-medium text-white shadow-lg transition-all hover:scale-[1.02] hover:from-[#C5A572] hover:to-[#D4AF37] disabled:opacity-50"
          >
            {isSubmitting ? "Uploading..." : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
