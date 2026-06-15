import { Link } from "react-router-dom";
import { Typography } from "antd";
import { useTheme } from "../context/ThemeContext.jsx";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const { theme } = useTheme();

  const socialLinks = [
    {
      href: "https://wa.me/919907371539",
      icon: FaWhatsapp,
      color: "#25D366",
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/20",
      label: "WhatsApp"
    },
    {
      href: "https://www.facebook.com/share/1D64ztXvSU/",
      icon: FaFacebook,
      color: "#1877F2",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
      label: "Facebook"
    },
    {
      href: "https://www.instagram.com/safet.yc?utm_source=qr&igsh=ejA5YzIzaWx5aTJ1",
      icon: FaInstagram,
      color: "#C837AB",
      hoverBg: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
      label: "Instagram"
    }
  ];

  return (
    <footer className={`mt-16 relative overflow-hidden ${theme === 'dark'
        ? 'bg-gradient-to-b from-[#0a0a0f] to-[#12121a]'
        : 'bg-gradient-to-b from-slate-50 to-white'
      }`}>
      {/* Decorative gradient blobs */}
      <div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #f97316, #ea580c)'
            : 'linear-gradient(135deg, #fed7aa, #fdba74)'
        }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
        }}
      />

      {/* Top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)'
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                safety<span className="text-orange-500">c</span>
              </span>
            </div>
            <Typography.Paragraph
              className={`!mb-4 ${theme === 'dark' ? '!text-gray-400' : '!text-gray-600'}`}
            >
              Complete Safety, Security, and Technology Solutions for West Bengal.
            </Typography.Paragraph>

            <div className={`text-xs space-y-1.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>PAN:</strong> AFAFS7759D</div>
                <div><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>GSTIN:</strong> 19AFAFS7759D1ZN</div>
                <div><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>ISO:</strong> 9001:2015</div>
                <div><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>MSME:</strong> UDYAM-WB-02-0013682</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Quick Links
            </h5>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Services" },
                { to: "/projects", label: "Projects" },
                { to: "/clients", label: "Clients" },
                { to: "/careers", label: "Careers" },
                { to: "/contact", label: "Contact" }
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`group flex items-center text-sm transition-all duration-300 ${theme === 'dark'
                        ? 'text-gray-400 hover:text-orange-400'
                        : 'text-gray-600 hover:text-orange-600'
                      }`}
                  >
                    <span className="w-0 h-0.5 bg-orange-500 mr-0 opacity-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Contact
            </h5>
            <div className={`text-sm space-y-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="p-3 rounded-xl transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                <strong className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Corporate Office:
                </strong>
                <span className="text-xs">Royal Residency, Junbedia(Near Damro Furniture), Bankura–722155, Bankura, West Bengal 722101</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">📞</span>
                  <span>+91 97758 02253, +91 99073 71539</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">✉️</span>
                  <a
                    href="mailto:mssafetyc@gmail.com"
                    className="text-orange-500 hover:text-orange-600 hover:underline transition-colors"
                  >
                    mssafetyc@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {socialLinks.map(({ href, icon: Icon, color, hoverBg, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${hoverBg} ${theme === 'dark'
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white border-gray-200 shadow-sm'
                    }`}
                >
                  <Icon size={22} color={color} />
                </a>
              ))}
            </div>

            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              © {new Date().getFullYear()} safetyc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
