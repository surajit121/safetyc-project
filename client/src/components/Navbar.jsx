import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Drawer } from "antd";
import { MenuOutlined, PhoneFilled, MailFilled } from "@ant-design/icons";
import { useMemo, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import applyMobileColorFix from "../utils/mobileColorFix.js";


const { Header } = Layout;

const links = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  // { label: "Products", path: "/products" },
  { label: "Projects", path: "/projects" },
  { label: "Clients", path: "/clients" },
  { label: "Careers", path: "/careers" },
  { label: "Contact", path: "/contact" },
];

function BrandMark() {
  return (
    <span className="brand-text">
      safety
      <span className="brand-accent">c</span>
    </span>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const drawerStyles = useMemo(() => ({
    body: {
      padding: 0,
      background:
        theme === "dark"
          ? "linear-gradient(180deg, #0f172a 0%, #111827 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    },
    header: {
      borderBottom: "none",
      background: "transparent",
    },
  }), [theme]);

  const selectedKeys = useMemo(() => {
    // map current pathname to matching menu key
    // Handle exact path matching for home page
    if (location.pathname === "/") {
      return ["/"];
    }
    // For other pages, check if the path exists in our links
    const match = links.find((l) => l.path === location.pathname);
    return match ? [match.path] : [];
  }, [location.pathname]);
  
  // Add scroll detection for navbar shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Apply mobile color fixes when location changes to ensure proper highlighting
  useEffect(() => {
    // Close the mobile drawer whenever the route changes
    setOpen(false);

    // Apply fixes after a short delay to ensure DOM has updated
    const fixTimer = setTimeout(() => {
      applyMobileColorFix();
    }, 100);
    
    return () => clearTimeout(fixTimer);
  }, [location.pathname]);

  return (
    <Header
      className={`sticky top-0 z-50 px-4 md:px-8 shadow-sm transition-colors flex items-center min-h-[80px] ${scrolled ? 'scrolled' : ''}`}
      style={{ backgroundColor: 'var(--header-bg)' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 w-full">
        <div className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-2xl font-extrabold tracking-tight hover:opacity-90 transition-colors mr-4"
            aria-label="Safetyc Home"
          >
            <BrandMark />
          </Link>
        </div>

        {/* Desktop menu - CENTERED */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <Menu
            mode="horizontal"
            selectedKeys={selectedKeys}
            items={links.map((l) => ({ 
              key: l.path, 
              label: <NavLink 
                to={l.path} 
                className={({ isActive }) => {
                  // For home link, be very specific about matching only the exact root path
                  if (l.path === "/") {
                    // Only highlight home when we're exactly at the root path
                    return location.pathname === "/" ? "text-orange-600 font-medium" : "hover:text-orange-600";
                  }
                  // For other links, use React Router's isActive prop
                  return isActive ? "text-orange-600 font-medium" : "hover:text-orange-600";
                }}
                end={l.path === "/" ? true : false} // Ensure exact matching for home path
              >
                {l.label}
              </NavLink>
            }))}
            className="border-0 bg-transparent min-w-[500px] justify-center"
          />
        </div>

        {/* Right side actions - Theme Toggle & Get Quote */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle 
            className="hidden md:flex theme-toggle-navbar" 
            variant="default"
            key={`theme-toggle-${theme}`} 
          />
          <Button 
            type="primary" 
            className="bg-blue-600 hover:bg-blue-700 font-medium px-6 h-10 rounded-lg"
            onClick={() => navigate('/contact')}
          >
            Get Quote
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button 
            type="text" 
            size="large"
            icon={<MenuOutlined />} 
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            className="mobile-menu-button"
          />
          <Drawer
            title={null}
            placement="bottom"
            open={open}
            height="85vh"
            onClose={() => {
              setOpen(false);
              setTimeout(() => applyMobileColorFix(), 100);
            }}
            styles={{
              wrapper: { boxShadow: "0 -4px 24px rgba(0,0,0,0.15)" },
              content: { 
                borderTopLeftRadius: "24px", 
                borderTopRightRadius: "24px",
                background: "var(--mobile-drawer-bg)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--mobile-drawer-border)",
                borderBottom: "none"
              },
              body: { padding: 0 },
              mask: { backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.3)" }
            }}
          >
            <div className="flex flex-col h-full">
              {/* Drag Handle Indicator */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700/50" />
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-gray-200 dark:border-gray-800">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-orange-600 mb-0.5">Menu</span>
                  <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    safety<span className="text-orange-600">c</span>
                  </span>
                </div>
                <ThemeToggle variant="drawer" />
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
                {links.map((l) => {
                  const isActive = location.pathname === l.path;
                  return (
                    <Link
                      key={l.path}
                      to={l.path}
                      onClick={() => setOpen(false)}
                      className={`group relative flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          : "bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200"
                      }`}
                      style={{
                        // Force explicit color to override any potential global :visited styles
                        color: isActive ? (theme === 'dark' ? '#fb923c' : '#ea580c') : (theme === 'dark' ? '#e5e7eb' : '#1f2937')
                      }}
                    >
                      <span className="text-base font-semibold tracking-wide">
                        {l.label}
                      </span>
                      
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="p-5">
                <Button 
                  type="primary" 
                  className="w-full h-14 text-base font-bold rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 border-0 shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all text-white"
                  onClick={() => {
                    setOpen(false);
                    navigate('/contact');
                  }}
                >
                  Get a Free Quote
                </Button>
                
                <div className="mt-6 flex items-center justify-center gap-6 pb-6">
                  <a href="tel:+919907371539" className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-orange-600 transition-colors group-hover:bg-orange-100">
                      <PhoneFilled className="text-xl" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Call</span>
                  </a>
                  <a href="mailto:mssafetyc@gmail.com" className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                      <MailFilled className="text-xl" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Email</span>
                  </a>
                </div>
              </div>
            </div>
          </Drawer>
        </div>
      </div>
    </Header>
  );
}
