
export default function SizeSelector({ sizes = [], selectedSize, onSizeSelect }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-space-xs">
      <div className="flex justify-between items-center text-body-md font-body-md">
        <span className="text-text-secondary">
          Kích thước: <strong className="text-text-primary font-headline-sm">{selectedSize?.name || 'Chọn kích thước'}</strong>
        </span>
        <button className="text-accent-terracotta hover:text-secondary text-body-sm font-body-sm flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined text-[16px]">straighten</span>
          Hướng dẫn chọn size
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
        {sizes.map((size) => {
          const isSelected = selectedSize?.id === size.id;
          // You can also add disabled logic if we had inventory data
          const isOutOfStock = false; 

          if (isOutOfStock) {
            return (
              <button
                key={size.id}
                disabled
                title="Hết hàng"
                className="py-2.5 rounded-lg bg-surface-canvas/50 text-text-muted text-body-md font-body-md cursor-not-allowed line-through relative"
              >{size.name}</button>
            );
          }

          return (
            <button
              key={size.id}
              onClick={() => onSizeSelect(size)}
              className={`py-2.5 rounded-lg font-headline-sm text-body-md transition-colors ${
                isSelected
                  ? 'bg-text-primary text-on-primary shadow-sm'
                  : 'bg-surface-canvas text-text-primary hover:bg-surface-container-high'
              }`}
            >{size.name}</button>
          );
        })}
      </div>
    </div>
  );
}
