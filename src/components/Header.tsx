import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

interface NavLink {
  label: string;
  href: string;
}

interface DropdownLink {
  label: string;
  href: string;
}

interface HeaderProps {
  navLinks?: NavLink[];
  dropdownLinks?: DropdownLink[][];
  ctaLabel?: string;
  lightSections?: string[];
}

const defaultNavLinks: NavLink[] = [
  { label: "Works", href: "/work" },
  { label: "Contact", href: "/#contact" },
];

const defaultDropdownLinks: DropdownLink[][] = [
  [
    { label: "Homepage", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Works", href: "/work" },
    { label: "About", href: "/#about" },
  ],
  [
    { label: "Process", href: "/#process" },
    { label: "Blog", href: "#" },
    { label: "Gallery", href: "#" },
    { label: "Career", href: "#" },
  ],
  [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Contact", href: "/#contact" },
  ],
];

export default function Header({
  navLinks = defaultNavLinks,
  dropdownLinks = defaultDropdownLinks,
  ctaLabel = "Book",
  lightSections = ["about", "projects", "services", "reviews", "contact"],
}: HeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateHeader = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Hide/show on scroll direction
    if (currentScrollY > 200) {
      if (currentScrollY > lastScrollY.current + 5) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY.current - 5) {
        setIsHidden(false);
      }
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = currentScrollY;

    // Light/dark mode based on overlapping section
    if (!innerRef.current) return;
    const headerRect = innerRef.current.getBoundingClientRect();
    const headerMid = headerRect.top + headerRect.height / 2;

    let overLight = false;
    for (const id of lightSections) {
      const section = document.getElementById(id);
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      if (rect.top <= headerMid && rect.bottom >= headerMid) {
        overLight = true;
        break;
      }
    }
    setIsLight(overLight);
  }, [lightSections]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateHeader, { passive: true });
    updateHeader();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateHeader);
    };
  }, [updateHeader]);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <header
      ref={headerRef}
      className={`
        fixed top-6 left-0 right-0 z-50 w-full max-w-6xl mx-auto px-4
        transition-all duration-[400ms] cubic-bezier-smooth
        animate-hdr-slide-down
        ${isHidden ? "-translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"}
      `}
    >
      <div
        ref={innerRef}
        className={`
          backdrop-blur-lg rounded-full shadow-lg border px-8 py-4
          transition-all duration-500
          ${isLight
            ? "bg-white/[0.88] border-black/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
            : "bg-white/10 border-white/20"
          }
        `}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 animate-hdr-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden transition-transform duration-500 hover:rotate-[360deg]" style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
              <img
                src="/images/alma.png"
                alt="Alma Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`
                text-xl font-bold tracking-wider transition-colors duration-500
                ${isLight ? "text-[#3A3A3A]" : "text-white"}
              `}
            >
              ALMA INTERIOR
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* All Pages Dropdown */}
            <div
              className="relative animate-hdr-fade-in"
              style={{ animationDelay: "0.25s" }}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`
                  hdr-nav-hover flex items-center gap-1 text-sm font-medium
                  transition-colors duration-500
                  ${isLight
                    ? "text-[#3A3A3A]/70 hover:text-[#3A3A3A]"
                    : "text-white/80 hover:text-white"
                  }
                `}
              >
                All Pages
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Panel */}
              <div
                className={`
                  absolute top-full left-0 mt-6
                  transition-all duration-300
                  ${dropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible translate-y-2"
                  }
                `}
              >
                <div
                  className={`
                    bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100
                    w-[600px] origin-top-left
                    ${dropdownOpen ? "animate-hdr-dropdown-in" : ""}
                  `}
                >
                  <div className="flex">
                    {/* Image Side */}
                    <div className="w-48 bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 overflow-hidden">
                      <img
                        src="/images/project1.jpg"
                        alt="Interior preview"
                        className={`
                          w-full h-full object-cover transition-transform duration-[4s] ease-out
                          ${dropdownOpen ? "scale-110" : "scale-100"}
                        `}
                      />
                    </div>

                    {/* Links Side */}
                    <div className="flex-1 p-8">
                      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                        {dropdownLinks.map((column, colIdx) => (
                          <div key={colIdx} className="space-y-3">
                            {column.map((link, linkIdx) => (
                              <Link
                                key={linkIdx}
                                to={link.href}
                                className="hdr-dropdown-link block text-[#3A3A3A] hover:text-[#C5A572] font-medium text-sm transition-all duration-300 relative hover:pl-3.5"
                              >
                                <span className="hdr-dropdown-line" />
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Nav Links */}
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className={`
                  hdr-nav-hover text-sm font-medium transition-colors duration-500
                  animate-hdr-fade-in
                  ${isLight
                    ? "text-[#3A3A3A]/70 hover:text-[#3A3A3A]"
                    : "text-white/80 hover:text-white"
                  }
                `}
                style={{ animationDelay: `${0.35 + i * 0.1}s` }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div
            className="animate-hdr-fade-in"
            style={{ animationDelay: "0.55s" }}
          >
            <button className="hdr-cta bg-gradient-to-r from-[#D4AF37] to-[#C5A572] hover:from-[#C5A572] hover:to-[#D4AF37] text-white px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 font-medium shadow-lg text-sm relative overflow-hidden">
              <span className="relative z-10">{ctaLabel}</span>
              <div className="hdr-cta-shimmer absolute inset-0" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}