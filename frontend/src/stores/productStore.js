import { create } from 'zustand';
import { productService } from '../services/productService';

export const useProductStore = create((set, get) => ({
  products: [],
  totalElements: 0,
  totalPages: 1,
  currentPage: 0,
  isLoading: false,
  error: null,
  
  fetchProducts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await productService.getAll(params);
      
      let items = [];
      let totalPages = 1;
      let totalElements = 0;
      let currentPage = 0;

      if (data && data.content) {
         items = data.content;
         totalPages = data.totalPages;
         totalElements = data.totalElements;
         currentPage = data.page;
      } else if (Array.isArray(data)) {
         items = data;
      }
      
      set({ 
        products: items, 
        totalPages,
        totalElements,
        currentPage,
        isLoading: false 
      });
      
    } catch (error) {
      console.warn("API fetch failed.", error.message);
      set({ products: [], isLoading: false, error: error.message });
    }
  },

  getProductById: (id) => {
    const { products } = get();
    return products.find(p => p.id === parseInt(id) || p.id === id) || null;
  }
}));
