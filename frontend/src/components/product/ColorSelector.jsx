
const isValidHex = (hex) => {
  if (typeof hex !== 'string') return false;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex.trim());
};

const getValidColor = (code) => {
  if (isValidHex(code)) {
    return code.trim();
  }
  return '#E5E7EB';
};

const isLightColor = (hex) => {
  if (!isValidHex(hex)) return true;
  let clean = hex.trim().replace('#', '');
  if (clean.length === 3 || clean.length === 4) {
    clean = clean.split('').slice(0, 3).map((c) => c + c).join('');
  } else if (clean.length === 8) {
    clean = clean.substring(0, 6);
  }
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return true;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 180;
};

export default function ColorSelector({ colors = [], selectedColor, onColorSelect }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-space-xs">
      <div className="flex justify-between items-center text-body-md font-body-md">
        <span className="text-text-secondary">
          Màu sắc: <strong className="text-text-primary font-headline-sm">{selectedColor?.name || 'Chọn màu'}</strong>
        </span>
      </div>
      <div className="flex items-center gap-3 pt-1 flex-wrap" role="radiogroup" aria-label="Chọn màu sắc">
        {colors.map((color) => {
          const isSelected = selectedColor?.id === color.id;
          const bgColor = getValidColor(color.code);
          const isLight = isLightColor(bgColor);
          const checkColor = isLight ? '#1F2937' : '#FFFFFF';

          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${color.name || 'Màu sắc'}${isSelected ? ' (Đang chọn)' : ''}`}
              onClick={() => onColorSelect(color)}
              title={color.name || 'Màu sắc'}
              className={`w-9 h-9 rounded-full shadow-md transition-all flex items-center justify-center border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                isLight ? 'border-neutral-300 shadow-xs' : 'border-black/10'
              } ${
                isSelected
                  ? 'scale-110 shadow-accent-terracotta/30 ring-2 ring-offset-2 ring-primary'
                  : 'hover:scale-110 opacity-85 hover:opacity-100'
              }`}
              style={{ backgroundColor: bgColor }}
            >
              <span
                className={`material-symbols-outlined text-[16px] font-bold transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ color: checkColor }}
              >
                check
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

