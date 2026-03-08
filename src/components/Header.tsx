import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { WHATSAPP_URL } from "../config/whatsapp";
import { useAuth } from "../contexts/AuthContext";

interface NavLink { label: string; href: string; }
interface DropdownLink { label: string; href: string; }
interface HeaderProps { navLinks?: NavLink[]; dropdownLinks?: DropdownLink[][]; ctaLabel?: string; lightSections?: string[]; }

const defaultNavLinks: NavLink[] = [
  { label: "Works", href: "/work" },
  { label: "Teams", href: "/teams" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

const defaultDropdownLinks: DropdownLink[][] = [
  [{ label: "Homepage", href: "/" }, { label: "About", href: "/#about" }, { label: "Works", href: "/work" }],
  [{ label: "Services", href: "/#services" }, { label: "Process", href: "/#process" }, { label: "Reviews", href: "/#reviews" }],
  [{ label: "Teams", href: "/teams" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/#contact" }],
];

export default function Header({ navLinks = defaultNavLinks, dropdownLinks = defaultDropdownLinks, ctaLabel = "Book", lightSections = ["about", "projects", "services", "reviews", "contact"] }: HeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    setDropdownOpen(false);
    const [pathname, hash] = href.split("#");
    const targetPath = pathname || "/";
    if (!hash) return;
    e.preventDefault();
    if (location.pathname === targetPath) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(targetPath);
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [location.pathname, navigate]);

  const updateHeader = useCallback(() => {
    const y = window.scrollY;
    if (y > 200) { if (y > lastScrollY.current + 5) setIsHidden(true); else if (y < lastScrollY.current - 5) setIsHidden(false); } else setIsHidden(false);
    lastScrollY.current = y;
    if (!innerRef.current) return;
    const r = innerRef.current.getBoundingClientRect();
    const mid = r.top + r.height / 2;
    let over = false;
    for (const id of lightSections) { const s = document.getElementById(id); if (!s) continue; const sr = s.getBoundingClientRect(); if (sr.top <= mid && sr.bottom >= mid) { over = true; break; } }
    setIsLight(over);
  }, [lightSections]);

  useEffect(() => {
    let t = false;
    const onScroll = () => { if (!t) { requestAnimationFrame(() => { updateHeader(); t = false; }); t = true; } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateHeader, { passive: true });
    updateHeader();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", updateHeader); };
  }, [updateHeader]);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  }, [location]);

  const handleDropdownEnter = () => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); setDropdownOpen(true); };
  const handleDropdownLeave = () => { dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150); };
  const handleLogout = async () => { setDropdownOpen(false); await logout(); navigate("/"); };

  return (
    <header ref={headerRef} className={`fixed top-6 left-0 right-0 z-50 w-full max-w-6xl mx-auto px-4 transition-all duration-[400ms] animate-hdr-slide-down ${isHidden ? "-translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"}`}>
      <div ref={innerRef} className={`backdrop-blur-lg rounded-full shadow-lg border px-8 py-4 transition-all duration-500 ${isLight ? "bg-white/[0.88] border-black/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.06)]" : "bg-white/10 border-white/20"}`}>
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 animate-hdr-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="w-10 h-10 rounded-full overflow-hidden transition-transform duration-500 hover:rotate-[360deg]" style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
              <img src="/images/alma.png" alt="Alma Interior" className="w-full h-full object-cover" />
            </div>
            <span className={`text-xl font-bold tracking-wider transition-colors duration-500 ${isLight ? "text-[#3A3A3A]" : "text-white"}`}>ALMA INTERIOR</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative animate-hdr-fade-in" style={{ animationDelay: "0.25s" }} onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
              <button className={`hdr-nav-hover flex items-center gap-1 text-sm font-medium transition-colors duration-500 ${isLight ? "text-[#3A3A3A]/70 hover:text-[#3A3A3A]" : "text-white/80 hover:text-white"}`}>
                All Pages
                <svg className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`absolute top-full left-0 mt-6 transition-all duration-300 ${dropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}`}>
                <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 w-[520px] origin-top-left ${dropdownOpen ? "animate-hdr-dropdown-in" : ""}`}>
                  <div className="flex">
                    <div className="w-44 bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 overflow-hidden">
                      <img src="/images/livingroom.jpeg" alt="Interior preview" className={`w-full h-full object-cover transition-transform duration-[4s] ease-out ${dropdownOpen ? "scale-110" : "scale-100"}`} />
                    </div>
                    <div className="flex-1 p-8">
                      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                        {dropdownLinks.map((col, ci) => (
                          <div key={ci} className="space-y-3">
                            {col.map((link, li) => (
                              <Link key={li} to={link.href} className="hdr-dropdown-link block text-[#3A3A3A] hover:text-[#C5A572] font-medium text-sm transition-all duration-300 relative hover:pl-3.5" onClick={(e) => handleNavClick(e, link.href)}>
                                <span className="hdr-dropdown-line" />{link.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 border-t border-gray-100 pt-4">
                        {isAuthenticated ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#6B6B6B]">Hai, <span className="font-semibold text-[#3A3A3A]">{user?.name}</span></span>
                            <button onClick={handleLogout} className="text-xs font-medium text-red-400 transition-colors hover:text-red-500">Logout</button>
                          </div>
                        ) : (
                          <Link to="/login" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 text-sm font-medium text-[#C5A572] transition-colors hover:text-[#D4AF37]">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Login
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {navLinks.map((link, i) => (
              <Link key={link.label} to={link.href} className={`hdr-nav-hover text-sm font-medium transition-colors duration-500 animate-hdr-fade-in ${isLight ? "text-[#3A3A3A]/70 hover:text-[#3A3A3A]" : "text-white/80 hover:text-white"}`} style={{ animationDelay: `${0.35 + i * 0.1}s` }} onClick={(e) => handleNavClick(e, link.href)}>{link.label}</Link>
            ))}
          </nav>

          <div className="animate-hdr-fade-in" style={{ animationDelay: "0.55s" }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hdr-cta group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A572] px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-[#C5A572] hover:to-[#D4AF37]">
              <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              <span className="relative z-10">{ctaLabel}</span>
              <div className="hdr-cta-shimmer absolute inset-0" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
