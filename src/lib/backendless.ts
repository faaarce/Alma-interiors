import ky from "ky";

const API_BASE = "https://smoothbrick-eu.backendless.app/api";

const api = ky.create({
  prefixUrl: API_BASE,
  headers: { "Content-Type": "application/json" },
});

/** Authenticated API — adds user-token header */
function authApi() {
  const token = localStorage.getItem("user-token");
  return api.extend({
    headers: token ? { "user-token": token } : {},
  });
}

/* ═══ AUTH ═══ */

export interface BackendlessUser {
  objectId: string;
  email: string;
  name: string;
  "user-token": string;
  userStatus: string;
  lastLogin: number | null;
  created: number;
}

export async function login(email: string, password: string): Promise<BackendlessUser> {
  const user = await api
    .post("users/login", { json: { login: email, password } })
    .json<BackendlessUser>();
  localStorage.setItem("user-token", user["user-token"]);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export async function register(name: string, email: string, password: string): Promise<BackendlessUser> {
  return api.post("users/register", { json: { name, email, password } }).json<BackendlessUser>();
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem("user-token");
  if (token) {
    try { await authApi().get("users/logout"); } catch { /* ignore */ }
  }
  localStorage.removeItem("user-token");
  localStorage.removeItem("user");
}

export function getStoredUser(): BackendlessUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as BackendlessUser) : null;
  } catch { return null; }
}

export function getStoredToken(): string | null {
  return localStorage.getItem("user-token");
}

export async function validateToken(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await authApi().get("users/isvalidusertoken/" + token).json<boolean>();
    if (!res) { localStorage.removeItem("user-token"); localStorage.removeItem("user"); }
    return !!res;
  } catch {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
    return false;
  }
}

/* ═══ BLOGS — smoothbrick "Blogs" table ═══ */

export interface BlogData {
  objectId?: string;
  title: string;
  description: string;
  content: string;
  author: string;
  thumbnail?: string | null;
  tags?: string | null;
  created?: number;
  updated?: number | null;
}

/** Fetch all blogs (public — no token needed) */
export async function fetchBlogs(): Promise<BlogData[]> {
  return api.get("data/Blogs", { searchParams: { sortBy: "created desc", pageSize: 100 } }).json<BlogData[]>();
}

/** Fetch single blog (public) */
export async function fetchBlogById(id: string): Promise<BlogData> {
  return api.get(`data/Blogs/${id}`).json<BlogData>();
}

/** Create blog (requires auth token) */
export async function createBlog(
  blog: Pick<BlogData, "title" | "description" | "content" | "author"> & { thumbnail?: string; tags?: string }
): Promise<BlogData> {
  // Strip empty optional fields so Backendless doesn't store ""
  const payload: Record<string, string> = {
    title: blog.title,
    description: blog.description,
    content: blog.content,
    author: blog.author,
  };
  if (blog.thumbnail) payload.thumbnail = blog.thumbnail;
  if (blog.tags) payload.tags = blog.tags;
  return authApi().post("data/Blogs", { json: payload }).json<BlogData>();
}

/** Delete blog (requires auth token) */
export async function deleteBlog(objectId: string): Promise<void> {
  await authApi().delete(`data/Blogs/${objectId}`);
}