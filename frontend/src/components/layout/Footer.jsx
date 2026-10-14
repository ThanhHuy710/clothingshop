import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import ZaloIcon from "../common/ZaloIcon";
import { CONTACT_LINKS, CONTACT_PHONE_DISPLAY } from "../../config/contact";
export default function Footer() {
  return (
    <footer className="w-full bg-surface-pure border-t border-border-subtle">
      <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop pt-space-3xl pb-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-2xl">
          <div className="space-y-space-md">
            <Link to="/" className="flex items-center gap-3">
              <img
                alt="Lumen Atelier Logo"
                className="h-10 w-auto object-contain"
                src="/images/logo.png"
              />
            </Link>
            <p className="text-body-md font-body-md text-text-secondary leading-relaxed">
              Thương hiệu Pijama và Đồ mặc nhà cao cấp. Mang đến sự thoải mái và tinh tế trong từng khoảnh khắc.
            </p>
            <div className="pt-space-xs space-y-1 text-body-sm font-body-sm text-text-secondary">
              <div>MST: 0109876543 do Sở KH&ĐT cấp</div>
              
            </div>
          </div>
          <div className="space-y-space-md">
            <div className="text-label-caps font-label-caps uppercase tracking-wider text-text-primary border-b border-border-hairline pb-space-xs">
              HỖ TRỢ KHÁCH HÀNG
            </div>
            <ul className="space-y-2.5 text-body-md font-body-md text-text-secondary">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Hướng dẫn mua hàng trực tuyến
                </a>
              </li>
              
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Chính sách giao hàng & đồng kiểm
                </a>
              </li>
              
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Hướng dẫn chọn kích cỡ chuẩn (Size Guide)
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-space-md">
            <div className="text-label-caps font-label-caps uppercase tracking-wider text-text-primary border-b border-border-hairline pb-space-xs">
              DANH MỤC THỜI TRANG
            </div>
            <ul className="space-y-2.5 text-body-md font-body-md text-text-secondary">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Thời trang Nam Minimalist
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Thời trang Nữ Contemporary
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Pijama Lụa Cao Cấp
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Quần âu & Quần ống suông
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Đầm váy dự tiệc & dạo phố
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors text-accent-terracotta"
                  href="#"
                >
                  Bộ sưu tập Mùa Thu mới
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-space-md">
            <div className="text-label-caps font-label-caps uppercase tracking-wider text-text-primary border-b border-border-hairline pb-space-xs">
              LIÊN HỆ & CỬA HÀNG
            </div>
            <div className="space-y-3 text-body-md font-body-md text-text-secondary">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-primary mt-0.5">
                  location_on
                </span>
                <span>TP.HCM: 23/24/7 Bùi Thế Mỹ , Bảy Hiền, Tân Bình</span>
              </div>
              <a
                href={CONTACT_LINKS.phone}
                className="flex items-center gap-2 hover:text-primary transition-colors"
                aria-label={`Hotline ${CONTACT_PHONE_DISPLAY}`}
              >
                <Phone size={18} className="text-[#16A34A] fill-[#16A34A] shrink-0" />
                <span>Hotline: <strong className="font-semibold text-text-primary">{CONTACT_PHONE_DISPLAY}</strong> (8:30 - 22:00)</span>
              </a>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-primary">
                  mail
                </span>
                <span>contact@lumenatelier.vn</span>
              </div>
              <div className="pt-2">
                <a
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-canvas border border-border-subtle text-text-primary hover:bg-surface-container-high transition-colors text-body-sm font-body-sm"
                  href={CONTACT_LINKS.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat Zalo Official Account"
                >
                  <ZaloIcon size={18} color="#0068FF" />
                  <span>Chat Zalo Official Account</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-space-3xl pt-space-md border-t border-border-hairline flex flex-col md:flex-row justify-between items-center gap-4 text-body-sm font-body-sm text-text-muted">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 LUMEN ATELIER. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="text-status-success flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                verified
              </span>
              Đã thông báo Bộ Công Thương
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span>Điều khoản dịch vụ</span>
            <span>Chính sách bảo mật</span>
            <span>Giao hàng an toàn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
