 import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FadeIn } from "../ui/FadeIn";
import { categoryService } from "../../services/categoryService";

export default function CategoryExploration() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        let cats = [];
        if (Array.isArray(data)) cats = data;
        else if (data && Array.isArray(data.content)) cats = data.content;
        else if (data && Array.isArray(data.data)) cats = data.data;
        setCategories(cats);
      } catch (err) {
        setError(err.message || 'Unable to load categories.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  const next = () => {
    if (canGoNext) setPage(p => p + 1);
  };
  const prev = () => {
    if (canGoPrev) setPage(p => p - 1);
  };

  const visibleCategories = categories.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <FadeIn direction="up" className="w-full"><section className="w-full py-16 bg-surface-alabaster">
      <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-label-caps text-label-caps text-accent-terracotta uppercase">BỘ SƯU TẬP CỐT LÕI</span>
            <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-text-primary mt-1">
              Khám Phá Danh Mục
            </h2>
          </div>
          <Link to="/categories" className="group flex items-center gap-2 text-text-primary hover:text-accent-terracotta transition-colors font-headline-sm text-body-md whitespace-nowrap">
            <span>Xem tất cả danh mục</span>
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
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

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface-canvas w-full aspect-[4/5] rounded-xl"></div>
               ))}
            </div>
          ) : error ? (
            <div className="py-10 text-center text-text-secondary">
               <p>{error}</p>
               <button onClick={() => window.location.reload()} className="mt-4 text-primary underline">Thử lại</button>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center text-text-secondary">Chưa có danh mục nào.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {visibleCategories.map((cat, idx) => (
                <FadeIn key={cat.id} delay={idx * 50}><Link key={cat.id} className="group/card flex flex-col bg-surface-pure rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" to={`/products?categoryId=${cat.id}`}>
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-canvas">
                    <img className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" alt={cat.name} src={cat.image || cat.imageUrl || "https://placehold.co/400x500/eee/999?text=Category"} />
                  </div>
                  <div className="p-3.5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-headline-sm text-body-md text-text-primary group-hover/card:text-accent-terracotta transition-colors">{cat.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-accent-terracotta font-body-sm text-body-sm mt-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <span>Khám phá</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                  </div>
                </Link></FadeIn>
              ))}
            </div>
          )}
        </div>
      </div>
    </section></FadeIn>
  );
}
