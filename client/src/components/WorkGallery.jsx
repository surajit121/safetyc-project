import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workPhotos } from '../data/work-photos.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  FaVideo, 
  FaFireExtinguisher, 
  FaSolarPanel, 
  FaBolt, 
  FaNetworkWired, 
  FaHardHat, 
  FaTools,
  FaGlobe,
  FaMapMarkerAlt,
  FaCalendarAlt
} from 'react-icons/fa';

// Helper to get icon based on category
const getCategoryIcon = (category) => {
  if (category.includes('CCTV')) return <FaVideo />;
  if (category.includes('Fire')) return <FaFireExtinguisher />;
  if (category.includes('Solar')) return <FaSolarPanel />;
  if (category.includes('Electrical')) return <FaBolt />;
  if (category.includes('IT')) return <FaNetworkWired />;
  if (category.includes('Civil')) return <FaHardHat />;
  if (category.includes('Services')) return <FaTools />;
  return <FaGlobe />;
};

export default function WorkGallery() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [selectedId, setSelectedId] = useState(null);

  // Extract unique categories
  const categories = ['All Projects', ...new Set(workPhotos.map(p => p.category))];

  // Filter photos
  const filteredPhotos = activeCategory === 'All Projects' 
    ? workPhotos 
    : workPhotos.filter(p => p.category === activeCategory);

  return (
    <div className="py-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const isDark = theme === 'dark';
          
          return (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: isActive ? '#ea580c' : (isDark ? '#1f2937' : '#f3f4f6'), // Orange-600 or Gray-800 or Gray-100
                color: isActive ? '#ffffff' : (isDark ? '#e5e7eb' : '#111827'), // White or Gray-200 or Gray-900
                borderColor: isActive ? 'transparent' : (isDark ? '#374151' : '#d1d5db'),
              }}
              className={`
                cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-200 border shadow-sm
                ${isActive ? 'shadow-orange-500/30' : ''}
              `}
            >
              {cat !== 'All Projects' && getCategoryIcon(cat)}
              {cat}
            </motion.button>
          );
        })}
      </div>

      {/* Grid Layout */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode='popLayout'>
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
              onClick={() => setSelectedId(photo.id)}
            >
              {/* Background Image */}
              <img 
                src={photo.src} 
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Floating Badge (Top Left) */}
              <div className="absolute top-4 left-4">
                <span className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-lg">
                  {getCategoryIcon(photo.category)}
                  {photo.category}
                </span>
              </div>

              {/* Content (Bottom) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-2 leading-tight">{photo.title}</h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{photo.description}</p>
                
                {/* Metadata Footer */}
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400 border-t border-white/10 pt-3">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-orange-500" />
                    {photo.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-orange-500" />
                    {photo.year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            {workPhotos.map((photo) => {
              if (photo.id !== selectedId) return null;
              return (
                <motion.div
                  key={photo.id}
                  layoutId={`card-container-${photo.id}`}
                  className="relative z-[101] max-w-4xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="relative aspect-video">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-contain bg-black"
                    />
                    <button 
                       onClick={() => setSelectedId(null)}
                       className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                     >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="px-3 py-1 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-sm font-bold rounded-lg">
                        {photo.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <FaMapMarkerAlt /> {photo.location}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <FaCalendarAlt /> {photo.year}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 dark:text-white">{photo.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
