import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Tabs,
  Input,
  Typography,
  Empty,
  Dropdown,
  message
} from "antd";
import { 
  SearchOutlined, 
  EyeOutlined, 
  MoreOutlined,
  PrinterOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext.jsx";
import axios from "axios";
import { apiUrl } from "../../lib/api.js";

const { Title, Text } = Typography;

const statusColors = {
  draft: "default",
  "in-progress": "processing",
  completed: "success",
  invoiced: "purple"
};

export default function WorkOrdersList() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchWorkOrders();
  }, [activeTab, pagination.current, searchQuery]);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...(activeTab !== "all" && { status: activeTab }),
        ...(searchQuery && { search: searchQuery })
      };
      
      const res = await axios.get(apiUrl("/work-orders"), { params });
      if (res.data.ok) {
        setWorkOrders(res.data.data);
        setPagination(prev => ({ ...prev, total: res.data.pagination.total }));
      }
    } catch (err) {
      console.error("Failed to fetch work orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (workOrderId) => {
    try {
      await axios.post(apiUrl(`/work-orders/${workOrderId}/complete`));
      message.success("Work order completed!");
      fetchWorkOrders();
    } catch (err) {
      message.error("Failed to complete work order");
    }
  };

  const glassCardStyle = {
    background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
    borderRadius: 20,
    boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.2)" : "0 8px 32px rgba(0, 0, 0, 0.03)"
  };

  const getActionMenu = (record) => ({
    items: [
      {
        key: "view",
        icon: <EyeOutlined />,
        label: "View / Edit",
        onClick: () => navigate(`/admin/work-orders/${record._id}`)
      },
      {
        key: "complete",
        icon: <CheckCircleOutlined />,
        label: "Mark Complete",
        onClick: () => handleComplete(record._id),
        disabled: record.status === "completed" || record.status === "invoiced"
      },
      {
        key: "print",
        icon: <PrinterOutlined />,
        label: "Print Docket",
        onClick: () => window.print()
      }
    ]
  });

  const columns = [
    {
      title: "Docket #",
      dataIndex: "docketNumber",
      key: "docketNumber",
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/admin/work-orders/${record._id}`)}
          style={{ padding: 0, fontWeight: 600, color: "#3b82f6" }}
        >
          {text}
        </Button>
      )
    },
    {
      title: "Booking #",
      key: "booking",
      render: (_, record) => record.bookingId?.bookingNumber || "N/A",
      responsive: ["lg"]
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customer"
    },
    {
      title: "Service",
      dataIndex: "serviceType",
      key: "serviceType",
      responsive: ["md"]
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status?.toUpperCase()}</Tag>
    },
    {
      title: "Total",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost) => cost ? `₹${cost.toLocaleString()}` : "-"
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ["lg"]
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  const tabItems = [
    { key: "all", label: "All" },
    { key: "draft", label: "Draft" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
    { key: "invoiced", label: "Invoiced" }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: isDark ? "#fff" : "#1e293b", fontWeight: 800, letterSpacing: "-0.5px" }}>
          Work Orders
        </Title>
        <Text style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 15 }}>
          Track and manage service job dockets
        </Text>
      </div>

      {/* Filters */}
      <Card 
        style={{ ...glassCardStyle, marginBottom: 24 }}
        bodyStyle={{ padding: "16px 24px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={tabItems}
            className="custom-tabs"
            style={{ marginBottom: 0 }}
          />
          <Input 
            placeholder="Search work orders..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: 300, 
              height: 44, 
              borderRadius: 12,
              background: isDark ? "rgba(0,0,0,0.1)" : "#fff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)"}`
            }}
            allowClear
          />
        </div>
      </Card>

      {/* Table */}
      <Card style={glassCardStyle}>
        <Table 
          dataSource={workOrders}
          columns={columns}
          rowKey="_id"
          loading={loading}
          className="custom-table"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `${total} work orders`,
            onChange: (page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize })),
            style: { padding: "16px 0" }
          }}
          locale={{
            emptyText: <Empty description="No work orders found" />
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
