import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Typography,
  Empty,
  Rate,
  Spin
} from "antd";
import { 
  EyeOutlined,
  StarFilled
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext.jsx";
import axios from "axios";
import { apiUrl } from "../../lib/api.js";

const { Title, Text } = Typography;

export default function FeedbackList() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.current]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.current, limit: pagination.pageSize };
      const res = await axios.get(apiUrl("/feedback"), { params });
      if (res.data.ok) {
        setFeedbacks(res.data.data);
        setStats(res.data.stats);
        setPagination(prev => ({ ...prev, total: res.data.pagination.total }));
      }
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: isDark ? "#18181f" : "#ffffff",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
    borderRadius: 16
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customer"
    },
    {
      title: "Booking",
      key: "booking",
      render: (_, record) => record.bookingId?.bookingNumber || "N/A"
    },
    {
      title: "Rating",
      dataIndex: "overallRating",
      key: "rating",
      render: (rating) => <Rate disabled value={rating} style={{ fontSize: 14 }} />
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
      ellipsis: true,
      render: (review) => review || <Text type="secondary">No review</Text>
    },
    {
      title: "Recommend",
      dataIndex: "wouldRecommend",
      key: "recommend",
      render: (val) => val ? <Tag color="success">Yes</Tag> : <Tag color="error">No</Tag>
    },
    {
      title: "Date",
      dataIndex: "submittedAt",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  if (loading && !feedbacks.length) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: isDark ? "#fff" : "#1f2937" }}>
          Customer Feedback
        </Title>
        <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
          View and manage customer reviews
        </Text>
      </div>

      {/* Stats */}
      {stats && (
        <Card style={{ ...cardStyle, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#f97316" }}>
                {stats.avgOverall?.toFixed(1) || "0.0"}
              </div>
              <Rate disabled value={stats.avgOverall || 0} style={{ fontSize: 16 }} />
              <div style={{ color: isDark ? "#9ca3af" : "#6b7280", marginTop: 4 }}>Average Rating</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#3b82f6" }}>
                {stats.total || 0}
              </div>
              <div style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>Total Reviews</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#22c55e" }}>
                {stats.avgQuality?.toFixed(1) || "0.0"}
              </div>
              <div style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>Service Quality</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#8b5cf6" }}>
                {stats.avgPunctuality?.toFixed(1) || "0.0"}
              </div>
              <div style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>Punctuality</div>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card style={cardStyle}>
        <Table 
          dataSource={feedbacks}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `${total} reviews`,
            onChange: (page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize }))
          }}
          locale={{
            emptyText: <Empty description="No feedback yet" />
          }}
        />
      </Card>
    </div>
  );
}
