import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";

import { useSearchParams } from "react-router-dom";

import { Search, Plus, Edit, Trash2, Palette } from 'lucide-react';

import LoadingSpinner from '../../components/ui/LoadingSpinner';

import Button from '../../components/ui/Button';

import Pagination from '../../components/ui/Pagination';

import { colorService } from '../../services/productService';

export default function AdminColors() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // UI Pagination (1-indexed), API uses 0-indexed
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('size') || '10', 10);
  const searchName = searchParams.get('name') || '';

  const [searchInput, setSearchInput] = useState(searchName);
  
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [saving, setSaving] = useState(false);

  
  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {
        page: Math.max(0, page - 1),
        size: limit
      };
      if (searchName) {
        params.name = searchName;
      }
      
      const data = await colorService.getAll(params);
      setItems(data.content || data || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchName]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };


  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, code: item.code || '' });
    } else {
      setEditingItem(null);
      setFormData({ name: '', code: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        await colorService.update(editingItem.id, formData);
      } else {
        await colorService.create(formData);
      }
      handleCloseModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('C� l?i x?y ra, vui l�ng th? l?i');
    } finally {
      setSaving(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await colorService.delete(id);
        
        // If it's the last item on the current page, and not the first page, go back one page
        if (items.length === 1 && page > 1) {
          updateParam('page', String(page - 1));
        } else {
          fetchItems();
        }
      } catch (err) {
        console.error(err);
        toast.error('C� l?i x?y ra, vui l�ng th? l?i');
      }
    }
  };


  
  return (
    <div className="flex flex-col h-full space-y-4 relative overflow-hidden text-sm font-sans">
      {/* Header & Search */}
        <div className="shrink-0 bg-white rounded-xl shadow-sm p-3 border border-gray-100 flex flex-col gap-3">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full xl:w-1/3">
              <div className="w-8 h-8 bg-blue-50 text-admin-primary-600 rounded-lg flex items-center justify-center shrink-0">
                <Palette size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-none mb-1">Quản lý Màu sắc</h2>
                <p className="text-xs text-gray-500 font-sans leading-none">Quản lý màu sắc trong hệ thống</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col md:flex-row gap-3 w-full xl:w-2/3 items-center justify-between">
              <div className="flex justify-center flex-1 w-full">
                <div className="relative w-full max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc mã..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateParam('name', searchInput);
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 bg-slate-50 rounded-full focus:outline-none focus:ring-2 focus:ring-admin-primary-600/20 focus:border-admin-primary-600 focus:bg-white transition-all text-sm font-medium text-slate-700 h-9"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap gap-2 shrink-0 w-full md:w-auto justify-end">
                <Button variant="primary" className="!bg-admin-primary-600 hover:!bg-admin-primary-700 h-9 flex items-center gap-1.5 px-4 font-semibold text-xs rounded-lg" onClick={() => handleOpenModal()}>
                  <Plus size={16} />
                  Thêm Màu sắc
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr className="bg-slate-50 text-sm text-gray-600 font-sans border-b border-gray-200">
                  <th className="py-3 px-5 font-semibold">Mã Màu</th>
                  <th className="py-3 px-5 font-semibold">Tên màu sắc</th>
                  <th className="py-3 px-5 font-semibold">Mã Hex</th>
                  <th className="py-3 px-5 font-semibold text-center w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm font-sans divide-y divide-gray-100">
                {items.length > 0 ? items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-5 font-mono text-xs font-semibold text-gray-700">{item.colorCode || '--'}</td>
                    <td className="py-3 px-5 font-medium text-gray-800">{item.name}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md border border-gray-200" style={{ backgroundColor: item.code }}></div>
                        <span className="text-gray-600 font-mono text-xs">{item.code || '--'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-1.5 text-amber-500 hover:text-amber-600 transition-colors" title="Chỉnh sửa">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:text-red-600 transition-colors" title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="opacity-20" />
                        <p>Không tìm thấy dữ liệu</p>
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
            onChangePage={(p) => updateParam('page', String(p))}
            onChangeLimit={(l) => updateParam('size', String(l))}
          />
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? 'Sửa màu sắc' : 'Thêm màu sắc mới'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 flex-1 overflow-y-auto">
              {editingItem && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã Màu (Semantic)</label>
                <input type="text" value={editingItem.colorCode || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 font-mono text-sm" />
              </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên màu <span className="text-rose-500">*</span></label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary-500" placeholder="VD: Đen, Trắng..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã màu (Hex hoặc Code)</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.code && formData.code.startsWith('#') ? formData.code : '#000000'} onChange={(e) => setFormData({...formData, code: e.target.value})} className="h-10 w-10 p-1 rounded border border-gray-300 cursor-pointer" />
                  <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary-500 font-mono text-sm uppercase" placeholder="#000000 hoặc BLK" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-admin-primary-600 rounded-lg hover:bg-admin-primary-700 disabled:opacity-70">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


