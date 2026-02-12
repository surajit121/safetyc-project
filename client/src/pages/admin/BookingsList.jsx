import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Tabs, 
  Input, 
  Space, 
  Typography,
  Spin,
  Empty,
  Dropdown,
  Modal,
  Select,
  DatePicker,
  message
} from "antd";
import { 
  SearchOutlined, 
  EyeOutlined, 
  MoreOutlined,
  FileAddOutlined,
  UserSwitchOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext.jsx";
import axios from "axios";
import { apiUrl } from "../../lib/api.js";

const { Title, Text } = Typography;
const { Option } = Select;

const statusColors = {
  pending: "orange",
  confirmed: "blue", 
  assigned: "purple",
  "in-progress": "processing",
  completed: "success",
  cancelled: "error"
};

export default function BookingsList() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  
  // Modal states
  const [assignModal, setAssignModal] = useState({ visible: false, booking: null });
  const [assignData, setAssignData] = useState({ technician: "", scheduledDate: null });

  useEffect(() => {
    fetchBookings();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, [activeTab, pagination.current, searchQuery]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...(activeTab !== "all" && { status: activeTab }),
        ...(searchQuery && { search: searchQuery })
      };
      
      const res = await axios.get(apiUrl("/bookings"), { params });
      if (res.data.ok) {
        setBookings(res.data.data);
        setPagination(prev => ({ 
          ...prev, 
          total: res.data.pagination.total 
        }));
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.patch(apiUrl(`/bookings/${bookingId}`), { status: newStatus });
      message.success(`Status updated to ${newStatus}`);
      fetchBookings();
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  const handleAssignTechnician = async () => {
    if (!assignData.technician) {
      message.error("Please enter technician name");
      return;
    }
    try {
      await axios.patch(apiUrl(`/bookings/${assignModal.booking._id}`), {
        assignedTechnician: assignData.technician,
        scheduledDate: assignData.scheduledDate,
        status: "assigned"
      });
      message.success("Technician assigned successfully");
      setAssignModal({ visible: false, booking: null });
      setAssignData({ technician: "", scheduledDate: null });
      fetchBookings();
    } catch (err) {
      message.error("Failed to assign technician");
    }
  };

  const handleCreateWorkOrder = async (booking) => {
    try {
      const res = await axios.post(apiUrl("/work-orders"), {
        bookingId: booking._id,
        tasks: [{ description: `${booking.service.type} service` }]
      });
      if (res.data.ok) {
        message.success(`Work Order ${res.data.docketNumber} created!`);
        navigate(`/admin/work-orders/${res.data.id}`);
      }
    } catch (err) {
      if (err.response?.data?.workOrderId) {
        navigate(`/admin/work-orders/${err.response.data.workOrderId}`);
      } else {
        message.error("Failed to create work order");
      }
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
        label: "View Details",
        onClick: () => navigate(`/admin/bookings/${record._id}`)
      },
      {
        key: "assign",
        icon: <UserSwitchOutlined />,
        label: "Assign Technician",
        onClick: () => setAssignModal({ visible: true, booking: record }),
        disabled: record.status === "completed" || record.status === "cancelled"
      },
      {
        key: "workorder",
        icon: <FileAddOutlined />,
        label: "Create Work Order",
        onClick: () => handleCreateWorkOrder(record),
        disabled: record.status === "pending" || record.status === "cancelled"
      },
      { type: "divider" },
      {
        key: "status",
        label: "Change Status",
        children: [
          { key: "confirmed", label: "Confirmed", onClick: () => handleStatusChange(record._id, "confirmed") },
          { key: "in-progress", label: "In Progress", onClick: () => handleStatusChange(record._id, "in-progress") },
          { key: "completed", label: "Completed", onClick: () => handleStatusChange(record._id, "completed") },
          { key: "cancelled", label: "Cancelled", danger: true, onClick: () => handleStatusChange(record._id, "cancelled") }
        ]
      }
    ]
  });

  const columns = [
    {
      title: "Booking #",
      dataIndex: "bookingNumber",
      key: "bookingNumber",
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/admin/bookings/${record._id}`)}
          style={{ padding: 0, fontWeight: 600, color: "#f97316" }}
        >
          {text}
        </Button>
      )
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.customer?.name}</div>
          <div style={{ fontSize: 12, color: isDark ? "#9ca3af" : "#6b7280" }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.customer?.phone}
          </div>
        </div>
      )
    },
    {
      title: "Service",
      dataIndex: ["service", "type"],
      key: "service"
    },
    {
      title: "Location",
      dataIndex: ["site", "location"],
      key: "location",
      responsive: ["lg"]
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status?.toUpperCase()}</Tag>
    },
    {
      title: "Technician",
      dataIndex: "assignedTechnician",
      key: "technician",
      responsive: ["md"],
      render: (tech) => tech || <Text type="secondary">Not assigned</Text>
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["lg"],
      render: (date) => new Date(date).toLocaleDateString()
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
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "assigned", label: "Assigned" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: isDark ? "#fff" : "#1e293b", fontWeight: 800, letterSpacing: "-0.5px" }}>
          Bookings Management
        </Title>
        <Text style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 15 }}>
          View and manage all client service requests
        </Text>
      </div>

      {/* Filters Card */}
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
            placeholder="Search bookings..."
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

      {/* Bookings Table */}
      <Card style={glassCardStyle}>
        <Table 
          dataSource={bookings}
          columns={columns}
          rowKey="_id"
          loading={loading}
          className="custom-table"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `${total} bookings`,
            onChange: (page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize })),
            style: { padding: "16px 0" }
          }}
          locale={{
            emptyText: <Empty description="No bookings found" />
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Assign Technician Modal */}
      <Modal
        title="Assign Technician"
        open={assignModal.visible}
        onOk={handleAssignTechnician}
        onCancel={() => {
          setAssignModal({ visible: false, booking: null });
          setAssignData({ technician: "", scheduledDate: null });
        }}
        okText="Assign"
        okButtonProps={{ style: { background: "#f97316", borderColor: "#f97316" } }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Booking: </Text>
          <Text>{assignModal.booking?.bookingNumber}</Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Service: </Text>
          <Text>{assignModal.booking?.service?.type}</Text>
        </div>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Technician Name *</Text>
            <Input 
              placeholder="Enter technician name"
              value={assignData.technician}
              onChange={(e) => setAssignData(prev => ({ ...prev, technician: e.target.value }))}
            />
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Scheduled Date</Text>
            <DatePicker 
              style={{ width: "100%" }}
              onChange={(date) => setAssignData(prev => ({ ...prev, scheduledDate: date?.toISOString() }))}
              placeholder="Select scheduled date"
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}
