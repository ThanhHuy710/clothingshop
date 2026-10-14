import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import ZaloIcon from '../common/ZaloIcon';
import { CONTACT_LINKS, CONTACT_PHONE_DISPLAY } from '../../config/contact';

export default function MobileMenuDrawer({ isOpen, onClose }) {
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      timer = setTimeout(() => setShow(false), 0);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.search;
    if (path === '/categories') return location.pathname === '/categories';
    if (path === '/products?gender=male') return location.pathname === '/products' && searchParams.get('gender') === 'male';
    if (path === '/products?gender=female') return location.pathname === '/products' && searchParams.get('gender') === 'female';
    if (path === '/products?bestSeller=1') return location.pathname === '/products' && searchParams.get('bestSeller') === '1';
    if (path === '/products') return location.pathname === '/products' && !searchParams.get('gender') && !searchParams.get('bestSeller');
    return false;
  };

  const getLinkClass = (path) => {
    if (isLinkActive(path)) {
      return "flex items-center justify-between px-space-sm py-2.5 rounded-lg bg-surface-canvas text-yellow-500 font-headline-sm transition-colors duration-200";
    }
    return "flex items-center justify-between px-space-sm py-2.5 rounded-lg text-on-surface-variant hover:text-yellow-500 hover:bg-surface-canvas transition-colors duration-200 font-body-md text-body-md";
  };

  const handleSearch = (e) => {
    if (e && e.key && e.key !== 'Enter') return;
    if (searchQuery.trim()) {
      navigate('/products?Name=' + encodeURIComponent(searchQuery.trim()) + '&page=0&size=12');
      onClose();
    }
  };

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-text-primary/40 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>
      <aside className={`fixed inset-y-0 left-0 z-50 w-[86%] max-w-[380px] bg-surface-pure shadow-2xl flex flex-col h-screen text-text-primary transform transition-transform duration-300 ${show ? 'translate-x-0' : '-translate-x-full'}`} id="side-drawer">
        {/*  Drawer Top Brand Header  */}
        <div className="px-margin-mobile pt-space-lg pb-space-md flex items-center justify-between bg-surface-pure border-b border-border-hairline">
          <Link className="inline-flex items-center" to="/" onClick={onClose}>
            <img alt="Lumen Atelier logo" className="h-7 w-auto object-contain" src="/images/logo.png" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/aida/AEtjO1V-qZHCEBIU0bfESmOII-ABxq5a7ZD43NGwg9wxECJiOqA1XF7rq8Bg66NCw000LBDoRJgAv7XRl3ZWqhY4WQRXlGyb7roguNVwML8F-1zEVoPC2MI8jnUZrF5bRw7FUvxqllo7iVaPfYMrVpuB70WHVNGe6VEmVlAwGjrjnsZodZC6BOs1BK-HsSp8aOQtIw16YlHa69gQ3SMCgZk-ptdPBcq9iTulB3hN88oc-sJZL-wHTi2bLKeXQWY"; }} />
          </Link>
          <button onClick={onClose} aria-label="Đóng menu" className="w-9 h-9 rounded-full bg-surface-canvas flex items-center justify-center text-text-primary hover:text-accent-terracotta hover:bg-surface-container-high transition-all active:scale-95 focus:outline-none" type="button">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/*  In-Drawer Compact Search Field  */}
        <div className="px-margin-mobile my-space-sm">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-text-muted text-[19px] pointer-events-none">search</span>
            <input 
              className="w-full bg-surface-canvas text-text-primary placeholder:text-text-muted text-body-sm font-body-sm rounded-lg pl-9 pr-8 py-2.5 outline-none focus:bg-surface-pure focus:shadow-sm transition-all" 
              placeholder="Tìm kiếm sản phẩm, áo, quần..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} aria-label="Xóa tìm kiếm" className="absolute right-2.5 text-text-muted hover:text-text-primary" type="button">
                <span className="material-symbols-outlined text-[17px]">close</span>
              </button>
            ) : (
              <button onClick={handleSearch} aria-label="Tìm kiếm" className="absolute right-2.5 text-text-muted hover:text-text-primary" type="button">
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/*  Scrollable Navigation Section  */}
        <div className="flex-1 overflow-y-auto px-margin-mobile py-space-xs space-y-1">
          {/* 1. Trang chủ */}
          <Link
            className={getLinkClass('/')}
            to="/"
            onClick={onClose}
          >
            <div className="flex items-center gap-space-sm">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isLinkActive('/') ? 'bg-yellow-500' : 'bg-transparent'}`}></span>
              <span className="font-body-md text-body-md">Trang chủ</span>
            </div>
            <span className={`material-symbols-outlined text-[16px] transition-colors duration-200 ${isLinkActive('/') ? 'text-yellow-500 font-bold' : 'text-text-muted'}`}>chevron_right</span>
          </Link>

          {/* 2. Sản phẩm */}
          <Link
            className={getLinkClass('/products')}
            to="/products"
            onClick={onClose}
          >
            <div className="flex items-center gap-space-sm">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isLinkActive('/products') ? 'bg-yellow-500' : 'bg-transparent'}`}></span>
              <span className="font-body-md text-body-md">Sản phẩm</span>
            </div>
            <span className={`material-symbols-outlined text-[16px] transition-colors duration-200 ${isLinkActive('/products') ? 'text-yellow-500 font-bold' : 'text-text-muted'}`}>chevron_right</span>
          </Link>

          {/* 3. Nam */}
          <Link
            className={getLinkClass('/products?gender=male')}
            to="/products?gender=male"
            onClick={onClose}
          >
            <div className="flex items-center gap-space-sm">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isLinkActive('/products?gender=male') ? 'bg-yellow-500' : 'bg-transparent'}`}></span>
              <span className="font-body-md text-body-md">Nam</span>
            </div>
            <span className={`material-symbols-outlined text-[16px] transition-colors duration-200 ${isLinkActive('/products?gender=male') ? 'text-yellow-500 font-bold' : 'text-text-muted'}`}>chevron_right</span>
          </Link>

          {/* 4. Nữ */}
          <Link
            className={getLinkClass('/products?gender=female')}
            to="/products?gender=female"
            onClick={onClose}
          >
            <div className="flex items-center gap-space-sm">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isLinkActive('/products?gender=female') ? 'bg-yellow-500' : 'bg-transparent'}`}></span>
              <span className="font-body-md text-body-md">Nữ</span>
            </div>
            <span className={`material-symbols-outlined text-[16px] transition-colors duration-200 ${isLinkActive('/products?gender=female') ? 'text-yellow-500 font-bold' : 'text-text-muted'}`}>chevron_right</span>
          </Link>

          {/* 5. Danh mục */}
          <Link
            className={getLinkClass('/categories')}
            to="/categories"
            onClick={onClose}
          >
            <div className="flex items-center gap-space-sm">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isLinkActive('/categories') ? 'bg-yellow-500' : 'bg-transparent'}`}></span>
              <span className="font-body-md text-body-md">Danh mục</span>
            </div>
            <span className={`material-symbols-outlined text-[16px] transition-colors duration-200 ${isLinkActive('/categories') ? 'text-yellow-500 font-bold' : 'text-text-muted'}`}>chevron_right</span>
          </Link>

          {/* 6. Bán chạy */}
          <Link
            className={getLinkClass('/products?bestSeller=1')}
            to="/products?bestSeller=1"
            onClick={onClose}
          >
            <div className="flex items-center gap-space-sm">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isLinkActive('/products?bestSeller=1') ? 'bg-yellow-500' : 'bg-transparent'}`}></span>
              <span className="font-body-md text-body-md">Bán chạy</span>
            </div>
            <span className={`material-symbols-outlined text-[16px] transition-colors duration-200 ${isLinkActive('/products?bestSeller=1') ? 'text-yellow-500 font-bold' : 'text-text-muted'}`}>chevron_right</span>
          </Link>

          {/* 7. Giới thiệu */}
          <a
            className="flex items-center justify-between px-space-sm py-2.5 rounded-lg text-on-surface-variant hover:text-yellow-500 hover:bg-surface-canvas transition-colors duration-200 font-body-md text-body-md"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            <div className="flex items-center gap-space-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
              <span className="font-body-md text-body-md">Giới thiệu</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-text-muted">chevron_right</span>
          </a>
        </div>

        {/*  Quick Action Support & Atelier Concierge (Bottom docked)  */}
        <div className="p-margin-mobile bg-surface-alabaster space-y-space-sm border-t border-border-hairline">
          {/*  Direct Zalo Concierge Assistance Button  */}
          <a className="w-full h-11 px-space-md rounded-lg bg-[#0068FF] text-white font-label-caps text-label-caps tracking-wider flex items-center justify-center gap-2 hover:bg-[#0052cc] transition-colors shadow-sm active:scale-[0.99]" href={CONTACT_LINKS.zalo} target="_blank" rel="noopener noreferrer">
            <ZaloIcon size={18} color="#FFFFFF" />
            <span>TƯ VẤN TRỰC TIẾP ZALO 24/7</span>
          </a>
          {/*  Contact Information  */}
          <div className="flex flex-col gap-1.5 pt-1 text-text-secondary">
            <a className="flex items-center gap-2 text-body-sm font-body-sm hover:text-accent-terracotta transition-colors" href={CONTACT_LINKS.phone}>
              <Phone size={16} className="text-[#16A34A] fill-[#16A34A] shrink-0" />
              <span>Hotline: <strong className="text-text-primary font-semibold">{CONTACT_PHONE_DISPLAY}</strong> <span className="text-[11px] text-text-muted">(8:30 - 22:00)</span></span>
            </a>
            <a className="flex items-center gap-2 text-body-sm font-body-sm hover:text-accent-terracotta transition-colors" href="#">
              <span className="material-symbols-outlined text-[16px] text-text-muted">storefront</span>
              <span>Hệ thống cửa hàng</span>
            </a>
          </div>
          {/*  Language & Regional Currency Switcher  */}
          <div className="pt-space-xs flex items-center justify-between">
            <div className="inline-flex items-center p-0.5 rounded bg-surface-canvas">
              <button className="px-2 py-1 rounded text-[11px] font-label-caps font-semibold bg-surface-pure text-text-primary shadow-xs" type="button">
                Tiếng Việt (VN)
              </button>
              <button className="px-2 py-1 rounded text-[11px] font-label-caps font-medium text-text-muted hover:text-text-primary" type="button">
                English (EN)
              </button>
            </div>
            <span className="text-[11px] font-body-sm text-text-muted">VND (₫)</span>
          </div>
        </div>
      </aside>
    </div>
  );
}