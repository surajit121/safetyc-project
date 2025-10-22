import { useEffect, useState } from "react";
import Hero from "../components/Hero.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CTA from "../components/CTA.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import fireExtinguisherImg from "../assets/fire exting.jpeg";
import cctvImg from "../assets/cctv.jpeg";
import solarImg from "../assets/solar.jpeg";
import computerImg from "../assets/computer.jpeg";
import bioImg from "../assets/bio.jpeg";
import electricalImg from "../assets/bio.jpeg"; // Using bio image for electrical temporarily

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
          // Sort services in specific order before displaying
          (() => {
            // Define the desired order of services
            const serviceOrder = [
              "fire safety", 
              "cctv", 
              "biometric", 
              "solar", 
              "computer", 
              "electrical"
            ];
            
            // Create a copy and sort based on our defined order
            const sortedServices = [...services].sort((a, b) => {
              const titleA = (a.title || '').toLowerCase();
              const titleB = (b.title || '').toLowerCase();
              
              // Find the position of each service in our desired order
              let indexA = -1;
              let indexB = -1;
              
              serviceOrder.forEach((keyword, index) => {
                if (titleA.includes(keyword)) indexA = index;
                if (titleB.includes(keyword)) indexB = index;
              });
              
              // Sort by our defined order
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
              return 0;
            });
            
            return sortedServices.slice(0, 6).map(s => {
              // Assign images based on service title
              let image;
              const title = (s.title || '').toLowerCase();
              
              if (title.includes('fire safety')) image = fireExtinguisherImg;
              else if (title.includes('cctv') || title.includes('surveillance')) image = cctvImg;
              else if (title.includes('biometric') || title.includes('access')) image = bioImg;
              else if (title.includes('solar')) image = solarImg;
              else if (title.includes('computer') || title.includes('peripherals')) image = computerImg;
              else if (title.includes('electrical')) image = electricalImg;
              else image = computerImg; // Default fallback
              
              return <ServiceCard key={s._id || s.slug} {...s} image={image} />;
            });
          })()
        ) : (
          <p className="text-gray-500">No services available</p>
        )}
      </div>
    </section>
    <CTA />
  </div>
);
}
