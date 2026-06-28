import axios from "axios";

// In local dev, VITE_API_BASE is unset, so requests go to "/api" and Vite's
// dev proxy (vite.config.js) forwards them to the backend on :8010. In a
// Render static-site deploy, VITE_API_BASE is set at build time to the
// backend service's absolute URL (no dev proxy exists in production).
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Resolves a backend-relative path (e.g. a Feedback.image_path like "/uploads/x.jpg")
 * into a URL the browser can actually load. In dev this stays relative and goes through
 * the Vite proxy; in production it's prefixed with the backend's absolute origin. */
export function resolveUploadUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${import.meta.env.VITE_API_BASE || ""}${path}`;
}

export default api;
