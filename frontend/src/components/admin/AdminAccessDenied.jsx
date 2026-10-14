import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function AdminAccessDenied({ user }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const username = user?.username || 'Người dùng';
  const role = user?.role || 'CUSTOMER';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 mb-6 ring-8 ring-red-50/50">
          <ShieldAlert size={36} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          403 - Quyền truy cập bị từ chối
        </h1>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Tài khoản <strong className="text-slate-800 font-semibold">{username}</strong> (Vai trò: <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-700">{role}</span>) không có quyền Quản trị viên (ADMIN) để truy cập hệ thống quản trị này.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Về trang chủ
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
          >
            <LogOut size={16} />
            Đăng nhập lại
          </button>
        </div>
      </div>
    </div>
  );
}
