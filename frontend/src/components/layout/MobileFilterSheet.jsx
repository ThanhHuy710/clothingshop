import { useEffect, useState } from 'react';

const PRICE_RANGES = [
  { id: 'under_300', label: 'Dưới 300.000₫', min: null, max: 300000 },
  { id: '300_500', label: '300.000₫ - 500.000₫', min: 300000, max: 500000 },
  { id: '500_1000', label: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000 },
  { id: 'over_1000', label: 'Trên 1.000.000₫', min: 1000000, max: null }
];

export default function MobileFilterSheet({ isOpen, onClose, categories = [], colors = [], sizes = [], searchParams, updateParam, clearAllFilters }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      timer = setTimeout(() => setShow(false), 0);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const categoryId = searchParams.get('categoryId');
  const gender = searchParams.get('gender');
  const colorId = searchParams.get('colorId');
  const sizeId = searchParams.get('sizeId');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  let activeCount = 0;
  if (categoryId) activeCount++;
  if (gender) activeCount++;
  if (colorId) activeCount++;
  if (sizeId) activeCount++;
  if (minPrice || maxPrice) activeCount++;

  const handlePriceChange = (range) => {
    if (range.min === null && range.max === null) {
      updateParam('minPrice', null);
      updateParam('maxPrice', null);
    } else {
      updateParam('minPrice', range.min);
      updateParam('maxPrice', range.max);
    }
  };

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-text-primary/40 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sheet Container */}
      <aside 
        className={`fixed inset-x-0 bottom-0 z-[70] bg-surface-pure rounded-t-2xl shadow-[0_-12px_48px_rgba(0,0,0,0.15)] flex flex-col h-[85vh] max-h-[800px] w-full transform transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${show ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* DRAG HANDLE & HEADER */}
        <div className="shrink-0 pt-3 pb-4 px-4 bg-surface-pure rounded-t-2xl flex flex-col items-center relative z-10">
          <div className="w-12 h-1.5 bg-surface-canvas rounded-full mb-3"></div>
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="font-headline-sm text-[18px] font-semibold text-text-primary">BỘ LỌC TÌM KIẾM</h2>
              {activeCount > 0 && <span className="font-body-sm text-[12px] text-accent-terracotta">{activeCount} đang chọn</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { clearAllFilters(); onClose(); }} className="p-2 rounded-full hover:bg-surface-canvas text-text-secondary transition-colors" title="Đặt lại">
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
              <button onClick={onClose} className="p-2 rounded-full bg-surface-canvas hover:bg-surface-container text-text-primary transition-colors" title="Đóng bộ lọc">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE FILTER CONTENT */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 flex flex-col gap-5 pb-safe-bottom">
          
          {/* CATEGORY */}
          <section className="flex flex-col gap-3">
            <span className="font-headline-sm text-[15px] font-semibold text-text-primary uppercase tracking-wider">Danh mục</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const isSelected = categoryId === cat.id.toString();
                return (
                  <button 
                    key={cat.id}
                    onClick={() => updateParam('categoryId', isSelected ? null : cat.id.toString())}
                    className={`px-4 py-2 rounded-full font-body-sm text-body-md transition-all flex items-center gap-1 ${isSelected ? 'bg-text-primary text-surface-pure font-medium shadow-sm' : 'bg-surface-canvas text-text-secondary hover:text-text-primary'}`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <span className="material-symbols-outlined text-[16px]">close</span>}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="h-px w-full bg-surface-canvas"></div>

          {/* GENDER */}
          <section className="flex flex-col gap-3">
            <span className="font-headline-sm text-[15px] font-semibold text-text-primary uppercase tracking-wider">Dành cho</span>
            <div className="flex flex-wrap gap-2">
              {[{id: 'male', label: 'Nam'}, {id: 'female', label: 'Nữ'}, {id: 'unisex', label: 'Unisex'}].map(g => {
                const isSelected = gender === g.id;
                return (
                  <button 
                    key={g.id}
                    onClick={() => updateParam('gender', isSelected ? null : g.id)}
                    className={`px-4 py-2 rounded-full font-body-sm text-body-md transition-all flex items-center gap-1 ${isSelected ? 'bg-text-primary text-surface-pure font-medium shadow-sm' : 'bg-surface-canvas text-text-secondary hover:text-text-primary'}`}
                  >
                    <span>{g.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <div className="h-px w-full bg-surface-canvas"></div>

          {/* SIZES */}
          <section className="flex flex-col gap-3">
            <span className="font-headline-sm text-[15px] font-semibold text-text-primary uppercase tracking-wider">Kích cỡ</span>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map(s => {
                const isSelected = sizeId === s.id.toString();
                return (
                  <button 
                    key={s.id}
                    onClick={() => updateParam('sizeId', isSelected ? null : s.id.toString())}
                    className={`h-11 rounded border font-headline-sm flex items-center justify-center transition-all ${isSelected ? 'border-transparent bg-text-primary text-surface-pure shadow' : 'border-border-subtle bg-surface-pure text-text-secondary'}`}
                  >
                    {s.name}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="h-px w-full bg-surface-canvas"></div>

          {/* COLORS */}
          <section className="flex flex-col gap-3">
            <span className="font-headline-sm text-[15px] font-semibold text-text-primary uppercase tracking-wider">Màu sắc</span>
            <div className="flex flex-wrap gap-3">
              {colors.map(c => {
                const isSelected = colorId === c.id.toString();
                return (
                  <button 
                    key={c.id}
                    onClick={() => updateParam('colorId', isSelected ? null : c.id.toString())}
                    style={{ backgroundColor: c.hexCode || c.code || '#ddd' }}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-sm ${isSelected ? 'border-transparent ring-2 ring-offset-2 ring-primary' : 'border-border-subtle'}`}
                    title={c.name}
                  >
                    {isSelected && <span className="material-symbols-outlined text-[18px]" style={{filter: 'invert(1) grayscale(1) contrast(9)'}}>check</span>}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="h-px w-full bg-surface-canvas"></div>

          {/* PRICE RANGE */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-[15px] font-semibold text-text-primary uppercase tracking-wider">Mức giá</span>
            </div>
            <div className="flex flex-col gap-2">
              {PRICE_RANGES.map(r => {
                const isChecked = (r.min || '') == (minPrice || '') && (r.max || '') == (maxPrice || '');
                return (
                  <label key={r.id} className="flex items-center gap-2.5 cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handlePriceChange(isChecked ? {min: null, max: null} : r)}
                      className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                    />
                    <span className="text-body-md text-text-secondary">{r.label}</span>
                  </label>
                );
              })}
            </div>
          </section>

        </div>

        {/* BOTTOM FIXED ACTION BAR */}
        <div className="shrink-0 p-4 bg-surface-pure shadow-[0_-8px_24px_rgba(0,0,0,0.05)] flex items-center gap-3">
          <button onClick={() => { clearAllFilters(); onClose(); }} className="w-1/3 h-12 rounded bg-surface-canvas hover:bg-surface-canvas/80 text-text-primary font-body-md text-body-md font-medium flex items-center justify-center gap-1.5 transition-colors">
            Xóa tất cả
          </button>
          <button onClick={onClose} className="flex-1 h-12 rounded bg-accent-terracotta hover:bg-accent-bronze text-surface-pure font-headline-sm text-[14px] font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all">
            Áp Dụng
          </button>
        </div>
      </aside>
    </div>
  );
}
