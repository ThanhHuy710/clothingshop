 import { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import { productService } from '../../services/productService';
import { Link } from 'react-router-dom';
import { FadeIn } from '../ui/FadeIn';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = { bestSeller: 1, page, size: 4 }; // Max 4 products
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
  }, [page]);

  const next = () => { if (page < totalPages - 1) setPage(p => p + 1); };
  const prev = () => { if (page > 0) setPage(p => p - 1); };

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <FadeIn direction="up" className="w-full"><section className="w-full py-20 bg-surface-alabaster border-t border-border-subtle overflow-hidden">
      <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-text-primary">
              BÁN CHẠY NHẤT
            </h2>
            <p className="font-body-md text-body-md text-text-secondary mt-3">
              Những thiết kế được yêu thích nhất. Form dáng dễ mặc, chất liệu tự nhiên êm ái tạo cảm giác thoải mái tuyệt đối cho mọi dáng người.
            </p>
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
        
        <div className="mt-12 text-center">
          <Link to="/products?bestSeller=1" className="inline-flex items-center gap-2 px-8 py-3.5 border border-border-subtle rounded-lg text-body-md font-headline-sm text-text-primary hover:bg-surface-canvas transition-colors">
            Khám phá thêm
          </Link>
        </div>
      </div>
    </section></FadeIn>
  );
}




