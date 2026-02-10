import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Statistic, Table, Tag, Button, Spin } from "antd";
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ToolOutlined,
  PlusOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext.jsx";
import axios from "axios";
import { apiUrl } from "../../lib/api.js";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(apiUrl("/bookings/stats"));
      if (res.data.ok) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: isDark ? "#18181f" : "#ffffff",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
    borderRadius: 16
  };

  const statCards = [
    { 
      title: "Pending", 
      value: stats?.pending || 0, 
      icon: <ClockCircleOutlined />,
      color: "#f97316",
      bgColor: "rgba(249, 115, 22, 0.1)"
    },
    { 
      title: "In Progress", 
      value: stats?.["in-progress"] || 0, 
      icon: <ToolOutlined />,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)"
    },
    { 
      title: "Completed", 
      value: stats?.completed || 0, 
      icon: <CheckCircleOutlined />,
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.1)"
    },
    { 
      title: "Today's Bookings", 
      value: stats?.todayBookings || 0, 
      icon: <CalendarOutlined />,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)"
    }
  ];

  const statusColors = {
    pending: "orange",
    confirmed: "blue",
    assigned: "purple",
    "in-progress": "processing",
    completed: "success",
    cancelled: "error"
  };

  const recentColumns = [
    {
      title: "Booking #",
      dataIndex: "bookingNumber",
      key: "bookingNumber",
      render: (text) => <Text strong style={{ color: "#f97316" }}>{text}</Text>
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customer"
    },
    {
      title: "Service",
      dataIndex: ["service", "type"],
      key: "service"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => navigate(`/admin/bookings/${record._id}`)}
        >
          View <ArrowRightOutlined />
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={2} style={{ margin: 0, color: isDark ? "#fff" : "#1f2937" }}>
            Dashboard
          </Title>
          <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
            Service Management Overview
          </Text>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => { setLoading(true); fetchStats(); }}
            style={{ 
              height: 44,
              width: 44,
              borderRadius: 12,
              background: isDark ? "#1f2937" : "#fff",
              borderColor: isDark ? "#374151" : "#e5e7eb",
              color: isDark ? "#9ca3af" : "#6b7280"
            }}
          />
          <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate("/get-quote")}
          style={{ 
            background: "#f97316", 
            borderColor: "#f97316",
            height: 44,
            paddingInline: 24,
            fontWeight: 600
          }}
        >
          New Booking
        </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card style={cardStyle} className="hover-lift">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div 
                  style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 12, 
                    background: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    color: stat.color
                  }}
                >
                  {stat.icon}
                </div>
                <Statistic 
                  title={<span style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>{stat.title}</span>}
                  value={stat.value}
                  valueStyle={{ color: stat.color, fontWeight: 700, fontSize: 28 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Bookings */}
      <Card 
        style={cardStyle}
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: isDark ? "#fff" : "#1f2937", fontWeight: 600 }}>
              Recent Bookings
            </span>
            <Button type="link" onClick={() => navigate("/admin/bookings")}>
              View All <ArrowRightOutlined />
            </Button>
          </div>
        }
      >
        <Table 
          dataSource={stats?.recentBookings || []}
          columns={recentColumns}
          rowKey="_id"
          pagination={false}
          size="middle"
          style={{ 
            background: "transparent"
          }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
}
