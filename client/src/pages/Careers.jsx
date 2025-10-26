import { useState, useRef, useEffect } from "react";
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

const JOBS = [
  {
    id: 1,
    title: "CCTV & Security Technician",
    location: "West Bengal (Multiple Locations)",
    category: "Technical",
    summary: `Who we're looking for:
A skilled technician to install, maintain, and troubleshoot CCTV and security systems. If you love gadgets, tech, and keeping people safe, this is your spot!

What you'll do:
•	Install CCTV cameras, DVRs, and access control systems
•	Troubleshoot and repair systems onsite
•	Assist clients with setup and guidance

Requirements:
•	Experience in CCTV or security systems
•	Basic electrical knowledge
•	Problem-solving and teamwork

Perks:
•	Growth across West Bengal
•	Hands-on experience with latest technology
•	Friendly and supportive team`,
  },
  {
    id: 2,
    title: "Fire Safety Technician",
    location: "West Bengal",
    category: "Safety",
    summary: `Who we're looking for:
A fire safety technician to handle installation, maintenance, and testing of fire safety systems. Safety is serious, but your work environment is fun!

What you'll do:
•	Install fire hydrants, extinguishers, and suppression systems
•	Conduct inspections and tests
•	Educate clients on fire safety practices

Requirements:
•	Experience in fire safety systems preferred
•	Knowledge of safety standards
•	Quick learner and proactive attitude

Perks:
•	Skill development opportunities
•	On-field hands-on experience
•	Supportive team`,
  },
  {
    id: 3,
    title: "Electrical & Solar Technician",
    location: "West Bengal",
    category: "Technical",
    summary: `Who we're looking for:
If you love wires, circuits, and renewable energy, join our electrical and solar team. You'll work on installations, maintenance, and repairs for residential and commercial projects.

What you'll do:
•	Install and maintain electrical and solar systems
•	Troubleshoot and repair issues
•	Assist project teams and clients

Requirements:
•	Diploma or experience in electrical/solar work
•	Safety-first mindset
•	Team player with good communication

Perks:
•	Career growth and training opportunities
•	Exposure to multiple projects
•	Friendly work environment`,
  },
  {
    id: 4,
    title: "Computer Sales & Service Executive",
    location: "West Bengal",
    category: "Sales & Service",
    summary: `Who we're looking for:
A tech-savvy person to sell and service computers and peripherals. If you love computers and helping people with tech, this is your role!

What you'll do:
•	Sell computers, laptops, and accessories
•	Provide onsite and remote support for clients
•	Maintain inventory and service records

Requirements:
•	Knowledge of computer hardware and software
•	Good communication and problem-solving skills
•	Customer-focused attitude

Perks:
•	Hands-on experience with latest tech
•	Growth opportunities
•	Supportive team`,
  },
  {
    id: 5,
    title: "Biometric Attendance & Access Control Technician",
    location: "West Bengal",
    category: "Technical",
    summary: `Who we're looking for:
A technician to install, maintain, and troubleshoot biometric attendance and access control systems.

What you'll do:
•	Install biometric devices at client locations
•	Troubleshoot hardware/software issues
•	Guide clients on proper usage

Requirements:
•	Experience with biometric systems preferred
•	Basic IT and electrical knowledge
•	Reliable and proactive

Perks:
•	Skill growth and on-field experience
•	Friendly work culture
•	Opportunity to work on modern technology`,
  },
  {
    id: 6,
    title: "Office & Admin Executive",
    location: "Bankura (Head Office)",
    category: "Administration",
    summary: `Who we're looking for:
A detail-oriented office admin who keeps things running smoothly. If organizing and coordinating is your thing, join us!

What you'll do:
•	Manage day-to-day office operations
•	Coordinate with teams and clients
•	Maintain records, reports, and schedules

Requirements:
•	Good communication and organizational skills
•	Basic knowledge of office tools
•	Proactive and reliable

Perks:
•	Growth opportunities within the company
•	Be part of a fast-growing safety and security solutions company
•	Friendly office culture`,
  },
];



export default function Careers() {
  const [openJobId, setOpenJobId] = useState(null);
  const [formState, setFormState] = useState({ name: "", email: "", message: "", whatsapp: "", address: "", phone: "", dob: "", pincode: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: null, error: null });
  const submitControllerRef = useRef(null);
  const submitTimeoutRef = useRef(null);

  function toggle(jobId) {
    setStatus({ loading: false, success: null, error: null });
    setErrors({});
    setFormState({ name: "", email: "", message: "", whatsapp: "", address: "", phone: "", dob: "", pincode: "" });
    setOpenJobId(openJobId === jobId ? null : jobId);
  }

  // cleanup any in-flight submission when component unmounts
  useEffect(() => {
    return () => {
      try {
        submitControllerRef.current?.abort();
      } catch (e) {
        // ignore
      }
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    const trimmed = value.toString().trim();
    setFormState((s) => ({ ...s, [name]: trimmed }));
  }

  function validate() {
    const e = {};
    const name = (formState.name || "").toString().trim();
    const email = (formState.email || "").toString().trim();
    const message = (formState.message || "").toString().trim();
    const whatsapp = (formState.whatsapp || "").toString().trim();
    const phone = (formState.phone || "").toString().trim();
    const address = (formState.address || "").toString().trim();
    const dob = (formState.dob || "").toString().trim();
    const pincode = (formState.pincode || "").toString().trim();

    if (!name) e.name = "Name is required";
    else if (name.length > 100) e.name = "Name is too long";

    if (!email) e.email = "Email is required";
    else if (email.length > 254) e.email = "Email is too long";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Enter a valid email";

    if (message.length > 2000) e.message = "Message is too long";

    if (whatsapp && !/^[+0-9\s\-()]{7,30}$/.test(whatsapp)) {
      e.whatsapp = "Enter a valid WhatsApp number";
    }

    if (!phone) e.phone = "Phone is required";
    else if (!/^[+0-9\s\-()]{7,30}$/.test(phone)) {
      e.phone = "Enter a valid phone number";
    }

    if (address.length > 300) e.address = "Address is too long";

    if (!dob) e.dob = "Date of Birth is required";
    // rudimentary DOB check
    // YYYY-MM-DD regex
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) e.dob = "Enter a valid date (YYYY-MM-DD)";

    if (!pincode) e.pincode = "Pincode is required";
    else if (!/^\d{4,10}$/.test(pincode)) e.pincode = "Enter a valid pincode";

    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) {
      // Show validation error toast
      if (!toast) {
        ToastManager.error("Please fix the highlighted errors before submitting.");
      } else {
        if (typeof toast.error === 'function') {
          toast.error("Please fix the highlighted errors before submitting.", {
            position: window.innerWidth < 640 ? "bottom-center" : "top-right",
            autoClose: window.innerWidth < 640 ? 4000 : 5000,
            hideProgressBar: window.innerWidth < 640,
            closeOnClick: true,
            pauseOnHover: window.innerWidth >= 640,
            draggable: window.innerWidth >= 640,
            style: window.innerWidth < 640 ? { fontSize: '14px' } : {},
          });
        } else {
          ToastManager.error("Please fix the highlighted errors before submitting.");
        }
      }
      return;
    }

    const job = JOBS.find((j) => j.id === openJobId);
    // send trimmed values
    const payload = {
      jobId: openJobId,
      jobTitle: job ? job.title : undefined,
      name: (formState.name || "").toString().trim(),
      email: (formState.email || "").toString().trim(),
      message: (formState.message || "").toString().trim(),
      whatsapp: (formState.whatsapp || "").toString().trim(),
      address: (formState.address || "").toString().trim(),
      phone: (formState.phone || "").toString().trim(),
      dob: (formState.dob || "").toString().trim(),
      pincode: (formState.pincode || "").toString().trim(),
    };

    setStatus({ loading: true, success: null, error: null });
    try {
      const url = apiUrl('/applications');
      // debug: ensures we don't accidentally call double /api
      if (import.meta.env.MODE !== 'production') console.debug('Uploading application to:', url, payload);

      // abort any previous submission
      try { submitControllerRef.current?.abort(); } catch (e) {}
      const controller = new AbortController();
      submitControllerRef.current = controller;

      // optional timeout: abort after 10s
      submitTimeoutRef.current = setTimeout(() => {
        try { controller.abort(); } catch (e) {}
      }, 10000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const contentType = res.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // fallback: server returned HTML or plain text (common when proxy sends index.html)
        const text = await res.text();
        throw new Error(`Server returned non-JSON response (status ${res.status}): ${text.slice(0, 300)}`);
      }

      if (!res.ok) {
        // server may return field-level errors in data.errors
        if (data && data.errors && typeof data.errors === "object") {
          setErrors(data.errors);
          setStatus({ loading: false, success: null, error: "Please fix the highlighted fields" });
          return;
        }
        throw new Error(data?.error || "Upload failed");
      }

      // Show success toast
      if (!toast) {
        ToastManager.success("Application submitted successfully! We'll get back to you soon.");
      } else {
        if (typeof toast.success === 'function') {
          toast.success("Application submitted successfully! We'll get back to you soon.", {
            position: window.innerWidth < 640 ? "bottom-center" : "top-right",
            autoClose: window.innerWidth < 640 ? 4000 : 5000,
            hideProgressBar: window.innerWidth < 640,
            closeOnClick: true,
            pauseOnHover: window.innerWidth >= 640,
            draggable: window.innerWidth >= 640,
            style: window.innerWidth < 640 ? { fontSize: '14px' } : {},
            icon: "🎉",
          });
        } else {
          ToastManager.success("Application submitted successfully! We'll get back to you soon.");
        }
      }
      
      setStatus({ loading: false, success: `Application submitted`, error: null });
      setFormState({ name: "", email: "", message: "", whatsapp: "", address: "", phone: "", dob: "", pincode: "" });
      setTimeout(() => setOpenJobId(null), 1200);
    } catch (err) {
      // If aborted, don't surface as an error to the user
      if (err && (err.name === 'AbortError' || err.name === 'DOMException')) {
        // reset loading state silently
        setStatus({ loading: false, success: null, error: null });
        return;
      }

      // More helpful message for HTML responses or network errors
      const msg = err?.message || "Submission failed";
      
      // Show error toast
      if (!toast) {
        ToastManager.error(msg);
      } else {
        if (typeof toast.error === 'function') {
          toast.error(msg, {
            position: window.innerWidth < 640 ? "bottom-center" : "top-right",
            autoClose: window.innerWidth < 640 ? 4000 : 5000,
            hideProgressBar: window.innerWidth < 640,
            closeOnClick: true,
            pauseOnHover: window.innerWidth >= 640,
            draggable: window.innerWidth >= 640,
            style: window.innerWidth < 640 ? { fontSize: '14px' } : {},
          });
        } else {
          ToastManager.error(msg);
        }
      }
      
      setStatus({ loading: false, success: null, error: msg });
      // only log non-sensitive info in production
      if (import.meta.env.MODE !== 'production') console.error("Application upload error:", err);
    } finally {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
        submitTimeoutRef.current = null;
      }
      submitControllerRef.current = null;
    }
  }

  // (No outer dropdown) jobs will be shown directly under the heading

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Careers & Job Opportunities</h1>
        <p className="text-gray-700 mt-2">Click a job below to view details and apply.</p>
      </header>

      <div className="space-y-4">
        {JOBS.map((job) => (
          <div key={job.id} className="border rounded-lg overflow-hidden">
            <button
              aria-expanded={openJobId === job.id}
              aria-controls={`job-panel-${job.id}`}
              onClick={() => toggle(job.id)}
              className="w-full text-left px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
              id={`job-button-${job.id}`}
            >
              <div>
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-gray-600">{job.location}</div>
              </div>
              <div className="text-sm text-orange-600">{openJobId === job.id ? "Close" : "Apply"}</div>
            </button>

            {openJobId === job.id && (
              <div id={`job-panel-${job.id}`} role="region" aria-labelledby={`job-button-${job.id}`} className="px-4 py-4 bg-white">
                <div className="mb-3 text-gray-700 whitespace-pre-line">{job.summary}</div>

                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  <div>
                    <label htmlFor="app-name" className="block text-sm font-medium">Full name</label>
                    <input
                      id="app-name"
                      name="name"
                      autoComplete="name"
                      value={formState.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={100}
                      aria-invalid={errors.name ? true : false}
                      aria-describedby={errors.name ? "app-name-error" : undefined}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.name && <div id="app-name-error" className="text-sm text-red-600">{errors.name}</div>}
                  </div>

                  <div>
                    <label htmlFor="app-email" className="block text-sm font-medium">Email</label>
                    <input
                      id="app-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formState.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      aria-invalid={errors.email ? true : false}
                      aria-describedby={errors.email ? "app-email-error" : undefined}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.email && <div id="app-email-error" className="text-sm text-red-600">{errors.email}</div>}
                  </div>

                  <div>
                    <label htmlFor="app-whatsapp" className="block text-sm font-medium">WhatsApp number</label>
                    <input
                      id="app-whatsapp"
                      name="whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={formState.whatsapp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="+91 XXXXX XXXXX"
                      maxLength={30}
                      aria-invalid={errors.whatsapp ? true : false}
                      aria-describedby={errors.whatsapp ? "app-whatsapp-error" : undefined}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.whatsapp && <div id="app-whatsapp-error" className="text-sm text-red-600">{errors.whatsapp}</div>}
                  </div>

                  <div>
                    <label htmlFor="app-phone" className="block text-sm font-medium">Phone number</label>
                    <input
                      id="app-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={formState.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      maxLength={30}
                      aria-invalid={errors.phone ? true : false}
                      aria-describedby={errors.phone ? "app-phone-error" : undefined}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.phone && <div id="app-phone-error" className="text-sm text-red-600">{errors.phone}</div>}
                  </div>

                  <div>
                    <label htmlFor="app-address" className="block text-sm font-medium">Address</label>
                    <input
                      id="app-address"
                      name="address"
                      autoComplete="street-address"
                      value={formState.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={300}
                      aria-invalid={errors.address ? true : false}
                      aria-describedby={errors.address ? "app-address-error" : undefined}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.address && <div id="app-address-error" className="text-sm text-red-600">{errors.address}</div>}
                  </div>

                  <div>
                    <label htmlFor="app-dob" className="block text-sm font-medium">Date of Birth</label>
                    <input
                      id="app-dob"
                      name="dob"
                      type="date"
                      autoComplete="bday"
                      value={formState.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={errors.dob ? true : false}
                      aria-describedby={errors.dob ? "app-dob-error" : undefined}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.dob && <div id="app-dob-error" className="text-sm text-red-600">{errors.dob}</div>}
                  </div>

                  <div>
                    <label htmlFor="app-pincode" className="block text-sm font-medium">Pincode</label>
                    <input
                      id="app-pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={formState.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={10}
                      aria-invalid={errors.pincode ? true : false}
                      aria-describedby={errors.pincode ? "app-pincode-error" : undefined}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.pincode && <div id="app-pincode-error" className="text-sm text-red-600">{errors.pincode}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Message</label>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={2000}
                      aria-invalid={errors.message ? true : false}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className="mt-1 w-full border rounded px-3 py-2"
                      rows={3}
                    />
                    {errors.message && <div id="message-error" className="text-sm text-red-600">{errors.message}</div>}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={status.loading}
                      className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-60"
                    >
                      {status.loading ? "Sending..." : "Submit Application"}
                    </button>

                    <div role="status" aria-live="polite">
                      {status.success && <div className="text-sm text-green-700">{status.success}</div>}
                      {status.error && <div className="text-sm text-red-700">{status.error}</div>}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
