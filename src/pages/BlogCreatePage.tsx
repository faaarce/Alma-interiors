import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { createBlog } from "../lib/backendless";

export default function BlogCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { setError("Title dan content harus diisi."); return; }
    setIsSubmitting(true);
    setError("");
    try {
      await createBlog({ title: title.trim(), description: description.trim(), content: content.trim(), author: author.trim() || user?.name || "Anonymous" });
      navigate("/blog");
    } catch { setError("Gagal membuat blog. Coba lagi."); } finally { setIsSubmitting(false); }
  }

  return (
    <div className="font-sans">
      <Header navLinks={[{ label: "Works", href: "/work" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/#contact" }]} ctaLabel="Book" lightSections={["blog-create"]} />
      <section id="blog-create" className="min-h-screen bg-white pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-8">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-[#6B6B6B] transition-colors hover:text-[#3A3A3A]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 12H5M5 12l7-7M5 12l7 7" /></svg>Kembali ke Blog
          </Link>
          <h1 className="mb-2 font-serif text-4xl font-bold text-[#3A3A3A]">Tulis Blog Baru</h1>
          <p className="mb-10 text-[#6B6B6B]">Bagikan insight dan pengalaman tentang interior design.</p>
          {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#C5A572]">TITLE *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul blog post" required className="w-full rounded-xl border border-[#3A3A3A]/10 bg-white px-5 py-4 text-lg text-[#3A3A3A] placeholder-[#3A3A3A]/25 outline-none transition-all focus:border-[#C5A572]/50 focus:ring-2 focus:ring-[#C5A572]/10" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#C5A572]">AUTHOR</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={user?.name || "Nama penulis"} className="w-full rounded-xl border border-[#3A3A3A]/10 bg-white px-5 py-4 text-[#3A3A3A] placeholder-[#3A3A3A]/25 outline-none transition-all focus:border-[#C5A572]/50 focus:ring-2 focus:ring-[#C5A572]/10" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#C5A572]">DESCRIPTION / EXCERPT</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ringkasan singkat (muncul di daftar blog)" rows={3} className="w-full resize-none rounded-xl border border-[#3A3A3A]/10 bg-white px-5 py-4 text-[#3A3A3A] placeholder-[#3A3A3A]/25 outline-none transition-all focus:border-[#C5A572]/50 focus:ring-2 focus:ring-[#C5A572]/10" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#C5A572]">CONTENT *</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis isi blog post di sini..." rows={14} required className="w-full resize-y rounded-xl border border-[#3A3A3A]/10 bg-white px-5 py-4 leading-relaxed text-[#3A3A3A] placeholder-[#3A3A3A]/25 outline-none transition-all focus:border-[#C5A572]/50 focus:ring-2 focus:ring-[#C5A572]/10" />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A572] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50">
                {isSubmitting ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Publishing...</> : <><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" /></svg>Publish Blog</>}
              </button>
              <Link to="/blog" className="text-sm text-[#6B6B6B] transition-colors hover:text-[#3A3A3A]">Batal</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
