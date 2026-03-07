import { WHATSAPP_URL } from "../config/whatsapp";

interface HeroProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  backgroundImage?: string;
  badgeText?: string;
}

const defaultParticles = [
  { top: "10%", left: "20%", delay: "0s", size: "w-1 h-1" },
  { top: "30%", left: "80%", delay: "1s", size: "w-1.5 h-1.5" },
  { top: "60%", left: "10%", delay: "2s", size: "w-1 h-1" },
  { top: "80%", left: "70%", delay: "0.5s", size: "w-2 h-2" },
  { top: "15%", left: "50%", delay: "1.5s", size: "w-1 h-1" },
  { top: "45%", left: "30%", delay: "0.8s", size: "w-1.5 h-1.5" },
  { top: "70%", left: "90%", delay: "2.5s", size: "w-1 h-1" },
  { top: "25%", left: "65%", delay: "1.2s", size: "w-2 h-2" },
  { top: "55%", left: "45%", delay: "0.3s", size: "w-1 h-1" },
  { top: "85%", left: "25%", delay: "1.8s", size: "w-1.5 h-1.5" },
];

export default function Hero({
  heading = "Design<br />& Build",
  subheading = "Interior Design & Custom Furniture dengan desain modern dan rapi sesuai kebutuhan anda.",
  ctaLabel = "Book A Consultation",
  backgroundImage = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop",
  badgeText = "★ Design & Build • 2024 • Design & Build • 2024 •",
}: HeroProps) {
  return (
    <section
      id="home"
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      {/* Background Image with parallax zoom */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Modern interior design"
          className="animate-hero-bg-zoom h-full w-full object-cover"
          style={{ transform: "scale(1.1)" }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Animated floating particles */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {defaultParticles.map((p, i) => (
          <div
            key={i}
            className={`absolute ${p.size} animate-hero-float rounded-full bg-[#D4AF37]/40`}
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Decorative corner lines */}
      <div className="absolute top-12 left-12 z-[2]">
        <div className="animate-hero-line-h h-[1px] w-16 origin-left bg-[#C5A572]/30" />
        <div className="animate-hero-line-v h-16 w-[1px] origin-top bg-[#C5A572]/30" />
      </div>
      <div className="absolute right-12 bottom-12 z-[2]">
        <div className="animate-hero-line-h ml-auto h-[1px] w-16 origin-right bg-[#C5A572]/30" />
        <div className="animate-hero-line-v ml-auto h-16 w-[1px] origin-bottom bg-[#C5A572]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Spinning Badge with Logo */}
        <div className="animate-hero-badge-in mb-8 inline-flex items-center justify-center">
          <div className="relative h-32 w-32">
            <svg
              className="animate-spin-slow h-full w-full"
              viewBox="0 0 200 200"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                />
              </defs>
              <text className="fill-[#D4AF37] text-[11px] font-medium tracking-[0.3em]">
                <textPath href="#circlePath" startOffset="0">
                  {badgeText}
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/images/alma.png"
                alt="Alma Interior Logo"
                className="animate-hero-logo-glow h-24 w-24 rounded-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Heading with clip-path reveal */}
        <h1
          className="animate-hero-heading-reveal mb-6 font-serif text-6xl leading-tight font-bold text-white md:text-7xl lg:text-8xl"
          dangerouslySetInnerHTML={{ __html: heading }}
        />

        {/* Gold divider line */}
        <div className="mb-6 flex justify-center">
          <div className="hero-divider animate-hero-divider-grow h-[2px] w-0 bg-gradient-to-r from-transparent via-[#C5A572] to-transparent" />
        </div>

        {/* Subheading */}
        <p className="animate-hero-sub-in mx-auto mb-10 max-w-2xl text-lg text-[#E8E4DC]/90 md:text-xl">
          {subheading}
        </p>

        {/* CTA Button → WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta animate-hero-cta-in group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A572] px-10 py-4 text-lg font-medium text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-[#C5A572] hover:to-[#D4AF37]"
        >
          {/* WhatsApp icon */}
          <svg
            className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="relative z-10">{ctaLabel}</span>
          <svg
            className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          <div className="hero-cta-shimmer absolute inset-0" />
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="animate-hero-scroll-in absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest text-white/40 uppercase">
            Scroll
          </span>
          <div className="animate-hero-scroll-pulse h-8 w-[1px] bg-gradient-to-b from-[#C5A572]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}