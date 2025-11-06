import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

// Import founder images
import coFounder1 from '../assets/co-founder_1.jpeg';
import coFounder2 from '../assets/co-founder_2.jpeg';

export default function About() {
  // Get theme from context
  const { theme } = useTheme();
  
  // Set CSS variables based on theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--card-bg', '#1f2937');
      document.documentElement.style.setProperty('--card-text', '#f9fafb');
      document.documentElement.style.setProperty('--card-subtext', '#d1d5db');
    } else {
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--card-text', '#1f2937');
      document.documentElement.style.setProperty('--card-subtext', '#4b5563');
    }
  }, [theme]);
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">About safetyc</h1>
      <p className="mt-4 text-gray-700">
        safetyc, founded in 2023, is a sister concern of P R Solutions, which
        has been serving clients since 2013 with a strong reputation for
        reliability and technical excellence. We are a Security Solutions
        Service Provider company offering a wide range of safety, surveillance,
        fire protection, solar, and electrical contracting solutions. Our goal
        is to help our customers achieve complete safety, operational efficiency,
        and peace of mind through reliable and technology-driven services.
      </p>
      <p className="mt-4 text-gray-700">
        Headquartered in Bankura, West Bengal, safetyc operates across 12
        districts and continues to expand its presence throughout the state. We
        have successfully delivered projects for schools, government offices,
        industries, and commercial establishments, becoming a trusted partner
        for integrated safety and security systems.
      </p>
      
      {/* Download Brochure Section */}
      <div 
        className="mt-8 p-6 rounded-lg border shadow-sm dark:shadow-none" 
        style={{
          backgroundColor: 'white',
          borderColor: '#e5e7eb'
        }}
        data-theme-override="true"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          [data-theme-override="true"] {
            background-color: white !important;
            border-color: #e5e7eb !important;
          }
          [data-theme-override="true"] h3 {
            color: #000000 !important;
          }
          [data-theme-override="true"] p {
            color: #333333 !important;
          }
          .dark [data-theme-override="true"] {
            background-color: #111827 !important;
            border-color: #4b5563 !important;
          }
          .dark [data-theme-override="true"] h3 {
            color: #ffffff !important;
          }
          .dark [data-theme-override="true"] p {
            color: #d1d5db !important;
          }
        ` }} />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-semibold" style={{color: '#000000'}}>Download Our Company Brochure</h3>
            <p className="mt-2" style={{color: '#333333'}}>
              Get detailed information about our services, expertise, and completed projects.
            </p>
          </div>
          <a
            href="/assets/safetyc brochure (1).pdf"
            download="safetyc-company-brochure.pdf"
            className="inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            style={{
              backgroundColor: '#f97316',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ea580c';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f97316';
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      <div className="mt-5">
      <h2 className="mt-8 text-2xl font-semibold">Our Services</h2>
      <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
        <li>
          CCTV and Surveillance Systems: Supply, installation, and maintenance
          of advanced IP and analog CCTV systems.
        </li>
        <li>
          Fire Fighting and Safety Systems: Fire extinguishers, hydrant systems,
          alarms, and AMC services.
        </li>
        <li>
          Computer and IT Solutions: Supply, setup, and servicing of computers
          and networking devices.
        </li>
        <li>
          Solar Power Solutions: Installation and maintenance of solar energy
          systems.
        </li>
        <li>
          Electrical Contracting: Comprehensive electrical wiring and
          professional contracting services.
        </li>
      </ul>
      <h2 className="mt-8 text-2xl font-semibold">Our Vision</h2>
      <p className="mt-4 text-gray-700">
        To be recognized as the most trusted and comprehensive safety and
        security solutions provider in Eastern India by combining innovation,
        integrity, and technical expertise to protect people, property, and
        progress.
      </p>
      <h2 className="mt-8 text-2xl font-semibold">Our Mission</h2>
      <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
        <li>
          Deliver end-to-end safety and security solutions with quality and
          reliability.
        </li>
        <li>
          Provide prompt after-sales and AMC services across our operational
          areas.
        </li>
        <li>
          Continually enhance our capabilities through innovation and skilled
          manpower.
        </li>
      </ul>

      {/* Founders Section */}
      <h2 className="mt-12 text-2xl font-semibold">Our Leadership</h2>
      <p className="mt-4 text-gray-900 dark:text-gray-300">
        Meet the visionaries behind safetyc who combine decades of experience with a passion for innovation and excellence.
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Founder 1 */}
        <motion.div 
          className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img 
                src={coFounder1} 
                alt="Co-Founder of safetyc" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Co-Founder';
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-white">Co-Founder</span>
              </div>
            </div>
          </div>
          <div className="p-6" style={{backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', color: theme === 'dark' ? '#f9fafb' : '#1f2937'}}>
            <h3 className="text-xl font-bold" style={{color: 'inherit'}}>Pankaj Mukherjee</h3>
            <p className="mt-2" style={{color: theme === 'dark' ? '#d1d5db' : '#4b5563'}}>
              Our vision is to grow into a leading safety solutions provider in West Bengal and beyond, known for innovation, quality, and creating safer spaces—and at the same time, build more opportunities for professionals to grow and thrive with us.
            </p>
          </div>
        </motion.div>
        
        {/* Founder 2 */}
        <motion.div 
          className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: 'transparent' }}>
              <img 
                src={coFounder2} 
                alt="Co-Founder of safetyc" 
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 20%'}}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Co-Founder';
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-white">Co-Founder</span>
              </div>
            </div>
          </div>
          <div className="p-6" style={{backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', color: theme === 'dark' ? '#f9fafb' : '#1f2937'}}>
            <h3 className="text-xl font-bold" style={{color: 'inherit'}}>Subhajit Mukherjee</h3>
            <p className="mt-2" style={{color: theme === 'dark' ? '#d1d5db' : '#4b5563'}}>
              At safetyc, our mission is simple: to be your go-to safety and security solution across the states, offering quick, hassle-free services anytime, 24/7. We aim to be a trusted name in safety, known for being reliable, innovative, and always there when you need us.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </section>
  );
}
