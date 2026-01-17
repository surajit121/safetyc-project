import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { 
  SafetyCertificateOutlined, 
  ThunderboltOutlined, 
  ToolOutlined, 
  CheckCircleOutlined,
  CustomerServiceOutlined,
  RocketOutlined
} from "@ant-design/icons";

const features = [
  {
    icon: SafetyCertificateOutlined,
    title: "Government Approved",
    description: "Certified and approved for institutional and government projects across West Bengal.",
    color: "orange",
  },
  {
    icon: ThunderboltOutlined,
    title: "Same-Day Service",
    description: "Quick response and rapid installation for urgent security and safety requirements.",
    color: "blue",
  },
  {
    icon: ToolOutlined,
    title: "Expert Technicians",
    description: "Factory-trained and certified professionals with years of hands-on experience.",
    color: "green",
  },
  {
    icon: CheckCircleOutlined,
    title: "Quality Guarantee",
    description: "Premium products from trusted brands backed by comprehensive warranty coverage.",
    color: "purple",
  },
  {
    icon: CustomerServiceOutlined,
    title: "24/7 Support",
    description: "Round-the-clock assistance for emergencies and technical support when you need it.",
    color: "red",
  },
  {
    icon: RocketOutlined,
    title: "Modern Solutions",
    description: "Cutting-edge technology implementations with future-ready infrastructure design.",
    color: "indigo",
  },
];

// Color mappings for different themes
const colorMappings = {
  orange: {
    light: { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-500", hoverBg: "from-orange-500 to-orange-600" },
    dark: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", hoverBg: "from-orange-500 to-orange-600" },
  },
  blue: {
    light: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-500", hoverBg: "from-blue-500 to-blue-600" },
    dark: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", hoverBg: "from-blue-500 to-blue-600" },
  },
  green: {
    light: { bg: "bg-green-50", border: "border-green-100", text: "text-green-500", hoverBg: "from-green-500 to-green-600" },
    dark: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", hoverBg: "from-green-500 to-green-600" },
  },
  purple: {
    light: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-500", hoverBg: "from-purple-500 to-purple-600" },
    dark: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", hoverBg: "from-purple-500 to-purple-600" },
  },
  red: {
    light: { bg: "bg-red-50", border: "border-red-100", text: "text-red-500", hoverBg: "from-red-500 to-red-600" },
    dark: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", hoverBg: "from-red-500 to-red-600" },
  },
  indigo: {
    light: { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-500", hoverBg: "from-indigo-500 to-indigo-600" },
    dark: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", hoverBg: "from-indigo-500 to-indigo-600" },
  },
};

function FeatureCard({ feature, index }) {
  const { theme } = useTheme();
  const colors = colorMappings[feature.color][theme === 'dark' ? 'dark' : 'light'];
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="feature-card group"
    >
      {/* Icon */}
      <div className={`feature-icon ${colors.bg} ${colors.border} ${colors.text} border mb-4 group-hover:bg-gradient-to-br group-hover:${colors.hoverBg} group-hover:text-white group-hover:border-transparent`}>
        <Icon className="text-2xl" />
      </div>
      
      {/* Content */}
      <h3 className={`text-lg font-semibold mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {feature.title}
      </h3>
      
      <p className={`text-sm leading-relaxed ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {feature.description}
      </p>
    </motion.div>
  );
}

export default function FeatureHighlights() {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
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
          className={`hero-gradient-blob w-72 h-72 -top-36 left-1/3 ${
            theme === 'dark' ? 'bg-blue-600/10' : 'bg-blue-200/40'
          }`}
          style={{ animation: 'floatSlow 16s ease-in-out infinite' }}
        />
        <div 
          className={`hero-gradient-blob w-96 h-96 -bottom-48 right-1/4 ${
            theme === 'dark' ? 'bg-orange-600/10' : 'bg-orange-100/50'
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
            Why Choose Us
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            The SafetyC Advantage
          </h2>
          <p className={`max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            We combine technical expertise with customer-first service to deliver 
            comprehensive safety and security solutions.
          </p>
        </motion.div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
