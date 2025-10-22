import { useEffect, useState } from "react";
import Hero from "../components/Hero.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CTA from "../components/CTA.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Set loading state to true before fetching data
    setLoading(true);
    setError(null);
    
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
          setError(new Error("Unexpected data format from server"));
        }
        setLoading(false); // Set loading to false when data is received
      })
      .catch(err => {
        console.error("Error fetching services:", err.message);
        setServices([]);
        setError(err); // Store the error
        setLoading(false); // Set loading to false on error
      });
  }, []);

 return (
  <div>
    <Hero />
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Core Services</h2>
      
      {/* Loading state */}
      {loading && (
        <div className="py-12 flex justify-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400" aria-hidden="true" />
          <span className="sr-only">Loading services...</span>
        </div>
      )}
      
      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-6 mb-6">
          <p className="text-red-600 mb-4">Failed to load services. {error.message || ''}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && Array.isArray(services) && services.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No services available at the moment.</p>
        </div>
      )}
      
      {/* Services display */}
      {!loading && !error && Array.isArray(services) && services.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(() => {
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
              // Don't include images in the home page service cards
              return <ServiceCard key={s._id || s.slug} {...s} />;
            });
          })()}
        </div>
      )}
    </section>
    <CTA />
  </div>
);
}
