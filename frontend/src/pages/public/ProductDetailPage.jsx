import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductGallery from '../../components/product/ProductGallery';
import ColorSelector from '../../components/product/ColorSelector';
import SizeSelector from '../../components/product/SizeSelector';
import { productService, colorService } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import { Phone } from 'lucide-react';
import ZaloIcon from '../../components/common/ZaloIcon';
import { CONTACT_LINKS, CONTACT_PHONE_DISPLAY } from '../../config/contact';
import { FadeIn } from '../../components/ui/FadeIn';


export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false);
  const [allColors, setAllColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState(null);
  const [relatedPage, setRelatedPage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    colorService.getAll()
      .then((res) => {
        if (!isMounted) return;
        let data = res;
        if (res && res.data) data = res.data;
        if (res && res.content) data = res.content;
        setAllColors(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load colors master data:', err);
      });
    return () => { isMounted = false; };
  }, []);

  const colorMap = useMemo(() => {
    const map = new Map();
    allColors.forEach((c) => {
      if (c && c.id != null) {
        map.set(String(c.id), c);
        map.set(Number(c.id), c);
      }
    });
    return map;
  }, [allColors]);
  

  useEffect(() => {
    let isMounted = true;
    
    // Reset state and scroll immediately on id change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(false);
    setSelectedColor(null);
    setSelectedSize(null);
    setRelatedPage(0);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    productService.getById(id).then(async (data) => {
      if (!isMounted) return;
      if (data) {
        setProduct(data);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (data.categoryId) {
          setRelatedLoading(true);
          setRelatedError(null);
          try {
            const params = {
              categoryId: data.categoryId,
              page: 0,
              size: 12
            };
            if (data.gender) {
              params.gender = data.gender;
            }

            let res = await productService.getAll(params);
            let list = Array.isArray(res) ? res : (res?.content || res?.data || []);

            // Fallback: only if Call 1 succeeded but returned empty and gender was specified
            if (list.length === 0 && data.gender) {
              const fallbackRes = await productService.getAll({
                categoryId: data.categoryId,
                page: 0,
                size: 12
              });
              list = Array.isArray(fallbackRes) ? fallbackRes : (fallbackRes?.content || fallbackRes?.data || []);
            }

            if (isMounted) {
              const seen = new Set();
              const filtered = list.filter(p => {
                if (!p || String(p.id) === String(id)) return false;
                if (seen.has(p.id)) return false;
                seen.add(p.id);
                return true;
              });
              setRelatedProducts(filtered);
            }
          } catch (err) {
            if (isMounted) {
              setRelatedError(err?.message || 'Không thể tải danh sách sản phẩm tương tự.');
            }
          } finally {
            if (isMounted) {
              setRelatedLoading(false);
            }
          }
        } else {
          setRelatedProducts([]);
        }
      } else {
        setError(true);
      }
    }).catch(() => {
      if (isMounted) setError(true);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [id]);

  const colors = useMemo(() => {
    if (!product || !product.variants) return [];
    const uniqueColors = [];
    const map = new Map();
    product.variants.forEach((v) => {
      if (v.colorId != null && !map.has(v.colorId)) {
        map.set(v.colorId, true);
        const masterColor = colorMap.get(v.colorId);
        const colorCode =
          masterColor?.code ||
          v.code ||
          v.color?.code ||
          (v.colorCode && v.colorCode.startsWith('#') ? v.colorCode : null) ||
          '#E5E7EB';
        uniqueColors.push({
          id: v.colorId,
          name: v.colorName || masterColor?.name || ('Màu ' + v.colorId),
          code: colorCode,
        });
      }
    });
    return uniqueColors;
  }, [product, colorMap]);

  useEffect(() => {
    if (colors.length > 0) {
      if (!selectedColor || !colors.some((c) => c.id === selectedColor.id)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedColor(colors[0]);
      } else {
        const updated = colors.find((c) => c.id === selectedColor.id);
        if (updated && (updated.code !== selectedColor.code || updated.name !== selectedColor.name)) {
          setSelectedColor(updated);
        }
      }
    }
  }, [colors, selectedColor]);

  const sizes = useMemo(() => {
    if (!product || !product.variants || !selectedColor) return [];
    return product.variants
      .filter(v => v.colorId === selectedColor.id && v.sizeId != null)
      .map(v => ({ id: v.sizeId, name: v.sizeName || 'Size ' + v.sizeId }));
  }, [product, selectedColor]);

  useEffect(() => {
    if (sizes.length > 0) {
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSize(sizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [sizes]);

  const currentVariant = useMemo(() => {
    if (!product || !product.variants || !selectedColor || !selectedSize) return null;
    return product.variants.find(v => v.colorId === selectedColor.id && v.sizeId === selectedSize.id) || null;
  }, [product, selectedColor, selectedSize]);

  const currentPrice = currentVariant && currentVariant.price ? currentVariant.price : (product?.price || 0);
  const currentSku = currentVariant && currentVariant.sku ? currentVariant.sku : 'N/A';
  

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (product.imageDetails && product.imageDetails.length > 0) {
      return product.imageDetails.map(i => i.imageUrl);
    }
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return ['https://via.placeholder.com/600x800?text=No+Image'];
  }, [product]);

  const ITEMS_PER_PAGE = 4;
  const totalRelatedPages = Math.ceil(relatedProducts.length / ITEMS_PER_PAGE) || 1;
  const canGoPrev = relatedPage > 0;
  const canGoNext = relatedPage < totalRelatedPages - 1;

  const prevRelated = () => {
    if (canGoPrev) setRelatedPage(p => p - 1);
  };
  const nextRelated = () => {
    if (canGoNext) setRelatedPage(p => p + 1);
  };

  const visibleRelatedProducts = relatedProducts.slice(
    relatedPage * ITEMS_PER_PAGE,
    (relatedPage + 1) * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <main className="w-full pt-28 min-h-screen bg-surface-alabaster flex items-center justify-center">
        <div className="text-xl text-gray-500">Đang tải thông tin sản phẩm...</div>
      </main>
    );
  }


  return (
    <>
      <main className="w-full pt-[92px] sm:pt-[110px] min-h-screen bg-surface-alabaster"><div className="flex flex-col w-full">
{/*  Breadcrumb Bar  */}
<div className="w-full bg-surface-pure py-space-sm px-margin-mobile lg:px-margin-desktop shadow-sm">
<div className="max-w-max-width-content mx-auto flex items-center gap-2 text-body-sm font-body-sm text-text-muted flex-wrap">
<a className="hover:text-primary transition-colors" href="#">Trang chủ</a>
<span>/</span>
<a className="hover:text-primary transition-colors" href="#">Sản phẩm</a>
<span>/</span>
<a className="hover:text-primary transition-colors" href="#">Nữ</a>
<span>/</span>
<a className="hover:text-primary transition-colors" href="#">Áo Sơ Mi</a>
<span>/</span>
<span className="text-text-primary font-headline-sm">{product.name}</span>
<span className="ml-auto text-label-caps font-label-caps bg-surface-canvas text-text-secondary px-2.5 py-1 rounded-full uppercase tracking-wider">SKU: {currentSku}</span>
</div>
</div>
{/*  Main Product Display Area  */}
<section className="w-full py-space-xl px-margin-mobile lg:px-margin-desktop">
<div className="max-w-max-width-content mx-auto">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-start">
{/*  Left: Gallery Showcase (7 Cols)  */}
<div className="lg:col-span-7 flex flex-col gap-space-md">
  <ProductGallery images={galleryImages} badges={[]} />
</div>
{/*  Right: Purchasing Decisions & Specifications (5 Cols)  */}
<div className="lg:col-span-5 flex flex-col gap-space-lg bg-surface-pure rounded-2xl p-space-lg lg:p-space-xl shadow-md">
{/*  Heading & Ratings Block  */}
<div className="space-y-space-xs">
<div className="flex items-center gap-2 flex-wrap">
<span className="inline-flex items-center gap-1 bg-surface-container-high text-accent-bronze px-2.5 py-0.5 rounded-full text-label-caps font-label-caps uppercase tracking-wider">
<span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                Chính Phẩm Loại 1
              </span>
<span className="text-body-sm font-body-sm text-text-muted">•</span>
<span className="text-body-sm font-body-sm text-status-success flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                Còn hàng sẵn
              </span>
</div>
<h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight leading-snug">
              {product?.name || 'Sản phẩm'}
            </h1>
<div className="flex items-center gap-3 pt-1 text-body-sm font-body-sm">
<span className="text-text-muted">Đã bán 860 sản phẩm</span>
</div>
</div>
{/*  Price Display  */}
<div className="p-space-md rounded-xl bg-surface-canvas flex items-baseline justify-between">
<div className="flex items-baseline gap-3">
<span className="font-price-lg text-price-lg text-accent-terracotta tracking-tight">{(currentPrice || 0).toLocaleString("vi-VN")} ₫</span>

</div>

</div>
{/*  Color Swatches Selection  */}
<ColorSelector 
  colors={colors} 
  selectedColor={selectedColor} 
  onColorSelect={setSelectedColor} 
/>
{/*  Size Selection  */}
<SizeSelector 
  sizes={sizes} 
  selectedSize={selectedSize} 
  onSizeSelect={setSelectedSize} 
/>

{/*  Action Buttons  */}
<div className="space-y-space-xs pt-space-xs">
<a href={CONTACT_LINKS.zalo} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 px-6 rounded-lg bg-surface-pure border-2 border-[#0068FF] text-[#0068FF] hover:bg-[#0068FF] hover:text-white font-bold text-body-md tracking-wider uppercase transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group" >
<ZaloIcon size={20} color="currentColor" className="transition-colors" />
<span>Liên hệ Zalo</span>
</a>
<a href={CONTACT_LINKS.phone} className="w-full py-3.5 px-6 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-body-md tracking-wider uppercase transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2" >
<Phone size={18} className="fill-current text-white" />
<span>Liên hệ số điện thoại</span>
</a>
</div>
{/*  Value Guarantees  */}
<div className="pt-space-sm space-y-2 text-body-sm font-body-sm text-text-secondary">
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-[18px] text-accent-bronze">local_shipping</span>
<span>Thiết kế tinh tế • Ưu tiên sự thoải mái</span>
</div>
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-[18px] text-accent-bronze">content_cut</span>
<span>Chất liệu được chọn lọc • Mềm mại và dễ chịu</span>
</div>
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-[18px] text-accent-bronze">verified_user</span>
<span>Chỉn chu từng chi tiết • Hướng đến trải nghiệm thoải mái</span>
</div>
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-[18px] text-accent-bronze">photo_camera</span>
<span>Hình ảnh sản phẩm rõ nét • Trực quan từng chi tiết</span>
</div>
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-[18px] text-accent-bronze">published_with_changes</span>
<span>Kiểu dáng dễ mặc • Phù hợp nhiều khoảnh khắc</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  Detailed Specs & Information  */}
<section className="w-full py-space-xl px-margin-mobile lg:px-margin-desktop bg-surface-alabaster">
  <div className="max-w-max-width-content mx-auto">
    <div className="bg-surface-pure rounded-2xl p-space-lg lg:p-space-2xl shadow-sm space-y-12">
      
      {/* Description Section */}
      <div className="space-y-4">
        <h3 className="font-headline-md text-headline-md text-text-primary border-b border-border-subtle pb-2">
          Mô tả sản phẩm
        </h3>
        <div className="max-w-max-width-editorial">
          <div className="text-body-lg font-body-lg text-text-secondary leading-relaxed whitespace-pre-line">
            {product.description || 'Chưa có mô tả cho sản phẩm này.'}
          </div>
        </div>
      </div>

      {/* Specs Section */}
      <div className="space-y-4">
        <h3 className="font-headline-md text-headline-md text-text-primary border-b border-border-subtle pb-2">
          Đặc tính & Chi tiết thông số
        </h3>
        <div className="max-w-2xl overflow-hidden rounded-xl bg-surface-canvas">
          <div className="grid grid-cols-3 p-4 bg-surface-container-high/50 text-body-md font-headline-sm text-text-primary">
            <div>Đặc tính</div>
            <div className="col-span-2">Chi tiết thông số</div>
          </div>
          <div className="divide-y divide-transparent">
            {product.categoryName && (
              <div className="grid grid-cols-3 p-4 text-body-md font-body-md bg-surface-pure">
                <div className="text-text-muted">Danh mục</div>
                <div className="col-span-2 text-text-primary font-headline-sm">{product.categoryName}</div>
              </div>
            )}
            {product.gender && (
              <div className="grid grid-cols-3 p-4 text-body-md font-body-md bg-surface-canvas/40">
                <div className="text-text-muted">Giới tính</div>
                <div className="col-span-2 text-text-primary">
                  {product.gender === 'male' ? 'Nam' : product.gender === 'female' ? 'Nữ' : 'Unisex'}
                </div>
              </div>
            )}
            {product.status && (
              <div className="grid grid-cols-3 p-4 text-body-md font-body-md bg-surface-pure">
                <div className="text-text-muted">Tình trạng</div>
                <div className="col-span-2 text-text-primary">{product.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}</div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  </div>
{/*  Tab 3: Size Chart  */}
<div className="tab-pane hidden pt-space-md space-y-space-md" id="tab-size">
<p className="text-body-md font-body-md text-text-secondary">
            Số đo thực tế của sản phẩm (sai số cho phép ±1cm). Nếu số đo của bạn nằm giữa 2 size, nên chọn tăng 1 size để có dáng áo rủ bay phóng khoáng nhất.
          </p>
<div className="overflow-x-auto rounded-xl shadow-sm">
<table className="w-full text-left bg-surface-canvas text-body-md font-body-md">
<thead className="bg-primary text-on-primary font-headline-sm uppercase text-body-sm">
<tr>
<th className="p-3.5">Size áo</th>
<th className="p-3.5">Vòng ngực (cm)</th>
<th className="p-3.5">Dài áo trước/sau (cm)</th>
<th className="p-3.5">Rộng vai (cm)</th>
<th className="p-3.5">Dài tay (cm)</th>
<th className="p-3.5">Cân nặng gợi ý (kg)</th>
</tr>
</thead>
<tbody className="divide-y divide-transparent bg-surface-pure text-text-primary">
<tr className="hover:bg-surface-container-high/40 transition-colors">
<td className="p-3.5 font-headline-sm">S</td>
<td className="p-3.5">92 - 96</td>
<td className="p-3.5">65 / 69</td>
<td className="p-3.5">38</td>
<td className="p-3.5">56</td>
<td className="p-3.5 text-accent-terracotta font-headline-sm">42 - 47 kg</td>
</tr>
<tr className="bg-surface-canvas/30 hover:bg-surface-container-high/40 transition-colors">
<td className="p-3.5 font-headline-sm">M (Khuyên dùng)</td>
<td className="p-3.5">96 - 100</td>
<td className="p-3.5">67 / 71</td>
<td className="p-3.5">39.5</td>
<td className="p-3.5">57.5</td>
<td className="p-3.5 text-accent-terracotta font-headline-sm">48 - 54 kg</td>
</tr>
<tr className="hover:bg-surface-container-high/40 transition-colors">
<td className="p-3.5 font-headline-sm">L</td>
<td className="p-3.5">100 - 104</td>
<td className="p-3.5">69 / 73</td>
<td className="p-3.5">41</td>
<td className="p-3.5">59</td>
<td className="p-3.5 text-accent-terracotta font-headline-sm">55 - 60 kg</td>
</tr>
<tr className="bg-surface-canvas/30 hover:bg-surface-container-high/40 transition-colors">
<td className="p-3.5 font-headline-sm">XL</td>
<td className="p-3.5">104 - 108</td>
<td className="p-3.5">71 / 75</td>
<td className="p-3.5">42.5</td>
<td className="p-3.5">60</td>
<td className="p-3.5 text-accent-terracotta font-headline-sm">61 - 66 kg</td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Tab 4: Care Guide  */}
<div className="tab-pane hidden pt-space-md" id="tab-care">
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<div className="p-space-md rounded-xl bg-surface-canvas space-y-2">
<div className="flex items-center gap-2 font-headline-sm text-text-primary">
<span className="material-symbols-outlined text-accent-terracotta">dry_cleaning</span>
<span>Phương pháp giặt</span>
</div>
<p className="text-body-md font-body-md text-text-secondary leading-relaxed">
                Nên giặt tay với nước lạnh hoặc dùng chế độ giặt lụa nhẹ (Silk Wash) với túi giặt chuyên dụng. Dùng sữa tắm hoặc dầu gội dịu nhẹ, không dùng bột giặt chứa chất tẩy Clo mạnh.
              </p>
</div>
<div className="p-space-md rounded-xl bg-surface-canvas space-y-2">
<div className="flex items-center gap-2 font-headline-sm text-text-primary">
<span className="material-symbols-outlined text-accent-terracotta">iron</span>
<span>Cách ủi và sấy</span>
</div>
<p className="text-body-md font-body-md text-text-secondary leading-relaxed">
                Ủi khi vải còn ẩm nhẹ ở chế độ nhiệt thấp nhất (Low/Silk) hoặc dùng bàn ủi hơi nước đứng. Phơi trong bóng râm thoáng mát, tránh ánh nắng gắt trực tiếp làm xơ giòn sợi tơ lụa.
              </p>
</div>
</div>
</div>
</section>
{/* Related Products: "Phối đồ hoàn hảo / Có Thể Bạn Sẽ Thích" */}
<section className="w-full py-space-3xl px-margin-mobile lg:px-margin-desktop bg-surface-alabaster">
  <div className="max-w-max-width-content mx-auto space-y-space-xl">
    <div>
      <span className="text-label-caps font-label-caps uppercase text-accent-terracotta tracking-wider">Phối đồ hoàn hảo</span>
      <h2 className="font-headline-lg text-headline-lg text-text-primary mt-1 uppercase">CÓ THỂ BẠN SẼ THÍCH</h2>
    </div>

    <div className="relative group/carousel">
      {/* Navigation Buttons: Reused from BestSellers & NewArrivals */}
      <button 
        type="button"
        onClick={prevRelated} 
        disabled={!canGoPrev}
        aria-label="Sản phẩm trước"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 p-3 bg-surface-pure rounded-full shadow-lg border border-border-subtle transition-all disabled:hidden hover:bg-surface-canvas text-text-primary ${canGoPrev ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0'}`}
      >
        <span className="material-symbols-outlined text-2xl">chevron_left</span>
      </button>
      <button 
        type="button"
        onClick={nextRelated} 
        disabled={!canGoNext}
        aria-label="Sản phẩm tiếp theo"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 p-3 bg-surface-pure rounded-full shadow-lg border border-border-subtle transition-all disabled:hidden hover:bg-surface-canvas text-text-primary ${canGoNext ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0'}`}
      >
        <span className="material-symbols-outlined text-2xl">chevron_right</span>
      </button>

      {relatedLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-canvas w-full aspect-[3/4] rounded-xl"></div>
          ))}
        </div>
      ) : relatedError ? (
        <div className="py-10 text-center text-text-secondary">
          <p>{relatedError}</p>
        </div>
      ) : relatedProducts.length === 0 ? (
        <div className="py-10 text-center text-text-secondary">Chưa có sản phẩm nào phù hợp.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {visibleRelatedProducts.map((rp, index) => (
            <FadeIn key={rp.id} delay={index * 50}>
              <ProductCard product={rp} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  </div>
</section>
{/*  Interactive Modal: Size Guide Dialog  */}
<div className="fixed inset-0 z-50 bg-text-primary/60 backdrop-blur-sm hidden items-center justify-center p-4" id="size-modal">
<div className="bg-surface-pure rounded-2xl max-w-lg w-full p-space-lg shadow-xl space-y-space-md max-h-[921px] overflow-y-auto">
<div className="flex items-center justify-between pb-space-xs border-b border-border-subtle">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-accent-terracotta">straighten</span>
<h3 className="font-headline-sm text-headline-sm text-text-primary">Hướng dẫn chọn kích cỡ</h3>
</div>
<button className="w-8 h-8 rounded-full hover:bg-surface-canvas flex items-center justify-center text-text-muted hover:text-text-primary" >
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div className="space-y-3 text-body-md font-body-md text-text-secondary leading-relaxed">
<p>Để tìm kích thước áo vừa vặn nhất, hãy đo quanh phần lớn nhất của vòng 1 và đối chiếu:</p>
<ul className="list-disc list-inside space-y-1 text-text-primary">
<li><strong>Size S:</strong> Dưới 48kg | Chiều cao 1m50 - 1m58</li>
<li><strong>Size M:</strong> 48kg - 54kg | Chiều cao 1m55 - 1m64</li>
<li><strong>Size L:</strong> 55kg - 60kg | Chiều cao 1m60 - 1m68</li>
<li><strong>Size XL:</strong> 61kg - 66kg | Chiều cao 1m62 - 1m72</li>
</ul>
<div className="p-3 bg-surface-canvas rounded-lg text-body-sm font-body-sm text-text-secondary">
          💡 Bạn vẫn đang phân vân? Gọi ngay <a href={CONTACT_LINKS.phone} className="font-semibold text-text-primary hover:underline">{CONTACT_PHONE_DISPLAY}</a> hoặc <a href={CONTACT_LINKS.zalo} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0068FF] hover:underline">nhắn Zalo</a> để đội ngũ thợ may Lumen tư vấn chính xác theo dáng người riêng của bạn.
        </div>
</div>
<button className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-headline-sm text-body-md uppercase tracking-wider" >
        Đã hiểu & Quay lại sản phẩm
      </button>
</div>
</div>
{/*  Micro-Interactions Script  */}

</div></main>
    </>
  );
}