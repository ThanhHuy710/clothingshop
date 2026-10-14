import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <main className="w-full pt-20 min-h-screen bg-surface-alabaster">
      <div className="w-full bg-surface-canvas relative overflow-hidden py-space-xl">
        <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop relative z-10">
          <nav className="flex items-center gap-2 text-body-sm font-body-sm text-text-muted mb-space-sm">
            <Link className="hover:text-primary transition-colors" to="/">Trang chủ </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-text-primary font-headline-sm">Danh mục</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-text-primary font-light tracking-tight">
                Tất cả danh mục
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop py-space-xl">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-surface-canvas w-full aspect-[4/5] rounded-xl"></div>
             ))}
          </div>
        ) : error ? (
          <div className="py-10 text-center text-text-secondary">
             <p>{error}</p>
             <button onClick={() => window.location.reload()} className="mt-4 text-primary underline">Retry</button>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center text-text-secondary">No categories available.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} className="group flex flex-col bg-surface-pure rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" to={`/products?categoryId=${cat.id}`}>
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-canvas">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={cat.name} src={cat.image || cat.imageUrl || "https://placehold.co/400x500/eee/999?text=Category"} />
                </div>
                <div className="p-3.5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-headline-sm text-body-md text-text-primary group-hover:text-accent-terracotta transition-colors">{cat.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-accent-terracotta font-body-sm text-body-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Khám phá</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
