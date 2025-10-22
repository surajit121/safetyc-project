import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { apiUrl } from "../lib/api.js";
import ServiceCard from "../components/ServiceCard.jsx";
import fireExtinguisherImg from "../assets/fire exting.jpeg";
import cctvImg from "../assets/cctv.jpeg";
import solarImg from "../assets/solar.jpeg";
import computerImg from "../assets/computer.jpeg";
import bioImg from "../assets/bio.jpeg";
import electricalImg from "../assets/bio.jpeg"; // Using bio image for electrical temporarily
import rentalImg from "../assets/fire exting.jpeg"; // Using fire extinguisher image for rentals temporarily

// Fallback static services data
const staticServices = [
  {
    _id: "s1",
    title: "Fire Safety Solutions",
    description: "Complete fire protection systems engineered to safeguard lives and protect valuable assets with industry-leading technology.",
    highlights: ["Fire Hydrant, Alarm & Sprinkler Systems", "Fire Extinguishers & Suppression Systems", "Fire NOC Consulting & AMC Services"]
  },
  {
    _id: "s2",
    title: "CCTV Surveillance",
    description: "Custom-designed surveillance systems providing round-the-clock monitoring solutions to enhance security protocols and ensure complete peace of mind.",
    highlights: ["HD/IP Camera Installation", "Remote Monitoring & Recording", "System Maintenance & Support"]
  },
  {
    _id: "s3",
    title: "Biometric Attendance & Access Control",
    description: "Smart attendance and security solutions to streamline workplace management and enhance security for organizations of all sizes.",
    highlights: ["Fingerprint, Face & RFID Systems", "Visitor Management & Payroll Integration"]
  },
  {
    _id: "s4",
    title: "Solar Power Systems",
    description: "Eco-friendly energy solutions designed to significantly reduce operational costs while minimizing environmental impact for a greener tomorrow.",
    highlights: ["On-Grid, Off-Grid & Hybrid Installations", "Panels, Inverters, Net Metering & AMC"]
  },
  {
    _id: "s5", 
    title: "Computer Peripherals & IT Services",
    description: "Reliable IT infrastructure solutions meticulously selected to enhance productivity and streamline your organization's digital operations.",
    highlights: ["Supply of Devices & Peripherals", "IT Support, Networking & Software Services"]
  },
  {
    _id: "s6",
    title: "Electrical Contracting",
    description: "End-to-end electrical services delivering safe, efficient, and code-compliant power distribution systems for commercial and industrial environments.",
    highlights: ["Wiring, Panel Boards & Lighting Systems", "Earthing, Surge Protection & Safety Audits"]
  },
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
       // IMPORTANT: HARDCODED URL - Do not change this as it's been tested and works
      const url = 'https://safetyc-api.onrender.com/api/services';
      
      // No logs before the request to prevent extra HTML output
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      // Check if response is OK
      if (!res.ok) {
        throw new Error(`Server returned ${res.status} ${res.statusText}`);
      }
      
      // Parse the JSON response
      const data = await res.json();
      
      // Validate that we received an array
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        console.error('Non-array response from API:', data);
        setServices([]);
        setError(new Error("Unexpected data format from server"));
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
  
  // Sort services in the specified order
  const sortServices = (servicesArray) => {
    // Create a copy of the array to avoid mutating the original
    let sortedServices = [...servicesArray];
    
    // Define the desired order of services
    const serviceOrder = [
      "fire safety", 
      "cctv", 
      "biometric", 
      "solar", 
      "computer", 
      "electrical"
    ];
    
    // Sort based on our defined order
    sortedServices.sort((a, b) => {
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      
      // Find the position of each service in our desired order
      let indexA = -1;
      let indexB = -1;
      
      serviceOrder.forEach((keyword, index) => {
        if (titleA.includes(keyword)) indexA = index;
        if (titleB.includes(keyword)) indexB = index;
      });
      
      // If both services are in our defined order, sort by that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one is in the defined order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // Otherwise keep original order
      return 0;
    });
    
    return sortedServices;
  };
  
  // Use static data if API call fails or returns empty
  // Also ensure Fire Safety is first in either case
  const displayServices = services.length > 0 
    ? sortServices(services) 
    : staticServices;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Our Comprehensive Services</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">From fire safety and surveillance to renewable energy and IT infrastructure, we provide end-to-end solutions for your business security and operational needs with unmatched expertise and reliability.</p>
      </div>

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
            else if (title.includes('biometric') || title.includes('access')) image = bioImg;
            else if (title.includes('electrical')) image = electricalImg;
            else if (title.includes('rental')) image = rentalImg;
            else image = computerImg; // Default fallback
            
            return <ServiceCard key={s._id} {...s} image={image} />;
          })}
        </div>
      )}
    </div>
  );
}
