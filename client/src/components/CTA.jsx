import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { ArrowRightOutlined } from "@ant-design/icons";

export default function CTA() {
  const { theme } = useTheme();
  
  return (
    <section className="relative overflow-hidden">
      {/* Main gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
            : 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)'
        }}
      />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientMove 8s ease infinite'
        }}
      />
      
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-orange-300/20 blur-3xl" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 right-[20%] w-3 h-3 rounded-full bg-white/40 animate-float" />
      <div className="absolute bottom-10 left-[15%] w-2 h-2 rounded-full bg-white/30 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-[10%] w-4 h-4 rounded-full bg-orange-200/30 animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              theme === 'dark' 
                ? 'bg-orange-500/20 text-orange-300' 
                : 'bg-white/20 text-white'
            }`}>
              Get Started Today
            </span>
            
            <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-white'
            }`}>
              Ready to enhance your safety and efficiency?
            </h2>
            
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-orange-100'
            }`}>
              Our experts will design a tailored, future-ready solution for your budget.
            </p>
            
            {/* Trust badges */}
            <div className={`flex flex-wrap gap-4 pt-2 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-orange-200'
            }`}>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                24/7 Support
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                ISO Certified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Free Consultation
              </span>
            </div>
          </div>
          
          <div className="md:text-right">
            <Link
              to="/contact"
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.5)]'
                  : 'bg-white text-orange-600 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]'
              }`}
            >
              Contact Our Team
              <ArrowRightOutlined className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-orange-200'}`}>
              Response within 24 hours
            </p>
          </div>
        </div>
      </div>
      
      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
