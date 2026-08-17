import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workPhotos } from '../data/work-photos.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  FaVideo, 
  FaFireExtinguisher, 
  FaSolarPanel, 
  FaBolt, 
  FaNetworkWired, 
  FaHardHat, 
  FaTools,
  FaGlobe,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaLeaf,
  FaSun
} from 'react-icons/fa';

// Helper to get category-specific icon
const getCategoryIcon = (category) => {
  if (category.toLowerCase().includes('cctv')) return <FaVideo />;
  if (category.toLowerCase().includes('fire')) return <FaFireExtinguisher />;
  if (category.toLowerCase().includes('solar')) return <FaSolarPanel />;
  if (category.toLowerCase().includes('electrical')) return <FaBolt />;
  if (category.toLowerCase().includes('biomatric')) return <FaNetworkWired />;
  if (category.toLowerCase().includes('civil')) return <FaHardHat />;
  if (category.toLowerCase().includes('services')) return <FaTools />;
  return <FaGlobe />;
};

export default function RecentWorkCarousel() {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const autoPlayTimerRef = useRef(null);

  // Extract solar project for the dedicated Spotlight card
  const solarProject = workPhotos.find(p => p.category.toLowerCase().includes('solar')) || workPhotos[2];
  
  // Filter out the featured solar project from the carousel to prevent duplication
  const carouselProjects = workPhotos.filter(p => p.id !== solarProject.id);

  // Setup autoplay timer (5 seconds as approved)
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselProjects.length);
      }, 5000);
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, carouselProjects.length]);

  // Pause autoplay on user interaction
  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    stopAutoPlay();
    setCurrentIndex((prev) => (prev - 1 + carouselProjects.length) % carouselProjects.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    stopAutoPlay();
    setCurrentIndex((prev) => (prev + 1) % carouselProjects.length);
  };

  const handleDotClick = (index, e) => {
    e.stopPropagation();
    stopAutoPlay();
    setCurrentIndex(index);
  };

  return (
    <section className={`py-20 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-zinc-900 to-black text-white' 
        : 'bg-gradient-to-b from-slate-50 to-white text-gray-800'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
            theme === 'dark' 
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
              : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            <span className="flex items-center gap-1.5">
              <FaSun className="animate-spin-slow text-amber-500" />
              Green Energy & Security Showcase
            </span>
          </span>
          <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Our Live Projects & Installations
          </h2>
          <p className={`max-w-2xl mx-auto text-base md:text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Take a look at our recent commercial installations. Bridging the gap between reliable security networks and sustainable solar power engineering.
          </p>
        </div>

        {/* Dual Layout: Solar Spotlight + Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Solar Spotlight Card (Col-Span 5) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className={`group relative h-full flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border ${
              theme === 'dark' 
                ? 'bg-zinc-950/80 border-amber-500/30 hover:border-amber-500/60 shadow-amber-950/10' 
                : 'bg-white border-amber-200 hover:border-amber-400 shadow-amber-100'
            }`}>
              
              {/* Highlight Glow Effect in Dark Mode */}
              {theme === 'dark' && (
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
              )}
              
              {/* Solar Project Image Header */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={solarProject.src} 
                  alt={solarProject.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold uppercase rounded-lg shadow-lg">
                    <FaSolarPanel className="text-sm" />
                    Solar Spotlight
                  </span>
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg">
                    <FaLeaf className="text-green-400 text-2xs" />
                    Eco-Friendly
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Featured Green Initiative</span>
                  <h3 className="text-2xl font-bold leading-tight mt-0.5">{solarProject.title}</h3>
                </div>
              </div>

              {/* Solar Card Body */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <p className={`text-sm md:text-base leading-relaxed mb-6 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {solarProject.description} We design, supply, install, and commission high-performance rooftop solar networks to lower operating costs and carbon footprint for heavy industries.
                  </p>
                </div>

                {/* Solar Project Metadata Footer */}
                <div className={`flex items-center justify-between pt-5 border-t ${
                  theme === 'dark' ? 'border-zinc-800' : 'border-gray-150'
                }`}>
                  <div className="flex gap-4 text-xs font-semibold text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-amber-500" />
                      {solarProject.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-amber-500" />
                      {solarProject.year}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedPhoto(solarProject)}
                    className={`flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      theme === 'dark' 
                        ? 'border-zinc-800 hover:border-amber-500/50 text-amber-400 bg-zinc-900/30' 
                        : 'border-gray-200 hover:border-amber-300 text-amber-700 bg-amber-50/20'
                    }`}
                  >
                    <FaInfoCircle /> Details
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
          
          {/* RIGHT: Security & Infrastructure Carousel (Col-Span 7) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <div 
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`h-full flex flex-col justify-between rounded-3xl p-6 md:p-8 border shadow-xl relative overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-zinc-900/60 border-zinc-800/80' 
                  : 'bg-white border-gray-150'
              }`}
            >
              <div>
                {/* Carousel Header */}
                <div className="flex justify-between items-center mb-6">
                  <h4 className={`text-lg md:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Active Installations Portfolio
                  </h4>
                  
                  {/* Arrows */}
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrev}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                        theme === 'dark' 
                          ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950 text-white' 
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      aria-label="Previous Project"
                    >
                      <FaChevronLeft className="text-xs" />
                    </button>
                    <button 
                      onClick={handleNext}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                        theme === 'dark' 
                          ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950 text-white' 
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      aria-label="Next Project"
                    >
                      <FaChevronRight className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Sliding Card Container with AnimatePresence */}
                <div className="relative min-h-[360px] md:min-h-[380px] overflow-hidden rounded-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className="absolute inset-0 flex flex-col justify-between"
                    >
                      {/* Project Main visual block */}
                      <div 
                        onClick={() => setSelectedPhoto(carouselProjects[currentIndex])}
                        className="group/item relative h-56 rounded-xl overflow-hidden cursor-pointer shadow-inner"
                      >
                        <img 
                          src={carouselProjects[currentIndex].src} 
                          alt={carouselProjects[currentIndex].title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                        
                        {/* Floating Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-600 text-white text-2xs font-bold uppercase rounded-lg shadow-lg">
                            {getCategoryIcon(carouselProjects[currentIndex].category)}
                            {carouselProjects[currentIndex].category}
                          </span>
                        </div>

                        {/* Project Info Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h5 className="text-xl font-bold leading-snug">{carouselProjects[currentIndex].title}</h5>
                        </div>
                      </div>

                      {/* Project Text Specs */}
                      <div className="pt-5 flex-grow">
                        <p className={`text-sm leading-relaxed line-clamp-3 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {carouselProjects[currentIndex].description}
                        </p>
                      </div>
                      
                      {/* Project Metadata Details */}
                      <div className={`flex items-center justify-between pt-4 mt-2 border-t ${
                        theme === 'dark' ? 'border-zinc-800/80' : 'border-gray-150'
                      }`}>
                        <div className="flex gap-4 text-xs font-semibold text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-orange-500" />
                            {carouselProjects[currentIndex].location}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-orange-500" />
                            {carouselProjects[currentIndex].year}
                          </span>
                        </div>
                        <button 
                          onClick={() => setSelectedPhoto(carouselProjects[currentIndex])}
                          className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            theme === 'dark' 
                              ? 'border-zinc-800 hover:border-orange-500/50 text-orange-400 bg-zinc-950/20' 
                              : 'border-gray-200 hover:border-orange-400/50 text-orange-600 bg-orange-50/10'
                          }`}
                        >
                          View Details
                        </button>
                      </div>

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Indicator dots */}
              <div className="flex justify-center gap-2 mt-6">
                {carouselProjects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleDotClick(idx, e)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx 
                        ? 'w-6 bg-orange-500' 
                        : (theme === 'dark' ? 'w-2 bg-zinc-700 hover:bg-zinc-600' : 'w-2 bg-gray-300 hover:bg-gray-400')
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              
            </div>
          </motion.div>

        </div>
      </div>

      {/* Lightbox / Details Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`relative z-[101] max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border ${
                theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-800' 
                  : 'bg-white border-gray-150'
              }`}
            >
              {/* Photo Display */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-full max-w-full object-contain"
                />
                
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/85 transition-colors border border-white/10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Details Content */}
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                    selectedPhoto.category.toLowerCase().includes('solar')
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {getCategoryIcon(selectedPhoto.category)}
                    {selectedPhoto.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <FaMapMarkerAlt className="text-orange-500" /> {selectedPhoto.location}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <FaCalendarAlt className="text-orange-500" /> {selectedPhoto.year}
                  </span>
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedPhoto.title}
                </h3>
                
                <p className={`text-sm md:text-base leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {selectedPhoto.description}
                </p>
                
                {selectedPhoto.category.toLowerCase().includes('solar') && (
                  <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${
                    theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20 text-amber-200' : 'bg-amber-50 border-amber-100 text-amber-900'
                  }`}>
                    <FaSun className="text-amber-500 text-xl flex-shrink-0 mt-0.5 animate-spin-slow" />
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wide mb-1">Solar Installation Scope</h4>
                      <p className="text-xs leading-relaxed">
                        This project represents one of our major industrial rollouts in West Bengal, integrating smart off-grid monitoring with high-capacity mono-crystalline solar configurations to yield maximum grid independence.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
