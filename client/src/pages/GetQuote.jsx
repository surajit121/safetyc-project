import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Steps, 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Upload, 
  message, 
  Row, 
  Col, 
  Typography,
  Radio,
  InputNumber
} from "antd";
import { 
  FireOutlined, 
  SafetyOutlined, 
  VideoCameraOutlined, 
  ThunderboltOutlined,
  WarningOutlined,
  TeamOutlined,
  ToolOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  CheckCircleOutlined,
  BuildOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext.jsx";
import SEO from "../components/SEO.jsx";
import axios from "axios";
import { apiUrl } from "../lib/api.js";
import { ToastManager } from "../components/FallbackToast.jsx";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Request Type Options
const requestTypes = [
  {
    id: "new-installation",
    emoji: "🏗️",
    icon: BuildOutlined,
    title: "New Installation",
    description: "Set up brand-new safety systems, CCTV, electrical, fire safety, or solar panels for your property",
    gradient: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16, 185, 129, 0.35)",
    accentColor: "#10b981"
  },
  {
    id: "service-repair",
    emoji: "🔧",
    icon: SettingOutlined,
    title: "Service & Repair",
    description: "Maintenance, repair, AMC, troubleshooting, or upgrades for your existing systems",
    gradient: "from-blue-500 to-indigo-600",
    glowColor: "rgba(59, 130, 246, 0.35)",
    accentColor: "#3b82f6"
  }
];

// Service Categories Data (Reused/Shared structure)
const serviceCategories = [
  {
    id: "fire-safety-installation",
    icon: FireOutlined,
    emoji: "🔥",
    title: "Fire Safety",
    description: "Installation of alarms, sprinklers, & exits",
    gradient: "from-red-500 to-orange-500",
    glowColor: "rgba(239, 68, 68, 0.3)"
  },
  {
    id: "fire-extinguisher-refilling",
    icon: SafetyOutlined,
    emoji: "🧯",
    title: "Extinguisher Service",
    description: "Refilling and rental availability",
    gradient: "from-rose-500 to-red-500",
    glowColor: "rgba(244, 63, 94, 0.3)"
  },
  {
    id: "cctv-surveillance",
    icon: VideoCameraOutlined,
    emoji: "📹",
    title: "CCTV Surveillance",
    description: "Home & Business camera systems",
    gradient: "from-blue-500 to-indigo-500",
    glowColor: "rgba(59, 130, 246, 0.3)"
  },
  {
    id: "electrical-solar",
    icon: ThunderboltOutlined,
    emoji: "⚡",
    title: "Electrical Works",
    description: "Wiring, repairs, and solar panels",
    gradient: "from-yellow-500 to-amber-500",
    glowColor: "rgba(245, 158, 11, 0.3)"
  },
  {
    id: "gps-tracking",
    icon: EnvironmentOutlined,
    emoji: "🛰️",
    title: "GPS Tracking",
    description: "Vehicle and asset tracking solutions",
    gradient: "from-green-500 to-emerald-500",
    glowColor: "rgba(16, 185, 129, 0.3)"
  },
  {
    id: "event-rental",
    icon: HomeOutlined,
    emoji: "🎪",
    title: "Event / Puja Rental",
    description: "Temporary safety setups for events",
    gradient: "from-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.3)"
  }
];

export default function GetQuote() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: null,
    requestType: null,
    siteType: "",
    siteLocation: "",
    areaSize: "",
    name: "",
    phone: "",
    email: "",
    serviceDetails: {},
    files: [],
    notes: ""
  });

  // Handle URL params for pre-selection
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const typeParam = searchParams.get('type');
    
    if (typeParam) {
      setFormData(prev => ({ ...prev, requestType: typeParam }));
      // If type is pre-selected from BookService, skip step 0
      if (serviceParam) {
        const matched = serviceCategories.find(s => s.title === serviceParam || s.id === serviceParam);
        if (matched) {
          setFormData(prev => ({ ...prev, service: matched }));
          setCurrentStep(2); // Skip to site details (step 2)
        }
      } else {
        setCurrentStep(1); // Skip to service selection (step 1)
      }
    }
  }, [searchParams]);

  const next = () => setCurrentStep(prev => prev + 1);
  const prev = () => setCurrentStep(prev => prev - 1);

  const handleRequestTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, requestType: type.id }));
    next();
  };

  const handleServiceSelect = (service) => {
    setFormData(prev => ({ ...prev, service }));
    next();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare booking payload for the new bookings API
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.siteLocation
        },
        service: {
          type: formData.service?.title,
          category: formData.service?.id,
          requestType: formData.requestType || "new-installation",
          details: formData.serviceDetails
        },
        site: {
          type: formData.siteType,
          location: formData.siteLocation,
          areaSize: formData.areaSize
        },
        notes: formData.notes
      };

      // Use direct API URL logic
      let url;
      const apiBase = import.meta.env.VITE_API_URL;
      if (apiBase === 'safetyc-api') {
        url = 'https://safetyc-api.onrender.com/api/bookings';
      } else {
        url = apiUrl('/bookings');
      }

      const response = await axios.post(url, payload);
      
      // Store booking number for success message
      if (response.data.ok) {
        setFormData(prev => ({ ...prev, bookingNumber: response.data.bookingNumber }));
      }
      
      // Success state
      setCurrentStep(5); // Move to Success Step
      
      // Try using toast if available, otherwise fallback
      try {
        import('react-toastify').then(({ toast }) => {
          toast.success("Booking request received!");
        });
      } catch (e) {
        ToastManager.success("Booking request received!");
      }

    } catch (error) {
      console.error("Submission error:", error);
      try {
        import('react-toastify').then(({ toast }) => {
          toast.error("Failed to submit. Please try again.");
        });
      } catch (e) {
        ToastManager.error("Failed to submit. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- STEPS RENDERERS ---

  // Step 0: Request Type (New Installation vs Service & Repair)
  const renderStep0_RequestType = () => (
    <div className="animate-fade-in">
      <Title level={3} className={`text-center mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        What do you need?
      </Title>
      <p className={`text-center mb-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Tell us whether you need a brand-new installation or service for an existing system
      </p>

      <Row gutter={[32, 32]} justify="center">
        {requestTypes.map((type, index) => (
          <Col xs={24} sm={12} lg={10} key={type.id}>
            <Card
              hoverable
              onClick={() => handleRequestTypeSelect(type)}
              className={`h-full cursor-pointer transition-all duration-500 group relative overflow-hidden ${
                formData.requestType === type.id
                  ? (theme === 'dark' ? 'border-orange-500 bg-orange-900/10' : 'border-orange-500 bg-orange-50')
                  : theme === 'dark' 
                    ? 'bg-[#18181f] border-[#27272a] hover:border-transparent' 
                    : 'bg-white border-gray-200 hover:border-transparent hover:shadow-2xl'
              }`}
              style={{
                borderRadius: '24px',
                animationDelay: `${index * 0.1}s`
              }}
              bodyStyle={{ padding: '40px 32px' }}
            >
              {/* Hover glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${type.glowColor} 0%, transparent 70%)`,
                  filter: 'blur(40px)'
                }}
              />

              {/* Top gradient border on hover */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${type.accentColor}, transparent)`
                }}
              />
              
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Icon with gradient background */}
                <div 
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 bg-gradient-to-br ${type.gradient} shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  style={{
                    boxShadow: `0 15px 40px -12px ${type.glowColor}`
                  }}
                >
                  <span className="text-5xl">{type.emoji}</span>
                </div>
                
                {/* Title */}
                <h2 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {type.title}
                </h2>
                
                {/* Description */}
                <p className={`text-base mb-6 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {type.description}
                </p>

                {/* Select button */}
                <div className={`py-3 px-8 rounded-full text-sm font-semibold transition-all duration-300 transform group-hover:-translate-y-1 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white group-hover:bg-white/20' 
                    : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                }`}
                style={{
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  Select {type.title} →
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  // Step 1: Service Category Selection
  const renderStep1_ServiceSelection = () => (
    <div className="animate-fade-in">
      <Title level={3} className={`text-center mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        What service do you need?
      </Title>
      <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Select a category below to get started
      </p>

      {/* Request type badge */}
      {formData.requestType && (
        <div className="flex justify-center mb-8">
          <div className={`inline-flex items-center gap-2 py-2 px-5 rounded-full text-sm font-semibold ${
            formData.requestType === 'new-installation'
              ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
              : (theme === 'dark' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200')
          }`}>
            <span className="text-base">{formData.requestType === 'new-installation' ? '🏗️' : '🔧'}</span>
            {formData.requestType === 'new-installation' ? 'New Installation' : 'Service & Repair'}
          </div>
        </div>
      )}

      <Row gutter={[24, 24]}>
        {serviceCategories.map((service, index) => (
          <Col xs={24} sm={12} md={8} key={service.id}>
            <Card
              hoverable
              onClick={() => handleServiceSelect(service)}
              className={`h-full text-center transition-all duration-500 group relative overflow-hidden ${
                formData.service?.id === service.id 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                  : theme === 'dark' ? 'bg-[#18181f] border-[#27272a] hover:border-orange-500/30' : 'bg-white border-gray-200 hover:border-orange-300'
              }`}
              style={{ borderRadius: '20px', animationDelay: `${index * 0.05}s` }}
              bodyStyle={{ padding: '28px' }}
            >
              {/* Hover glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${service.glowColor} 0%, transparent 70%)`,
                  filter: 'blur(40px)'
                }}
              />

              <div className="relative z-10">
                <div 
                  className={`w-18 h-18 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 bg-gradient-to-br ${service.gradient} text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  style={{
                    width: '72px', height: '72px',
                    boxShadow: `0 10px 30px -10px ${service.glowColor}`
                  }}
                >
                  {service.emoji}
                </div>
                <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {service.title}
                </h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {service.description}
                </p>
                <div className={`py-2 px-5 rounded-full text-sm font-semibold transition-all duration-300 transform group-hover:-translate-y-1 ${
                  theme === 'dark'
                    ? 'bg-orange-500/20 text-orange-300 group-hover:bg-orange-500/30'
                    : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                }`}>
                  Select →
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderStep2_SiteDetails = () => (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Title level={3} className={`text-center mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Tell us about your site
      </Title>

      {/* Request type + service badge */}
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        {formData.requestType && (
          <span className={`inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full text-xs font-semibold ${
            formData.requestType === 'new-installation'
              ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
              : (theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700')
          }`}>
            {formData.requestType === 'new-installation' ? '🏗️ New Installation' : '🔧 Service & Repair'}
          </span>
        )}
        {formData.service && (
          <span className={`inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full text-xs font-semibold ${
            theme === 'dark' ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
          }`}>
            {formData.service.emoji} {formData.service.title}
          </span>
        )}
      </div>
      
      <Form layout="vertical" size="large" className="mt-4">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label={<span className={theme === 'dark' ? 'text-gray-300' : ''}>Site Type</span>} required>
              <Radio.Group 
                value={formData.siteType} 
                onChange={e => handleInputChange('siteType', e.target.value)}
                className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {['Home', 'Office', 'Factory', 'Event'].map(type => (
                  <Radio.Button 
                    key={type} 
                    value={type}
                    className={`text-center rounded-lg border flex items-center justify-center h-12 ${
                      theme === 'dark' ? 'bg-[#1f2937] border-gray-700 text-white' : ''
                    }`}
                  >
                    {type}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item label={<span className={theme === 'dark' ? 'text-gray-300' : ''}>Approx. Area (sq ft)</span>} required>
              <InputNumber 
                className="w-full rounded-lg" 
                placeholder="e.g. 1500" 
                min={0}
                value={formData.areaSize}
                onChange={val => handleInputChange('areaSize', val)}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item label={<span className={theme === 'dark' ? 'text-gray-300' : ''}>Location / City</span>} required>
              <Input 
                prefix={<EnvironmentOutlined className="text-gray-400" />}
                placeholder="e.g. Kolkata, Salt Lake" 
                className="rounded-lg"
                value={formData.siteLocation}
                onChange={e => handleInputChange('siteLocation', e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#1f2937] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Contact Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Your Name" 
                  className="rounded-lg"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                />
                <Input 
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Phone Number" 
                  className="rounded-lg"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                />
                <Input 
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email Address" 
                  className="rounded-lg sm:col-span-2"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );

  const renderStep3_ServiceOptions = () => {
    // Dynamic fields based on service selection
    const getFields = () => {
      switch(formData.service?.id) {
        case 'cctv-surveillance':
          return (
            <>
              {/* 1. Technical Requirements */}
              <div className={`p-4 rounded-xl border mb-6 ${theme === 'dark' ? 'bg-[#1f2937] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Technical Requirements</h4>
                
                <Form.Item label="Number of Cameras">
                  <InputNumber 
                    min={1} 
                    max={100} 
                    placeholder="e.g. 8" 
                    className="w-full"
                    onChange={v => handleInputChange('serviceDetails', {...formData.serviceDetails, cameraCount: v})}
                  />
                </Form.Item>

                <Form.Item label="Camera Type Preference">
                  <Select 
                    mode="multiple"
                    placeholder="Select camera types"
                    onChange={v => handleInputChange('serviceDetails', {...formData.serviceDetails, cameraType: v})}
                  >
                    <Option value="dome">Dome (Discreet, indoor/ceiling)</Option>
                    <Option value="bullet">Bullet (Visible deterrent, outdoor/long-range)</Option>
                    <Option value="ptz">PTZ (Pan-Tilt-Zoom, active monitoring)</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Technology">
                  <Radio.Group onChange={e => handleInputChange('serviceDetails', {...formData.serviceDetails, technology: e.target.value})}>
                    <Radio value="ip">IP (Network-based)</Radio>
                    <Radio value="analog">Analog/HD-TVI</Radio>
                    <Radio value="not-sure">Not Sure</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="Resolution">
                  <Radio.Group onChange={e => handleInputChange('serviceDetails', {...formData.serviceDetails, resolution: e.target.value})}>
                    <Radio value="2mp">2MP (1080p)</Radio>
                    <Radio value="4mp">4MP (2K)</Radio>
                    <Radio value="8mp">8MP (4K)</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="Storage Duration">
                  <Radio.Group onChange={e => handleInputChange('serviceDetails', {...formData.serviceDetails, storageDuration: e.target.value})}>
                    <Radio value="7days">7 Days</Radio>
                    <Radio value="15days">15 Days</Radio>
                    <Radio value="30days">30 Days</Radio>
                    <Radio value="60days">60+ Days</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              {/* 2. Installation Details */}
              <div className={`p-4 rounded-xl border mb-6 ${theme === 'dark' ? 'bg-[#1f2937] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Installation Details</h4>
                
                <Form.Item label="Environment">
                  <Radio.Group onChange={e => handleInputChange('serviceDetails', {...formData.serviceDetails, environment: e.target.value})}>
                    <Radio value="indoor">Indoor Only</Radio>
                    <Radio value="outdoor">Outdoor Only</Radio>
                    <Radio value="both">Both</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="Mounting Surface">
                  <Select 
                    mode="multiple"
                    placeholder="Select mounting surfaces"
                    onChange={v => handleInputChange('serviceDetails', {...formData.serviceDetails, mountingSurface: v})}
                  >
                    <Option value="concrete">Concrete/Brick</Option>
                    <Option value="wood">Wood</Option>
                    <Option value="ceiling">False Ceiling</Option>
                    <Option value="metal">Metal</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Remote Viewing (Smartphone/Tablet access)">
                  <Radio.Group onChange={e => handleInputChange('serviceDetails', {...formData.serviceDetails, remoteViewing: e.target.value})}>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="Internet Available at Site?">
                  <Radio.Group onChange={e => handleInputChange('serviceDetails', {...formData.serviceDetails, internetAvailable: e.target.value})}>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              {/* 3. Service & Maintenance */}
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#1f2937] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Service & Maintenance (Post-Warranty)</h4>
                
                <Form.Item label="Select Service Type">
                  <Radio.Group 
                    className="w-full"
                    onChange={e => handleInputChange('serviceDetails', {...formData.serviceDetails, serviceType: e.target.value})}
                  >
                    <div className="space-y-3">
                      <Radio value="standard" className="block">
                        <span className="font-medium">Standard Installation</span>
                        <span className={`block text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>One-time setup with standard product warranty</span>
                      </Radio>
                      <Radio value="amc" className="block">
                        <span className="font-medium">AMC (Annual Maintenance)</span>
                        <span className={`block text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Regular health checks, cleaning, and labor for repairs. (Parts charged extra)</span>
                      </Radio>
                      <Radio value="camc" className="block">
                        <span className="font-medium">CAMC (Comprehensive AMC)</span>
                        <span className={`block text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Includes labor and replacement of faulty parts/cables</span>
                      </Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </div>
            </>
          );
        case 'fire-safety-installation':
          return (
            <>
              <Form.Item label="Requirement Type">
                <Select mode="multiple" placeholder="Select all that apply" onChange={v => handleInputChange('serviceDetails', {...formData.serviceDetails, requirements: v})}>
                  <Option value="alarms">Fire Alarms / Smoke Detectors</Option>
                  <Option value="sprinklers">Sprinkler System</Option>
                  <Option value="hydrants">Fire Hydrants</Option>
                  <Option value="extinguishers">Extinguishers</Option>
                </Select>
              </Form.Item>
            </>
          );
        default:
          return (
            <div className="text-center py-8">
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                Please describe your specific requirements in the notes section on the next step.
              </p>
            </div>
          );
      }
    };

    return (
      <div className="max-w-xl mx-auto animate-fade-in">
         <Title level={3} className={`text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {formData.service?.title} Options
        </Title>
        <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Specific details help us give you an accurate quote
        </p>
        
        <Form layout="vertical" size="large">
          {getFields()}
        </Form>
      </div>
    );
  };

  const renderStep4_UploadNotes = () => (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Title level={3} className={`text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Almost there! Any extra info?
      </Title>

      <Form layout="vertical" size="large">
        <Form.Item label={<span className={theme === 'dark' ? 'text-gray-300' : ''}>Additional Notes / Specific Requirements</span>}>
          <TextArea 
            rows={4} 
            placeholder="Describe your project, timeline, or any specific constraints..." 
            className="rounded-xl"
            value={formData.notes}
            onChange={e => handleInputChange('notes', e.target.value)}
          />
        </Form.Item>
        
        <Form.Item label={<span className={theme === 'dark' ? 'text-gray-300' : ''}>Upload Photos / Layouts (Optional)</span>}>
          <Upload.Dragger 
            multiple 
            listType="picture" 
            className={theme === 'dark' ? 'dark-dragger' : ''}
            beforeUpload={() => false} // Prevent auto upload
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ color: '#f97316' }} />
            </p>
            <p className="ant-upload-text" style={{ color: theme === 'dark' ? '#d1d5db' : '' }}>
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint" style={{ color: theme === 'dark' ? '#9ca3af' : '' }}>
              Support for images or PDF layouts
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-16 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 mx-auto flex items-center justify-center mb-6 text-5xl">
        <CheckCircleOutlined />
      </div>
      <Title level={2} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
        Booking Received!
      </Title>
      {formData.bookingNumber && (
        <div className="mb-6">
          <Text type="secondary" className="block text-base mb-1">Your Booking Number</Text>
          <div className="text-3xl font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/10 py-3 px-6 rounded-xl inline-block border border-orange-200 dark:border-orange-800/30">
            {formData.bookingNumber}
          </div>
        </div>
      )}
      <Paragraph className={`text-lg max-w-lg mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        Thank you for choosing Safetyc. Your booking has been registered. You can track its status using the number above. Our team will contact you within 24 hours.
      </Paragraph>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          size="large" 
          type="primary" 
          onClick={() => navigate('/track-booking')}
          style={{ background: "#f97316", borderColor: "#f97316" }}
        >
          Track My Booking
        </Button>
        <Button size="large" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );

  // --- MAIN RENDER ---

  if (currentStep === 5) {
    return (
      <div className={`min-h-screen pt-24 pb-12 px-4 ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
        {renderSuccess()}
      </div>
    );
  }

  const steps = [
    { title: 'Type', icon: <BuildOutlined /> },
    { title: 'Service', icon: <ToolOutlined /> },
    { title: 'Site Details', icon: <EnvironmentOutlined /> },
    { title: 'Options', icon: <HomeOutlined /> },
    { title: 'Review', icon: <CheckCircleOutlined /> },
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 transition-colors duration-300 relative overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-gradient-to-br from-slate-50 via-white to-orange-50'
    }`}>
      {/* Decorative background elements - matching BookService */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ 
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)'
        }}
      />
      <SEO 
        title="Get A Quote - Safetyc" 
        description="Request a customized quote for fire safety, CCTV, and electrical services."
        path="/get-quote"
      />

      <div className="max-w-5xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12 px-4">
          <Steps 
            current={currentStep} 
            items={steps}
            className={theme === 'dark' ? 'dark-steps' : ''}
            responsive
          />
        </div>

        {/* Dynamic Content Area */}
        <div className="mb-12 min-h-[400px]">
          {currentStep === 0 && renderStep0_RequestType()}
          {currentStep === 1 && renderStep1_ServiceSelection()}
          {currentStep === 2 && renderStep2_SiteDetails()}
          {currentStep === 3 && renderStep3_ServiceOptions()}
          {currentStep === 4 && renderStep4_UploadNotes()}
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between max-w-3xl mx-auto pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button 
            size="large" 
            icon={<ArrowLeftOutlined />}
            onClick={prev}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
          >
            Back
          </Button>

          {currentStep < 4 ? (
            <Button 
              type="primary" 
              size="large" 
              onClick={() => {
                // Validation logic
                if (currentStep === 0 && !formData.requestType) {
                   message.error("Please select a request type");
                   return;
                }
                if (currentStep === 2 && (!formData.siteType || !formData.name || !formData.phone)) {
                   message.error("Please fill in required details");
                   return;
                }
                next(); 
              }}
              className="px-8 bg-orange-600 hover:bg-orange-700 border-none h-12 text-base font-semibold shadow-lg shadow-orange-500/30"
            >
              Next Step <ArrowRightOutlined />
            </Button>
          ) : (
            <Button 
              type="primary" 
              size="large" 
              onClick={handleSubmit}
              loading={loading}
              className="px-8 bg-green-600 hover:bg-green-700 border-none h-12 text-base font-semibold shadow-lg shadow-green-500/30"
            >
              Submit Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
