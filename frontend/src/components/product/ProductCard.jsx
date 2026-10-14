import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!product) return null;

  return (
    <div className="group flex flex-col bg-surface-pure rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[3/4] bg-surface-canvas overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:opacity-0 ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onLoad={() => setImgLoaded(true)}
            src={product.images?.[0] || 'https://via.placeholder.com/300x400'}
            alt={product.name}
          />
          {product.images?.[1] && (
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
              src={product.images[1]}
              alt={`${product.name} alternate view`}
            />
          )}
        </Link>
        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.badges?.map((badge, idx) => (
            <span
              key={idx}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-on-primary text-[10px] sm:text-label-caps font-label-caps tracking-wider uppercase shadow-sm ${
                badge === '-20%' || badge === 'Sale'
                  ? 'bg-accent-terracotta'
                  : badge === 'Bestseller'
                  ? 'bg-primary'
                  : 'bg-surface-variant text-text-primary'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
        
        {/* Wishlist Button */}
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-surface-pure/80 backdrop-blur text-text-primary hover:text-accent-terracotta hover:bg-surface-pure transition-colors flex items-center justify-center shadow-sm z-10"
          title="Thêm vào yêu thích"
        >
          <span className="material-symbols-outlined text-[15px] sm:text-[18px]">favorite</span>
        </button>

        

        
      </div>

      {/* Product Details */}
      <div className="p-2.5 sm:p-space-sm flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-text-muted mb-1">
            <span className="line-clamp-1">{product.material || 'Premium Material'}</span>
            <div className="flex items-center text-accent-bronze shrink-0">
              <span
                className="material-symbols-outlined text-[13px] sm:text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              
            </div>
          </div>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-headline-sm text-body-sm sm:text-body-md text-text-primary line-clamp-1 group-hover:text-accent-terracotta transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="mt-2 sm:mt-3 pt-2 border-t border-border-hairline">
          <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
            <span className="font-price-md text-[13px] sm:text-price-md text-accent-terracotta font-semibold">
              {Number(product.price || 0).toLocaleString('vi-VN')}₫
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-body-sm text-text-muted line-through">
                {Number(product.originalPrice || 0).toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          {/* Color Swatches */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
            {product.colors?.map((color) => (
              <span
                key={color.id}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full shadow-inner border border-border-subtle"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


