import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "antd";
import { useEffect } from "react";
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
  
  return (
    <Layout className={`min-h-screen ${theme} transition-colors app-layout`} data-theme={theme}>
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
