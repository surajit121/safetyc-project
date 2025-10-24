import { Card, Typography } from "antd";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ServiceCard({ title, description, highlights = [], image }) {
  const { theme } = useTheme();
  return (
    <Card hoverable className="rounded-2xl" bodyStyle={{ textAlign: "center" }}>
      {image && (
        <img 
          src={image} 
          alt={title + " image"} 
          className="mb-4 w-24 h-24 object-cover rounded mx-auto" 
          loading="lazy"
          width="96"
          height="96"
        />
      )}
      <Typography.Title level={4} style={{ marginBottom: 8 }}>{title}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
        {description}
      </Typography.Paragraph>
      {highlights?.length > 0 && (
        <ul className="mt-3 list-disc list-inside text-sm space-y-1 text-left">
          {highlights.map((h, i) => (
            <li key={i} className="text-gray-600">{h}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
