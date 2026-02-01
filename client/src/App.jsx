import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "antd";
import { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ActivePageIndicator from "./components/ActivePageIndicator.jsx";
import FaqChatbot from "./components/FaqChatbot.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import applyMobileColorFix from "./utils/mobileColorFix.js";
import { FallbackToastContainer } from "./components/FallbackToast.jsx";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const Clients = lazy(() => import("./pages/Clients.jsx"));
const Careers = lazy(() => import("./pages/Careers.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const BookService = lazy(() => import("./pages/BookService.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
  </div>
);

// Dynamically import react-toastify to handle potential import failures
let ToastContainer = null;
try {
  // Try to load react-toastify
  import('react-toastify/dist/ReactToastify.css')
    .then(() => import('react-toastify'))
    .then(() => {
      ToastContainer = module.ToastContainer;
    })
    .catch(() => {
      // Silently fall back to custom implementation
    });
} catch (error) {
  // Silently fall back to custom implementation
}

export default function App() {
  const { theme } = useTheme();
  const location = useLocation();
  
  // Apply mobile color fixes when component mounts, theme changes, or navigation happens
  // Mobile color fix useEffect removed as improvements are now handled via CSS
  // to avoid initial load layout thrashing
  /* 
  useEffect(() => {
    applyMobileColorFix();
    const fixTimer = setTimeout(() => { applyMobileColorFix(); }, 500);
    return () => clearTimeout(fixTimer);
  }, [theme, location.pathname]); 
  */
  
  // Detect mobile viewport
  const isMobile = typeof window !== 'undefined' && 
    (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 640);
  
  // State to track if react-toastify is loaded
  const [toastifyLoaded, setToastifyLoaded] = useState(false);
  
  // Check if react-toastify is loaded
  useEffect(() => {
    const checkToastify = async () => {
      try {
        const toastify = await import('react-toastify');
        if (toastify && toastify.ToastContainer) {
          ToastContainer = toastify.ToastContainer;
          setToastifyLoaded(true);
          // Successfully loaded react-toastify
        }
      } catch (error) {
        // Silently fall back to custom implementation
        setToastifyLoaded(false);
      }
    };
    
    if (!toastifyLoaded) {
      checkToastify();
    }
  }, [toastifyLoaded]);
  
  return (
    <Layout className={`min-h-screen ${theme} transition-colors app-layout`} data-theme={theme}>
      {toastifyLoaded && ToastContainer ? (
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
      ) : (
        <FallbackToastContainer />
      )}
      <Navbar />
      <Layout.Content className="flex-1">
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-service" element={<BookService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout.Content>
      <Footer />
      <ActivePageIndicator />
      <FaqChatbot />
    </Layout>
  );
}
