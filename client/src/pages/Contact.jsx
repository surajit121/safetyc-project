import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../lib/api.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus(null);
    
    try {
      // Use direct API URL for production
      let url;
      const apiBase = import.meta.env.VITE_API_URL;
      
      console.log("Original API base:", apiBase);
      
      if (apiBase === 'safetyc-api') {
        // Direct hardcoded URL for production
        url = 'https://safetyc-api.onrender.com/api/inquiries';
        console.log('Using hardcoded production API URL for inquiries');
      } else {
        // Use the apiUrl function for development or custom environments
        url = apiUrl('/inquiries');
      }
      
      console.log('Posting to API URL:', url);
      
      await axios.post(url, form);
      setStatus("Thanks! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e) {
      console.error("Error submitting form:", e);
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Our Team</h1>
      <form onSubmit={submit} className="grid gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <input
          className="border rounded-lg px-3 py-2 outline-none focus:border-orange-500 transition"
          placeholder="Name"
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded-lg px-3 py-2 outline-none focus:border-orange-500 transition"
          placeholder="Email"
          type="email"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border rounded-lg px-3 py-2 outline-none focus:border-orange-500 transition"
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          className="border rounded-lg px-3 py-2 min-h-[120px] outline-none focus:border-orange-500 transition"
          placeholder="Message"
          required
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
        <button className="px-5 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">
          Send
        </button>
        {status && <p className="text-sm text-gray-700">{status}</p>}
      </form>
    </section>
  );
}

