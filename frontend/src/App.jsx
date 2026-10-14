import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/public/HomePage';
import CategoryListPage from "./pages/public/CategoryListPage";
import ProductListPage from './pages/public/ProductListPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import NotFoundPage from './pages/public/NotFoundPage';
import AdminLayout from './layouts/AdminLayout';
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSizes from "./pages/admin/AdminSizes";
import AdminColors from "./pages/admin/AdminColors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductCreate from "./pages/admin/AdminProductCreate";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminProductDetail from "./pages/admin/AdminProductDetail";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from './components/layout/ScrollToTop';


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

                {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminProducts />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="sizes" element={<AdminSizes />} />
            <Route path="colors" element={<AdminColors />} />

            <Route path="products/new" element={<AdminProductCreate />} />
            <Route path="products/:id" element={<AdminProductDetail />} />
            <Route path="products/:id/edit" element={<AdminProductEdit />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

