import { SlidersHorizontal, X } from 'lucide-react';

const FilterChip = ({ label, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 border rounded-lg text-sm font-sans transition-all flex items-center outline-none ${
      isSelected
        ? 'bg-admin-primary-600 text-white border-admin-primary-600 shadow-md font-bold'
        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
    }`}
  >
    {label}
  </button>
);

const FilterSection = ({ title, children }) => (
  <div className="space-y-2">
    <label className="block text-sm font-sans font-semibold text-slate-700 border-b border-slate-100 pb-1">
      {title}
    </label>
    <div className="flex flex-wrap gap-2 pt-1">{children}</div>
  </div>
);

export default function AdminProductFilter({ 
  filters, 
  handleFilterChange, 
  isOpen,
  onClose,
  clearFilters,
  categories = [],
  colors = [],
  sizes = [],
  PRICE_RANGES = []
}) {
  const genders = [
    { id: 'male', name: 'Nam' },
    { id: 'female', name: 'Nữ' },
    { id: 'unisex', name: 'Unisex' }
  ];

  const sortOptions = [
    { id: 'newest', name: 'Mới nhất' },
    { id: 'best-selling', name: 'Bán chạy nhất' },
    { id: 'price-asc', name: 'Giá tăng dần' },
    { id: 'price-desc', name: 'Giá giảm dần' }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[100] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] max-w-full bg-white shadow-2xl border-l border-slate-200 z-[110] transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-admin-primary-600" /> Bộ lọc Nâng Cao
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg outline-none transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Sắp xếp */}
          <FilterSection title="Sắp xếp">
            {sortOptions.map(option => (
              <FilterChip
                key={option.id}
                label={option.name}
                isSelected={(filters.sort || 'newest') === option.id}
                onClick={() => handleFilterChange('sort', option.id === 'newest' ? null : option.id)}
              />
            ))}
          </FilterSection>

          {/* Danh mục */}
          <FilterSection title="Danh mục">
            {categories.map(cat => (
              <FilterChip
                key={cat.id}
                label={cat.name}
                isSelected={filters.categoryId === String(cat.id)}
                onClick={() => handleFilterChange('categoryId', filters.categoryId === String(cat.id) ? null : String(cat.id))}
              />
            ))}
          </FilterSection>

          {/* Giới tính */}
          <FilterSection title="Giới tính">
            {genders.map(g => (
              <FilterChip
                key={g.id}
                label={g.name}
                isSelected={filters.gender === g.id}
                onClick={() => handleFilterChange('gender', filters.gender === g.id ? null : g.id)}
              />
            ))}
          </FilterSection>

          {/* Màu sắc */}
          <FilterSection title="Màu sắc">
            {colors.map(c => (
              <FilterChip
                key={c.id}
                label={c.name}
                isSelected={filters.colorId === String(c.id)}
                onClick={() => handleFilterChange('colorId', filters.colorId === String(c.id) ? null : String(c.id))}
              />
            ))}
          </FilterSection>

          {/* Kích cỡ */}
          <FilterSection title="Kích cỡ">
            {sizes.map(s => (
              <FilterChip
                key={s.id}
                label={s.name}
                isSelected={filters.sizeId === String(s.id)}
                onClick={() => handleFilterChange('sizeId', filters.sizeId === String(s.id) ? null : String(s.id))}
              />
            ))}
          </FilterSection>

          {/* Khoảng giá */}
          <FilterSection title="Khoảng giá">
            {PRICE_RANGES.map(r => (
              <FilterChip
                key={r.id}
                label={r.label}
                isSelected={filters.minPrice == r.min && filters.maxPrice == r.max}
                onClick={() => {
                  if (filters.minPrice == r.min && filters.maxPrice == r.max) {
                    handleFilterChange('price', { min: null, max: null });
                  } else {
                    handleFilterChange('price', { min: r.min, max: r.max });
                  }
                }}
              />
            ))}
          </FilterSection>
          
          {/* Best Seller */}
          <FilterSection title="Khác">
            <FilterChip
              label="Bán chạy nhất (Best Seller)"
              isSelected={filters.bestSeller === '1'}
              onClick={() => handleFilterChange('bestSeller', filters.bestSeller === '1' ? null : '1')}
            />
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
          <button
            onClick={clearFilters}
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-admin-primary-600 hover:bg-admin-primary-700 transition-colors shadow-sm"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </>
  );
}
