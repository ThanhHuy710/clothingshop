import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useProductStore } from '../../stores/productStore';

export default function AdminProductDetail() {
  const { id } = useParams();
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  const product = products.find(p => p.id === parseInt(id) || p.id === id);

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-3xl font-semibold text-admin-text-primary">Chi tiết sản phẩm</h2></div>
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="rounded-lg border border-admin-border px-5 py-2.5 text-sm font-medium text-admin-text-secondary hover:bg-admin-surface-secondary">Quay lại</Link>
          <Link to={"/admin/products/" + id + "/edit"} className="rounded-lg bg-admin-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-admin-primary-700">Sửa sản phẩm</Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h3 className="mb-5 text-2xl font-semibold text-admin-text-primary">Tổng quan</h3>
            <div className="flex gap-6">
              <img src={product.images?.[0]?.url || product.images?.[0]} alt={product.name} className="h-32 w-32 rounded-lg object-cover border border-admin-border" />
              <div>
                <h4 className="text-xl font-medium text-admin-text-primary">{product.name}</h4>
                <p className="text-admin-text-secondary mt-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                <p className="text-admin-text-muted mt-3 text-sm">{product.description || 'Không có mô tả.'}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h3 className="mb-5 text-2xl font-semibold text-admin-text-primary">Biến thể</h3>
            <div className="rounded-lg border border-admin-border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-admin-surface-secondary text-admin-text-muted">
                  <tr><th className="px-4 py-2">Màu sắc</th><th className="px-4 py-2">Kích cỡ</th><th className="px-4 py-2">Giá</th></tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  <tr><td colSpan="3" className="px-4 py-3 text-center text-admin-text-secondary">Chưa có biến thể nào.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h3 className="mb-5 text-2xl font-semibold text-admin-text-primary">Thuộc tính</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-admin-text-muted">Danh mục:</span> <span className="text-admin-text-primary">{product.category?.name || 'Chưa phân loại'}</span></li>
              <li className="flex justify-between"><span className="text-admin-text-muted">Giới tính:</span> <span className="text-admin-text-primary capitalize">{product.gender || 'Unisex'}</span></li>
              <li className="flex justify-between"><span className="text-admin-text-muted">Trạng thái:</span> <span className="text-admin-success font-medium">Hoạt động</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
