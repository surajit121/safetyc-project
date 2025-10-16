import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { apiUrl } from "../lib/api.js";
import ProjectCard from "../components/ProjectCard.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
const api = import.meta.env.VITE_API_URL;

function useProjectsApi() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryRef = useRef(0);
  const controllerRef = useRef(null);

  const fetchProjects = useCallback(async (opts = { retry: true }) => {
    setLoading(true);
    setError(null);

    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch {}
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await axios.get(api ? `${api}/projects` : apiUrl('/projects'), { signal: controller.signal, timeout: 10000 });
      if (Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        setProjects([]);
        setError(new Error("Unexpected server response"));
      }
      setLoading(false);
      retryRef.current = 0;
    } catch (err) {
      if (axios.isCancel && err && err.message === 'canceled') return;
      if (err && err.name === 'CanceledError') return;

      console.error("Error fetching projects:", err);
      setLoading(false);
      setProjects([]);
      setError(err instanceof Error ? err : new Error(String(err)));

      if (opts.retry && retryRef.current < 3) {
        const delay = Math.pow(2, retryRef.current) * 1000;
        retryRef.current += 1;
        setTimeout(() => fetchProjects({ retry: true }), delay);
      }
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchProjects]);

  const retry = useCallback(() => {
    retryRef.current = 0;
    fetchProjects({ retry: true });
  }, [fetchProjects]);

  return { projects, loading, error, retry };
}

export default function Projects() {
  const { projects, loading, error, retry } = useProjectsApi();
  const { theme } = useTheme();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">All Projects</h2>

      {loading && (
        <div className="py-12 flex justify-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" aria-hidden="true" />
          <span className="sr-only">Loading projects...</span>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load projects. {error.message || 'Please try again.'}</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={retry} className="px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
          </div>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-12 text-gray-600">No projects found.</div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p._id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}
