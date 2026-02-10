import { useState, useEffect } from "react";
import { Card, Typography, Button, Alert, Space } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiUrl } from "../../lib/api.js";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const error = searchParams.get("error");

  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "#f3f4f6"
    }}>
      <Card style={{ width: 400, textAlign: "center", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={2} style={{ margin: 0, color: "#f97316" }}>Safetyc Admin</Title>
            <Text type="secondary">Secure Access Portal</Text>
          </div>

          {error === "unauthorized" && (
            <Alert
              message="Access Denied"
              description="Your email is not authorized to access the admin dashboard."
              type="error"
              showIcon
            />
          )}

          <Button 
            type="primary" 
            icon={<GoogleOutlined />} 
            size="large" 
            block
            onClick={() => window.location.href = apiUrl("/auth/google")}
            style={{ 
              height: 48, 
              background: "#4285F4", 
              borderColor: "#4285F4",
              fontSize: 16,
              fontWeight: 600
            }}
          >
            Sign in with Google
          </Button>
          
          <Text type="secondary" style={{ fontSize: 12 }}>
            Only authorized personnel can access this area.
          </Text>
        </Space>
      </Card>
    </div>
  );
}
