import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  Filter,
  X,
} from "lucide-react";

import LoadingSpinner from "../../components/ui/LoadingSpinner";

import Badge from "../../components/ui/Badge";

import Button from "../../components/ui/Button";

import Modal from "../../components/ui/Modal";

import Pagination from "../../components/ui/Pagination";

import AdminProductFilter from "../../components/admin/product/AdminProductFilter";

import {
  productService,
  colorService,
  sizeService,
} from "../../services/productService";

import { categoryService } from "../../services/categoryService";

import { useProductStore } from "../../stores/productStore";

const PRICE_RANGES = [
  { id: "under_300", label: "Dưới 300.000₫", min: null, max: 300000 },
  { id: "300_500", label: "300.000₫ - 500.000₫", min: 300000, max: 500000 },
  { id: "500_1000", label: "500.000₫ - 1.000.000₫", min: 500000, max: 1000000 },
  { id: "over_1000", label: "Trên 1.000.000₫", min: 1000000, max: null },
];

export default function AdminProducts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    products,
    totalElements,
    totalPages,
    isLoading,
    error,
    fetchProducts,
  } = useProductStore();

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("name") || "",
  );

  // Extract from URL
  const searchName = searchParams.get("name");
  const categoryId = searchParams.get("categoryId");
  const gender = searchParams.get("gender");
  const bestSeller = searchParams.get("bestSeller");
  const colorId = searchParams.get("colorId");
  const sizeId = searchParams.get("sizeId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");

  // UI Pagination (1-indexed), API uses 0-indexed
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("size") || "12", 10);

  useEffect(() => {
    categoryService
      .getAll({ size: 100 })
      .then((res) => {
        let data = res;
        if (res && res.data) data = res.data;
        if (res && res.content) data = res.content;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(console.error);

    colorService
      .getAll()
      .then((res) => {
        let data = res;
        if (res && res.data) data = res.data;
        if (res && res.content) data = res.content;
        setColors(Array.isArray(data) ? data : []);
      })
      .catch(console.error);

    sizeService
      .getAll()
      .then((res) => {
        let data = res;
        if (res && res.data) data = res.data;
        if (res && res.content) data = res.content;
        setSizes(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (searchName) params.name = searchName;
    if (gender) params.gender = gender;
    if (colorId) params.colorId = colorId;
    if (sizeId) params.sizeId = sizeId;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (bestSeller === "1") params.bestSeller = true;
    if (sort && sort !== "newest") params.sort = sort;

    // Convert 1-indexed UI page to 0-indexed API page
    params.page = Math.max(0, page - 1);
    params.size = limit;

    fetchProducts(params);
  }, [
    fetchProducts,
    categoryId,
    searchName,
    gender,
    colorId,
    sizeId,
    minPrice,
    maxPrice,
    bestSeller,
    sort,
    page,
    limit,
  ]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Always reset to page 1 on filter change, unless changing page itself
    if (key !== "page") {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, value) => {
    if (key === "price") {
      const newParams = new URLSearchParams(searchParams);
      if (value.min) newParams.set("minPrice", value.min);
      else newParams.delete("minPrice");
      if (value.max) newParams.set("maxPrice", value.max);
      else newParams.delete("maxPrice");
      newParams.set("page", "1");
      setSearchParams(newParams);
    } else {
      updateParam(key, value);
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("name", searchInput.trim());
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await productService.delete(productToDelete.id);
      setDeleteModalOpen(false);
      // Refetch
      fetchProducts({
        page: Math.max(0, page - 1),
        size: limit,
        name: searchName,
        categoryId,
      });
    } catch (e) {
      console.error(e);
      toast.error('C� l?i x?y ra, vui l�ng th? l?i');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Build active filters
  const getActiveFilters = () => {
    const filters = [];
    if (searchName)
      filters.push({ key: "name", label: `Tìm kiếm: ${searchName}` });
    if (categoryId && categories.length > 0) {
      const cat = categories.find((c) => String(c.id) === categoryId);
      if (cat) filters.push({ key: "categoryId", label: cat.name });
    }
    if (gender) {
      const gLabel =
        gender === "female" ? "Nữ" : gender === "male" ? "Nam" : "Unisex";
      filters.push({ key: "gender", label: `Dành cho: ${gLabel}` });
    }
    if (colorId && colors.length > 0) {
      const c = colors.find((c) => String(c.id) === colorId);
      if (c) filters.push({ key: "colorId", label: `Màu: ${c.name}` });
    }
    if (sizeId && sizes.length > 0) {
      const s = sizes.find((s) => String(s.id) === sizeId);
      if (s) filters.push({ key: "sizeId", label: `Size: ${s.name}` });
    }
    if (minPrice || maxPrice) {
      const r = PRICE_RANGES.find(
        (r) =>
          String(r.min || "") === String(minPrice || "") &&
          String(r.max || "") === String(maxPrice || ""),
      );
      filters.push({
        key: "price",
        label: r ? r.label : `Giá: ${minPrice || 0} - ${maxPrice || "∞"}`,
      });
    }
    if (bestSeller === "1")
      filters.push({ key: "bestSeller", label: "Bán chạy nhất" });
    if (sort) {
      const s = [
        { id: "newest", name: "Mới nhất" },
        { id: "best-selling", name: "Bán chạy nhất" },
        { id: "price-asc", name: "Giá tăng dần" },
        { id: "price-desc", name: "Giá giảm dần" },
      ].find((x) => x.id === sort);
      if (s) filters.push({ key: "sort", label: `Sắp xếp: ${s.name}` });
    }
    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="flex flex-col h-full space-y-3 relative overflow-hidden text-sm font-sans">
      {/* Header & Search */}
      <div className="shrink-0 bg-white rounded-xl shadow-sm p-3 border border-gray-100 flex flex-col gap-3">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full xl:w-1/3">
            <div className="w-8 h-8 bg-blue-50 text-admin-primary-600 rounded-lg flex items-center justify-center shrink-0">
              <Package size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-none mb-1">
                Quản lý Sản phẩm
              </h2>
              <p className="text-xs text-gray-500 font-sans leading-none">
                Quản lý kho hàng và thông tin sản phẩm
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 flex-col md:flex-row gap-3 w-full xl:w-2/3 items-center justify-between"
          >
            <div className="flex justify-center flex-1 w-full">
              <div className="relative w-full max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mã..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 bg-slate-50 rounded-full focus:outline-none focus:ring-2 focus:ring-admin-primary-600/20 focus:border-admin-primary-600 focus:bg-white transition-all text-sm font-medium text-slate-700 h-9"
                />
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-2 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-1.5 px-4 h-9 border border-slate-300 text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-all font-semibold text-xs outline-none shadow-sm"
              >
                <Filter size={14} />
                Tìm kiếm nâng cao
                {activeFilters.length > 0 && (
                  <span className="bg-admin-primary-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>
              <Button
                variant="primary"
                onClick={() => navigate("/admin/products/new")}
                className="!bg-admin-primary-600 hover:!bg-admin-primary-700 h-9 !text-xs !py-0 !px-4 flex items-center gap-1.5"
              >
                <Plus size={14} />
                Thêm sản phẩm
              </Button>
            </div>
          </form>
        </div>

        {/* Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 min-h-[36px]">
          {activeFilters.length > 0 ? (
            <>
              <span className="text-xs font-medium text-gray-500 mr-1">
                Bộ lọc đang áp dụng:
              </span>
              {activeFilters.map((filter) => (
                <span
                  key={filter.key}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-admin-primary-50 text-admin-primary-700 border border-admin-primary-200 rounded-full text-[11px] font-semibold"
                >
                  {filter.label}
                  <button
                    onClick={() =>
                      handleFilterChange(
                        filter.key,
                        filter.key === "price"
                          ? { min: null, max: null }
                          : null,
                      )
                    }
                    className="ml-0.5 hover:text-red-500 focus:outline-none flex items-center"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 ml-2 underline"
              >
                Xóa tất cả
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">
              Chưa có bộ lọc nào được áp dụng
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex-1 flex justify-center items-center py-20 text-rose-500 flex-col gap-2">
            <AlertCircle size={32} />
            <p>Lỗi tải dữ liệu sản phẩm</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr className="bg-slate-50 text-sm text-gray-600 font-sans border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold">Tên sản phẩm</th>
                  <th className="py-3 px-4 font-semibold">Mã SP</th>
                  <th className="py-3 px-4 font-semibold">Danh mục</th>
                  <th className="py-3 px-4 font-semibold">Giới tính</th>
                  <th className="py-3 px-4 font-semibold">Giá</th>
                  <th className="py-3 px-4 font-semibold">Trạng thái</th>
                  <th className="py-3 px-4 font-semibold text-center w-36">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-sans divide-y divide-gray-100">
                {console.log("Products:", products)}
                {products && products.length > 0 ? (
                  products.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-slate-100 flex-shrink-0 border border-gray-200 overflow-hidden">
                            {item.imageDetails &&
                            item.imageDetails.length > 0 ? (
                              <img
                                src={
                                  (
                                    item.imageDetails.find(
                                      (img) => img.isPrimary,
                                    ) || item.imageDetails[0]
                                  ).imageUrl
                                }
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 line-clamp-1">
                              {item.name}
                            </span>
                            {item.bestSeller && (
                              <span className="text-xs text-amber-600 font-medium mt-0.5">
                                Bán chạy
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs font-semibold text-gray-700">
                        {item.productCode || "--"}
                      </td>
                      <td className="py-2.5 px-4 text-gray-600">
                        {item.category
                          ? item.category.name
                          : item.categoryName || "--"}
                      </td>
                      <td className="py-2.5 px-4 text-gray-600 capitalize">
                        {item.gender || "Unisex"}
                      </td>
                      <td className="py-2.5 px-4 text-gray-800 font-medium">
                        {item.price
                          ? formatPrice(item.price)
                          : item.variants && item.variants.length > 0
                            ? formatPrice(item.variants[0].price)
                            : "--"}
                      </td>
                      <td className="py-2.5 px-4">
                        <Badge
                          variant={
                            item.status === "active" ? "success" : "default"
                          }
                        >
                          {item.status === "active" ? "Hoạt động" : "Bản nháp"}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/${item.id}/edit`)
                            }
                            className="p-1.5 text-amber-500 hover:text-amber-600 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="opacity-20" />
                        <p>Không tìm thấy sản phẩm nào phù hợp</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="shrink-0 p-4 border-t border-slate-200 bg-white">
          <Pagination
            currentPage={page}
            totalPages={totalPages || 1}
            totalElements={totalElements || 0}
            limit={limit}
            onChangePage={(p) => updateParam("page", String(p))}
            onChangeLimit={(l) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set("size", String(l));
              newParams.set("page", "1");
              setSearchParams(newParams);
            }}
          />
        </div>
      </div>

      <AdminProductFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={{
          categoryId,
          gender,
          colorId,
          sizeId,
          minPrice,
          maxPrice,
          bestSeller,
          sort,
        }}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
        categories={categories}
        colors={colors}
        sizes={sizes}
        PRICE_RANGES={PRICE_RANGES}
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Xóa sản phẩm"
      >
        <div className="text-gray-600">
          <p>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>{productToDelete?.name}</strong> không?
          </p>
          <p className="mt-2 text-sm text-rose-500">
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa sản phẩm
          </Button>
        </div>
      </Modal>
    </div>
  );
}



