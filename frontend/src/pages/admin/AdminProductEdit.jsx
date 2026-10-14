import { useEffect } from 'react';
import AdminProductForm from '../../components/admin/product/AdminProductForm';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../../stores/productStore';

export default function AdminProductEdit() {
  const { id } = useParams();
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  const product = products.find(p => p.id === parseInt(id) || p.id === id);

  if (isLoading || (products.length > 0 && !product)) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return <AdminProductForm isEdit={true} initialData={product} />;
}
