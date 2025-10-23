import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "antd";
import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ActivePageIndicator from "./components/ActivePageIndicator.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Projects from "./pages/Projects.jsx";
import Clients from "./pages/Clients.jsx";
import Careers from "./pages/Careers.jsx";
import Contact from "./pages/Contact.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import applyMobileColorFix from "./utils/mobileColorFix.js";


export default function App() {
  const { theme } = useTheme();
  const location = useLocation();
  
  // Apply mobile color fixes when component mounts, theme changes, or navigation happens
  useEffect(() => {
    // Apply mobile fixes immediately
    applyMobileColorFix();
    
    // Also reapply after a short delay to catch dynamically rendered elements
    const fixTimer = setTimeout(() => {
      applyMobileColorFix();
    }, 500);
    
    return () => clearTimeout(fixTimer);
  }, [theme, location.pathname]);
  
  // Detect mobile viewport
  const isMobile = typeof window !== 'undefined' && 
    (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 640);
    
  return (
    <Layout className={`min-h-screen ${theme} transition-colors app-layout`} data-theme={theme}>
      <ToastContainer 
        position={isMobile ? "bottom-center" : "top-right"}
        autoClose={4000}
        hideProgressBar={isMobile}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
        toastClassName="rounded-lg shadow-md"
        bodyClassName="text-sm font-medium"
        style={isMobile ? { 
          width: '90%', 
          maxWidth: '400px',
          padding: '0',
          margin: '0 auto 20px'
        } : {}}
      />
      <Navbar />
      <Layout.Content className="flex-1">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout.Content>
      <Footer />
      <ActivePageIndicator />
    </Layout>
  );
}
