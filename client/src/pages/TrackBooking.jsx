import { useState } from "react";
import { Card, Input, Button, Typography, Steps, Tag, Spin, Empty, Timeline } from "antd";
import { 
  SearchOutlined, 
  PhoneOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext.jsx";
import SEO from "../components/SEO.jsx";
import axios from "axios";
import { apiUrl } from "../lib/api.js";

const { Title, Text, Paragraph } = Typography;

const statusSteps = {
  pending: 0,
  confirmed: 1,
  assigned: 2,
  "in-progress": 3,
  completed: 4
};

const statusColors = {
  pending: "orange",
  confirmed: "blue",
  assigned: "purple",
  "in-progress": "processing",
  completed: "success",
  cancelled: "error"
};

export default function TrackBooking() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [bookingNumber, setBookingNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!bookingNumber || !phone) {
      setError("Please enter both booking number and phone number");
      return;
    }

    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const res = await axios.get(apiUrl("/bookings/track"), {
        params: { bookingNumber, phone }
      });
      if (res.data.ok) {
        setBooking(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Booking not found. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: isDark ? "#18181f" : "#ffffff",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
    borderRadius: 16
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'
    }`}>
      <SEO 
        title="Track Your Booking - Safetyc" 
        description="Track the status of your service booking with Safetyc"
        path="/track-booking"
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} style={{ color: isDark ? "#fff" : "#1f2937", marginBottom: 8 }}>
            Track Your Booking
          </Title>
          <Paragraph style={{ color: isDark ? "#9ca3af" : "#6b7280", fontSize: 16 }}>
            Enter your booking number and phone to check the status of your service request
          </Paragraph>
        </div>

        {/* Search Form */}
        <Card style={{ ...cardStyle, marginBottom: 32 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              size="large"
              placeholder="Booking Number (e.g., SB-2026-0001)"
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
            />
            <Input
              size="large"
              placeholder="Phone Number"
              prefix={<PhoneOutlined style={{ color: "#9ca3af" }} />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button
            type="primary"
            size="large"
            block
            onClick={handleSearch}
            loading={loading}
            style={{ 
              background: "#f97316", 
              borderColor: "#f97316", 
              height: 48,
              fontWeight: 600
            }}
          >
            Track Booking
          </Button>
          {error && (
            <div style={{ marginTop: 16, color: "#ef4444", textAlign: "center" }}>
              {error}
            </div>
          )}
        </Card>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <Spin size="large" />
          </div>
        )}

        {/* Booking Details */}
        {booking && !loading && (
          <div className="animate-fade-in">
            {/* Status Card */}
            <Card style={{ ...cardStyle, marginBottom: 24 }}>
              <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
                <div>
                  <Text type="secondary">Booking Number</Text>
                  <Title level={3} style={{ margin: 0, color: "#f97316" }}>
                    {booking.bookingNumber}
                  </Title>
                </div>
                <Tag color={statusColors[booking.status]} style={{ fontSize: 14, padding: "4px 12px" }}>
                  {booking.status?.toUpperCase()}
                </Tag>
              </div>

              {/* Progress Steps */}
              {booking.status !== "cancelled" && (
                <Steps
                  current={statusSteps[booking.status] || 0}
                  size="small"
                  responsive={true}
                  items={[
                    { title: "Received", icon: <ClockCircleOutlined /> },
                    { title: "Confirmed", icon: <CheckCircleOutlined /> },
                    { title: "Assigned", icon: <UserOutlined /> },
                    { title: "In Progress", icon: <ToolOutlined /> },
                    { title: "Completed", icon: <CheckCircleOutlined /> }
                  ]}
                />
              )}
            </Card>

            {/* Details Card */}
            <Card style={cardStyle}>
              <Title level={4} style={{ color: isDark ? "#fff" : "#1f2937", marginBottom: 24 }}>
                Booking Details
              </Title>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    Service Type
                  </Text>
                  <Text strong style={{ fontSize: 16 }}>{booking.service?.type}</Text>
                </div>

                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    Location
                  </Text>
                  <Text strong style={{ fontSize: 16 }}>{booking.site?.location || "N/A"}</Text>
                </div>

                {booking.assignedTechnician && (
                  <div>
                    <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                      <UserOutlined style={{ marginRight: 8 }} />
                      Assigned Technician
                    </Text>
                    <Text strong style={{ fontSize: 16 }}>{booking.assignedTechnician}</Text>
                  </div>
                )}

                {booking.scheduledDate && (
                  <div>
                    <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      Scheduled Date
                    </Text>
                    <Text strong style={{ fontSize: 16 }}>
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </Text>
                  </div>
                )}

                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    Booked On
                  </Text>
                  <Text strong style={{ fontSize: 16 }}>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </Text>
                </div>

                {booking.estimatedCost && (
                  <div>
                    <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                      Estimated Cost
                    </Text>
                    <Text strong style={{ fontSize: 16, color: "#22c55e" }}>
                      ₹{booking.estimatedCost.toLocaleString()}
                    </Text>
                  </div>
                )}
              </div>

              {/* Feedback CTA for completed bookings */}
              {booking.status === "completed" && (
                <div style={{ 
                  marginTop: 32, 
                  padding: 24, 
                  background: isDark ? "#1f2937" : "#f0fdf4",
                  borderRadius: 12,
                  textAlign: "center"
                }}>
                  <CheckCircleOutlined style={{ fontSize: 32, color: "#22c55e", marginBottom: 8 }} />
                  <Title level={4} style={{ margin: "8px 0", color: isDark ? "#fff" : "#1f2937" }}>
                    Service Completed!
                  </Title>
                  <Paragraph style={{ color: isDark ? "#9ca3af" : "#6b7280", marginBottom: 16 }}>
                    We hope you're satisfied with our service. Your feedback helps us improve!
                  </Paragraph>
                  <Button 
                    type="primary"
                    href={`/feedback/${booking._id}`}
                    style={{ background: "#22c55e", borderColor: "#22c55e" }}
                  >
                    Share Your Feedback
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!booking && !loading && !error && (
          <Empty 
            description={
              <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                Enter your booking details above to track your service
              </Text>
            }
          />
        )}
      </div>
    </div>
  );
}
