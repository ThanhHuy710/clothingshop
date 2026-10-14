import { useState, useRef, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <AdminSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header for toggle */}
        <div className="flex items-center p-3 bg-white border-b border-slate-200 xl:hidden">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <span className="ml-2 font-bold text-slate-800">Admin Portal</span>
        </div>

        {/* Main Content (Scrollable) */}
        <main ref={mainContentRef} className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 custom-scrollbar flex flex-col">
          <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
