import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../lib/api.js";
import { ToastManager } from "../components/FallbackToast.jsx";

// Try to import toast from react-toastify, but fall back to our custom implementation
let toast;
try {
  // Import react-toastify dynamically
  import('react-toastify').then(toastify => {
    toast = toastify.toast;
  }).catch(() => {
    toast = ToastManager;
  });
} catch (error) {
  toast = ToastManager;
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile device on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
      
      // Check if we're using the real toast or our fallback
      if (!toast) {
        // If toast is not available yet, use a direct fallback
        ToastManager.success("Thanks! We'll get back to you soon.");
      } else {
        // Check if toast has the success method (it should be either react-toastify or our fallback)
        if (typeof toast.success === 'function') {
          // Using react-toastify
          toast.success("Thanks! We'll get back to you soon.", {
            position: isMobile ? "bottom-center" : "top-right",
            autoClose: isMobile ? 4000 : 5000,
            hideProgressBar: isMobile,
            closeOnClick: true,
            pauseOnHover: !isMobile,
            draggable: !isMobile,
            style: isMobile ? { fontSize: '14px' } : {},
            icon: "🎉",
          });
        } else {
          // Using another object that doesn't have success method
          ToastManager.success("Thanks! We'll get back to you soon.");
        }
      }
      
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e) {
      // Similar fallback pattern for error toasts
      if (!toast) {
        ToastManager.error("Something went wrong. Please try again.");
      } else {
        if (typeof toast.error === 'function') {
          toast.error("Something went wrong. Please try again.", {
            position: isMobile ? "bottom-center" : "top-right",
            autoClose: isMobile ? 4000 : 5000,
            hideProgressBar: isMobile,
            closeOnClick: true,
            pauseOnHover: !isMobile,
            draggable: !isMobile,
            style: isMobile ? { fontSize: '14px' } : {},
          });
        } else {
          ToastManager.error("Something went wrong. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Contact Our Team</h1>
      
      <div className={`${isMobile ? 'mobile-form-container' : ''} bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden`}>
        <form onSubmit={submit} className="grid gap-4 sm:gap-5 p-4 sm:p-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 text-base outline-none bg-white text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your name"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              style={{ WebkitAppearance: 'none' }} // Fix for iOS input styling
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 text-base outline-none bg-white text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="your.email@example.com"
              type="email"
              inputMode="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              style={{ WebkitAppearance: 'none' }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone (Optional)</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 text-base outline-none bg-white text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your phone number"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              disabled={loading}
              style={{ WebkitAppearance: 'none' }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 min-h-[120px] sm:min-h-[150px] text-base outline-none bg-white text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="How can we help you?"
              required
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="mt-2 px-5 py-3 sm:py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-base"
            disabled={loading}
            style={isMobile ? { 
              // iOS-specific button fixes
              WebkitAppearance: 'none', 
              WebkitTapHighlightColor: 'rgba(0,0,0,0)'
            } : {}}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : "Send Message"}
          </button>
        </form>
      </div>
      
      {/* Mobile contact info section */}
      {isMobile && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3">Need help right away?</h2>
          <div className="space-y-3">
            <a 
              href="tel:+123456789" 
              className="flex items-center text-blue-600 dark:text-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call us
            </a>
            <a 
              href="mailto:contact@safetyc.com" 
              className="flex items-center text-blue-600 dark:text-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email us
            </a>
          </div>
        </div>
      )}
    </section>
  );
}



