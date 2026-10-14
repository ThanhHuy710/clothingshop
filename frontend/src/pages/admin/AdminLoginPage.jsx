import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

const AdminLoginPage = () => {
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('admin_remember_me') === 'true';
  });
  const [formData, setFormData] = useState(() => ({
    username: localStorage.getItem('admin_remembered_username') || '',
    password: '',
  }));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.exp && decoded.exp * 1000 > Date.now()) {
          const role = decoded?.role || user?.role;
          if (role === 'ADMIN') {
            navigate('/admin', { replace: true });
          }
        } else {
          logout();
        }
      } catch (e) {
        console.warn('Invalid token in store:', e);
        logout();
      }
    }
  }, [isAuthenticated, token, user, navigate, logout]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrors({
        username: !formData.username ? 'Vui lòng nhập tài khoản' : '',
        password: !formData.password ? 'Vui lòng nhập mật khẩu' : ''
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login({
        username: formData.username.trim(),
        password: formData.password,
        rememberMe: Boolean(rememberMe),
      });

      const token = res?.token || res?.accessToken;
      if (token) {
        let userRole = res?.role;
        let username = formData.username.trim() || res?.username || '';

        try {
          const decoded = jwtDecode(token);
          if (decoded?.role) userRole = decoded.role;
        } catch (e) {
          console.warn('Could not decode token claims:', e);
        }

        if (rememberMe) {
          localStorage.setItem('admin_remembered_username', username);
        } else {
          localStorage.removeItem('admin_remembered_username');
        }

        login({ username, role: userRole }, token, rememberMe);

        if (userRole === 'ADMIN') {
          toast.success("Đăng nhập thành công!");
          const fromLocation = location.state?.from;
          const redirectUrl = fromLocation
            ? (fromLocation.pathname + (fromLocation.search || ''))
            : '/admin';
          navigate(redirectUrl, { replace: true });
        } else {
          toast.error("Tài khoản của bạn không có quyền Quản trị viên (ADMIN)!");
          navigate('/admin', { replace: true });
        }
      } else {
        toast.error("Đăng nhập thất bại: Không nhận được token");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex justify-center mb-6 drop-shadow-md">
              <img className="w-32 h-auto object-contain" src="/images/logo.png" alt="HaiPhongShop Logo" />
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Đăng nhập hệ thống
                  </h1>
                  <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                      <div>
                          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Tài khoản
                          </label>
                          <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            className={`bg-gray-50 border ${errors.username ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-admin-primary-600 focus:border-admin-primary-600'} text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} 
                            placeholder="Nhập username" 
                            value={formData.username}
                            onChange={handleChange}
                          />
                          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                      </div>
                      <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Mật khẩu
                          </label>
                          <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="••••••••" 
                            className={`bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-admin-primary-600 focus:border-admin-primary-600'} text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} 
                            value={formData.password}
                            onChange={handleChange}
                          />
                          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                      </div>
                      <div className="flex items-center justify-between">
                          <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input 
                                  id="remember" 
                                  name="remember"
                                  aria-describedby="remember" 
                                  type="checkbox" 
                                  checked={rememberMe}
                                  onChange={(e) => setRememberMe(e.target.checked)}
                                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-admin-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-admin-primary-600 dark:ring-offset-gray-800 cursor-pointer" 
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="remember" className="text-gray-500 dark:text-gray-300 cursor-pointer select-none">Ghi nhớ đăng nhập</label>
                              </div>
                          </div>
                          <a href="#" className="text-sm font-medium text-admin-primary-600 hover:underline dark:text-admin-primary-500">Quên mật khẩu?</a>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full text-white bg-admin-primary-600 hover:bg-admin-primary-700 focus:ring-4 focus:outline-none focus:ring-admin-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-admin-primary-600 dark:hover:bg-admin-primary-700 dark:focus:ring-admin-primary-800 disabled:opacity-50 transition-colors"
                      >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                      </button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                          Chưa có tài khoản? <a href="#" className="font-medium text-admin-primary-600 hover:underline dark:text-admin-primary-500">Đăng ký ngay</a>
                      </p>
                  </form>
              </div>
          </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
