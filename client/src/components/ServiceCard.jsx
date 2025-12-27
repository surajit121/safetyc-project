import { Card, Typography } from "antd";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ServiceCard({ title, description, highlights = [], image }) {
  const { theme } = useTheme();
  return (
    <Card hoverable className="rounded-2xl h-full flex flex-col" bodyStyle={{ textAlign: "center", height: "100%", display: "flex", flexDirection: "column" }}>
      {image && (
        <div className="mb-4 flex justify-center">
          <img 
            src={image} 
            alt={title + " image"} 
            className="h-24 w-24 object-contain rounded-lg"
            loading="lazy"
            width="96"
            height="96"
          />
        </div>
      )}
      <div className="flex flex-col flex-grow">
        <Typography.Title level={4} style={{ marginBottom: 8 }}>{title}</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          {description}
        </Typography.Paragraph>
        {highlights?.length > 0 && (
          <ul className="mt-3 list-disc list-inside text-sm space-y-1 text-left">
            {highlights.map((h, i) => (
              <li key={i} style={{ color: theme === 'dark' ? '#9ca3af' : '#1f2937' }}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
