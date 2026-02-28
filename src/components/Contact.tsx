import { useEffect, useRef, useCallback } from "react";

/* ───────── Types ───────── */
interface QuickLink {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

interface ContactProps {
  heading?: string;
  ctaLabel?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

/* ───────── Defaults ───────── */
const quickLinks: QuickLink[] = [
  { label: "Projects", href: "/work" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Career", href: "#" },
];

const legalLinks: QuickLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Us", href: "#contact" },
];

const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/almainterior.id",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Facebook",
    href: "#",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "YouTube",
    href: "https://youtu.be/YPndRSoPQwA",
    icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

/* ───────── Component ───────── */
export default function Contact({
  heading = "Ready To Build Your<br />Dream Project?",
  ctaLabel = "Get Started",
  whatsappNumber = "6281717726000",
  whatsappMessage = "Halo Alma Interior, saya mau konsultasi interior. Mohon info ya, terima kasih",
}: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Scroll reveal observer
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
      .querySelectorAll(".cta-reveal, .cta-divider")
      .forEach((el) => observer.observe(el));

    return observer;
  }, []);

  useEffect(() => {
    const observer = setupObserver();
    return () => observer?.disconnect();
  }, [setupObserver]);

  return (
    <section id="contact" ref={sectionRef} className="overflow-hidden bg-[#E8E4DC]">
      {/* ═══ CTA + Links ═══ */}
      <div className="mx-auto max-w-7xl px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left: Heading + WhatsApp Button */}
          <div>
            <h2
              className="cta-reveal cta-heading mb-10 font-serif text-6xl font-bold leading-tight text-[#3A3A3A]"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-reveal cta-btn inline-flex items-center space-x-2 rounded-full bg-[#3A3A3A] px-8 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#1C1C1C] hover:shadow-2xl"
              style={{ transitionDelay: "0.2s" }}
            >
              <span>{ctaLabel}</span>
              <span className="cta-arrow">↗</span>
            </a>
          </div>

          {/* Right: Quick Links + Legal */}
          <div className="grid grid-cols-2 gap-12">
            {/* Quick Links */}
            <div className="cta-reveal" style={{ transitionDelay: "0.3s" }}>
              <p className="mb-6 font-semibold text-[#C5A572]">Quick Links</p>
              <nav className="space-y-4">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="cta-link block text-[#3A3A3A]/70 transition-all duration-300 hover:text-[#3A3A3A]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Legal Links */}
            <div className="cta-reveal" style={{ transitionDelay: "0.45s" }}>
              <p className="mb-6 font-semibold text-[#C5A572]">
                Legal & Policy Links
              </p>
              <nav className="space-y-4">
                {legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="cta-link block text-[#3A3A3A]/70 transition-all duration-300 hover:text-[#3A3A3A]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Divider ═══ */}
      <div className="mx-auto max-w-7xl px-8">
        <div className="cta-divider border-t border-[#3A3A3A]/10"></div>
      </div>

      {/* ═══ Footer ═══ */}
      <div className="mx-auto max-w-7xl px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Logo + Tagline */}
          <div className="cta-reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="cta-logo-spin h-10 w-10 overflow-hidden rounded-full">
                <img
                  src="/images/alma.png"
                  alt="Alma Interior"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold tracking-wider text-[#3A3A3A]">
                ALMA INTERIOR
              </span>
            </div>
            <p className="leading-relaxed text-[#6B6B6B]">
              Interior Design & Custom Furniture dengan desain modern dan rapi
              sesuai kebutuhan anda.
            </p>
          </div>

          {/* Contact Info */}
          <div className="cta-reveal" style={{ transitionDelay: "0.25s" }}>
            <div className="space-y-4">
              <a
                href="https://wa.me/6281717726000"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-link block text-[#3A3A3A]/70 transition-all duration-300 hover:text-[#3A3A3A]"
              >
                +62 817-1772-6000
              </a>
              <a
                href="mailto:almainterior8@gmail.com"
                className="cta-link block text-[#3A3A3A]/70 transition-all duration-300 hover:text-[#3A3A3A]"
              >
                almainterior8@gmail.com
              </a>
              <a
                href="https://www.google.com/maps/place/Alma+Interior/data=!4m2!3m1!1s0x0:0x4aa450465200b39a?sa=X&ved=1t:2428&ictx=111"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-link block text-[#3A3A3A]/70 transition-all duration-300 hover:text-[#3A3A3A]"
              >
                Jl. Swadaya No.165, Binong, Kec. Curug, Kab. Tangerang, Banten
                15810
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="cta-reveal" style={{ transitionDelay: "0.4s" }}>
            <div className="space-y-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-social flex items-center gap-3 text-[#3A3A3A]/70 transition-all duration-300 hover:text-[#3A3A3A]"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={social.icon} />
                  </svg>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Copyright ═══ */}
      <div className="mx-auto max-w-7xl px-8 pb-8">
        <div className="cta-divider border-t border-[#3A3A3A]/10 pt-8">
          <p
            className="cta-reveal text-center text-sm text-[#6B6B6B]"
            style={{ transitionDelay: "0.5s" }}
          >
            © 2025 Alma Interior. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}