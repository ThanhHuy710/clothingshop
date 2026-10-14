import { useUIStore } from "../../stores/uiStore";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import ZaloIcon from "../common/ZaloIcon";
import { CONTACT_LINKS, CONTACT_PHONE_DISPLAY } from "../../config/contact";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
    const [searchParams] = useSearchParams();
  const location = useLocation();

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
      return "text-yellow-500 font-headline-sm transition-colors duration-200 py-2";
    }
    return "text-body-md font-body-md text-on-surface-variant hover:text-yellow-500 transition-colors duration-200 py-2";
  };
useEffect(() => {
    const q = searchParams.get("Name");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setSearchQuery(q);
      }, [searchParams, setSearchQuery]);

  const handleSearch = (e) => {
    if (e && e.key && e.key !== "Enter") return;
    if (searchQuery.trim()) {
      navigate("/products?Name=" + encodeURIComponent(searchQuery.trim()) + "&page=0&size=12");
    }
  };

  const setMenuDrawerOpen = useUIStore((state) => state.setMenuDrawerOpen);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-[0_1px_8px_rgba(0,0,0,0.04)]'}`}>
      <div className={`bg-primary text-on-primary px-margin-mobile lg:px-margin-desktop transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 py-0' : 'h-auto py-1.5'}`}>
        <div className="max-w-max-width-content mx-auto flex justify-between items-center text-body-sm font-body-sm">
          <div className="hidden sm:flex items-center gap-6 text-body-sm font-body-sm text-surface-container-high">
            <a href={CONTACT_LINKS.phone} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={14} className="text-[#16A34A] fill-[#16A34A]" />
              <span>Hotline: {CONTACT_PHONE_DISPLAY}</span>
            </a> 
          </div>
        </div>
      </div>
      <div className="h-20 bg-surface-pure/95 backdrop-blur-md border-b border-border-hairline">
        <div className="max-w-max-width-content w-full h-full mx-auto px-3.5 sm:px-margin-mobile lg:px-margin-desktop flex items-center justify-between gap-2 sm:gap-space-md">
          <div className="flex items-center gap-space-lg shrink-0">
            <Link className="flex items-center gap-3 h-auto shrink-0" to="/">
              <img
                className="h-10 w-auto object-contain"
                src="/images/logo.png"
                alt="Logo"
              />
            </Link>
            <nav
              className="hidden xl:flex items-center gap-space-lg ml-space-xs"
            >
              <Link
                className={getLinkClass('/')}
                to="/"
              >
                Trang chủ
              </Link>
              <Link
                className={getLinkClass('/products')}
                to="/products"
              >
                Sản phẩm
              </Link>
              <Link
                className={getLinkClass('/products?gender=male')}
                to="/products?gender=male"
              >
                Nam
              </Link>
              <Link
                className={getLinkClass('/products?gender=female')}
                to="/products?gender=female"
              >
                Nữ
              </Link>
              <Link
                className={getLinkClass('/categories')}
                to="/categories"
              >
                Danh mục
              </Link>
              <Link
                className={getLinkClass('/products?bestSeller=1')}
                to="/products?bestSeller=1"
              >
                Bán chạy
              </Link>
              <a
                className="text-body-md font-body-md text-on-surface-variant hover:text-yellow-500 transition-colors duration-200 py-2"
                href="#"
              >
                Giới thiệu
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-1 sm:gap-space-sm sm:gap-space-md shrink-0">
            <div className="relative hidden md:block group">
              <div className="flex items-center bg-surface-canvas rounded-lg px-3 py-2 border border-border-subtle focus-within:border-primary transition-all flex-1 min-w-0 md:w-64 max-w-xs transition-colors">
                <span className="material-symbols-outlined text-outline text-[18px] mr-2 cursor-pointer" onClick={handleSearch}>search</span>
                <input className="text-nowrap bg-transparent text-body-sm font-body-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full" placeholder="Tìm kiếm áo, quần..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} />
              </div>
            </div>
            <a
              className="text-nowrap hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-canvas border border-border-subtle hover:bg-surface-container-high transition-colors text-text-primary text-body-sm font-body-sm"
              href={CONTACT_LINKS.zalo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Liên hệ Zalo"
            >
              <ZaloIcon size={16} color="#0068FF" />
              <span>Zalo</span>
            </a>
            <a
              className="text-nowrap hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-canvas border border-border-subtle hover:bg-surface-container-high transition-colors text-text-primary text-body-sm font-body-sm"
              href={CONTACT_LINKS.phone}
              aria-label={`Gọi hotline ${CONTACT_PHONE_DISPLAY}`}
            >
              <Phone size={15} className="text-[#16A34A] fill-[#16A34A]" />
            </a>
            <a
              className="flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] p-1.5 sm:p-2 text-on-surface-variant hover:text-accent-terracotta transition-colors relative"
              data-path="wishlist"
              href="#"
              aria-label="Yêu thích"
            >
              <span className="material-symbols-outlined text-[22px]">
                favorite
              </span>
            </a>
            
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-space-xs border-l border-border-hairline shrink-0">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-border-subtle shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXnJvEI2Ty988N9ETMyk_DuuXWr9AU0Gu5F_QNlUzD95_H3xNVBbgPX6AAIVSRqiyx0wztY3T4-STBSsA11atZOK3xa_LNyrDVduZpPpTNaAt9to-p24RdPYTkdxKV5Adqj2l82XCG5KSouYkLWcfx8-sxpubUUpX_kVsBrv9YVykrcRsoenvBzOCLeKK3CNI1OPq_Ic7GXFC70UwatFG3uEmJtxoztPhCOrtlw6M4lLP-e1L93j-N"
              />
              <button
                type="button"
                onClick={() => setMenuDrawerOpen(true)}
                className="xl:hidden flex items-center justify-center min-w-[40px] min-h-[40px] p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                aria-label="Mở menu"
              >
                <span className="material-symbols-outlined text-[24px]">
                  menu
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

