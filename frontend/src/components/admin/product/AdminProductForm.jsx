import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { categoryService } from '../../../services/categoryService';

import { colorService, sizeService, productService, variantService } from '../../../services/productService';

export default function AdminProductForm({ initialData, isEdit }) {
  const navigate = useNavigate();
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    categoryId: '',
    gender: 'unisex',
    status: 'active',
    bestSeller: false,
    images: [],
    variants: []
  });

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [variantForm, setVariantForm] = useState({
    colorId: '',
    sizeId: '',
    sku: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    // If we have initialData, make sure we use categoryId correctly (some APIs might return 'category' object instead)
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...initialData,
        categoryId: initialData.categoryId || (initialData.category ? initialData.category.id : ''),
        variants: initialData.variants || [],
        images: initialData.imageDetails || []
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [cats, cols, sizs] = await Promise.all([
          categoryService.getAll(),
          colorService.getAll(),
          sizeService.getAll()
        ]);
        setCategories(cats.content || cats || []);
        setColors(cols.content || cols || []);
        setSizes(sizs.content || sizs || []);
      } catch (err) {
        console.error('Failed to load configs', err);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  const generateSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, slug: formData.slug || generateSlug(formData.name) };
      let savedProduct;
      if (isEdit) {
        savedProduct = await productService.update(initialData.id, payload);
      } else {
        savedProduct = await productService.create(payload);
      }
      
      const productId = savedProduct?.id || initialData?.id;
      
      if (productId) {
        // Handle Variants
        if (formData.variants && formData.variants.length > 0) {
          for (const variant of formData.variants) {
            if (!variant.id) {
              await variantService.create({
                productId: Number(productId),
                colorId: Number(variant.colorId),
                sizeId: Number(variant.sizeId),
                price: Number(variant.price),
                quantity: Number(variant.quantity)
              });
            }
          }
        }
        
        // Handle Images
        if (formData.images && formData.images.length > 0) {
          for (let i = 0; i < formData.images.length; i++) {
            const img = formData.images[i];
            if (img.file) {
              await productService.uploadImage(productId, img.file, img.isPrimary, i);
            }
          }
        }
      }

      toast.success(isEdit ? 'C?p nh?t s?n ph?m th�nh c�ng!' : 'Th�m s?n ph?m th�nh c�ng!');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data;
      let errMsg = 'Lỗi khi lưu sản phẩm';
      if (backendError) {
        if (typeof backendError === 'string') errMsg = backendError;
        else if (backendError.message) errMsg = backendError.message;
        else if (backendError.details) errMsg = backendError.details;
        else if (backendError.errors) errMsg = JSON.stringify(backendError.errors);
      }
      toast.error('L?i: ' + errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenVariantModal = (index = null) => {
    if (index !== null) {
      setEditingVariantIndex(index);
      setVariantForm(formData.variants[index]);
    } else {
      setEditingVariantIndex(null);
      setVariantForm({ colorId: '', sizeId: '', sku: '', price: '', quantity: '' });
    }
    setShowVariantModal(true);
  };

  const handleSaveVariant = () => {
    if (!variantForm.colorId || !variantForm.sizeId || variantForm.price === '' || variantForm.quantity === '') {
      toast.error('Vui l�ng nh?p d?y d? th�ng tin bi?n th?');
      return;
    }
    const updatedVariants = [...formData.variants];
    const newVariant = { ...variantForm };
    
    // Add names for display purposes in the table
    const selectedColor = colors.find(c => String(c.id) === String(newVariant.colorId));
    const selectedSize = sizes.find(s => String(s.id) === String(newVariant.sizeId));
    newVariant.colorName = selectedColor ? selectedColor.name : 'N/A';
    newVariant.sizeName = selectedSize ? selectedSize.name : 'N/A';

    if (editingVariantIndex !== null) {
      updatedVariants[editingVariantIndex] = newVariant;
    } else {
      updatedVariants.push(newVariant);
    }
    setFormData({ ...formData, variants: updatedVariants });
    setShowVariantModal(false);
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = [...formData.variants];
    updatedVariants.splice(index, 1);
    setFormData({ ...formData, variants: updatedVariants });
  };

  
  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map((file, idx) => ({
        url: URL.createObjectURL(file),
        file,
        isPrimary: formData.images.length === 0 && idx === 0
      }));
      setFormData({ ...formData, images: [...formData.images, ...newImages] });
    }
  };

  const handleRemoveImage = async (index) => {
    const updatedImages = [...formData.images];
    const removed = updatedImages[index];
    
    if (removed.id) {
      if (!window.confirm('Bạn có chắc muốn xóa ảnh này? Thao tác này sẽ xóa ngay lập tức trên máy chủ.')) return;
      try {
        await productService.deleteImage(initialData.id, removed.id);
      } catch (err) {
        toast.error('C� l?i x?y ra');
        return;
      }
    }

    updatedImages.splice(index, 1);
    if (removed.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSetPrimaryImage = async (index) => {
    const target = formData.images[index];
    
    if (target.id) {
      try {
        await productService.setPrimaryImage(initialData.id, target.id);
      } catch (err) {
        toast.error('C� l?i x?y ra');
        return;
      }
    }

    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setFormData({ ...formData, images: updatedImages });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Thêm biến thể Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-admin-surface p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-admin-text-primary">{editingVariantIndex !== null ? "Sửa biến thể" : "Thêm biến thể"}</h3>
              <button type="button" onClick={() => setShowVariantModal(false)} className="text-admin-text-muted hover:text-admin-text-primary"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                  {loadingConfig ? (
                    <div className="text-sm">Đang tải...</div>
                  ) : (
                    <select required value={variantForm.colorId} onChange={(e) => setVariantForm({...variantForm, colorId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary-600/20 focus:border-admin-primary-600 text-gray-800 text-sm">
                      <option value="">Chọn màu</option>
                      {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kích cỡ</label>
                  {loadingConfig ? (
                    <div className="text-sm">Đang tải...</div>
                  ) : (
                    <select required value={variantForm.sizeId} onChange={(e) => setVariantForm({...variantForm, sizeId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary-600/20 focus:border-admin-primary-600 text-gray-800 text-sm">
                      <option value="">Chọn kích cỡ</option>
                      {sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  )}
                </div>
              </div>
              {editingVariantIndex !== null && variantForm.sku && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" value={variantForm.sku || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm font-mono" />
              </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                  <input required type="number" value={variantForm.price || ''} onChange={(e) => setVariantForm({...variantForm, price: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary-600/20 focus:border-admin-primary-600 text-gray-800 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                  <input required type="number" value={variantForm.quantity || ''} onChange={(e) => setVariantForm({...variantForm, quantity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary-600/20 focus:border-admin-primary-600 text-gray-800 text-sm" placeholder="0" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowVariantModal(false)} className="rounded-lg border border-admin-border px-5 py-2 text-sm font-medium text-admin-text-secondary hover:bg-admin-surface-secondary">Hủy</button>
                <button type="button" onClick={handleSaveVariant} className="rounded-lg bg-admin-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-admin-primary-700">{editingVariantIndex !== null ? "Lưu thay đổi" : "Thêm biến thể"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Form */}
      <div className="shrink-0 bg-white rounded-xl shadow-sm p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
        </div>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <button type="button" onClick={() => navigate('/admin/products')} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Hủy
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-admin-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-admin-primary-700 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center min-w-[120px]">
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px] mr-2">progress_activity</span>
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-4">
        
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="mb-4 text-base font-bold text-slate-800">Thông tin sản phẩm & Phân loại</h3>
            
            <div className="space-y-4">
              {isEdit && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mã sản phẩm</label>
                <input type="text" value={formData.productCode || ''} disabled className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500 bg-slate-50 font-mono outline-none" />
              </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên sản phẩm <span className="text-rose-500">*</span></label>
                <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-admin-primary-600 focus:ring-2 focus:ring-admin-primary-600/20" placeholder="VD: Pijama lụa cao cấp" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả</label>
                <textarea rows="3" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-admin-primary-600 focus:ring-2 focus:ring-admin-primary-600/20" placeholder="Mô tả sản phẩm..."></textarea>
              </div>
              
              {/* Classification Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Danh mục <span className="text-rose-500">*</span></label>
                  {loadingConfig ? (
                    <div className="text-sm text-slate-500">Đang tải...</div>
                  ) : (
                    <select required value={formData.categoryId || ''} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-admin-primary-600 focus:ring-2 focus:ring-admin-primary-600/20">
                      <option value="">Chọn danh mục</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Giới tính</label>
                  <select value={formData.gender || 'unisex'} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-admin-primary-600 focus:ring-2 focus:ring-admin-primary-600/20">
                    <option value="unisex">Unisex</option>
                    <option value="men">Nam</option>
                    <option value="women">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Trạng thái</label>
                  <select value={formData.status || 'active'} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-admin-primary-600 focus:ring-2 focus:ring-admin-primary-600/20">
                    <option value="active">Hoạt động</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center cursor-pointer gap-2">
                    <input type="checkbox" checked={formData.bestSeller || false} onChange={(e) => setFormData({...formData, bestSeller: e.target.checked})} className="h-4 w-4 rounded border-slate-300 text-admin-primary-600 focus:ring-admin-primary-600" />
                    <span className="text-sm font-semibold text-slate-700">Đánh dấu Bán chạy</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Hình ảnh</h3>
            <label className="cursor-pointer text-xs font-semibold text-admin-primary-600 bg-admin-primary-50 px-3 py-1.5 rounded-md hover:bg-admin-primary-100 transition-colors inline-flex items-center gap-1 border border-admin-primary-100">
              <span className="material-symbols-outlined text-[14px]">add_photo_alternate</span>
              Thêm ảnh
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[320px] custom-scrollbar pr-1 bg-slate-50/50 rounded-lg border border-slate-100 p-3">
            {(!formData.images || formData.images.length === 0) ? (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 p-4 bg-white">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">image</span>
                <p className="text-xs text-center leading-relaxed">Chưa có hình ảnh nào.<br/>Nhấn <strong>Thêm ảnh</strong> để tải lên.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className={`relative group aspect-square rounded-md overflow-hidden bg-white shadow-sm ${img.isPrimary ? 'border-2 border-admin-primary-600 ring-2 ring-admin-primary-100' : 'border border-slate-200'}`}>
                    <img src={img.url || img.imageUrl} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {!img.isPrimary && (
                        <button type="button" onClick={() => handleSetPrimaryImage(idx)} className="text-[9px] bg-white text-slate-800 px-2 py-1 rounded-sm font-semibold hover:bg-slate-100 w-full truncate shadow-sm">Đặt chính</button>
                      )}
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="text-[9px] bg-rose-500 text-white px-2 py-1 rounded-sm font-semibold hover:bg-rose-600 w-full truncate shadow-sm">Xóa ảnh</button>
                    </div>
                    {img.isPrimary && (
                      <div className="absolute top-0 left-0 bg-admin-primary-600 text-white text-[9px] px-1.5 py-0.5 rounded-br-md font-bold shadow-sm">Chính</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variant Full Width */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Biến thể sản phẩm</h3>
          <button type="button" onClick={() => handleOpenVariantModal()} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">add</span>
            Thêm biến thể
          </button>
        </div>
        
        <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wider">Màu sắc</th>
                  <th className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wider">Kích cỡ</th>
                  <th className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-right">Giá bán</th>
                  <th className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-right">Tồn kho</th>
                  <th className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-center w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(!formData.variants || formData.variants.length === 0) ? (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400 italic bg-white">Chưa có biến thể nào được thêm.</td></tr>
                ) : (
                  (formData.variants || []).map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors bg-white">
                      <td className="px-4 py-2 font-medium">{v.colorName || colors.find(c => String(c.id) === String(v.colorId))?.name || 'N/A'}</td>
                      <td className="px-4 py-2 font-medium">{v.sizeName || sizes.find(s => String(s.id) === String(v.sizeId))?.name || 'N/A'}</td>
                      <td className="px-4 py-2 text-xs font-mono text-slate-500">{v.sku || '--'}</td>
                      <td className="px-4 py-2 text-right font-semibold text-admin-primary-700">{v.price ? new Intl.NumberFormat('vi-VN').format(v.price) + ' đ' : '--'}</td>
                      <td className="px-4 py-2 text-right font-medium">{v.quantity || 0}</td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button type="button" onClick={() => handleOpenVariantModal(idx)} className="text-amber-500 hover:text-amber-600 transition-colors" title="Sửa"><span className="material-symbols-outlined text-lg">edit</span></button>
                          <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-red-500 hover:text-red-600 transition-colors" title="Xóa"><span className="material-symbols-outlined text-lg">delete</span></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </form>
  );
}




