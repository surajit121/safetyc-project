import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { 
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Layout, Menu, Button, Typography, Avatar, Space } from "antd";
import { motion, AnimatePresence } from "framer-motion";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = [
  {
    key: "/admin",
    icon: <DashboardOutlined />,
    label: "Dashboard"
  },
  {
    key: "/admin/bookings",
    icon: <CalendarOutlined />,
    label: "Bookings"
  },
  {
    key: "/admin/work-orders",
    icon: <FileTextOutlined />,
    label: "Work Orders"
  },
  {
    key: "/admin/feedback",
    icon: <StarOutlined />,
    label: "Feedback"
  }
];

export default function AdminLayout() {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const bgColor = isDark ? "var(--dashboard-bg-dark)" : "#f8fafc";
  const glassBg = isDark ? "var(--dashboard-sidebar-bg-dark)" : "rgba(255, 255, 255, 0.8)";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
  const textColor = isDark ? "#f1f5f9" : "#334155";
  const activeColor = "#f97316";

  const glassStyle = {
    background: glassBg,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRight: `1px solid ${borderColor}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  };

  return (
    <Layout style={{ minHeight: "100vh", background: bgColor }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          ...glassStyle,
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100
        }}
        width={260}
        collapsedWidth={80}
      >
        {/* Logo */}
        <div 
          style={{
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 24px",
            borderBottom: `1px solid ${borderColor}`
          }}
        >
          <motion.div
            initial={false}
            animate={{ scale: collapsed ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Title 
              level={4} 
              style={{ 
                margin: 0, 
                color: activeColor,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 10,
                letterSpacing: "-0.5px"
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🛡️</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    SafetyC Admin
                  </motion.span>
                )}
              </AnimatePresence>
            </Title>
          </motion.div>
        </div>

        {/* Menu */}
        <div style={{ padding: "12px 8px", height: "calc(100vh - 144px)", overflowY: "auto" }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ 
              background: "transparent", 
              borderRight: 0,
            }}
            items={menuItems.map(item => ({
              ...item,
              label: (
                <span style={{ 
                  fontWeight: location.pathname === item.key ? 600 : 400,
                  fontSize: "14px"
                }}>
                  {item.label}
                </span>
              ),
              style: { 
                borderRadius: "12px",
                margin: "4px 0",
                height: "48px",
                display: "flex",
                alignItems: "center",
                color: location.pathname === item.key ? activeColor : textColor,
                background: location.pathname === item.key ? (isDark ? "rgba(249, 115, 22, 0.1)" : "rgba(249, 115, 22, 0.05)") : "transparent"
              },
              onClick: () => navigate(item.key)
            }))}
          />
        </div>

        {/* Back to Site */}
        <div style={{ 
          padding: "16px",
          borderTop: `1px solid ${borderColor}`,
          background: "transparent"
        }}>
          <Button 
            type="text" 
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            style={{ 
              width: "100%", 
              height: "44px",
              borderRadius: "10px",
              justifyContent: collapsed ? "center" : "flex-start",
              color: isDark ? "#94a3b8" : "#64748b",
              display: "flex",
              alignItems: "center"
            }}
          >
            {!collapsed && <span style={{ marginLeft: 8 }}>Back to Site</span>}
          </Button>
        </div>
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 260, 
        background: bgColor,
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}>
        {/* Header */}
        <Header 
          style={{
            background: glassBg,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${borderColor}`,
            position: "sticky",
            top: 0,
            zIndex: 99,
            height: 72
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ 
                fontSize: 18, 
                color: textColor,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
              }}
            />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              style={{ color: textColor }} 
            />
            <div style={{ 
              height: 32, 
              width: 1, 
              background: borderColor 
            }} />
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} style={{ background: activeColor }} />
              {!collapsed && (
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                  <Text strong style={{ color: textColor, fontSize: "14px" }}>Admin</Text>
                  <Text style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: "12px" }}>Super User</Text>
                </div>
              )}
            </Space>
          </div>
        </Header>

        {/* Page Content */}
        <Content 
          style={{
            margin: 24,
            minHeight: "calc(100vh - 64px - 48px)"
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
