import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../lib/api.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    setLoading(true);
    setError(null);
  axios.get(apiUrl('/clients'))
      .then(res => {
        setClients(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12" aria-labelledby="clients-heading">
      <h1 id="clients-heading" className="text-3xl font-bold mb-6">Clients</h1>
      {loading && (
        <div className="py-12 flex justify-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" aria-hidden="true" />
          <span className="sr-only">Loading clients...</span>
        </div>
      )}
      {!loading && error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load clients. {error.message || 'Please try again.'}</p>
        </div>
      )}
      {!loading && !error && clients.length === 0 && (
        <div className="text-center py-12 text-gray-600">No clients found.</div>
      )}
      {!loading && !error && clients.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {clients.map(c => (
            <div key={c._id} className="p-6 rounded-2xl shadow-sm border" aria-label={`Client: ${c.name}`}>
              <p className="mt-2 font-semibold">{c.name}</p>
              <p className="text-sm text-gray-600">{c.role}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}