import { Card, Typography } from "antd";
import { useTheme } from "../context/ThemeContext.jsx";
import OptimizedImage from "./OptimizedImage.jsx";

export default function ServiceCard({ title, description, highlights = [], image }) {
  const { theme } = useTheme();
  
  return (
    <Card 
      hoverable 
      className="enterprise-card rounded-2xl h-full flex flex-col overflow-hidden group" 
      bodyStyle={{ 
        textAlign: "center", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        padding: "1.5rem"
      }}
    >
      {/* Decorative top gradient bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-100 transition-opacity duration-300"
        style={{ 
          background: 'linear-gradient(90deg, #f97316, #ea580c)',
        }}
      />
      
      {image && (
        <div className="mb-4 flex justify-center overflow-hidden rounded-xl">
          <OptimizedImage 
            src={image} 
            alt={title + " image"} 
            className="h-24 w-24 object-contain rounded-lg transition-transform duration-500 group-hover:scale-110"
            width={96}
            height={96}
          />
        </div>
      )}
      
      <div className="flex flex-col flex-grow">
        <Typography.Title 
          level={4} 
          style={{ marginBottom: 8 }}
          className="transition-colors duration-300"
        >
          {title}
        </Typography.Title>
        
        <Typography.Paragraph 
          type="secondary" 
          style={{ margin: 0 }}
          className="text-enterprise"
        >
          {description}
        </Typography.Paragraph>
        
        {highlights?.length > 0 && (
          <ul className="mt-4 space-y-2 text-left">
            {highlights.map((h, i) => (
              <li 
                key={i} 
                className="flex items-start gap-2 text-sm transition-all duration-300 hover:translate-x-1"
                style={{ color: theme === 'dark' ? '#a1a1aa' : '#4b5563' }}
              >
                <span 
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #f97316, #ea580c)'
                  }}
                />
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Hover indicator */}
      <div 
        className="mt-4 pt-4 border-t opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
        style={{ borderColor: theme === 'dark' ? '#27272a' : '#e5e7eb' }}
      >
        <span 
          className="text-sm font-medium"
          style={{ color: '#f97316' }}
        >
          Learn more →
        </span>
      </div>
    </Card>
  );
}
