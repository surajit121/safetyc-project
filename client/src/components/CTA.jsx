import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

export default function CTA() {
  const { theme } = useTheme();
  
  // Check if we're on mobile
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Add stronger styling for mobile
  const buttonStyle = {
    display: "inline-block",
    backgroundColor: theme === 'dark' ? "#1f1f1f" : "#ffffff",
    color: "#0ea5e9 !important",
    padding: "12px 20px",
    borderRadius: 8,
    boxShadow: theme === 'dark' ? "0 1px 3px rgba(0,0,0,0.2)" : "0 1px 2px rgba(0,0,0,0.05)",
    border: theme === 'dark' ? "1px solid rgba(66, 153, 225, 0.25)" : "1px solid rgba(2, 132, 199, 0.15)",
    lineHeight: 1.25,
    textDecoration: "none !important",
    fontWeight: "600",
    fontSize: isMobile ? "16px" : "inherit", // Ensure visible text size on mobile
  };
  
  return (
    <section className="bg-orange-600 text-white" style={{backgroundColor: "#e65100"}}>
      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Ready to enhance your safety and efficiency?</h2>
          <p className="mt-2 text-orange-100">Our experts will design a tailored, future-ready solution for your budget.</p>
        </div>
        <div className="md:text-right">
          <Link
            to="/contact"
            data-cta-link
            className="group no-underline font-semibold focus:outline-none focus:ring-2 focus:ring-sky-200 mobile-cta-button"
            style={buttonStyle}
          >
            <span style={{color: "#0ea5e9"}}>Contact Our Team</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
