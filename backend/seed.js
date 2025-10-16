import dotenv from "dotenv";
import { dbconnect } from "./config/db.js";
import Service from "./src/model/Service.js";
import Client from "./src/model/Client.js";
import Project from "./src/model/Project.js";

dotenv.config();

const services = [
  {
    title: "CCTV & Surveillance",
    slug: "cctv-surveillance",
    description:
      "Advanced CCTV sales and services for continuous monitoring and enhanced security.",
    highlights: ["Remote monitoring", "HD/4K cameras", "Maintenance & support"],
  },
  {
    title: "Fire Safety",
    slug: "fire-safety",
    description:
      "Complete fire detection and suppression products and solutions to protect lives and assets.",
    highlights: ["Alarms & panels", "Extinguishers", "AMC"],
  },
  {
    title: "Solar Energy",
    slug: "solar-energy",
    description:
      "Sustainable solar solutions to reduce costs and environmental impact.",
    highlights: ["On-grid/Off-grid", "Rooftop design", "O&M"],
  },
  {
    title: "Computer Sales & Peripherals",
    slug: "computer-sales-peripherals",
    description:
      "High-quality computers and peripherals to optimize operational efficiency.",
    highlights: ["Desktops/Laptops", "Printers/Scanners", "Networking"],
  },
  {
    title: "Electrical Contracting",
    slug: "electrical-contracting",
    description:
      "Certified electrical contracting for safe and efficient power distribution.",
    highlights: ["LT/HT works", "Panel installation", "Compliance"],
  },
];

const clients = [
  { name: "Renowned Manufacturing Plant", role: "Client" },
  { name: "Food Corporation of India (FCI), Divisional Office, Bankura", role: "Client" },
  { name: "Innovative India Private Limited", role: "Client" },
  { name: "Mass Education Extension & L.S Department Office Of The Bankura State Welfare Home", role: "Client" },
  { name: "Food Corporation of India (FCI), Divisional Office, Adra", role: "Client" },
  { name: "Food Corporation of India (FCI), Divisional Office, Purulia", role: "Client" },
  { name: "NIS Facility Management Services Pvt. Ltd.", role: "Client" },
  { name: "M/S Satyam Construction instead of Chattal Builders", role: "Client" },
  { name: "District Magistrate Bankura", role: "Client" },
  { name: "Kamel Himatul Meata Memorial (E.M.) School, A unit of Shree Kharagpur Gujrati samaj", role: "Client" },
  { name: "Pho-com-ney, UNIT solar Power Plant Mejia", role: "Client" },
  { name: "Kanchanpur BPHC", role: "Client" },
  { name: "Maithagopinathpur PHC", role: "Client" },
  { name: "MANKANALI PHC", role: "Client" },
  { name: "MUBARAKPUR SSK", role: "Client" },
  { name: "KOSTIA SSK", role: "Client" },
  { name: "Block Development Officer, Chhatna", role: "Client" },
  { name: "Backward Classes Welfare & Tribal Development Department, Government of West Bengal", role: "Client" },
  { name: "West Bengal M R  Dealer Association", role: "Client" },
  { name: "West Bengal M R Distributor Association", role: "Client" },
  { name: "Indas Thana Samity Co-operative Society", role: "Client" },
  { name: "E-Kart Delivery Office, Purulia", role: "Client" },
  { name: "District Controller Food and supplies Office", role: "Client" },
  { name: "Saltora Block Food and Supplies Office, Government of West Bengal", role: "Client" },
];

const projects = [
  {
    name: "Plant-wide Safety Upgrade",
    sector: "Manufacturing",
    summary:
      "Integrated CCTV and fire safety deployment across the facility in West Bengal.",
    servicesUsed: ["CCTV & Surveillance", "Fire Safety"],
    clientName: "Renowned Manufacturing Plant",
    year: 2024,
  },
  {
    name: "CCTV Camera Projects at FSD Bikna & FSD Adra",
    clientName: "Food Corporation of India (FCI), Divisional Office, Bankura",
    summary:
      "Work Order for repairing and networking CCTV FSD Banka & FSD Adra",
    sector: "Security",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "CCTV Camera setup for NEET UG Examination Center at Bankura and Purba Medinipur District",
    clientName: "Innovative India Private Limited",
    summary:
      "Survey Center Inspection for CCTV setup/installation with charge up services at NET UG & CC Mocks-Mednipur District-Data Extraction & Submission",
    sector: "Education",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "CCTV Camera setup for WBSET Examination Center at Bankura District",
    clientName: "Innovative India Private Limited",
    summary:
      "Survey Center Inspection for CCTV setup/installation with charge up services at WBSET & CC Mocks-Mednipur District-Data Extraction & Submission",
    sector: "Education",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Installation and Maintenance at premises",
    clientName:
      "Mass Education Extension & L.S Department Office Of The Bankura State Welfare Home",
    summary: "Fire Extinguisher Installation and Maintenance",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety"],
    year: 2025,
  },
  {
    name: "AMC of Security and Surveillance System-CCTV Maintenance at FSD Adra & FSD Bikna, Bankura district",
    clientName: "Food Corporation of India (FCI), Divisional Office, Adra",
    summary:
      "AMC of Integrated Security and Surveillance System-CCTV Maintenance, Comprehensive Software, Hardware, Networking System at FSD Adra & FSD Bikna",
    sector: "Security",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "AMC of Security and Surveillance System-CCTV Maintenance at FSD Chharrah & FSD Balarampur, Purulia district",
    clientName: "Food Corporation of India (FCI), Divisional Office, Purulia",
    summary:
      "AMC of Integrated Security and Surveillance System-CCTV Maintenance, Comprehensive Software, Hardware, Networking System at FSD Chharrah & FSD Balarampur, Purulia",
    sector: "Security",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "CCTV Camera Installation at Centralized procurement center (CPC) under Food & Supplies Department, Government of West Bengal",
    clientName: "NIS Facility Management Services Pvt. Ltd.",
    summary:
      "CCTV Camera Installation Bankura, Purulia, Purba Mednipur, purba Bhardhaman, paschim mednipur, Jhargram",
    sector: "Security",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "Fire Hydrant System Installation and Maintenance at Bahrampur",
    clientName: "M/S Satyam Construction instead of Chattal Builders",
    summary: "Fire Hydrant System Installation and Maintenance",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Installation and Maintenance at District Magistrate Bankura",
    clientName: "District Magistrate Bankura",
    summary: "Fire Extinguisher Supply in Bankura District Schools",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Supply and Installation",
    clientName:
      "Kamel Himatul Meata Memorial (E.M.) School, A unit of Shree Kharagpur Gujrati samaj",
    summary: "Fire Extinguisher supplied and installation",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety"],
    year: 2025,
  },
  {
    name: "Security Equipment Supply, Installation",
    clientName: "Pho-com-ney, UNIT solar Power Plant Mejia",
    summary: "Security Equipment Supply, Installation and Commissioning",
    sector: "Security",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Supply and Installation",
    clientName: "Kanchanpur BPHC",
    summary: "Fire Extinguisher Supply and Installation",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Supply and Installation",
    clientName: "Maithagopinathpur PHC",
    summary: "Fire Extinguisher Supply and Installation",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Supply and Installation",
    clientName: "MANKANALI PHC",
    summary: "Fire Extinguisher Supply and Installation",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Supply and Installation",
    clientName: "MUBARAKPUR SSK",
    summary: "Fire Extinguisher Supply and Installation",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety Installation"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Supply and Installation",
    clientName: "KOSTIA SSK",
    summary: "Fire Extinguisher Supply and Installation",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety Installation"],
    year: 2025,
  },
  {
    name: "Fire Extinguisher Supply and Installation",
    clientName: "Block Development Officer, Chhatna",
    summary: "Fire Extinguisher Supply and Installation",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety Installation"],
    year: 2025,
  },
  {
    name: "AMC CCTV Camera at Centralized procurement centre (CPC) under Food & Supplies Department, Government of West Bengal",
    clientName: "NIS Facility Management Services Pvt. Ltd.",
    summary:
      "CCTV Camera Installation Bankura, Purulia, Purba mednipur, purba Bardhaman, paschim mednipur, howrah, birbhum, mursidabad, Hooghly, Birbhum, and Murshidabad District",
    sector: "Security",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "Bio-Metric Attendance System (IRIS) Installation",
    clientName:
      "Backward Classes Welfare & Tribal Development Department, Government of West Bengal",
    summary: "Bio-Metric Attendance System (BIS) Installation",
    sector: "IT",
    servicesUsed: ["Computer Sales & Peripherals"],
    year: 2025,
  },
  {
    name: "Distribution of Fire extinguisher",
    clientName: "West Bengal M R  Dealer Association",
    summary: "Distribution of Fire extinguisher",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety Installation"],
    year: 2025,
  },
  {
    name: "Distribution of Fire extinguisher",
    clientName: "West Bengal M R Distributor Association",
    summary: "Distribution of Fire extinguisher",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety Installation"],
    year: 2025,
  },
  {
    name: "Distribution of Fire extinguisher",
    clientName: "Indas Thana Samity Co-operative Society",
    summary: "Distribution of Fire extinguisher",
    sector: "Fire Safety",
    servicesUsed: ["Fire Safety Installation"],
    year: 2025,
  },
  {
    name: "CCTV Camera Installation and Maintenance at Office Premises",
    clientName: "E-Kart Delivery Office, Purulia",
    summary: "CCTV Camera Installation and Maintenance",
    sector: "Security",
    servicesUsed: ["CCTV & Surveillance"],
    year: 2025,
  },
  {
    name: "Supply and Installation of Computer peripherals",
    clientName: "District Controller Food and supplies Office",
    summary:
      "Supply and Installation of Computer peripherals and maintenance Software, Hardware Service",
    sector: "IT",
    servicesUsed: ["Computer Sales & Peripherals"],
    year: 2025,
  },
  {
    name: "Supply and Installation of Computer peripherals",
    clientName:
      "Saltora Block Food and Supplies Office, Government of West Bengal",
    summary:
      "Supply and Installation of Computer peripherals and maintenance Software, Hardware Service",
    sector: "IT",
    servicesUsed: ["Computer Sales & Peripherals"],
    year: 2025,
  },
];

(async () => {
  await dbconnect();
  await Service.deleteMany({});
  await Client.deleteMany({});
  await Project.deleteMany({});

  await Service.insertMany(services);
  await Client.insertMany(clients);
  await Project.insertMany(projects);

  console.log("Database seeded");
  process.exit(0);
})();
