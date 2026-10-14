import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, List, Palette, Ruler, LogOut, X, Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const isActive = (path) => pathname.startsWith(path);

  const menuItems = [
    { name: 'Sản phẩm', path: '/admin/products', icon: Package, color: 'text-blue-500' },
    { name: 'Danh mục', path: '/admin/categories', icon: List, color: 'text-purple-500' },
    { name: 'Màu sắc', path: '/admin/colors', icon: Palette, color: 'text-pink-500' },
    { name: 'Kích thước', path: '/admin/sizes', icon: Ruler, color: 'text-emerald-500' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-[9998] xl:hidden"
          onClick={onToggle}
        />
      )}
      
      <aside
        className={`fixed inset-y-0 left-0 z-[9999] flex h-screen flex-col bg-white text-slate-700 border-r border-slate-200 transition-all duration-300 xl:static xl:translate-x-0 ${
          collapsed ? '-translate-x-full xl:w-20 w-64' : 'translate-x-0 w-64'
        }`}
      >
        <div className={`flex items-center h-16 px-4 border-b border-slate-200 shrink-0 ${collapsed ? 'xl:justify-center' : 'justify-between'}`}>
          <Link to="/admin/products" className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'xl:hidden' : ''}`}>
            <div className="w-8 h-8 bg-admin-primary-600 rounded-lg shadow-sm flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg leading-none">A</span>
            </div>
            <span className="text-lg font-semibold text-slate-800 whitespace-nowrap tracking-tight font-bold">Admin</span>
          </Link>
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            {collapsed ? <Menu size={20} className="hidden xl:block" /> : <Menu size={20} className="hidden xl:block" />}
            <X size={20} className="xl:hidden" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto py-4 custom-scrollbar">
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-admin-primary-50 text-admin-primary-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon size={20} className={`shrink-0 ${active ? 'text-admin-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className={`whitespace-nowrap transition-opacity ${collapsed ? 'xl:hidden' : ''}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="px-3 mt-auto pt-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 group transition-all"
              title={collapsed ? "Đăng xuất" : undefined}
            >
              <LogOut size={20} className="shrink-0 text-slate-400 group-hover:text-red-500 transition-colors" />
              <span className={`whitespace-nowrap transition-opacity ${collapsed ? 'xl:hidden' : ''}`}>
                Đăng xuất
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

