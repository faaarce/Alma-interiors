import ky from "ky";

const API_BASE = "https://smoothbrick-eu.backendless.app/api";

/* ───────── API Client ───────── */
const api = ky.create({
  prefixUrl: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Create an authenticated API instance (adds user-token header) */
function authApi() {
  const token = localStorage.getItem("user-token");
  return api.extend({
    headers: token ? { "user-token": token } : {},
  });
}

/* ═══════════════════════════════════════════
   AUTH
   ═══════════════════════════════════════════ */

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

export async function register(
  name: string,
  email: string,
  password: string
): Promise<BackendlessUser> {
  return api
    .post("users/register", { json: { name, email, password } })
    .json<BackendlessUser>();
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem("user-token");
  if (token) {
    try {
      await api.get("users/logout", { headers: { "user-token": token } });
    } catch {
      /* ignore */
    }
  }
  localStorage.removeItem("user-token");
  localStorage.removeItem("user");
}

export function getStoredUser(): BackendlessUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as BackendlessUser) : null;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem("user-token");
}

export async function validateToken(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await api.get("users/isvalidusertoken/" + token).json<boolean>();
    if (!res) {
      localStorage.removeItem("user-token");
      localStorage.removeItem("user");
    }
    return !!res;
  } catch {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
    return false;
  }
}

/* ═══════════════════════════════════════════
   PROJECTS — Backendless Data Table "projects"
   ═══════════════════════════════════════════ */

export interface ProjectData {
  objectId?: string;
  title: string;
  category: string;
  image_url: string;
  alt: string;
  created?: number;
}

/** Fetch all projects from the "projects" table */
export async function fetchProjects(): Promise<ProjectData[]> {
  return api
    .get("data/projects", {
      searchParams: {
        sortBy: "created desc",
        pageSize: 100,
      },
    })
    .json<ProjectData[]>();
}

/** Create a new project (requires auth) */
export async function createProject(project: Omit<ProjectData, "objectId" | "created">): Promise<ProjectData> {
  return authApi()
    .post("data/projects", { json: project })
    .json<ProjectData>();
}

/** Delete a project by objectId (requires auth) */
export async function deleteProject(objectId: string): Promise<void> {
  await authApi().delete(`data/projects/${objectId}`);
}

/* ═══════════════════════════════════════════
   FILE UPLOAD — Backendless File Service
   ═══════════════════════════════════════════ */

interface FileUploadResponse {
  fileURL: string;
}

/** Upload an image file to /projects/ directory */
export async function uploadProjectImage(file: File): Promise<string> {
  const token = getStoredToken();
  const fileName = `${Date.now()}_${file.name}`;

  const formData = new FormData();
  formData.append("file", file);

  // ky with FormData — don't set Content-Type (browser auto-sets with boundary)
  const res = await ky
    .post(`${API_BASE}/files/projects/${fileName}`, {
      body: formData,
      headers: token ? { "user-token": token } : {},
    })
    .json<FileUploadResponse>();

  return res.fileURL;
}
