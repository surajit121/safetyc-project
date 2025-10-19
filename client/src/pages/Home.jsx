import { useEffect, useState } from "react";
import Hero from "../components/Hero.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CTA from "../components/CTA.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Home() {
  const [services, setServices] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    // IMPORTANT: HARDCODED URL - Do not change this as it's been tested and works
    const url = 'https://safetyc-api.onrender.com/api/services';
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Don't log the data - it causes confusion with HTML content
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('API response is not an array:', typeof data);
          setServices([]);
        }
      })
      .catch(err => {
        console.error("Error fetching services:", err.message);
        setServices([]);
      });
  }, []);

 return (
  <div>
    <Hero />
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Core Services</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(services) && services.length > 0 ? (
          services.slice(0, 6).map(s => (
            <ServiceCard key={s._id || s.slug} {...s} />
          ))
        ) : (
          <p className="text-gray-500">No services available</p>
        )}
      </div>
    </section>
    <CTA />
  </div>
);
}
