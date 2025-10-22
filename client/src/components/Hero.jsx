import { Link } from "react-router-dom";
import { Typography, Button, Row, Col, Card, Tag, Space, Divider } from "antd";
import { ArrowRightOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import building from "../assets/building.png";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Hero() {
  const { theme } = useTheme();
  
  // List of clients/industries served - for corporate credibility
  const clientSectors = ["Government Institutions", "Manufacturing", "Healthcare", "Educational Institutions", "Commercial Buildings"];
  
  return (
    <section className={theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 via-slate-50 to-white'}>
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-20">
        <Row gutter={[32, 40]} align="middle">
          <Col xs={24} lg={14}>
            <div className="mb-4 flex items-center">
              <SafetyOutlined className="text-orange-500 mr-2" />
              <Tag color="orange" className="text-base px-3 py-1">Trusted by enterprises across West Bengal</Tag>
            </div>
            
            <Typography.Title level={1} style={{ 
              margin: 0, 
              lineHeight: 1.1, 
              fontSize: '2.5rem', 
              fontWeight: 700, 
              marginBottom: '1rem',
              background: theme === 'dark' ? 'linear-gradient(90deg, #fff, #ccc)' : 'linear-gradient(90deg, #1a365d, #2a4365)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Enterprise-Grade Safety & Security Solutions
            </Typography.Title>
            
            <Typography.Title level={2} style={{ 
              fontSize: '1.5rem', 
              margin: 0, 
              marginBottom: '1.5rem',
              fontWeight: 500,
              opacity: 0.85
            }}>
              Protecting what matters most to your business
            </Typography.Title>
            
            <Typography.Paragraph style={{ 
              fontSize: 17, 
              marginBottom: 24,
              lineHeight: 1.6,
              maxWidth: '90%'
            }}>
              Comprehensive CCTV, Fire Safety, Solar, Electrical and IT solutions expertly tailored for enterprises, government institutions, and commercial facilities with professional implementation and support.
            </Typography.Paragraph>
            
            <Space wrap className="mb-8">
              {["ISO Standards", "24/7 Support", "Certified Technicians", "Govt. Approved"].map(item => (
                <div key={item} className={`flex items-center px-3 py-1.5 rounded-full text-sm mr-2 mb-2 ${
                  theme === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-800'
                }`}>
                  <CheckCircleOutlined className="mr-1" /> {item}
                </div>
              ))}
            </Space>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/contact">
                <Button type="primary" size="large" icon={<ArrowRightOutlined />} className="h-12 px-8 text-base font-medium">
                  Request Consultation
                </Button>
              </Link>
              <Link to="/services">
                <Button size="large" className="h-12 px-8 text-base font-medium">
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
              <div className="relative">
                <img
                  src={building}
                  alt="Enterprise Security Solutions"
                  className="w-full object-cover rounded-xl"
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
          <Typography.Text className="text-gray-500 text-base font-medium uppercase tracking-wider">
            Trusted by Organizations Across Industries
          </Typography.Text>
          
          <Row justify="center" className="mt-6">
            {clientSectors.map((sector, index) => (
              <Col key={index} xs={12} sm={8} md={4} className="mb-4 px-2">
                <div className={`py-2 px-3 text-center rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Typography.Text strong className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {sector}
                  </Typography.Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </section>
  );
}

