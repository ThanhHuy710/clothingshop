import api from './api';

export const productService = {
  getAll: async (params) => {
    // Ensure params is passed to axios

    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  
  uploadImage: async (productId, file, isPrimary, sortOrder) => {
    const formData = new FormData();
    formData.append('file', file);
    if (isPrimary !== undefined) formData.append('isPrimary', isPrimary);
    if (sortOrder !== undefined) formData.append('sortOrder', sortOrder);
    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (productId, imageId) => {
    const response = await api.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  },

  setPrimaryImage: async (productId, imageId) => {
    const response = await api.put(`/products/${productId}/images/${imageId}/primary`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export const colorService = {
  getAll: async (params) => {
    const response = await api.get('/colors' + (!params ? '?size=100' : ''), { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/colors', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/colors/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/colors/${id}`);
    return response.data;
  }
};

export const sizeService = {
  getAll: async (params) => {
    const response = await api.get('/sizes' + (!params ? '?size=100' : ''), { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/sizes', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/sizes/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/sizes/${id}`);
    return response.data;
  }
};

export const variantService = {
  create: async (data) => {
    const response = await api.post('/variants', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/variants');
    return response.data;
  },
  
  getByProductId: async () => {
    const response = await api.get(`/variants`);
    const allVariants = response.data;
    return allVariants;
  }
};
