import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO.jsx";
import Hero from "../components/Hero.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CTA from "../components/CTA.jsx";
import BrandAssociates from "../components/BrandAssociates.jsx";
import StatsSection from "../components/StatsSection.jsx";
import Testimonials from "../components/Testimonials.jsx";
import FeatureHighlights from "../components/FeatureHighlights.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // Memoize animation variants to prevent recreation on each render
  const heroVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }), []);

  const sectionHeadingVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }), []);

  const servicesContainerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }), []);

  const serviceCardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }), []);

  const ctaVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }), []);

  const IS_DEV = import.meta.env.MODE !== 'production';

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
          if (IS_DEV) console.error('API response is not an array:', typeof data);
          setServices([]);
          setError(new Error("Unexpected data format from server"));
        }
        setLoading(false); // Set loading to false when data is received
      })
      .catch(err => {
        if (IS_DEV) console.error("Error fetching services:", err.message);
        setServices([]);
        setError(err); // Store the error
        setLoading(false); // Set loading to false on error
      });
  }, []);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "safetyc",
    "alternateName": "safetyc.in",
    "url": "https://safetyc.in",
    "logo": "https://safetyc.in/assets/logo.png",
    "description": "Leading provider of fire extinguishers and CCTV installation services in Bankura, West Bengal. We offer complete security solutions including fire safety equipment, surveillance systems, and biometric attendance systems.",
    "image": "https://safetyc.in/assets/logo.png",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bankura",
      "addressLocality": "Bankura",
      "addressRegion": "West Bengal",
      "postalCode": "722101",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "23.2324",
      "longitude": "87.0716"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9933396918",
      "contactType": "sales",
      "areaServed": ["Bankura", "West Bengal"],
      "availableLanguage": ["English", "Bengali"]
    }
  };

 return (
   <div>
     <SEO 
       title="Home" 
       description="safetyc is Bankura's leading provider of fire safety equipment, CCTV surveillance systems, and complete security solutions. Best rates in West Bengal."
       path="/"
       keywords="fire extinguisher Bankura, CCTV installation Bankura, security systems Bankura, fire safety equipment Bankura"
       schema={homeSchema}
     />
    
    {/* Hero Section */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroVariants}
    >
      <Hero />
    </motion.div>
    
    {/* Stats Section - Social Proof */}
    <StatsSection />
    
    {/* Core Services Section */}
    <motion.section
      className={`py-16 md:py-20 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-900' : 'bg-white'
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          variants={sectionHeadingVariants}
        >
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
            theme === 'dark' 
              ? 'bg-orange-500/10 text-orange-400' 
              : 'bg-orange-100 text-orange-600'
          }`}>
            What We Offer
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Core Services
          </h2>
          <p className={`max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Comprehensive safety and security solutions tailored for your needs
          </p>
        </motion.div>
        
        {/* Loading state */}
        {loading && (
          <div className="py-12 flex justify-center min-h-[600px] items-center" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" aria-hidden="true" />
            <span className="sr-only">Loading services...</span>
          </div>
        )}
        
        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-6 mb-6">
            <p className="text-red-600 mb-4">Failed to load services. {error.message || ''}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
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
          <motion.div
            className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={servicesContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
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
                return (
                  <motion.div key={s._id || s.slug} variants={serviceCardVariants} className="h-full">
                    <ServiceCard {...s} />
                  </motion.div>
                );
              });
            })()}
          </motion.div>
        )}
      </div>
    </motion.section>
    
    {/* Feature Highlights Section */}
    <FeatureHighlights />
    
    {/* Testimonials Section */}
    <Testimonials />
    
    {/* Brand Associates Section */}
    <BrandAssociates />

    {/* CTA Section */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={ctaVariants}
    >
      <CTA />
    </motion.div>
  </div>
);
}

