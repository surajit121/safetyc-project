import { useRef, useEffect, useState, memo } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { 
  ProjectOutlined, 
  TeamOutlined, 
  ClockCircleOutlined, 
  SafetyCertificateOutlined 
} from "@ant-design/icons";

// Animated counter hook
function useCounter(end, duration = 2000, startOnView = true, isInView = true) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  
  useEffect(() => {
    if (!startOnView || !isInView) return;
    
    let startTime;
    const startValue = 0;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };
    
    countRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [end, duration, startOnView, isInView]);
  
  return count;
}

// Individual stat card component - memoized for performance
const StatCard = memo(function StatCard({ icon: Icon, value, suffix = "", label, delay = 0 }) {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCounter(value, 2000, true, isInView);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className="stats-card group"
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
        theme === 'dark' 
          ? 'bg-orange-500/10 text-orange-400' 
          : 'bg-orange-50 text-orange-500'
      }`}>
        <Icon className="text-2xl" />
      </div>
      
      {/* Counter */}
      <div className="stats-counter">
        <span className={`text-4xl md:text-5xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {count}
        </span>
        <span className={`text-2xl md:text-3xl font-bold ml-0.5 ${
          theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
        }`}>
          {suffix}
        </span>
      </div>
      
      {/* Label */}
      <p className={`mt-2 font-medium ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {label}
      </p>
    </motion.div>
  );
});

export default function StatsSection() {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  const stats = [
    { 
      icon: ProjectOutlined, 
      value: 500, 
      suffix: "+", 
      label: "Projects Completed" 
    },
    { 
      icon: ClockCircleOutlined, 
      value: 15, 
      suffix: "+", 
      label: "Years Experience" 
    },
    { 
      icon: TeamOutlined, 
      value: 200, 
      suffix: "+", 
      label: "Happy Clients" 
    },
    { 
      icon: SafetyCertificateOutlined, 
      value: 24, 
      suffix: "/7", 
      label: "Support Available" 
    },
  ];
  
  return (
    <section 
      ref={containerRef}
      className={`relative py-20 overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-950' : 'bg-gray-50'
      }`}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`hero-gradient-blob w-96 h-96 -top-48 -right-48 ${
            theme === 'dark' ? 'bg-orange-600/20' : 'bg-orange-200/50'
          }`}
          style={{ animation: 'floatSlow 15s ease-in-out infinite' }}
        />
        <div 
          className={`hero-gradient-blob w-80 h-80 -bottom-40 -left-40 ${
            theme === 'dark' ? 'bg-blue-600/10' : 'bg-blue-200/40'
          }`}
          style={{ animation: 'floatSlow 20s ease-in-out infinite reverse' }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
            theme === 'dark' 
              ? 'bg-orange-500/10 text-orange-400' 
              : 'bg-orange-100 text-orange-600'
          }`}>
            Our Impact
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Numbers That Speak
          </h2>
          <p className={`max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Years of dedication to safety and security have helped us build a track record 
            that our clients trust.
          </p>
        </motion.div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard 
              key={stat.label}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
