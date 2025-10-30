import { Link, NavLink, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
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

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
      className="sticky top-0 z-50 px-4 shadow-sm transition-colors"
      style={{ padding: "0 16px", backgroundColor: theme === 'dark' ? 'var(--header-bg)' : 'var(--header-bg)' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-2xl font-extrabold tracking-tight hover:opacity-90 transition-colors mr-4"
            aria-label="Safetyc Home"
          >
            <span>
              SAFETY<span className="text-orange-600" style={{color: "#e65100 !important"}}>C</span>
            </span>
          </Link>
          
          <ThemeToggle 
            className="hidden md:flex theme-toggle-navbar" 
            variant="default"
            key={`theme-toggle-${theme}`} 
          />
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center justify-end">
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
            className="border-0 bg-transparent"
          />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button type="text" icon={<MenuOutlined />} onClick={() => setOpen(true)} />
          <Drawer
            title="Menu"
            placement="right"
            open={open}
            onClose={() => {
              setOpen(false);
              // Apply mobile fixes after drawer closes to reset any lingering states
              setTimeout(() => applyMobileColorFix(), 100);
            }}
          >
            <div className="flex items-center mb-4">
              <span className="text-base mr-2">Theme:</span>
              <ThemeToggle variant="drawer" />
            </div>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              onClick={() => setOpen(false)}
              forceSubMenuRender={false}
              className="mobile-menu bg-white dark:bg-gray-900"
              items={links.map((l) => ({
                key: l.path,
                className: "",
                label: <Link 
                  to={l.path}
                  onClick={() => setOpen(false)}
                  className={location.pathname === l.path ? "text-orange-600 font-semibold" : "text-gray-700 hover:text-orange-600"}
                  data-active={location.pathname === l.path ? "true" : "false"}
                >
                  {l.label}
                </Link>,
              }))}
            />
          </Drawer>
        </div>
      </div>
    </Header>
  );
}
