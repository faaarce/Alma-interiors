import { useState, useEffect, useRef, useCallback } from "react";

/* ───────── Types ───────── */
interface Review {
  quote: string;
  name: string;
  location: string;
}

interface ReviewsProps {
  sectionLabel?: string;
  heading?: string;
  reviews?: Review[];
  sideImage?: string;
}

/* ───────── Defaults ───────── */
const defaultReviews: Review[] = [
  {
    quote:
      "Pelayanan yang ramah dan desain interior yang memukau! Sangat puas dengan hasil akhir. Terimakasih Alma Interior!",
    name: "Mr. Aru Nika",
    location: "Jakarta",
  },
  {
    quote:
      "Tim Alma Interior terpercaya dan amanah ini repurchase ke 3 kali. Proses desain dan pembangunan berjalan lancar. Kami sangat senang dengan rumah kami yang baru!",
    name: "Mr. Rowi Jaya",
    location: "Tangerang",
  },
  {
    quote:
      "Terima kasih Alma, untuk hasil kitchen nya rapih dan sesuai dengan gambar memuaskan dan sesuai amanah.",
    name: "Mr. Soni",
    location: "BSD",
  },
];

/* ───────── Component ───────── */
export default function Reviews({
  sectionLabel = "REVIEWS",
  heading = "Customer Reviews",
  reviews = defaultReviews,
  sideImage = "/images/project1.jpg",
}: ReviewsProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Navigate to a review ───
  const goTo = useCallback(
    (newIndex: number, dir: "left" | "right") => {
      if (isAnimating || newIndex === current) return;
      setIsAnimating(true);
      setDirection(dir);
      setCurrent(newIndex);

      // Unlock after animation (600ms matches CSS transition)
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, current]
  );

  const goNext = useCallback(() => {
    const next = (current + 1) % reviews.length;
    goTo(next, "left");
  }, [current, reviews.length, goTo]);

  const goPrev = useCallback(() => {
    const prev = (current - 1 + reviews.length) % reviews.length;
    goTo(prev, "right");
  }, [current, reviews.length, goTo]);

  // ─── Auto-play: start when section visible, stop when not ───
  useEffect(() => {
    if (!sectionRef.current) return;

    const sectionEl = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          autoPlayRef.current = setInterval(() => {
            // Pake functional setState biar selalu dapet current terbaru
            setCurrent((prev) => {
              const next = (prev + 1) % reviews.length;
              setDirection("left");
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 600);
              return next;
            });
          }, 5000);
        } else {
          if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [reviews.length]);

  // ─── Scroll reveal observer ───
  const setupReveal = useCallback(() => {
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
      .querySelectorAll(".rev-reveal")
      .forEach((el) => observer.observe(el));

    return observer;
  }, []);

  useEffect(() => {
    const observer = setupReveal();
    return () => observer?.disconnect();
  }, [setupReveal]);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#E8E4DC] to-white py-24"
    >
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">

          {/* ═══ Left Side — Quotes ═══ */}
          <div>
            {/* Heading */}
            <div className="rev-reveal">
              <p className="mb-4 text-sm font-semibold tracking-wider text-[#C5A572]">
                {sectionLabel}
              </p>
              <h2 className="mb-12 font-serif text-5xl font-bold leading-tight text-[#3A3A3A]">
                {heading}
              </h2>
            </div>

            {/* Quote area */}
            <div className="rev-reveal mb-8" style={{ transitionDelay: "0.2s" }}>
              {/* Big floating quote mark */}
              <div className="rev-quote-mark -mb-16 select-none font-serif text-[120px] leading-none text-[#C5A572]/20">
                "
              </div>

              {/* Review container (fixed height, slides swap) */}
              <div className="relative min-h-[280px] overflow-hidden">
                {reviews.map((review, i) => (
                  <ReviewSlide
                    key={i}
                    review={review}
                    isActive={i === current}
                    direction={direction}
                  />
                ))}
              </div>
            </div>

            {/* Navigation + dots */}
            <div
              className="rev-reveal flex items-center space-x-4"
              style={{ transitionDelay: "0.4s" }}
            >
              {/* Prev button */}
              <button
                onClick={goPrev}
                aria-label="Previous review"
                className="rev-nav-btn group flex h-12 w-12 items-center justify-center rounded-full bg-[#3A3A3A]/10 transition-all duration-300 hover:bg-[#C5A572]"
              >
                <svg
                  className="h-5 w-5 text-[#3A3A3A] transition-colors group-hover:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M19 12H5M5 12l7-7M5 12l7 7" />
                </svg>
              </button>

              {/* Progress dots */}
              <div className="flex items-center space-x-2">
                {reviews.map((_, i) => (
                  <div
                    key={i}
                    className={`
                      h-2 rounded-full transition-all duration-500
                      ${i === current
                        ? "w-6 bg-[#C5A572]"
                        : "w-2 bg-[#3A3A3A]/20"
                      }
                    `}
                  />
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={goNext}
                aria-label="Next review"
                className="rev-nav-btn group flex h-12 w-12 items-center justify-center rounded-full bg-[#3A3A3A]/10 transition-all duration-300 hover:bg-[#C5A572]"
              >
                <svg
                  className="h-5 w-5 text-[#3A3A3A] transition-colors group-hover:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M5 12h14M19 12l-7-7M19 12l-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* ═══ Right Side — Image ═══ */}
          <div
            className="rev-reveal relative"
            style={{ transitionDelay: "0.3s" }}
          >
            {/* Main image */}
            <div className="rev-image-clip overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={sideImage}
                alt="Modern interior space"
                className="rev-image-zoom h-[600px] w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Gold frame accent (offset) */}
            <div className="rev-frame pointer-events-none absolute -top-4 -right-4 h-full w-full rounded-2xl border-2 border-[#C5A572]/20" />

            {/* Glow blobs */}
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-[#D4AF37] opacity-10 blur-3xl" />
            <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-[#C5A572] opacity-10 blur-3xl" />
          </div>

        </div>
      </div>

      {/* Decorative spinning star */}
      <div className="rev-star absolute top-20 left-20 h-12 w-12 opacity-10">
        <svg
          viewBox="0 0 24 24"
          className="h-full w-full text-[#D4AF37]"
          fill="currentColor"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>
    </section>
  );
}

/* ───────── ReviewSlide sub-component ───────── */
interface ReviewSlideProps {
  review: Review;
  isActive: boolean;
  direction: "left" | "right";
}

function ReviewSlide({ review, isActive, direction }: ReviewSlideProps) {
  // Tentukan transform berdasarkan active state + direction
  let transform = "";
  let opacity = "";
  let pointerEvents = "";

  if (isActive) {
    transform = "translateX(0)";
    opacity = "1";
    pointerEvents = "auto";
  } else {
    // Slide yang NGGAK aktif: posisi tergantung arah animasi terakhir
    transform = direction === "left" ? "translateX(-80px)" : "translateX(80px)";
    opacity = "0";
    pointerEvents = "none";
  }

  return (
    <div
      className="absolute top-0 left-0 w-full"
      style={{
        opacity,
        transform,
        pointerEvents: pointerEvents as "auto" | "none",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <blockquote className="mb-8 font-serif text-2xl italic leading-relaxed text-[#3A3A3A]">
        {review.quote}
      </blockquote>
      <div className="flex items-center space-x-4">
        <div
          className="h-[2px] bg-[#C5A572]"
          style={{
            width: isActive ? "2rem" : "0",
            transition: "width 0.4s ease 0.3s",
          }}
        />
        <div>
          <p className="text-xl font-semibold text-[#3A3A3A]">{review.name}</p>
          <p className="text-sm text-[#C5A572]">{review.location}</p>
        </div>
      </div>
    </div>
  );
}