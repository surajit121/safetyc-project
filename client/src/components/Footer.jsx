import { Link } from "react-router-dom";
import { Typography } from "antd";
import { useTheme } from "../context/ThemeContext.jsx";

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

            <div className="flex flex-col mt-4">
              <span className="mb-2 font-medium text-gray-700">
                Connect with us:
              </span>
              <div className="flex flex-row items-center space-x-4">
                {/* Social icons preserved */}
                <a
                  href="https://wa.me/919907371539"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 shadow-sm hover:shadow-md bg-white hover:bg-green-50 transition-all duration-300"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="12" fill="#25D366" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.6016 7.35156C14.9922 5.74219 12.8203 4.85938 10.5 4.85938C5.75391 4.85938 1.89844 8.71484 1.89844 13.4609C1.89844 14.9531 2.29688 16.4102 3.03516 17.6953L1.82812 22.1953L6.42188 21.0117C7.66406 21.6797 9.07031 22.0312 10.5 22.0312H10.5C15.2461 22.0312 19.1484 18.1758 19.1484 13.4297C19.1484 11.1094 18.2109 8.96094 16.6016 7.35156ZM10.5 20.4258C9.21094 20.4258 7.95312 20.0898 6.85547 19.4688L6.60938 19.3203L3.94141 19.9883L4.625 17.3828L4.45312 17.1211C3.76953 16.0078 3.40234 14.7539 3.40234 13.4609C3.40234 9.54297 6.58203 6.36328 10.5 6.36328C12.4453 6.36328 14.2891 7.09375 15.6484 8.45312C17.0078 9.8125 17.7383 11.6562 17.7383 13.6016C17.7383 17.5195 14.4492 20.4258 10.5 20.4258ZM14.7031 15.1406C14.4805 15.0312 13.3359 14.4688 13.1484 14.3828C12.9609 14.3125 12.8203 14.2734 12.6797 14.4961C12.5391 14.7188 12.0938 15.2422 11.9688 15.3828C11.8438 15.5234 11.7188 15.5469 11.5 15.4375C10.3086 14.8438 9.50391 14.375 8.69922 13.0078C8.47266 12.5781 8.94922 12.6055 9.39062 11.7188C9.47656 11.5781 9.43359 11.4531 9.37109 11.3438C9.30859 11.2344 8.84766 10.0859 8.66797 9.64062C8.49609 9.20703 8.32031 9.25781 8.19531 9.25C8.07031 9.24219 7.92969 9.24219 7.78906 9.24219C7.64844 9.24219 7.42188 9.30469 7.23438 9.52734C7.04688 9.75 6.44531 10.3125 6.44531 11.4609C6.44531 12.6094 7.26562 13.7188 7.39062 13.8594C7.51562 14 8.82812 15.9922 10.8125 16.9922C12.3516 17.7539 13.0273 17.7422 13.8867 17.6094C14.4141 17.5234 15.3359 17.0391 15.5156 16.5234C15.6953 16.0078 15.6953 15.5625 15.6328 15.4609C15.5703 15.3594 15.4297 15.3125 15.2109 15.2031C15.0391 15.1172 14.9258 15.25 14.7031 15.1406Z"
                      fill="white"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/1D64ztXvSU/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 shadow-sm hover:shadow-md bg-white hover:bg-blue-50 transition-all duration-300"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                      fill="#1877F2"
                    />
                    <path
                      d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z"
                      fill="white"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/safet.yc?utm_source=qr&igsh=ejA5YzIzaWx5aTJ1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 shadow-sm hover:shadow-md bg-white hover:bg-pink-50 transition-all duration-300"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="24"
                      height="24"
                      rx="6"
                      fill="url(#instagram-gradient)"
                    />
                    <path
                      d="M17.3837 8.24253C17.3837 9.04253 16.7337 9.69253 15.9337 9.69253C15.1337 9.69253 14.4837 9.04253 14.4837 8.24253C14.4837 7.44253 15.1337 6.79253 15.9337 6.79253C16.7337 6.79253 17.3837 7.44253 17.3837 8.24253Z"
                      fill="white"
                    />
                    <path
                      d="M12 15.75C9.933 15.75 8.25 14.067 8.25 12C8.25 9.933 9.933 8.25 12 8.25C14.067 8.25 15.75 9.933 15.75 12C15.75 14.067 14.067 15.75 12 15.75ZM12 9.75C10.764 9.75 9.75 10.764 9.75 12C9.75 13.236 10.764 14.25 12 14.25C13.236 14.25 14.25 13.236 14.25 12C14.25 10.764 13.236 9.75 12 9.75Z"
                      fill="white"
                    />
                    <path
                      d="M17.7542 21H6.24617C3.44617 21 1.16992 18.7237 1.16992 15.9237V8.07621C1.16992 5.27621 3.44617 3 6.24617 3H17.7542C20.5542 3 22.8304 5.27621 22.8304 8.07621V15.9237C22.8304 18.7237 20.5542 21 17.7542 21ZM6.24617 4.5C4.28617 4.5 2.66992 6.11621 2.66992 8.07621V15.9237C2.66992 17.8837 4.28617 19.5 6.24617 19.5H17.7542C19.7142 19.5 21.3304 17.8837 21.3304 15.9237V8.07621C21.3304 6.11621 19.7142 4.5 17.7542 4.5H6.24617Z"
                      fill="white"
                    />
                    <defs>
                      <linearGradient
                        id="instagram-gradient"
                        x1="1.91305"
                        y1="22.087"
                        x2="22.087"
                        y2="1.91307"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FFDD55" />
                        <stop offset="0.5" stop-color="#FF543E" />
                        <stop offset="1" stop-color="#C837AB" />
                      </linearGradient>
                    </defs>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-gray-500">
        © 2025 Safetyc. All rights reserved.
      </div>
    </footer>
  );
}
