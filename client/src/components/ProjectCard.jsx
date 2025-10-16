import { Card, Typography } from "antd";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ProjectCard({
  name,
  summary,
  servicesUsed = [],
  clientName,
  sector,
  year,
}) {
  const { theme } = useTheme();
  return (
    <Card hoverable className="rounded-2xl" bodyStyle={{ textAlign: "left" }}>
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        {name}
      </Typography.Title>
      {(clientName || sector || year) && (
        <Typography.Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
          {clientName ? clientName : ""}
          {clientName && (sector || year) ? " • " : ""}
          {[sector, year].filter(Boolean).join(" • ")}
        </Typography.Text>
      )}
      {summary && (
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          {summary}
        </Typography.Paragraph>
      )}
      {servicesUsed?.length > 0 && (
        <ul className="mt-3 list-disc list-inside text-sm space-y-1">
          {servicesUsed.map((s, i) => (
            <li key={i} className="text-gray-600">{s}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
