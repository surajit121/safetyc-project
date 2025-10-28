import { Link } from "react-router-dom";
import { Typography } from "antd";
import { useTheme } from "../context/ThemeContext.jsx";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <Typography.Title level={4} style={{ marginBottom: 8 }}>
            Safetyc
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
            Complete Safety, Security, and Technology Solutions for West Bengal.
          </Typography.Paragraph>
          <div className="text-xs text-gray-500 space-y-1">
            <div>
              <strong>Founders:</strong> Pankaj Mukherjee &amp; Subhajit
              Mukherjeee
            </div>
            <div>
              <strong>PAN:</strong> AFAFS7759D
            </div>
            <div>
              <strong>GSTIN:</strong> 19AFAFS7759D1ZN
            </div>
            <div>
              <strong>Trade License No:</strong> 0917P263852342147
            </div>
            <div>
              <strong>P Tax Enrolment No:</strong> 192162018684
            </div>
            <div>
              <strong>EPFO Registration No:</strong> WBDGP342472000
            </div>
            <div>
              <strong>ESIC Registration No:</strong> 74000807690001099
            </div>
            <div>
              <strong>ISO 9001:2015:</strong> 230422081150QRA
            </div>
            <div>
              <strong>MSME:</strong> UDYAM-WB-02-0013682
            </div>
            <div>
              <strong>Labour Licence:</strong> BAN01/CLR/000078
            </div>
            <div>
              <strong>SAFETYC GeM Seller Id:</strong> UCCH240012054709
            </div>
          </div>
        </div>
        <div>
          <Typography.Title level={5}>Quick Links</Typography.Title>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>
              <Link to="/" className="hover:underline hover:text-orange-600">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:underline hover:text-orange-600"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:underline hover:text-orange-600"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="hover:underline hover:text-orange-600"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/clients"
                className="hover:underline hover:text-orange-600"
              >
                Clients
              </Link>
            </li>
            <li>
              <Link
                to="/careers"
                className="hover:underline hover:text-orange-600"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:underline hover:text-orange-600"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Typography.Title level={5}>Contact</Typography.Title>
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <strong>Registered Office:</strong>
              <div>76/14 Nutanchati, Panchbaga, P.O.- Kenduadihi, Dist & PS Bankura. Word No 24, W.B., Pin 722102.</div>
            </div>
            <div>
              <strong>Corporate Office:</strong>
              <div>Schooldanga, Bankura - 722101, West Bengal, India</div>
            </div>
            <div>
              <strong>Branch Offices:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Purulia - North Lake road, Raghabpur more, Opposite of Reliance Digital, 723101</li>
                <li>Purba Medinipur - 2nd Floor. Opposite Sanhati UtsabGround. Keshabpur, chaitanyapur, Haldia. PIN-721645</li>
                <li>Birbhum - Moumachi Kali Mandir Suri, Birbhum, 731101</li>
                <li>East Burdwan - Near Seharabazar Football Ground, Pin: 713423</li>
                <li>Siliguri - Chowrangee bhavan, Chowrangee more, Potiram jote, Matigara, 734010</li>
                <li>Mejia(Bankura) - Bagangora near Shiv Mandir, Mejhia, Bankura</li>
              </ul>
            </div>
            <div>
              <strong>Phone:</strong> +91 97758 02253, +91 99073 71539
            </div>
            <div>
              <strong>Office:</strong> +91 03242 356676
            </div>
            <div>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:mssafetyc@gmail.com"
                className="text-orange-600 hover:underline"
              >
                mssafetyc@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-6 py-4">
        <a
          href="https://wa.me/919907371539"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 shadow-sm hover:shadow-md bg-white hover:bg-green-50 transition-all duration-300"
        >
          <FaWhatsapp size={24} color="#25D366" />
        </a>
        <a
          href="https://www.facebook.com/share/1D64ztXvSU/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 shadow-sm hover:shadow-md bg-white hover:bg-blue-50 transition-all duration-300"
        >
          <FaFacebook size={24} color="#1877F2" />
        </a>
        <a
          href="https://www.instagram.com/safet.yc?utm_source=qr&igsh=ejA5YzIzaWx5aTJ1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 shadow-sm hover:shadow-md bg-white hover:bg-pink-50 transition-all duration-300"
        >
          <FaInstagram size={24} color="#C837AB" />
        </a>
      </div>
      <div className="border-t py-4 text-center text-xs text-gray-500">
        © 2025 Safetyc. All rights reserved.
      </div>
    </footer>
  );
}
