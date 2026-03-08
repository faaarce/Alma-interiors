import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Contact from "../components/Contact";
import { useAuth } from "../contexts/AuthContext";
import { fetchBlogById, deleteBlog, type BlogData } from "../lib/backendless";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!id) return;
      try { setBlog(await fetchBlogById(id)); } catch { setError("Blog tidak ditemukan."); } finally { setIsLoading(false); }
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!blog?.objectId || !confirm("Hapus blog ini?")) return;
    try { await deleteBlog(blog.objectId); navigate("/blog"); } catch { alert("Gagal menghapus blog."); }
  }

  function formatDate(ts?: number) {
    if (!ts) return "";
    return new Date(ts).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  }

  return (
    <div className="font-sans">
      <Header navLinks={[{ label: "Works", href: "/work" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/#contact" }]} ctaLabel="Book" lightSections={["blog-content"]} />
      <section id="blog-content" className="bg-white pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-8">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-[#6B6B6B] transition-colors hover:text-[#3A3A3A]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 12H5M5 12l7-7M5 12l7 7" /></svg>Kembali ke Blog
          </Link>
          {isLoading && <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C5A572] border-t-transparent" /></div>}
          {error && <p className="py-20 text-center text-[#6B6B6B]">{error}</p>}
          {blog && !isLoading && (
            <article>
              {blog.thumbnail && <div className="mb-10 overflow-hidden rounded-2xl"><img src={blog.thumbnail} alt={blog.title} className="h-80 w-full object-cover" /></div>}
              <div className="mb-6 flex items-center gap-4 text-sm text-[#6B6B6B]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C5A572]/10 text-xs font-bold text-[#C5A572]">{blog.author?.charAt(0).toUpperCase()}</div>
                  <span className="font-semibold text-[#3A3A3A]">{blog.author}</span>
                </div>
                <span>•</span>
                <span>{formatDate(blog.created)}</span>
                {isAuthenticated && <><span>•</span><button onClick={handleDelete} className="text-red-400 transition-colors hover:text-red-500">Hapus</button></>}
              </div>
              <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-[#3A3A3A] md:text-5xl">{blog.title}</h1>
              {blog.description && <p className="mb-8 text-xl leading-relaxed text-[#6B6B6B] italic">{blog.description}</p>}
              <div className="mb-8 h-[2px] w-16 bg-gradient-to-r from-[#C5A572] to-transparent" />
              <div className="prose prose-lg max-w-none text-[#3A3A3A] leading-relaxed whitespace-pre-line">{blog.content}</div>
            </article>
          )}
        </div>
      </section>
      <Contact />
    </div>
  );
}
