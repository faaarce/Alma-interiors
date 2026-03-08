import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Contact from "../components/Contact";
import { useAuth } from "../contexts/AuthContext";
import { fetchBlogs, type BlogData } from "../lib/backendless";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function load() {
      try { setBlogs(await fetchBlogs()); } catch { setError("Gagal memuat blog."); } finally { setIsLoading(false); }
    }
    load();
  }, []);

  const filtered = search
    ? blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
    : blogs;

  function formatDate(ts?: number) {
    if (!ts) return "";
    return new Date(ts).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  }

  return (
    <div className="font-sans">
      <Header navLinks={[{ label: "Works", href: "/work" }, { label: "Teams", href: "/teams" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/#contact" }]} ctaLabel="Book" lightSections={[]} />

      {/* Hero */}
      <section className="relative flex h-[40vh] min-h-[340px] items-center justify-center overflow-hidden bg-[#1C1C1C]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"><div className="h-full w-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #C5A572 1px, transparent 0)", backgroundSize: "32px 32px" }} /></div>
        <div className="pointer-events-none absolute top-20 right-16 h-64 w-64 rounded-full border border-[#C5A572]/5" />
        <div className="relative z-10 text-center">
          <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-[#C5A572]">BLOG</p>
          <h1 className="mb-6 font-serif text-6xl font-bold text-white md:text-7xl">Articles & Insights</h1>
          <div className="flex items-center justify-center gap-3 text-sm">
            <Link to="/" className="text-white/50 transition-colors hover:text-white">Home</Link>
            <span className="text-[#C5A572]">/</span>
            <span className="text-white">Blog</span>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-8">
          {/* Top bar */}
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-4xl font-bold text-[#3A3A3A]">Latest Posts</h2>
              <p className="mt-2 text-[#6B6B6B]">{filtered.length} artikel {search ? "ditemukan" : "tersedia"}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <svg className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari artikel..." className="rounded-full border border-[#3A3A3A]/10 bg-white py-2.5 pr-4 pl-10 text-sm text-[#3A3A3A] outline-none transition-all focus:border-[#C5A572]/50 focus:ring-2 focus:ring-[#C5A572]/10" />
              </div>
              {isAuthenticated && (
                <Link to="/blog/create" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A572] px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" /></svg>
                  Tulis Blog
                </Link>
              )}
            </div>
          </div>

          {isLoading && <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C5A572] border-t-transparent" /></div>}
          {error && <p className="py-20 text-center text-[#6B6B6B]">{error}</p>}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="mb-4 text-xl text-[#6B6B6B]">{search ? "Tidak ada artikel yang cocok." : "Belum ada blog post."}</p>
              {!search && isAuthenticated && <Link to="/blog/create" className="text-[#C5A572] hover:text-[#D4AF37]">Tulis yang pertama →</Link>}
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((blog) => (
                <Link key={blog.objectId} to={`/blog/${blog.objectId}`} className="group cursor-pointer">
                  <div className="mb-5 h-60 overflow-hidden rounded-2xl bg-gray-100">
                    {blog.thumbnail ? (
                      <img src={blog.thumbnail} alt={blog.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E8E4DC] to-[#D5D0C7]">
                        <svg className="h-12 w-12 text-[#C5A572]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="mb-3 flex items-center gap-3 text-xs text-[#6B6B6B]">
                    <span className="font-semibold text-[#C5A572]">{blog.author}</span>
                    <span>•</span>
                    <span>{formatDate(blog.created)}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#3A3A3A] transition-colors duration-300 group-hover:text-[#C5A572]">{blog.title}</h3>
                  <p className="mb-4 line-clamp-2 text-[#6B6B6B]">{blog.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#C5A572] transition-all duration-300 group-hover:gap-2">
                    Baca selengkapnya
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Contact />
    </div>
  );
}
