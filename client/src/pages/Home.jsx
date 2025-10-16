import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CTA from "../components/CTA.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const api = import.meta.env.VITE_API_URL;

export default function Home() {
  const [services, setServices] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    axios.get(`${api}/services`)
      .then(res => {
        console.log("API response in Services.jsx:", res.data); // debug
        // ✅ API already returns array
        if (Array.isArray(res.data)) {
          setServices(res.data);
        } else {
          setServices([]);
        }
      })
      .catch(err => {
        console.error("Error fetching services:", err);
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
