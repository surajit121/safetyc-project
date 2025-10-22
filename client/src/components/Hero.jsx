import { Link } from "react-router-dom";
import { Typography, Button, Row, Col, Card, Tag, Space, Divider } from "antd";
import { ArrowRightOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

// Import image dynamically to improve initial load time
const buildingImageUrl = new URL('../assets/building.png', import.meta.url).href;

export default function Hero() {
  const { theme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Preload the image
  useEffect(() => {
    const img = new Image();
    img.src = buildingImageUrl;
    img.onload = () => setImageLoaded(true);
    
    // Add link preload to head
    const linkPreload = document.createElement('link');
    linkPreload.rel = 'preload';
    linkPreload.as = 'image';
    linkPreload.href = buildingImageUrl;
    document.head.appendChild(linkPreload);
    
    return () => {
      document.head.removeChild(linkPreload);
    };
  }, []);
  
  // List of clients/industries served - for corporate credibility
  const clientSectors = ["Government Institutions", "Manufacturing", "Healthcare", "Educational Institutions", "Commercial Buildings"];
  
  return (
    <section className={theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 via-slate-50 to-white'}>
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-20">
        <Row gutter={[32, 40]} align="middle">
          <Col xs={24} lg={14}>
            <div className="mb-4 flex items-center">
              <SafetyOutlined className={`text-xl ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} mr-2`} />
              <div className={`text-sm md:text-base px-3 py-1 rounded-md font-medium ${
                theme === 'dark' ? 'bg-orange-900/50 text-orange-200' : 'bg-orange-100 text-orange-800'
              }`}>
                Trusted by enterprises across West Bengal
              </div>
            </div>
            
            {/* Regular title instead of gradient text for better visibility and mobile compatibility */}
            <h1 className={`text-4xl md:text-5xl font-bold leading-tight mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-blue-900'
            }`}>
              Enterprise-Grade Safety & Security Solutions
            </h1>
            
            <h2 className={`text-xl md:text-2xl font-medium mb-6 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Protecting what matters most to your business
            </h2>
            
            <p className={`text-base md:text-lg mb-6 leading-relaxed max-w-[95%] md:max-w-[90%] ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Comprehensive CCTV, Fire Safety, Solar, Electrical and IT solutions expertly tailored for enterprises, government institutions, and commercial facilities with professional implementation and support.
            </p>
            
            <div className="flex flex-wrap mb-8">
              {["ISO Standards", "24/7 Support", "Certified Technicians", "Govt. Approved"].map(item => (
                <div key={item} className={`flex items-center px-3 py-1.5 rounded-full text-sm mr-2 mb-2 border ${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 text-blue-200 border-blue-800' 
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  <CheckCircleOutlined className={`mr-1.5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} /> 
                  {item}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
              <Link to="/contact">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ArrowRightOutlined />} 
                  className="h-11 md:h-12 px-4 md:px-8 text-sm md:text-base font-medium"
                  style={{
                    background: theme === 'dark' ? '#3182ce' : undefined, // Brighter blue in dark mode
                    borderColor: theme === 'dark' ? '#2c5282' : undefined
                  }}
                >
                  Request Consultation
                </Button>
              </Link>
              <Link to="/services">
                <Button 
                  size="large" 
                  className="h-11 md:h-12 px-4 md:px-8 text-sm md:text-base font-medium"
                  style={{
                    borderColor: theme === 'dark' ? '#718096' : undefined,
                    color: theme === 'dark' ? '#e2e8f0' : undefined
                  }}
                >
                  View Solutions
                </Button>
              </Link>
            </div>
          </Col>
          
          <Col xs={24} lg={10}>
            <Card
              bordered={false}
              bodyStyle={{ padding: 0 }}
              className="shadow-2xl rounded-2xl overflow-hidden"
              style={{ 
                background: 'transparent',
                boxShadow: theme === 'dark' ? '0 20px 25px -5px rgba(0, 0, 0, 0.5)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div 
                className="relative" 
                style={{ 
                  minHeight: '300px',
                  backgroundColor: theme === 'dark' ? '#2d3748' : '#e2e8f0',
                  borderRadius: '0.75rem'
                }}
              >
                {/* Low quality placeholder with colored background */}
                <div 
                  className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{ 
                    opacity: imageLoaded ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>

                {/* Actual image that will fade in when loaded */}
                <img
                  src={buildingImageUrl}
                  alt="Enterprise Security Solutions"
                  className={`w-full object-cover rounded-xl transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="eager" 
                  decoding="async"
                  fetchPriority="high"
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    maxHeight: '450px',
                    objectPosition: 'center'
                  }}
                />
                <div className={`absolute inset-0 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-tr from-black/50 to-transparent' : 'bg-gradient-to-tr from-blue-900/20 to-transparent'}`}></div>
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* Client Industries Section */}
        <Divider className="my-12" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }} />
        
        <div className="text-center">
          <p className={`text-sm md:text-base font-medium uppercase tracking-wider ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Trusted by Organizations Across Industries
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mt-6">
            {clientSectors.map((sector, index) => (
              <div key={index} className={`py-2 px-2 md:px-3 text-center rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800/80 text-gray-300 border border-gray-700' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                <p className="text-xs md:text-sm font-medium">
                  {sector}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

