import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../lib/api.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use direct API URL for production
      let url;
      const apiBase = import.meta.env.VITE_API_URL;
      
      if (apiBase === 'safetyc-api') {
        // Direct hardcoded URL for production
        url = 'https://safetyc-api.onrender.com/api/inquiries';
      } else {
        // Use the apiUrl function for development or custom environments
        url = apiUrl('/inquiries');
      }
      
      await axios.post(url, form);
      toast.success("Thanks! We'll get back to you soon.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e) {
      console.error("Error submitting form:", e);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Our Team</h1>
      <form onSubmit={submit} className="grid gap-4 bg-white p-6 rounded-2xl shadow-sm border dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            className="w-full border rounded-lg px-3 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Your name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            className="w-full border rounded-lg px-3 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="your.email@example.com"
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone (Optional)</label>
          <input
            className="w-full border rounded-lg px-3 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Your phone number"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 min-h-[120px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="How can we help you?"
            required
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="px-5 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : "Send Message"}
        </button>
      </form>
    </section>
  );
}



