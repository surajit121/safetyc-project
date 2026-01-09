import { Typography, Card, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { 
  FireOutlined, 
  SafetyOutlined, 
  VideoCameraOutlined, 
  ThunderboltOutlined,
  WarningOutlined,
  TeamOutlined,
  ToolOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

const serviceCategories = [
  {
    id: "fire-safety-installation",
    icon: FireOutlined,
    emoji: "🔥",
    title: "Fire Safety Installation",
    description: "Complete fire safety system installation including fire alarms, sprinklers, and emergency exits",
    gradient: "from-red-500 to-orange-500",
    glowColor: "rgba(239, 68, 68, 0.3)"
  },
  {
    id: "fire-extinguisher-refilling",
    icon: SafetyOutlined,
    emoji: "🧯",
    title: "Fire Extinguisher Refilling / Rental",
    description: "Professional refilling and rental services for events, puja, factories, and more",
    gradient: "from-rose-500 to-red-500",
    glowColor: "rgba(244, 63, 94, 0.3)"
  },
  {
    id: "cctv-surveillance",
    icon: VideoCameraOutlined,
    emoji: "📹",
    title: "CCTV & Surveillance",
    description: "Advanced security camera systems for home and business surveillance",
    gradient: "from-blue-500 to-indigo-500",
    glowColor: "rgba(59, 130, 246, 0.3)"
  },
  {
    id: "electrical-solar",
    icon: ThunderboltOutlined,
    emoji: "⚡",
    title: "Electrical Works / Solar",
    description: "Complete electrical solutions and solar panel installation services",
    gradient: "from-yellow-500 to-amber-500",
    glowColor: "rgba(245, 158, 11, 0.3)"
  },
  {
    id: "road-safety",
    icon: WarningOutlined,
    emoji: "🚧",
    title: "Road Safety",
    description: "Road safety equipment, signage, and traffic management solutions",
    gradient: "from-orange-500 to-yellow-500",
    glowColor: "rgba(249, 115, 22, 0.3)"
  },
  {
    id: "fire-safety-training",
    icon: TeamOutlined,
    emoji: "🧑‍🚒",
    title: "Fire Safety Training",
    description: "Professional training programs for fire safety and emergency response",
    gradient: "from-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.3)"
  },
  {
    id: "amc-maintenance",
    icon: ToolOutlined,
    emoji: "🏗️",
    title: "AMC & Maintenance",
    description: "Annual maintenance contracts and regular upkeep services for all systems",
    gradient: "from-teal-500 to-cyan-500",
    glowColor: "rgba(20, 184, 166, 0.3)"
  }
];

export default function BookService() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    navigate(`/contact?service=${encodeURIComponent(category.title)}`);
  };

  return (
    <div className={`min-h-screen py-12 px-4 relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-[#0a0a0f]' 
        : 'bg-gradient-to-br from-slate-50 via-white to-orange-50'
    }`}>
      {/* Decorative background elements */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ 
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)'
        }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className={`inline-flex items-center gap-2 mb-8 text-base font-medium transition-all duration-300 group ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-orange-400' 
              : 'text-gray-600 hover:text-orange-500'
          }`}
        >
          <ArrowLeftOutlined className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="text-center mb-14">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
            theme === 'dark' 
              ? 'bg-orange-500/20 text-orange-300' 
              : 'bg-orange-100 text-orange-600'
          }`}>
            Book a Service
          </span>
          
          <h1 className={`heading-xl mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Select Service Category
          </h1>
          
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Choose the type of service you need and we'll guide you through the booking process
          </p>
        </div>

        {/* Service Categories Grid */}
        <Row gutter={[24, 24]} className="stagger-animation">
          {serviceCategories.map((category, index) => (
            <Col xs={24} sm={12} lg={8} key={category.id}>
              <Card
                hoverable
                onClick={() => handleCategorySelect(category)}
                className={`h-full cursor-pointer transition-all duration-500 group ${
                  theme === 'dark' 
                    ? 'bg-[#18181f] border-[#27272a] hover:border-orange-500/30' 
                    : 'bg-white border-gray-200 hover:border-orange-300'
                }`}
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  animationDelay: `${index * 0.05}s`
                }}
                bodyStyle={{ padding: '28px' }}
              >
                {/* Hover glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${category.glowColor} 0%, transparent 70%)`,
                    filter: 'blur(40px)'
                  }}
                />
                
                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Icon with gradient background */}
                  <div 
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${category.gradient} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    style={{
                      boxShadow: `0 10px 30px -10px ${category.glowColor}`
                    }}
                  >
                    <span className="text-4xl">{category.emoji}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.title}
                  </h3>
                  
                  {/* Description */}
                  <p className={`text-sm mb-4 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {category.description}
                  </p>

                  {/* Hover indicator */}
                  <div className={`py-2.5 px-5 rounded-full text-sm font-semibold transition-all duration-300 transform group-hover:-translate-y-1 ${
                    theme === 'dark' 
                      ? 'bg-orange-500/20 text-orange-300 group-hover:bg-orange-500/30' 
                      : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                  }`}>
                    Select this service →
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Help Section */}
        <div className={`mt-16 text-center p-10 rounded-3xl relative overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-[#18181f] to-[#12121a] border border-[#27272a]' 
            : 'bg-gradient-to-br from-white to-slate-50 border border-gray-200 shadow-xl'
        }`}>
          {/* Decorative gradient */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, #f97316, #ea580c, #f97316)'
            }}
          />
          
          <h4 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Not sure which service you need?
          </h4>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Contact us directly and our experts will help you find the right solution
          </p>
          <Link 
            to="/contact" 
            className={`inline-flex items-center gap-2 py-3.5 px-8 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.4)]' 
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.4)]'
            }`}
          >
            Contact Us Directly
          </Link>
        </div>
      </div>
    </div>
  );
}
