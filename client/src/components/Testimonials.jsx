import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { StarFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";

// Testimonial data - replace with real testimonials when available
const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Facility Manager",
    company: "Bankura District Hospital",
    content: "safetyc transformed our entire security infrastructure. Their team installed a comprehensive CCTV system across all floors, and the fire safety equipment they provided gives us peace of mind. Highly professional service!",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Principal",
    company: "St. Xavier's School, Bankura",
    content: "We needed a reliable partner for our school's security upgrade. safetyc delivered beyond expectations - biometric attendance, CCTV monitoring, and fire extinguishers throughout the campus. The students and staff feel much safer now.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Das",
    role: "Factory Owner",
    company: "Das Manufacturing Pvt. Ltd.",
    content: "Their industrial fire safety solutions are top-notch. The team understood our manufacturing requirements and installed a complete fire suppression system. Their 24/7 support has been invaluable.",
    rating: 5,
  },
  {
    id: 4,
    name: "Sunita Ghosh",
    role: "Store Manager",
    company: "Ghosh Electronics",
    content: "Quick installation, fair pricing, and excellent after-sales service. The CCTV system they installed has already helped us prevent theft. Highly recommend safetyc for any business.",
    rating: 5,
  },
];

// Star rating component
function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <StarFilled 
          key={i} 
          className={i < rating ? "text-amber-400" : "text-gray-300"} 
        />
      ))}
    </div>
  );
}

// Individual testimonial card
function TestimonialCard({ testimonial, isActive }) {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className="testimonial-card h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>
      
      {/* Quote content */}
      <p className={`flex-grow text-base md:text-lg leading-relaxed mb-6 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {testimonial.content}
      </p>
      
      {/* Author info */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Avatar placeholder */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
          theme === 'dark' 
            ? 'bg-orange-500/20 text-orange-400' 
            : 'bg-orange-100 text-orange-600'
        }`}>
          {testimonial.name.charAt(0)}
        </div>
        
        <div>
          <h4 className={`font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {testimonial.name}
          </h4>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);
  
  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const goToIndex = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };
  
  return (
    <section 
      ref={containerRef}
      className={`relative py-20 overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-900' : 'bg-white'
      }`}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`hero-gradient-blob w-80 h-80 top-0 right-1/4 ${
            theme === 'dark' ? 'bg-orange-600/10' : 'bg-orange-100/60'
          }`}
          style={{ animation: 'floatSlow 18s ease-in-out infinite' }}
        />
        <div 
          className={`hero-gradient-blob w-64 h-64 bottom-0 left-1/4 ${
            theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-100/40'
          }`}
          style={{ animation: 'floatSlow 22s ease-in-out infinite reverse' }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
            theme === 'dark' 
              ? 'bg-orange-500/10 text-orange-400' 
              : 'bg-orange-100 text-orange-600'
          }`}>
            Testimonials
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            What Our Clients Say
          </h2>
          <p className={`max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Don&apos;t just take our word for it. Here&apos;s what businesses across 
            Bankura have to say about our services.
          </p>
        </motion.div>
        
        {/* Testimonial carousel */}
        <motion.div 
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Navigation buttons */}
          <button
            onClick={goToPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
              theme === 'dark'
                ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border border-gray-100'
            }`}
            aria-label="Previous testimonial"
          >
            <LeftOutlined />
          </button>
          
          <button
            onClick={goToNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
              theme === 'dark'
                ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border border-gray-100'
            }`}
            aria-label="Next testimonial"
          >
            <RightOutlined />
          </button>
          
          {/* Testimonial card */}
          <div className="min-h-[320px] md:min-h-[280px]">
            <AnimatePresence mode="wait">
              <TestimonialCard 
                key={testimonials[currentIndex].id}
                testimonial={testimonials[currentIndex]}
                isActive={true}
              />
            </AnimatePresence>
          </div>
          
          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-orange-500'
                    : theme === 'dark'
                      ? 'bg-zinc-600 hover:bg-zinc-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
