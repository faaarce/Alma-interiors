import { useState, useEffect, useRef, useCallback } from "react";

/* ───────── Types ───────── */
interface VideoTestimonialProps {
  sectionLabel?: string;
  heading?: string;
  description?: string;
  youtubeUrl?: string;
}

/* ───────── Helper: extract YouTube ID ───────── */
function getYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/
  );
  return match ? match[1] : "";
}

/* ───────── Component ───────── */
export default function VideoTestimonial({
  sectionLabel = "TESTIMONIAL",
  heading = "Hear From<br />Our Clients",
  description = "Dengarkan langsung pengalaman klien kami yang telah mempercayakan proyek interior mereka kepada Alma Interior.",
  youtubeUrl = "https://youtu.be/UkwGDniuIbY",
}: VideoTestimonialProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const videoId = getYouTubeId(youtubeUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // ─── Scroll reveal observer ───
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
      { threshold: 0.15 }
    );

    sectionRef.current
      .querySelectorAll(".vt-reveal, .vt-video-card")
      .forEach((el) => observer.observe(el));

    return observer;
  }, []);

  useEffect(() => {
    const observer = setupObserver();
    return () => observer?.disconnect();
  }, [setupObserver]);

  return (
    <section
      id="video-testimonial"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-[#2C2C2C] via-[#1C1C1C] to-[#2C2C2C] py-24"
    >
      {/* Floating decorative circles */}
      <div className="vt-float pointer-events-none absolute top-20 right-16 h-64 w-64 rounded-full border border-[#C5A572]/5" />
      <div className="vt-float-reverse pointer-events-none absolute bottom-20 left-10 h-40 w-40 rounded-full border border-[#C5A572]/5" />

      <div className="relative z-10 mx-auto max-w-7xl px-8">

        {/* ═══ Header: heading left + description right ═══ */}
        <div className="mb-16 grid grid-cols-1 items-end gap-12 md:grid-cols-2">
          <div className="vt-reveal">
            <p className="vt-label mb-4 text-sm font-semibold tracking-wider text-[#C5A572]">
              {sectionLabel}
            </p>
            <h2
              className="vt-heading font-serif text-6xl font-bold leading-tight text-white"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
            <div className="vt-line mt-6 h-[2px] w-0 bg-gradient-to-r from-[#C5A572] to-transparent" />
          </div>
          <div className="vt-reveal" style={{ transitionDelay: "0.2s" }}>
            <p className="text-xl leading-relaxed text-white/60">
              {description}
            </p>
          </div>
        </div>

        {/* ═══ Video Player Card ═══ */}
        <div
          className="vt-video-card relative overflow-hidden rounded-3xl shadow-2xl"
          style={{ transitionDelay: "0.3s" }}
        >
          {/* Thumbnail (before click) */}
          {!isPlaying && (
            <div
              className="vt-thumbnail group relative aspect-video cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={thumbnailUrl}
                alt="Video testimonial thumbnail"
                className="vt-thumb-zoom h-full w-full object-cover"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="vt-play-btn relative flex h-20 w-20 items-center justify-center rounded-full bg-[#C5A572] shadow-2xl transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24">
                  <svg
                    className="ml-1 h-8 w-8 text-white md:h-10 md:w-10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {/* Pulse rings */}
                  <div className="vt-pulse-ring absolute inset-0 rounded-full border-2 border-[#C5A572]/50" />
                  <div
                    className="vt-pulse-ring absolute inset-0 rounded-full border-2 border-[#C5A572]/30"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              </div>

              {/* Bottom gradient */}
              <div className="absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Video label */}
              <div className="absolute bottom-6 left-8 flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-sm font-medium text-white/80">
                  Client Testimonial Video
                </span>
              </div>
            </div>
          )}

          {/* Embedded iframe (after click) */}
          {isPlaying && (
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={embedUrl}
                title="Client Testimonial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Decorative gold corner accents */}
          <div className="vt-corner vt-corner-tl pointer-events-none absolute top-0 left-0 h-16 w-16">
            <div className="absolute top-0 left-0 h-[2px] w-full bg-[#C5A572]/30" />
            <div className="absolute top-0 left-0 h-full w-[2px] bg-[#C5A572]/30" />
          </div>
          <div className="vt-corner vt-corner-br pointer-events-none absolute right-0 bottom-0 h-16 w-16">
            <div className="absolute right-0 bottom-0 h-[2px] w-full bg-[#C5A572]/30" />
            <div className="absolute right-0 bottom-0 h-full w-[2px] bg-[#C5A572]/30" />
          </div>
        </div>

      </div>
    </section>
  );
}