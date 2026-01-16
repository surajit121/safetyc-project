import SEO from "../components/SEO.jsx";
import WorkGallery from "../components/WorkGallery.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Projects() {
  const { theme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO 
        title="Our Live Work" 
        description="Browse our portfolio of real-world safety installations in Bankura and West Bengal. CCTV, Fire Safety, and more."
        path="/projects"
      />
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Our Live Work
        </h2>
        <p className="text-gray-800 dark:text-gray-300 max-w-2xl mx-auto text-lg font-medium">
          Recent installations and projects completed for our satisfied clients across West Bengal.
        </p>
      </div>

      <WorkGallery />
    </div>
  );
}
