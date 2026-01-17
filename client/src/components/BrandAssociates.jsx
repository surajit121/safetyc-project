import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

// Import logos
import cpPlusLogo from "../assets/brands/cp-plus-logos.png";
import hikVisionLogo from "../assets/brands/hikvission-logos.png";
import dahuaLogo from "../assets/brands/dahua-logo.png";
import pramaLogo from "../assets/brands/Prama-Logo_cropped.png";
import consistentLogo from "../assets/brands/consistent-logo.png";
import westernDigitalLogo from "../assets/brands/western-logos.png";
import seagateLogo from "../assets/brands/seagate-logo.png";
import matrixLogo from "../assets/brands/Matrix-ComSec_Logo.png";
import esslLogo from "../assets/brands/esslogo.png";
import safetyOneLogo from "../assets/brands/safety-one-industries-logo-219x77-1.png";
import firePartner1 from "../assets/brands/footer-logo.png";
import firePartner2 from "../assets/brands/img-3712-90x90 (1).png";

export default function BrandAssociates() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const partners = [
    { name: "CP Plus", category: "CCTV Partner", logo: cpPlusLogo },
    { name: "Hik Vision", category: "CCTV Partner", logo: hikVisionLogo },
    { name: "Dahua", category: "CCTV Partner", logo: dahuaLogo },
    { name: "Prama", category: "CCTV Partner", logo: pramaLogo },
    { name: "Consistent", category: "CCTV Partner", logo: consistentLogo },
    { name: "Western Digital", category: "Storage Partner", logo: westernDigitalLogo },
    { name: "Seagate", category: "Storage Partner", logo: seagateLogo },
    { name: "Matrix", category: "Biometrics Partner", logo: matrixLogo },
    { name: "eSSL", category: "Biometrics Partner", logo: esslLogo },
    { name: "Safety One", category: "Fire Safety Partner", logo: safetyOneLogo },
    { name: "Fire Partner", category: "Fire Safety Partner", logo: firePartner1 },
    { name: "Fire Partner", category: "Fire Safety Partner", logo: firePartner2 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section 
      className={`py-20 relative overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-orange-900/10' : 'bg-orange-100'
        }`} />
        <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-red-900/10' : 'bg-red-100'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="text-center mb-16">
            <h2 className={`text-sm font-semibold tracking-widest uppercase mb-3 ${
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`}>
              Our Ecosystem
            </h2>
            <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Trusted Technology Partners
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <motion.div
                key={partner.name}
                variants={itemVariants}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                <div className={`relative h-full backdrop-blur-sm border p-6 rounded-xl flex flex-col items-center justify-center text-center transition-transform duration-300 group-hover:-translate-y-1 ${
                  theme === 'dark' 
                    ? 'bg-white/95 border-zinc-800' 
                    : 'bg-white border-gray-100 shadow-sm'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider mb-4 text-gray-400`}>
                    {partner.category}
                  </span>
                  
                  <div className="h-16 w-full flex items-center justify-center px-2">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Call to action card */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigate('/contact')}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-colors duration-300 cursor-pointer ${
                theme === 'dark' 
                  ? 'border-zinc-800 hover:border-orange-600' 
                  : 'border-gray-200 hover:border-orange-400'
              }`}
            >
              <span className={`text-sm font-medium mb-2 transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-500 group-hover:text-orange-400' 
                  : 'text-gray-400 group-hover:text-orange-500'
              }`}>
                Become a Partner
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-600 group-hover:text-orange-400' 
                    : 'text-gray-300 group-hover:text-orange-500'
                }`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
