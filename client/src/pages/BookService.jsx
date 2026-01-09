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
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: "fire-extinguisher-refilling",
    icon: SafetyOutlined,
    emoji: "🧯",
    title: "Fire Extinguisher Refilling / Rental",
    description: "Professional refilling and rental services for events, puja, factories, and more",
    gradient: "from-rose-500 to-red-500"
  },
  {
    id: "cctv-surveillance",
    icon: VideoCameraOutlined,
    emoji: "📹",
    title: "CCTV & Surveillance",
    description: "Advanced security camera systems for home and business surveillance",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    id: "electrical-solar",
    icon: ThunderboltOutlined,
    emoji: "⚡",
    title: "Electrical Works / Solar",
    description: "Complete electrical solutions and solar panel installation services",
    gradient: "from-yellow-500 to-amber-500"
  },
  {
    id: "road-safety",
    icon: WarningOutlined,
    emoji: "🚧",
    title: "Road Safety",
    description: "Road safety equipment, signage, and traffic management solutions",
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    id: "fire-safety-training",
    icon: TeamOutlined,
    emoji: "🧑‍🚒",
    title: "Fire Safety Training",
    description: "Professional training programs for fire safety and emergency response",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "amc-maintenance",
    icon: ToolOutlined,
    emoji: "🏗️",
    title: "AMC & Maintenance",
    description: "Annual maintenance contracts and regular upkeep services for all systems",
    gradient: "from-teal-500 to-cyan-500"
  }
];

export default function BookService() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    // Navigate to contact page with the selected service pre-filled
    navigate(`/contact?service=${encodeURIComponent(category.title)}`);
  };

  return (
    <div className={`min-h-screen py-12 px-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-orange-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/" 
          className={`inline-flex items-center gap-2 mb-8 text-base font-medium transition-colors ${
            theme === 'dark' 
              ? 'text-gray-300 hover:text-orange-400' 
              : 'text-gray-600 hover:text-orange-500'
          }`}
        >
          <ArrowLeftOutlined />
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <Typography.Title 
            level={1} 
            className={`!mb-4 ${theme === 'dark' ? '!text-white' : '!text-gray-900'}`}
          >
            Select Service Category
          </Typography.Title>
          <Typography.Paragraph 
            className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? '!text-gray-300' : '!text-gray-600'
            }`}
          >
            Choose the type of service you need and we'll guide you through the booking process
          </Typography.Paragraph>
        </div>

        {/* Service Categories Grid */}
        <Row gutter={[24, 24]}>
          {serviceCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Col xs={24} sm={12} lg={8} key={category.id}>
                <Card
                  hoverable
                  onClick={() => handleCategorySelect(category)}
                  className={`h-full cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                    theme === 'dark' 
                      ? 'bg-gray-800/80 border-gray-700 hover:border-orange-500/50' 
                      : 'bg-white border-gray-200 hover:border-orange-400'
                  }`}
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Icon with gradient background */}
                    <div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${category.gradient} shadow-lg`}
                    >
                      <span className="text-3xl">{category.emoji}</span>
                    </div>
                    
                    {/* Title */}
                    <Typography.Title 
                      level={4} 
                      className={`!mb-2 ${theme === 'dark' ? '!text-white' : '!text-gray-900'}`}
                    >
                      {category.title}
                    </Typography.Title>
                    
                    {/* Description */}
                    <Typography.Paragraph 
                      className={`!mb-0 text-sm ${
                        theme === 'dark' ? '!text-gray-400' : '!text-gray-600'
                      }`}
                    >
                      {category.description}
                    </Typography.Paragraph>

                    {/* Hover indicator */}
                    <div className={`mt-4 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      theme === 'dark' 
                        ? 'bg-orange-500/20 text-orange-300' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      Select this service →
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Help Section */}
        <div className={`mt-12 text-center p-8 rounded-2xl ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <Typography.Title 
            level={4} 
            className={theme === 'dark' ? '!text-white' : '!text-gray-900'}
          >
            Not sure which service you need?
          </Typography.Title>
          <Typography.Paragraph 
            className={`!mb-4 ${theme === 'dark' ? '!text-gray-300' : '!text-gray-600'}`}
          >
            Contact us directly and our experts will help you find the right solution
          </Typography.Paragraph>
          <Link 
            to="/contact" 
            className={`inline-flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${
              theme === 'dark' 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            Contact Us Directly
          </Link>
        </div>
      </div>
    </div>
  );
}
