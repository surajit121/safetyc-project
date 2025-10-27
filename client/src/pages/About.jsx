export default function About() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">About Safetyc</h1>
      <p className="mt-4 text-gray-700">
        Safetyc, founded in 2023, is a sister concern of P R Solutions, which
        has been serving clients since 2013 with a strong reputation for
        reliability and technical excellence. We are a Security Solutions
        Service Provider company offering a wide range of safety, surveillance,
        fire protection, solar, and electrical contracting solutions. Our goal
        is to help our customers achieve complete safety, operational efficiency,
        and peace of mind through reliable and technology-driven services.
      </p>
      <p className="mt-4 text-gray-700">
        Headquartered in Bankura, West Bengal, Safetyc operates across 12
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
        <style jsx>{`
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
        `}</style>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-semibold" style={{color: '#000000'}}>Download Our Company Brochure</h3>
            <p className="mt-2" style={{color: '#333333'}}>
              Get detailed information about our services, expertise, and completed projects.
            </p>
          </div>
          <a
            href="/assets/safetyc brochure (1).pdf"
            download="SafetyC-Company-Brochure.pdf"
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
    </div>
    </section>
  );
}
