 import { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import { productService } from '../../services/productService';
import { FadeIn } from '../ui/FadeIn';


export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, NAM, NU, BEST_SELLER
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = { page, size: 4 }; // Max 4 products
        if (activeTab === 'NAM') params.gender = 'male';
        if (activeTab === 'NU') params.gender = 'female';
        if (activeTab === 'BEST_SELLER') params.bestSeller = 1;
        
        const data = await productService.getAll(params);
        if (isMounted) {
          if (Array.isArray(data)) {
            setProducts(data.slice(0, 4));
            setTotalPages(Math.ceil(data.length / 4) || 1);
          } else if (data && Array.isArray(data.content)) {
            setProducts(data.content.slice(0, 4));
            setTotalPages(data.totalPages || 1);
          } else if (data && Array.isArray(data.data)) {
            setProducts(data.data.slice(0, 4));
            setTotalPages(data.totalPages || 1);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Unable to load products.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadProducts();
    return () => { isMounted = false; };
  }, [activeTab, page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0); // Reset pagination on tab change
  };

  const next = () => { if (page < totalPages - 1) setPage(p => p + 1); };
  const prev = () => { if (page > 0) setPage(p => p - 1); };

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <FadeIn direction="up" className="w-full"><section className="w-full py-16 bg-surface-pure">
      <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="font-label-caps text-label-caps text-accent-terracotta uppercase">Vừa Lên Kệ Tuần Này</span>
            <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-text-primary mt-1">
              NEW ARRIVALS - Những Sản Phẩm Mới Nhất
            </h2>
            <p className="font-body-md text-body-md text-text-secondary mt-1">Đường nét tối giản, bảng màu mộc lấy cảm hứng từ gốm nung và đất sét phương Nam.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
             <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button 
                  onClick={() => handleTabChange('ALL')} 
                  className={`px-4 py-2 rounded-lg font-headline-sm text-body-sm whitespace-nowrap transition-colors ${activeTab === 'ALL' ? 'bg-text-primary text-surface-pure' : 'bg-surface-canvas text-text-secondary hover:text-text-primary hover:bg-surface-variant'}`}
                >Tất cả</button>
                <button 
                  onClick={() => handleTabChange('NU')} 
                  className={`px-4 py-2 rounded-lg font-headline-sm text-body-sm whitespace-nowrap transition-colors ${activeTab === 'NU' ? 'bg-text-primary text-surface-pure' : 'bg-surface-canvas text-text-secondary hover:text-text-primary hover:bg-surface-variant'}`}
                >Nữ</button>
                <button 
                  onClick={() => handleTabChange('NAM')} 
                  className={`px-4 py-2 rounded-lg font-headline-sm text-body-sm whitespace-nowrap transition-colors ${activeTab === 'NAM' ? 'bg-text-primary text-surface-pure' : 'bg-surface-canvas text-text-secondary hover:text-text-primary hover:bg-surface-variant'}`}
                >Nam</button>
                <button 
                  onClick={() => handleTabChange('BEST_SELLER')} 
                  className={`px-4 py-2 rounded-lg font-headline-sm text-body-sm whitespace-nowrap transition-colors ${activeTab === 'BEST_SELLER' ? 'bg-text-primary text-surface-pure' : 'bg-surface-canvas text-text-secondary hover:text-text-primary hover:bg-surface-variant'}`}
                >Bán chạy</button>
             </div>
          </div>
        </div>

        <div className="relative group/carousel">
          <button 
            onClick={prev} 
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 p-3 bg-surface-pure rounded-full shadow-lg border border-border-subtle transition-all disabled:hidden hover:bg-surface-canvas text-text-primary ${canGoPrev ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0'}`}
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          <button 
            onClick={next} 
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 p-3 bg-surface-pure rounded-full shadow-lg border border-border-subtle transition-all disabled:hidden hover:bg-surface-canvas text-text-primary ${canGoNext ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0'}`}
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>

          {isLoading && products.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface-canvas w-full aspect-[3/4] rounded-xl"></div>
               ))}
            </div>
          ) : error ? (
            <div className="py-10 text-center text-text-secondary">
               <p>{error}</p>
               <button onClick={() => setPage(0)} className="mt-4 text-primary underline">Thử lại</button>
            </div>
          ) : products.length === 0 && !isLoading ? (
            <div className="py-10 text-center text-text-secondary">Chưa có sản phẩm nào.</div>
          ) : (
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {products.map((product, index) => (
                <FadeIn key={product.id} delay={index * 50}><ProductCard key={product.id} product={product} /></FadeIn>
              ))}
            </div>
          )}
        </div>
      </div>
    </section></FadeIn>
  );
}




