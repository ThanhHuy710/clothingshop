import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import OrientationGuard from '../guard/OrientationGuard';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <OrientationGuard>
      <div className="admin-theme admin-background flex h-screen overflow-hidden font-sans">
        <AdminSidebar collapsed={collapsed} onToggle={handleToggle} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="admin-background flex-1 overflow-x-hidden overflow-y-auto p-6 max-xl:[@media(orientation:landscape)]:p-3 max-xl:[@media(orientation:landscape)]:[&_table]:whitespace-nowrap max-xl:[@media(orientation:landscape)]:[&_th]:px-2 max-xl:[@media(orientation:landscape)]:[&_th]:py-2 max-xl:[@media(orientation:landscape)]:[&_td]:px-2 max-xl:[@media(orientation:landscape)]:[&_td]:py-2 max-xl:[@media(orientation:landscape)]:[&_table]:text-xs">
            <Outlet />
          </main>
        </div>
      </div>
    </OrientationGuard>
  );
}
