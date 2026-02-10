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
  SettingOutlined
} from "@ant-design/icons";
import { Layout, Menu, Button, Typography } from "antd";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

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

  const bgColor = isDark ? "#0a0a0f" : "#f5f5f5";
  const siderBg = isDark ? "#141419" : "#ffffff";
  const headerBg = isDark ? "#141419" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#1f2937";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <Layout style={{ minHeight: "100vh", background: bgColor }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: siderBg,
          borderRight: `1px solid ${borderColor}`,
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100
        }}
        width={240}
      >
        {/* Logo */}
        <div 
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 24px",
            borderBottom: `1px solid ${borderColor}`
          }}
        >
          <Title 
            level={4} 
            style={{ 
              margin: 0, 
              color: "#f97316",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            🔒 {!collapsed && "Safetyc Admin"}
          </Title>
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ 
            background: "transparent", 
            borderRight: 0,
            marginTop: 8
          }}
          items={menuItems.map(item => ({
            ...item,
            style: { 
              color: location.pathname === item.key ? "#f97316" : textColor,
              fontWeight: location.pathname === item.key ? 600 : 400
            },
            onClick: () => navigate(item.key)
          }))}
        />

        {/* Back to Site */}
        <div style={{ 
          position: "absolute", 
          bottom: 20, 
          left: 0, 
          right: 0, 
          padding: collapsed ? "0 8px" : "0 16px" 
        }}>
          <Button 
            type="text" 
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            style={{ 
              width: "100%", 
              justifyContent: collapsed ? "center" : "flex-start",
              color: isDark ? "#9ca3af" : "#6b7280"
            }}
          >
            {!collapsed && "Back to Site"}
          </Button>
        </div>
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 240, 
        background: bgColor,
        transition: "margin-left 0.2s"
      }}>
        {/* Header */}
        <Header 
          style={{
            background: headerBg,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${borderColor}`,
            position: "sticky",
            top: 0,
            zIndex: 99
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, color: textColor }}
          />
          
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button type="text" icon={<SettingOutlined />} style={{ color: textColor }} />
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
