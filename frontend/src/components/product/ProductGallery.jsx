import { useState, useEffect } from 'react';

export default function ProductGallery({ images = [], badges = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [images]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[3/4] bg-surface-canvas rounded-xl overflow-hidden shadow-md flex items-center justify-center">
        <span className="text-text-muted">No Image</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-space-md items-start">
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-space-xs w-full md:w-20 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden bg-surface-canvas shrink-0 transition-all shadow-sm border-2 ${
                selectedIndex === idx ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                className="w-full h-full object-cover object-center"
                src={img}
                alt={`Thumbnail ${idx}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main High-Res Image Container */}
      <div 
      className="relative w-full aspect-[3/4] bg-surface-canvas rounded-xl overflow-hidden shadow-md group flex-1 cursor-crosshair"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
        src={selectedImage}
        alt="Main product"
      />
      {isZoomed && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${selectedImage})`,
            backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
            backgroundSize: '200%',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
        
        {/* Floating Badges */}
        {(badges.length > 0) && (
          <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className={`font-label-caps text-label-caps uppercase px-3 py-1.5 rounded-full shadow-sm tracking-wider ${
                  badge.toLowerCase().includes('tiết kiệm') || badge.toLowerCase().includes('sale') || badge.includes('%')
                    ? 'bg-accent-terracotta text-on-primary'
                    : 'bg-primary text-on-primary'
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-surface-pure/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow text-body-sm font-body-sm text-text-primary flex items-center gap-1.5 pointer-events-none">
          <span className="material-symbols-outlined text-[16px] text-accent-bronze">zoom_in</span>
          <span className="hidden sm:inline">Di chuột để phóng to</span>
        </div>
      </div>
    </div>
  );
}
