import { Link, NavLink, useLocation } from "react-router-dom";
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

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
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
              Safety<span className="text-orange-600" style={{color: "#e65100 !important"}}>C</span>
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
            title={null}
            placement="right"
            open={open}
            onClose={() => {
              setOpen(false);
              // Apply mobile fixes after drawer closes to reset any lingering states
              setTimeout(() => applyMobileColorFix(), 100);
            }}
            styles={drawerStyles}
          >
            <div className="flex flex-col gap-6 px-5 pb-6 pt-5">
              <div className="flex items-center justify-between gap-3 mobile-drawer-header">
                <div>
                  <p className="mobile-drawer-label text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">Menu</p>
                  <p className="mobile-drawer-brand text-2xl font-extrabold mt-1 text-slate-900 dark:text-white">
                    Safety
                    <span
                      className="text-orange-600"
                      style={{ color: "#e65100 !important" }}
                    >
                      C
                    </span>
                  </p>
                  <p className="mobile-drawer-subtext text-sm mt-1 text-slate-500 dark:text-slate-300">
                    Integrated safety & security partners
                  </p>
                </div>
                <ThemeToggle variant="drawer" />
              </div>

              <nav className="space-y-3 mobile-drawer-nav">
                {links.map((l) => {
                  const isActive = location.pathname === l.path;
                  return (
                    <Link
                      key={l.path}
                      to={l.path}
                      onClick={() => setOpen(false)}
                      className={`block rounded-2xl px-4 py-3 text-base font-semibold transition-all ${
                        isActive
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                          : "bg-white text-gray-900 border border-slate-200 shadow-sm dark:bg-white/10 dark:text-gray-100 dark:border-white/10"
                      }`}
                      data-active={isActive ? "true" : "false"}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{l.label}</span>
                        <span
                          className={`text-xs uppercase tracking-wide ${
                            isActive
                              ? "text-white/90"
                              : "text-orange-500 dark:text-orange-300"
                          }`}
                        >
                          {isActive ? "Current" : "Go"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white p-5 shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Need assistance?</p>
                <p className="mt-2 text-lg font-bold">Talk with our experts now.</p>
                <div className="mt-4 space-y-3">
                  <Button
                    block
                    href="tel:+919907371539"
                    size="large"
                    className="!h-12 !rounded-2xl font-semibold"
                    icon={<PhoneFilled />}
                  >
                    Call +91 99073 71539
                  </Button>
                  <Button
                    block
                    href="mailto:mssafetyc@gmail.com"
                    size="large"
                    className="!h-12 !rounded-2xl font-semibold"
                    icon={<MailFilled />}
                    type="default"
                  >
                    Email mssafetyc@gmail.com
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 backdrop-blur-sm">
                <p className="font-semibold">Office hours</p>
                <p>Mon - Sat · 9:30 AM to 7:30 PM</p>
              </div>
            </div>
          </Drawer>
        </div>
      </div>
    </Header>
  );
}
