import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { apiUrl } from "../lib/api.js";
import ServiceCard from "../components/ServiceCard.jsx";
import fireExtinguisherImg from "../assets/fire exting.jpeg";
import cctvImg from "../assets/cctv.jpeg";
import solarImg from "../assets/solar.jpeg";
import computerImg from "../assets/computer.jpeg";
import bioImg from "../assets/bio.jpeg";

// Fallback static services data
const staticServices = [
  {
    _id: "s1",
    title: "Fire Safety",
    description: "Complete fire detection and suppression products and solutions to protect lives and assets.",
    highlights: ["Alarms & panels", "Extinguishers"]
  },
  {
    _id: "s2",
    title: "Solar Energy",
    description: "Sustainable solar solutions to reduce costs and environmental impact.",
    highlights: ["On-grid/Off-grid", "Rooftop design", "O&M"]
  },
  {
    _id: "s3", 
    title: "Computer Sales & Peripherals",
    description: "High-quality computers and peripherals to optimize operational efficiency.",
    highlights: ["Desktops/Laptops", "Printers/Scanners", "Networking"]
  },
  {
    _id: "s4",
    title: "Electrical Contracting",
    description: "Certified electrical contracting for safe and efficient power distribution.",
    highlights: ["LT/HT works", "Panel installation", "Compliance"]
  },
  {
    _id: "s5",
    title: "CCTV & Surveillance",
    description: "Advanced CCTV sales and services for continuous monitoring and enhanced security.",
    highlights: ["Remote monitoring", "HD/4K cameras", "Maintenance & support"]
  }
];

function useServicesApi() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryRef = useRef(0);
  const controllerRef = useRef(null);

  const fetchServices = useCallback(async (opts = { retry: true }) => {
    setLoading(true);
    setError(null);
    // cleanup any previous controller
    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (e) {
        // ignore
      }
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // Log the URL we're calling for debugging
      const url = apiUrl('/services');
      console.log('Calling API URL:', url);
      
      const res = await axios.get(url, { signal: controller.signal, timeout: 10000 });
      console.log('API response:', res);
      
      if (Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        console.error('Non-array response:', res.data);
        setServices([]);
        setError(new Error("Unexpected server response"));
      }
      setLoading(false);
      retryRef.current = 0;
    } catch (err) {
      // If request was aborted, just exit
      if (axios.isCancel && err && err.message === 'canceled') {
        // request cancelled (older axios) or aborted — ignore
        return;
      }

      // If AbortController signal aborted will throw DOMException with name 'AbortError'
      if (err && err.name === 'CanceledError') {
        return;
      }

      // Enhanced error logging
      console.error("Error fetching services:", err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
      }
      
      setLoading(false);
      setServices([]);
      setError(err instanceof Error ? err : new Error(String(err)));

      // optional retry with exponential backoff (limit 3 attempts)
      if (opts.retry && retryRef.current < 3) {
        const delay = Math.pow(2, retryRef.current) * 1000; // 1s, 2s, 4s
        retryRef.current += 1;
        setTimeout(() => fetchServices({ retry: true }), delay);
      }
    }
  }, []);

  useEffect(() => {
    fetchServices();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchServices]);

  const retry = useCallback(() => {
    retryRef.current = 0;
    fetchServices({ retry: true });
  }, [fetchServices]);

  return { services, loading, error, retry };
}

export default function Services() {
  const { services, loading, error, retry } = useServicesApi();
  
  // Sort services to ensure Fire Safety appears first
  const sortServices = (servicesArray) => {
    // Create a copy of the array to avoid mutating the original
    const sortedServices = [...servicesArray];
    
    // Find the index of the Fire Safety service
    const fireSafetyIndex = sortedServices.findIndex(
      s => (s.title || '').toLowerCase().includes('fire safety')
    );
    
    // If Fire Safety is found and not already at the first position
    if (fireSafetyIndex > 0) {
      // Remove the Fire Safety item
      const fireSafetyItem = sortedServices.splice(fireSafetyIndex, 1)[0];
      // Insert it at the beginning
      sortedServices.unshift(fireSafetyItem);
    }
    
    return sortedServices;
  };
  
  // Use static data if API call fails or returns empty
  // Also ensure Fire Safety is first in either case
  const displayServices = services.length > 0 
    ? sortServices(services) 
    : staticServices;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">All Services</h2>

      {loading && (
        <div className="py-12 flex justify-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" aria-hidden="true" />
          <span className="sr-only">Loading services...</span>
        </div>
      )}

      {!loading && error && (
        <div className="text-center mb-6">
          <p className="text-red-600 mb-4">Failed to load services from server. Showing default services. {error.message || ''}</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <button onClick={retry} className="px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
          </div>
        </div>
      )}

      {!loading && !error && services.length === 0 && displayServices.length === 0 && (
        <div className="text-center py-12 text-gray-600">No services found.</div>
      )}

      {!loading && displayServices.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((s) => {
            let image;
            // Determine image based on service title instead of index
            const title = s.title?.toLowerCase() || '';
            
            // Assign the correct images to each service
            if (title.includes('fire safety')) image = fireExtinguisherImg;
            else if (title.includes('solar')) image = solarImg; 
            else if (title.includes('cctv') || title.includes('surveillance')) image = cctvImg;
            else if (title.includes('computer') || title.includes('peripherals')) image = computerImg;
            else if (title.includes('electrical') || title.includes('bio')) image = bioImg;
            else image = computerImg; // Default fallback
            
            return <ServiceCard key={s._id} {...s} image={image} />;
          })}
        </div>
      )}
    </div>
  );
}
