import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-canvas px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold text-brand-terracotta uppercase tracking-wider">404 Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Không tìm thấy trang
        </h1>
        <p className="mt-6 text-base leading-7 text-text-secondary">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded bg-text-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            to="#"
            className="text-sm font-semibold leading-6 text-text-primary hover:text-brand-terracotta transition-colors"
          >
            Liên hệ hỗ trợ <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}