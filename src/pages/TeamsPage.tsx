import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Contact from "../components/Contact";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  email: string;
  location: string;
}

const roles = [
  "Lead Interior Designer",
  "Senior Architect",
  "Project Manager",
  "Furniture Designer",
  "3D Visualization Artist",
  "Site Supervisor",
  "Client Relations Manager",
  "Junior Designer",
];

const bios = [
  "Berpengalaman lebih dari 10 tahun dalam desain interior residential dan komersial. Spesialisasi dalam gaya modern minimalis.",
  "Ahli dalam perencanaan ruang dan desain arsitektural. Lulusan terbaik dari program arsitektur ternama.",
  "Mengelola proyek dari konsep hingga selesai dengan efisiensi tinggi. Memastikan setiap proyek tepat waktu dan sesuai budget.",
  "Menciptakan furnitur custom yang memadukan estetika dan fungsionalitas. Menggunakan material berkualitas tinggi.",
  "Menghadirkan visualisasi 3D realistis untuk membantu klien melihat desain sebelum produksi dimulai.",
  "Mengawasi proses instalasi di lapangan untuk memastikan kualitas dan ketepatan sesuai desain.",
  "Menjaga hubungan baik dengan klien dan memastikan kepuasan di setiap tahap proyek.",
  "Talenta muda dengan kreativitas tinggi dan semangat belajar yang kuat di bidang desain interior.",
];

export default function TeamsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("https://randomuser.me/api/?results=8&nat=us,gb,au");
        const data = await res.json();

        const team: TeamMember[] = data.results.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (user: any, i: number) => ({
            name: `${user.name.first} ${user.name.last}`,
            role: roles[i % roles.length],
            bio: bios[i % bios.length],
            photo: user.picture.large,
            email: user.email,
            location: `${user.location.city}, ${user.location.country}`,
          })
        );

        setMembers(team);
      } catch {
        setError("Gagal memuat data tim.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div className="font-sans">
      <Header
        navLinks={[
          { label: "Works", href: "/work" },
          { label: "Teams", href: "/teams" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/#contact" },
        ]}
        ctaLabel="Book"
        lightSections={["team-grid"]}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative flex h-[40vh] min-h-[340px] items-center justify-center overflow-hidden bg-[#1C1C1C]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #C5A572 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="pointer-events-none absolute top-20 right-16 h-64 w-64 rounded-full border border-[#C5A572]/5" />
        <div className="pointer-events-none absolute bottom-16 left-12 h-40 w-40 rounded-full border border-[#C5A572]/5" />

        <div className="relative z-10 text-center">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#C5A572]">OUR TEAM</p>
          <h1 className="mb-6 font-serif text-6xl font-bold text-white md:text-7xl">Meet The Team</h1>
          <div className="flex items-center justify-center gap-3 text-sm">
            <Link to="/" className="text-white/50 transition-colors hover:text-white">Home</Link>
            <span className="text-[#C5A572]">/</span>
            <span className="text-white">Teams</span>
          </div>
        </div>
      </section>

      {/* ═══ TEAM GRID ═══ */}
      <section id="team-grid" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[#C5A572]">EXPERTISE & PASSION</p>
            <h2 className="font-serif text-4xl font-bold text-[#3A3A3A] md:text-5xl">The People Behind<br />Every Project</h2>
            <div className="mx-auto mt-6 h-[2px] w-16 bg-gradient-to-r from-transparent via-[#C5A572] to-transparent" />
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C5A572] border-t-transparent" />
            </div>
          )}

          {error && <p className="py-20 text-center text-[#6B6B6B]">{error}</p>}

          {!isLoading && members.length > 0 && (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member, i) => (
                <div key={i} className="group cursor-pointer">
                  {/* Photo */}
                  <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-100">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Hover overlay info */}
                    <div className="absolute right-0 bottom-0 left-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-sm leading-relaxed text-white/80">{member.bio}</p>
                    </div>

                    {/* Number badge */}
                    <div className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Name + Role */}
                  <h3 className="mb-1 text-lg font-bold text-[#3A3A3A] transition-colors duration-300 group-hover:text-[#C5A572]">
                    {member.name}
                  </h3>
                  <p className="mb-2 text-sm font-medium text-[#C5A572]">{member.role}</p>
                  <p className="text-xs text-[#6B6B6B]">{member.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CULTURE SECTION ═══ */}
      <section className="bg-gradient-to-br from-[#2C2C2C] via-[#1C1C1C] to-[#2C2C2C] py-24">
        <div className="mx-auto max-w-5xl px-8 text-center">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[#C5A572]">OUR CULTURE</p>
          <h2 className="mb-8 font-serif text-4xl font-bold text-white md:text-5xl">Where Creativity<br />Meets Precision</h2>
          <div className="mx-auto mb-12 h-[2px] w-16 bg-gradient-to-r from-transparent via-[#C5A572] to-transparent" />

          <div className="grid grid-cols-1 gap-12 text-left md:grid-cols-3">
            {[
              { title: "Collaboration", desc: "Kami percaya pada kekuatan tim. Setiap proyek melibatkan kolaborasi lintas disiplin untuk hasil terbaik." },
              { title: "Innovation", desc: "Selalu mengeksplorasi material, teknik, dan desain baru untuk menghadirkan solusi interior yang fresh." },
              { title: "Excellence", desc: "Standar kualitas tinggi di setiap detail, dari konsep awal hingga instalasi akhir." },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="mb-4 h-[2px] w-8 bg-[#C5A572] transition-all duration-300 group-hover:w-16" />
                <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                <p className="leading-relaxed text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}
