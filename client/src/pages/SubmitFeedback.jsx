import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Rate, Input, Button, Typography, Spin, message, Checkbox, Result } from "antd";
import { 
  StarFilled,
  CheckCircleOutlined,
  SmileOutlined
} from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext.jsx";
import SEO from "../components/SEO.jsx";
import axios from "axios";
import { apiUrl } from "../lib/api.js";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function SubmitFeedback() {
  const { bookingId } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  
  const [feedback, setFeedback] = useState({
    overallRating: 0,
    serviceQuality: 0,
    punctuality: 0,
    professionalism: 0,
    valueForMoney: 0,
    review: "",
    wouldRecommend: true
  });

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(apiUrl(`/bookings/${bookingId}`));
      if (res.data.ok) {
        setBooking(res.data.data);
        if (res.data.data.status !== "completed") {
          setError("Feedback can only be submitted for completed services.");
        }
      }
    } catch (err) {
      setError("Booking not found or invalid link.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (feedback.overallRating === 0) {
      message.error("Please provide an overall rating");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(apiUrl("/feedback"), {
        bookingId,
        ...feedback
      });
      setSubmitted(true);
    } catch (err) {
      if (err.response?.data?.error?.includes("already")) {
        setError("Feedback has already been submitted for this booking.");
      } else {
        message.error("Failed to submit feedback. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const cardStyle = {
    background: isDark ? "#18181f" : "#ffffff",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
    borderRadius: 16
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  if (loading) {
    return (
      <div className={`min-h-screen pt-24 flex items-center justify-center ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen pt-24 pb-12 px-4 ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
        <div className="max-w-xl mx-auto">
          <Result
            status="warning"
            title={error}
            extra={
              <Button type="primary" onClick={() => navigate("/")}>
                Go Home
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={`min-h-screen pt-24 pb-12 px-4 ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
        <div className="max-w-xl mx-auto text-center">
          <Card style={cardStyle} className="py-8">
            <CheckCircleOutlined style={{ fontSize: 64, color: "#22c55e", marginBottom: 16 }} />
            <Title level={2} style={{ color: isDark ? "#fff" : "#1f2937" }}>
              Thank You!
            </Title>
            <Paragraph style={{ color: isDark ? "#9ca3af" : "#6b7280", fontSize: 16 }}>
              Your feedback has been submitted successfully. We appreciate your time!
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate("/")}
              style={{ marginTop: 24, background: "#f97316", borderColor: "#f97316" }}
            >
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'
    }`}>
      <SEO 
        title="Share Your Feedback - Safetyc" 
        description="Share your experience with Safetyc services"
        path={`/feedback/${bookingId}`}
      />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <SmileOutlined style={{ fontSize: 48, color: "#f97316", marginBottom: 16 }} />
          <Title level={2} style={{ color: isDark ? "#fff" : "#1f2937", marginBottom: 8 }}>
            How was your experience?
          </Title>
          <Paragraph style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
            Your feedback helps us serve you better
          </Paragraph>
          {booking && (
            <Text type="secondary">
              Service: <strong>{booking.service?.type}</strong> | Booking: <strong>{booking.bookingNumber}</strong>
            </Text>
          )}
        </div>

        {/* Feedback Form */}
        <Card style={cardStyle}>
          {/* Overall Rating */}
          <div className="text-center mb-8">
            <Title level={4} style={{ color: isDark ? "#fff" : "#1f2937", marginBottom: 16 }}>
              Overall Rating *
            </Title>
            <Rate
              value={feedback.overallRating}
              onChange={(val) => setFeedback(prev => ({ ...prev, overallRating: val }))}
              style={{ fontSize: 40 }}
            />
            {feedback.overallRating > 0 && (
              <div style={{ marginTop: 8, color: "#f97316", fontWeight: 500 }}>
                {ratingLabels[feedback.overallRating]}
              </div>
            )}
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Text style={{ display: "block", marginBottom: 8, color: isDark ? "#9ca3af" : "#6b7280" }}>
                Service Quality
              </Text>
              <Rate
                value={feedback.serviceQuality}
                onChange={(val) => setFeedback(prev => ({ ...prev, serviceQuality: val }))}
              />
            </div>
            <div>
              <Text style={{ display: "block", marginBottom: 8, color: isDark ? "#9ca3af" : "#6b7280" }}>
                Punctuality
              </Text>
              <Rate
                value={feedback.punctuality}
                onChange={(val) => setFeedback(prev => ({ ...prev, punctuality: val }))}
              />
            </div>
            <div>
              <Text style={{ display: "block", marginBottom: 8, color: isDark ? "#9ca3af" : "#6b7280" }}>
                Professionalism
              </Text>
              <Rate
                value={feedback.professionalism}
                onChange={(val) => setFeedback(prev => ({ ...prev, professionalism: val }))}
              />
            </div>
            <div>
              <Text style={{ display: "block", marginBottom: 8, color: isDark ? "#9ca3af" : "#6b7280" }}>
                Value for Money
              </Text>
              <Rate
                value={feedback.valueForMoney}
                onChange={(val) => setFeedback(prev => ({ ...prev, valueForMoney: val }))}
              />
            </div>
          </div>

          {/* Written Review */}
          <div className="mb-6">
            <Text style={{ display: "block", marginBottom: 8, fontWeight: 500, color: isDark ? "#fff" : "#1f2937" }}>
              Share your experience (optional)
            </Text>
            <TextArea
              rows={4}
              placeholder="Tell us what you liked or how we can improve..."
              value={feedback.review}
              onChange={(e) => setFeedback(prev => ({ ...prev, review: e.target.value }))}
              style={{ borderRadius: 8 }}
            />
          </div>

          {/* Would Recommend */}
          <div className="mb-8">
            <Checkbox
              checked={feedback.wouldRecommend}
              onChange={(e) => setFeedback(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
            >
              <Text style={{ color: isDark ? "#fff" : "#1f2937" }}>
                I would recommend Safetyc to others
              </Text>
            </Checkbox>
          </div>

          {/* Submit */}
          <Button
            type="primary"
            size="large"
            block
            onClick={handleSubmit}
            loading={submitting}
            disabled={feedback.overallRating === 0}
            style={{ 
              height: 48, 
              background: "#f97316", 
              borderColor: "#f97316",
              fontWeight: 600
            }}
          >
            Submit Feedback
          </Button>
        </Card>
      </div>
    </div>
  );
}
