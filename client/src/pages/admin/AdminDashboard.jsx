import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Statistic, Table, Tag, Button, Spin, Space } from "antd";
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ToolOutlined,
  PlusOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  CustomerServiceOutlined
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext.jsx";
import axios from "axios";
import { apiUrl } from "../../lib/api.js";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const textColor = isDark ? "#f1f5f9" : "#334155";

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

  const glassCardStyle = {
    background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.2)" : "0 8px 32px rgba(0, 0, 0, 0.05)"
  };

  const GlassStatCard = ({ stat, index }) => {
    const growth = stat.growth;
    const isPositive = growth > 0;
    const isNegative = growth < 0;
    const growthColor = isPositive ? "green" : isNegative ? "red" : "default";
    const growthPrefix = isPositive ? "+" : "";
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      >
        <Card 
          style={glassCardStyle} 
          bodyStyle={{ padding: 24 }}
          className="hover-lift"
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div 
              style={{ 
                width: 52, 
                height: 52, 
                borderRadius: 14, 
                background: stat.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: stat.color,
                boxShadow: `0 8px 16px ${stat.bgColor}`
              }}
            >
              {stat.icon}
            </div>
            <div style={{ textAlign: "right" }}>
              <Text style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>
                {stat.title}
              </Text>
              <Title level={2} style={{ margin: 0, color: isDark ? "#fff" : "#1e293b", fontWeight: 700 }}>
                {stat.value}
              </Title>
            </div>
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6 }}>
            <Tag 
              color={growthColor} 
              style={{ border: "none", borderRadius: 4 }}
            >
              {growthPrefix}{growth}%
            </Tag>
            <Text style={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>vs last month</Text>
          </div>
        </Card>
      </motion.div>
    );
  };

  const monthlyGrowth = stats?.monthlyGrowth || {};

  const statCards = [
    { 
      title: "Pending", 
      value: stats?.pending || 0, 
      icon: <ClockCircleOutlined />,
      color: "#f97316",
      bgColor: "rgba(249, 115, 22, 0.1)",
      growth: monthlyGrowth.pending ?? 0
    },
    { 
      title: "In Progress", 
      value: stats?.["in-progress"] || 0, 
      icon: <ToolOutlined />,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
      growth: monthlyGrowth["in-progress"] ?? 0
    },
    { 
      title: "Completed", 
      value: stats?.completed || 0, 
      icon: <CheckCircleOutlined />,
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.1)",
      growth: monthlyGrowth.completed ?? 0
    },
    { 
      title: "Today's Bookings", 
      value: stats?.todayBookings || 0, 
      icon: <CalendarOutlined />,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      growth: monthlyGrowth.total ?? 0
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
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={2} style={{ margin: 0, color: isDark ? "#fff" : "#1e293b", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Dashboard Overview
          </Title>
          <Text style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 15 }}>
            Welcome back! Here's what's happening today.
          </Text>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => { setLoading(true); fetchStats(); }}
            style={{ 
              height: 48,
              width: 48,
              borderRadius: 14,
              background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
              color: isDark ? "#94a3b8" : "#64748b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate("/get-quote")}
            style={{ 
              background: "#f97316", 
              borderColor: "#f97316",
              height: 48,
              paddingInline: 28,
              fontWeight: 700,
              borderRadius: 14,
              boxShadow: "0 8px 24px rgba(249, 115, 22, 0.3)"
            }}
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <GlassStatCard stat={stat} index={index} />
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Recent Bookings */}
          <Card 
            style={glassCardStyle}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                <span style={{ color: isDark ? "#fff" : "#1e293b", fontWeight: 700, fontSize: 18 }}>
                  Recent Bookings
                </span>
                <Button 
                  type="text" 
                  onClick={() => navigate("/admin/bookings")}
                  style={{ color: "#f97316", fontWeight: 600 }}
                >
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
              className="custom-table"
              style={{ background: "transparent" }}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            style={glassCardStyle}
            title={<span style={{ color: isDark ? "#fff" : "#1e293b", fontWeight: 700, fontSize: 18 }}>Actions</span>}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Button 
                block 
                size="large" 
                icon={<CustomerServiceOutlined />} 
                style={{ height: 56, borderRadius: 12, textAlign: "left", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: "none", color: textColor }}
              >
                Send Feedback Requests
              </Button>
              <Button 
                block 
                size="large" 
                icon={<CalendarOutlined />} 
                style={{ height: 56, borderRadius: 12, textAlign: "left", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: "none", color: textColor }}
              >
                Sync Google Calendar
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
