import ProductCard from "../../components/product/ProductCard";
import { FadeIn } from "../../components/ui/FadeIn";
import MobileFilterSheet from "../../components/layout/MobileFilterSheet";
import { useProductStore } from "../../stores/productStore";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useUIStore } from "../../stores/uiStore";
import { categoryService } from "../../services/categoryService";
import { colorService, sizeService } from "../../services/productService";

const PRICE_RANGES = [
  { id: 'under_300', label: 'Dưới 300.000₫', min: null, max: 300000 },
  { id: '300_500', label: '300.000₫ - 500.000₫', min: 300000, max: 500000 },
  { id: '500_1000', label: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000 },
  { id: 'over_1000', label: 'Trên 1.000.000₫', min: 1000000, max: null }
];

const getPaginationItems = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }
  const items = [];
  items.push(0);

  if (current > 2) {
    items.push('ellipsis-start');
  }

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);

  for (let i = start; i <= end; i++) {
    items.push(i);
  }

  if (current < total - 3) {
    items.push('ellipsis-end');
  }

  items.push(total - 1);
  return items;
};

export default function ProductListPage() {
  const setFilterSheetOpen = useUIStore((state) => state.setFilterSheetOpen);
  const isFilterSheetOpen = useUIStore((state) => state.isFilterSheetOpen);
  const { products, fetchProducts, isLoading, totalPages, currentPage } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    categoryService.getAll().then(res => {
      // Handle the case where backend returns { content: [...] } or just [...]
      let data = res;
      if (res && res.data) data = res.data;
      if (res && res.content) data = res.content;
      setCategories(Array.isArray(data) ? data : []);
    }).catch(console.error);

    colorService.getAll().then(res => {
      let data = res;
      if (res && res.data) data = res.data;
      if (res && res.content) data = res.content;
      setColors(Array.isArray(data) ? data : []);
    }).catch(console.error);

    sizeService.getAll().then(res => {
      let data = res;
      if (res && res.data) data = res.data;
      if (res && res.content) data = res.content;
      setSizes(Array.isArray(data) ? data : []);
    }).catch(console.error);
  }, []);
  
  const categoryId = searchParams.get('categoryId');
  const searchName = searchParams.get('name');
  const gender = searchParams.get('gender');
  const bestSeller = searchParams.get('bestSeller');
  const colorId = searchParams.get('colorId');
  const sizeId = searchParams.get('sizeId');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '12', 10);

  useEffect(() => {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (searchName) params.name = searchName;
    if (gender) params.gender = gender;
    if (colorId) params.colorId = colorId;
    if (sizeId) params.sizeId = sizeId;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (bestSeller === '1') params.bestSeller = true;
    if (sort && sort !== 'newest') params.sort = sort;
    params.page = page;
    params.size = size;
    fetchProducts(params);
  }, [fetchProducts, categoryId, searchName, gender, colorId, sizeId, minPrice, maxPrice, bestSeller, sort, page, size]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '0'); // reset pagination on filter change
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const getActiveFilters = () => {
    const filters = [];
    if (searchName) filters.push({ key: 'name', label: `Tìm kiếm: ${searchName}` });
    if (categoryId && categories.length > 0) {
      const cat = categories.find(c => c.id.toString() === categoryId);
      if (cat) filters.push({ key: 'categoryId', label: cat.name });
    }
    if (gender) {
      const gLabel = gender === 'female' ? 'Nữ' : gender === 'male' ? 'Nam' : 'Unisex';
      filters.push({ key: 'gender', label: `Dành cho: ${gLabel}` });
    }
    if (colorId && colors.length > 0) {
      const c = colors.find(c => c.id.toString() === colorId);
      if (c) filters.push({ key: 'colorId', label: `Màu: ${c.name}` });
    }
    if (sizeId && sizes.length > 0) {
      const s = sizes.find(s => s.id.toString() === sizeId);
      if (s) filters.push({ key: 'sizeId', label: `Size: ${s.name}` });
    }
    if (minPrice || maxPrice) {
      const r = PRICE_RANGES.find(r => (r.min || '') == (minPrice || '') && (r.max || '') == (maxPrice || ''));
      filters.push({ key: 'price', label: `Giá: ${r?.label}` });
    }
    return filters;
  };

  const activeFilters = getActiveFilters();

  const handlePriceChange = (range) => {
    const newParams = new URLSearchParams(searchParams);
    if (range.min) newParams.set('minPrice', range.min);
    else newParams.delete('minPrice');
    
    if (range.max) newParams.set('maxPrice', range.max);
    else newParams.delete('maxPrice');
    
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  return (
    <>
      <MobileFilterSheet 
        isOpen={isFilterSheetOpen} 
        onClose={() => setFilterSheetOpen(false)}
        categories={categories}
        colors={colors}
        sizes={sizes}
        searchParams={searchParams}
        updateParam={updateParam}
        clearAllFilters={clearAllFilters}
      />
      <main className="w-full pt-20 min-h-screen bg-surface-alabaster">
        <div className="flex flex-col w-full">
          <div 
            className="w-full relative overflow-hidden pt-6 pb-16 lg:pt-8 lg:pb-28 bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: "url('/images/banner.png')" }}
          >
            <div className="absolute inset-0 bg-surface-alabaster/60 backdrop-blur-[1px]"></div>
            <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop relative z-10">
              <nav className="flex items-center gap-2 text-body-md lg:text-body-lg mb-space-sm">
                <Link className="text-white hover:text-white/80 transition-colors" to="/">Trang chủ</Link>
                <span className="material-symbols-outlined text-[16px] lg:text-[18px] text-text-muted">chevron_right</span>
                <span className="text-text-primary font-headline-sm">Sản phẩm</span>
              </nav>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mt-10 lg:mt-16">
                <div>
                  <div className="text-[11px] lg:text-xs font-bold text-accent-terracotta uppercase tracking-[0.2em] mb-3">
                    BỘ SƯU TẬP XUÂN HÈ 2026
                  </div>
                  <h1 className="text-3xl lg:text-5xl text-text-primary font-light tracking-tight mb-4">
                    Tất cả sản phẩm
                  </h1>
                  <p className="text-body-md lg:text-lg text-text-secondary max-w-2xl leading-relaxed">
                    Tập hợp những thiết kế tinh tế với kỹ nghệ may đo
                    thủ công đương đại. Chất liệu vải linen tự nhiên, lụa
                    Habutai và poplin thoáng nhẹ, tôn dáng trang nhã suốt
                    ngày dài.
                  </p>
                </div>
                <div className="hidden lg:flex items-center gap-4 bg-surface-pure px-4 py-3 rounded-lg shadow-sm">
                  <div className="text-center pr-4">
                    <span className="block font-price-lg text-price-lg text-text-primary">
                      128
                    </span>
                    <span className="text-body-sm font-body-sm text-text-muted">
                      Thiết kế độc quyền
                    </span>
                  </div>
                  <div className="w-px h-8 bg-surface-variant"></div>
                  <div className="text-center pl-2">
                    <span className="block font-price-lg text-price-lg text-accent-terracotta">
                      100%
                    </span>
                    <span className="text-body-sm font-body-sm text-text-muted">
                      Chất liệu tự nhiên
                    </span>
                  </div>
                </div>
                            
            </div>
            </div>
          </div>

          <div className="sticky top-20 z-30 bg-surface-pure/95 backdrop-blur-md shadow-sm">
            <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop py-space-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
                {activeFilters.length > 0 && (
                  <span className="text-body-sm font-body-sm text-text-muted hidden sm:inline">Bộ lọc:</span>
                )}
                {activeFilters.map(filter => (
                  <span key={filter.key} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-body-sm font-body-sm text-text-primary">
                    <span>{filter.label}</span>
                    <button
                      className="hover:text-status-error flex items-center"
                      title="Xóa bộ lọc"
                      onClick={() => {
                        if (filter.key === 'price') {
                           updateParam('minPrice', null);
                           updateParam('maxPrice', null);
                        } else {
                           updateParam(filter.key, null);
                        }
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
                {activeFilters.length > 0 && (
                  <button onClick={clearAllFilters} className="text-body-sm font-body-sm text-accent-terracotta hover:underline ml-1 font-headline-sm">
                    Xóa tất cả
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 w-full md:w-auto ml-auto">
                <button
                  onClick={() => setFilterSheetOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-canvas text-body-sm font-body-sm text-text-primary hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Bộ lọc & Tùy chọn</span>
                </button>
                <div className="relative group">
                  <div className="flex items-center gap-2 bg-surface-canvas px-3 py-1.5 rounded-lg text-body-sm font-body-sm text-text-primary cursor-pointer hover:bg-surface-variant transition-colors">
                    <span className="text-text-muted hidden sm:inline">Sắp xếp:</span>
                    <select
                      className="bg-transparent font-headline-sm text-text-primary focus:outline-none cursor-pointer pr-1"
                      value={sort || (bestSeller === '1' ? 'BEST_SELLER' : 'newest')}
                      onChange={(e) => {
                        if (e.target.value === 'BEST_SELLER') {
                           updateParam('sort', null);
                           updateParam('bestSeller', '1');
                        } else {
                           updateParam('bestSeller', null);
                           updateParam('sort', e.target.value === 'newest' ? null : e.target.value);
                        }
                      }}
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="BEST_SELLER">Bán chạy nhất</option>
                      <option value="PRICE_ASC">Giá tăng dần</option>
                      <option value="PRICE_DESC">Giá giảm dần</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop py-space-xl w-full">
            <div className="flex flex-col lg:flex-row gap-space-xl items-start">
              
              <aside className="w-full lg:w-[280px] shrink-0 space-y-space-lg bg-surface-pure p-space-md rounded-xl shadow-sm hidden lg:block">
                <div className="flex items-center gap-2 pb-space-xs">
                  <span className="material-symbols-outlined text-[20px] text-accent-terracotta">filter_list</span>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary uppercase tracking-wide">Bộ Lọc Danh Mục</h2>
                </div>
                
                {/* Categories */}
                <div className="pt-space-xs">
                  <h3 className="font-headline-sm text-body-md text-text-primary mb-3">Danh mục sản phẩm</h3>
                  <div className="space-y-2.5">
                    {categories.length > 0 ? categories.map(cat => (
                      <label key={cat.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={categoryId === cat.id.toString()}
                            onChange={() => updateParam('categoryId', categoryId === cat.id.toString() ? null : cat.id.toString())}
                            className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                          />
                          <span className={`text-body-md font-body-md transition-colors ${categoryId === cat.id.toString() ? 'text-primary font-medium' : 'text-text-secondary group-hover:text-text-primary'}`}>
                            {cat.name}
                          </span>
                        </div>
                      </label>
                    )) : <p className='text-sm text-gray-500'>Đang tải...</p>}
                  </div>
                </div>

                {/* Gender */}
                <div className="pt-space-xs border-t border-surface-variant">
                  <h3 className="font-headline-sm text-body-md text-text-primary mb-3 mt-3">Dành cho</h3>
                  <div className="space-y-2.5">
                    {[{id: 'male', label: 'Nam'}, {id: 'female', label: 'Nữ'}, {id: 'unisex', label: 'Unisex'}].map(g => (
                      <label key={g.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gender === g.id}
                          onChange={() => updateParam('gender', gender === g.id ? null : g.id)}
                          className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                        />
                        <span className={`text-body-md transition-colors ${gender === g.id ? 'text-primary font-medium' : 'text-text-secondary'}`}>{g.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="pt-space-xs border-t border-surface-variant">
                  <h3 className="font-headline-sm text-body-md text-text-primary mb-3 mt-3">Khoảng giá</h3>
                  <div className="space-y-2.5">
                    {PRICE_RANGES.map(r => {
                      const isChecked = (r.min || '') == (minPrice || '') && (r.max || '') == (maxPrice || '');
                      return (
                        <label key={r.id} className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handlePriceChange(isChecked ? {min: null, max: null} : r)}
                            className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                          />
                          <span className={`text-body-md transition-colors ${isChecked ? 'text-primary font-medium' : 'text-text-secondary'}`}>{r.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Colors */}
                <div className="pt-space-xs border-t border-surface-variant">
                  <h3 className="font-headline-sm text-body-md text-text-primary mb-3 mt-3">Màu sắc</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.length > 0 ? colors.map(c => (
                      <button
                        key={c.id}
                        onClick={() => updateParam('colorId', colorId === c.id.toString() ? null : c.id.toString())}
                        title={c.name}
                        style={{ backgroundColor: c.hexCode || c.code || '#ddd' }}
                        className={'w-8 h-8 rounded-full border-2 ' + (colorId === c.id.toString() ? 'border-primary' : 'border-transparent') + ' shadow-sm'}
                      />
                    )) : <p className='text-sm text-gray-500'>Đang tải...</p>}
                  </div>
                </div>

                {/* Sizes */}
                <div className="pt-space-xs border-t border-surface-variant">
                  <h3 className="font-headline-sm text-body-md text-text-primary mb-3 mt-3">Kích thước</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.length > 0 ? sizes.map(s => (
                      <button
                        key={s.id}
                        onClick={() => updateParam('sizeId', sizeId === s.id.toString() ? null : s.id.toString())}
                        className={'px-3 py-1 border rounded text-sm ' + (sizeId === s.id.toString() ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700 hover:border-gray-400')}
                      >
                        {s.name}
                      </button>
                    )) : <p className='text-sm text-gray-500'>Đang tải...</p>}
                  </div>
                </div>

              </aside>
              
              <div className="flex-1 w-full relative">
                {isLoading && products.length === 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className={"transition-opacity duration-300 " + (isLoading ? "opacity-50 pointer-events-none" : "opacity-100")}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-10">
                      {products.map((product, index) => (
                        <FadeIn key={product.id} delay={index * 50}><ProductCard key={product.id} product={product} /></FadeIn>
                      ))}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-12 flex justify-center w-full px-2">
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full">
                          <button
                            disabled={currentPage === 0}
                            onClick={() => updateParam('page', currentPage - 1)}
                            className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-border-subtle rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-slate-50 shrink-0"
                          >
                            Trước
                          </button>
                          {getPaginationItems(currentPage, totalPages).map((item, i) => {
                            if (typeof item === 'string') {
                              return (
                                <span key={item + i} className="px-1.5 py-1 text-xs sm:text-sm text-text-muted select-none">
                                  ...
                                </span>
                              );
                            }
                            return (
                              <button
                                key={item}
                                onClick={() => updateParam('page', item)}
                                className={`min-w-[32px] sm:min-w-[38px] h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm border rounded-lg transition-colors font-medium ${
                                  currentPage === item
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "border-border-subtle hover:bg-slate-50 text-text-primary"
                                }`}
                              >
                                {item + 1}
                              </button>
                            );
                          })}
                          <button
                            disabled={currentPage === totalPages - 1}
                            onClick={() => updateParam('page', currentPage + 1)}
                            className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-border-subtle rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-slate-50 shrink-0"
                          >
                            Sau
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">search_off</span>
                    <h3 className="text-xl text-gray-600 mb-4">Không tìm thấy sản phẩm phù hợp.</h3>
                    {activeFilters.length > 0 && (
                      <button onClick={clearAllFilters} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                        Xóa tất cả bộ lọc
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}



