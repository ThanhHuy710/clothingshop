import { Link } from 'react-router-dom';

export default function AdminHeader({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-admin-surface border-b border-admin-border">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 xl:hidden">
          {/* Hamburger Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-99999 block rounded-sm border border-admin-border p-1.5 shadow-sm bg-admin-surface text-admin-text-primary xl:hidden"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          {/* Mobile Logo */}
          <Link className="block flex-shrink-0 xl:hidden" to="/admin/products">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        <div className="hidden sm:block">
          {/* Global search or header title could go here */}
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Notification or other actions */}
            <li>
              <button className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-admin-border bg-admin-surface-secondary text-admin-text-secondary hover:text-admin-primary-600 transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
            </li>
          </ul>

          {/* User Profile */}
          <div className="relative">
            <Link className="flex items-center gap-4" to="#">
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-admin-text-primary">Admin User</span>
                <span className="block text-xs text-admin-text-muted">Admin</span>
              </span>
              <span className="h-10 w-10 rounded-full bg-admin-surface-secondary flex items-center justify-center text-admin-text-secondary">
                <span className="material-symbols-outlined">person</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
