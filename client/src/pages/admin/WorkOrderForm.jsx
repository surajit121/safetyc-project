import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  Form,
  Input,
  InputNumber,
  Button, 
  Typography,
  Spin,
  Space,
  Divider,
  Table,
  Checkbox,
  Tag,
  message,
  Popconfirm
} from "antd";
import { 
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  SaveOutlined
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext.jsx";
import axios from "axios";
import { apiUrl } from "../../lib/api.js";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function WorkOrderForm() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) fetchWorkOrder();
  }, [id]);

  const fetchWorkOrder = async () => {
    try {
      const res = await axios.get(apiUrl(`/work-orders/${id}`));
      if (res.data.ok) {
        setWorkOrder(res.data.data);
        form.setFieldsValue({
          technicianNotes: res.data.data.technicianNotes,
          laborHours: res.data.data.laborHours,
          laborRate: res.data.data.laborRate,
          additionalCharges: res.data.data.additionalCharges,
          discount: res.data.data.discount
        });
      }
    } catch (err) {
      message.error("Failed to load work order");
      navigate("/admin/work-orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const values = form.getFieldsValue();
      await axios.patch(apiUrl(`/work-orders/${id}`), {
        ...values,
        tasks: workOrder.tasks,
        materials: workOrder.materials
      });
      message.success("Work order saved");
      fetchWorkOrder();
    } catch (err) {
      message.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    try {
      await axios.post(apiUrl(`/work-orders/${id}/complete`), {
        finalNotes: form.getFieldValue("technicianNotes")
      });
      message.success("Work order completed! Feedback request sent to customer.");
      fetchWorkOrder();
    } catch (err) {
      message.error("Failed to complete");
    }
  };

  const addTask = () => {
    const newTask = { description: "", completed: false };
    setWorkOrder(prev => ({
      ...prev,
      tasks: [...(prev.tasks || []), newTask]
    }));
  };

  const updateTask = (index, field, value) => {
    const updated = [...workOrder.tasks];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "completed" && value) {
      updated[index].completedAt = new Date();
    }
    setWorkOrder(prev => ({ ...prev, tasks: updated }));
  };

  const removeTask = (index) => {
    setWorkOrder(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const addMaterial = () => {
    const newMaterial = { item: "", quantity: 1, unitCost: 0 };
    setWorkOrder(prev => ({
      ...prev,
      materials: [...(prev.materials || []), newMaterial]
    }));
  };

  const updateMaterial = (index, field, value) => {
    const updated = [...workOrder.materials];
    updated[index] = { ...updated[index], [field]: value };
    setWorkOrder(prev => ({ ...prev, materials: updated }));
  };

  const removeMaterial = (index) => {
    setWorkOrder(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  // Calculate totals
  const materialsCost = workOrder?.materials?.reduce((sum, m) => sum + (m.quantity * m.unitCost), 0) || 0;
  const laborCost = (form.getFieldValue("laborHours") || 0) * (form.getFieldValue("laborRate") || 0);
  const additionalCharges = form.getFieldValue("additionalCharges") || 0;
  const discount = form.getFieldValue("discount") || 0;
  const totalCost = materialsCost + laborCost + additionalCharges - discount;

  const glassCardStyle = {
    background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
    borderRadius: 20,
    boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.15)" : "0 8px 32px rgba(0, 0, 0, 0.03)",
    marginBottom: 24
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/admin/work-orders")}
            style={{ marginLeft: -8, marginBottom: 8, color: isDark ? "#94a3b8" : "#64748b" }}
          >
            Back to List
          </Button>
          <Title level={2} style={{ margin: 0, color: isDark ? "#fff" : "#1e293b", fontWeight: 800 }}>
            {workOrder?.docketNumber}
          </Title>
          <Space size="middle" style={{ marginTop: 12 }}>
            <Tag color={workOrder?.status === "completed" ? "success" : "processing"} style={{ border: "none", borderRadius: 6, padding: "2px 10px" }}>
              {workOrder?.status?.toUpperCase()}
            </Tag>
            <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Booking: <b>{workOrder?.bookingId?.bookingNumber}</b></Text>
          </Space>
        </div>
        
        <Space size="middle">
          <Button 
            icon={<PrinterOutlined />} 
            onClick={() => window.print()}
            style={{ height: 44, borderRadius: 10 }}
          >
            Print Docket
          </Button>
          <Button 
            icon={<SaveOutlined />} 
            onClick={handleSave} 
            loading={saving}
            style={{ height: 44, borderRadius: 10 }}
          >
            Save Progress
          </Button>
          {workOrder?.status !== "completed" && (
            <Popconfirm
              title="Complete this work order?"
              description="This will mark the job as done and send a feedback request to the customer."
              onConfirm={handleComplete}
              okText="Yes, Complete"
              okButtonProps={{ style: { background: "#22c55e", borderColor: "#22c55e" } }}
            >
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />}
                style={{ background: "#22c55e", borderColor: "#22c55e", height: 44, borderRadius: 10, fontWeight: 600 }}
              >
                Complete Job
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      {/* Customer Info */}
      <Card 
        style={glassCardStyle} 
        title={<span style={{ fontWeight: 700, color: isDark ? "#fff" : "#334155" }}>Customer Information</span>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          <div>
            <Text style={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Name</Text>
            <div style={{ fontWeight: 600, color: isDark ? "#f1f5f9" : "#1e293b" }}>{workOrder?.customer?.name}</div>
          </div>
          <div>
            <Text style={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Phone</Text>
            <div style={{ fontWeight: 600, color: isDark ? "#f1f5f9" : "#1e293b" }}>{workOrder?.customer?.phone}</div>
          </div>
          <div>
            <Text style={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Service Type</Text>
            <div style={{ fontWeight: 600, color: isDark ? "#f1f5f9" : "#1e293b" }}>{workOrder?.serviceType}</div>
          </div>
          <div>
            <Text style={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, display: "block", marginBottom: 4 }}>Address</Text>
            <div style={{ fontWeight: 600, color: isDark ? "#f1f5f9" : "#1e293b" }}>{workOrder?.customer?.address || "N/A"}</div>
          </div>
        </div>
      </Card>

      {/* Tasks */}
      <Card 
        style={glassCardStyle} 
        title={<span style={{ fontWeight: 700, color: isDark ? "#fff" : "#334155" }}>Tasks</span>} 
        extra={<Button icon={<PlusOutlined />} onClick={addTask} style={{ borderRadius: 8 }}>Add Task</Button>}
      >
        {workOrder?.tasks?.length === 0 ? (
          <Text type="secondary">No tasks added yet</Text>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {workOrder?.tasks?.map((task, index) => (
              <div key={index} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Checkbox 
                  checked={task.completed}
                  onChange={(e) => updateTask(index, "completed", e.target.checked)}
                />
                <Input 
                  value={task.description}
                  onChange={(e) => updateTask(index, "description", e.target.value)}
                  placeholder="Task description"
                  style={{ flex: 1, textDecoration: task.completed ? "line-through" : "none" }}
                />
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => removeTask(index)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Materials */}
      <Card 
        style={glassCardStyle} 
        title={<span style={{ fontWeight: 700, color: isDark ? "#fff" : "#334155" }}>Materials Used</span>} 
        extra={<Button icon={<PlusOutlined />} onClick={addMaterial} style={{ borderRadius: 8 }}>Add Material</Button>}
      >
        {workOrder?.materials?.length === 0 ? (
          <Text type="secondary">No materials added yet</Text>
        ) : (
          <Table 
            dataSource={workOrder?.materials}
            rowKey={(_, index) => index}
            pagination={false}
            size="small"
            columns={[
              {
                title: "Item",
                dataIndex: "item",
                render: (_, record, index) => (
                  <Input 
                    value={record.item}
                    onChange={(e) => updateMaterial(index, "item", e.target.value)}
                    placeholder="Material name"
                  />
                )
              },
              {
                title: "Qty",
                dataIndex: "quantity",
                width: 100,
                render: (_, record, index) => (
                  <InputNumber 
                    value={record.quantity}
                    onChange={(v) => updateMaterial(index, "quantity", v)}
                    min={1}
                    style={{ width: "100%" }}
                  />
                )
              },
              {
                title: "Unit Cost (₹)",
                dataIndex: "unitCost",
                width: 120,
                render: (_, record, index) => (
                  <InputNumber 
                    value={record.unitCost}
                    onChange={(v) => updateMaterial(index, "unitCost", v)}
                    min={0}
                    style={{ width: "100%" }}
                  />
                )
              },
              {
                title: "Total",
                width: 100,
                render: (_, record) => `₹${(record.quantity * record.unitCost).toLocaleString()}`
              },
              {
                title: "",
                width: 50,
                render: (_, record, index) => (
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeMaterial(index)} />
                )
              }
            ]}
            scroll={{ x: 600 }}
          />
        )}
      </Card>

      {/* Labor & Costs */}
      <Card 
        style={glassCardStyle} 
        title={<span style={{ fontWeight: 700, color: isDark ? "#fff" : "#334155" }}>Labor & Costing</span>}
      >
        <Form form={form} layout="vertical" onValuesChange={() => form.validateFields()}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <Form.Item label="Labor Hours" name="laborHours">
              <InputNumber min={0} step={0.5} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Labor Rate (₹/hr)" name="laborRate">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Additional Charges (₹)" name="additionalCharges">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Discount (₹)" name="discount">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Divider />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ textAlign: "right" }}>
              <div><Text type="secondary">Materials:</Text> <Text>₹{materialsCost.toLocaleString()}</Text></div>
              <div><Text type="secondary">Labor:</Text> <Text>₹{laborCost.toLocaleString()}</Text></div>
              {additionalCharges > 0 && <div><Text type="secondary">Additional:</Text> <Text>₹{additionalCharges.toLocaleString()}</Text></div>}
              {discount > 0 && <div><Text type="secondary">Discount:</Text> <Text style={{ color: "#22c55e" }}>-₹{discount.toLocaleString()}</Text></div>}
              <Divider style={{ margin: "8px 0" }} />
              <div><Text strong style={{ fontSize: 18 }}>Total: ₹{totalCost.toLocaleString()}</Text></div>
            </div>
          </div>

          <Divider />

          <Form.Item label="Technician Notes" name="technicianNotes">
            <TextArea rows={4} placeholder="Add any notes about the work done..." />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
