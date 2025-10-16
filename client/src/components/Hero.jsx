import { Link } from "react-router-dom";
import { Typography, Button, Row, Col, Card, Tag } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import building from "../assets/building.png";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Hero() {
  const { theme } = useTheme();
  return (
    <section className={theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-orange-50 to-white'}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={14}>
            <Tag color="orange" className="mb-3">Trusted by enterprises across WB</Tag>
            <Typography.Title level={1} style={{ margin: 0, lineHeight: 1.15 }}>
              Complete Safety, Security & Technology Solutions
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ fontSize: 16, marginTop: 12 }}>
              Integrated CCTV, Fire Safety, Solar, Electrical and IT solutions tailored for your organisation.
            </Typography.Paragraph>
            <div className="mt-4 flex gap-3">
              <Link to="/contact">
                <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                  Get a Quote
                </Button>
              </Link>
              <Link to="/services">
                <Button size="large">Explore Services</Button>
              </Link>
            </div>
          </Col>
          <Col xs={24} md={10}>
            <Card
              bodyStyle={{ padding: 12 }}
              className="shadow-lg rounded-2xl"
              styles={{ body: { background: "transparent" } }}
            >
              <img
                src={building}
                alt="Building"
                className="h-50 md:h-80 w-full object-contain rounded-xl"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}

