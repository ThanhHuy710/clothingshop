import { Link } from "react-router-dom";
export default function HeroSection() {
  return (
    <>
      {/*  HERO SECTION  */}
      <section className="relative w-full min-h-[640px] lg:h-[880px] -mt-20 flex items-center justify-center overflow-hidden bg-surface-alabaster">
        <div
          className="absolute inset-0 bg-cover bg-center"
          data-alt="Editorial lookbook photograph of an elegant East Asian couple in Hanoi posing outdoors in minimal natural linen and fluid silk tailoring, soft morning sunlight casting long architectural shadows, neutral beige and terracotta palette, cinematic modern high-fashion aesthetic, 35mm film grain"
          style={{
            backgroundImage:
              "url('../../../public/images/banner.png')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/45 to-primary/30"></div>
        <div className="relative z-10 max-w-max-width-content w-full mx-auto px-margin-mobile lg:px-margin-desktop pt-32 lg:pt-40 pb-16 flex flex-col items-start justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-pure/15 backdrop-blur-md text-on-primary mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            <span className="font-label-caps text-label-caps tracking-widest uppercase">
              Bộ Sưu Tập Pijama
            </span>
          </div>
          <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-primary max-w-3xl leading-tight mb-4 tracking-tight">
            ĐỊNH HÌNH PHONG CÁCH CỦA BẠN
          </h1>
          <p className="font-body-lg text-body-lg text-surface-variant max-w-xl mb-10 leading-relaxed">
            Khám phá những thiết kế mới nhất dành cho phong cách hiện đại — Tinh
            tế trong từng đường kim mũi chỉ, tôn vinh nét tao nhã tự nhiên của
            người Việt đương đại.
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
            <Link className="min-h-[48px] h-auto py-2.5 sm:h-12 sm:py-0 px-2 sm:px-8 rounded-lg bg-accent-terracotta hover:bg-secondary text-on-primary font-headline-sm text-[11px] sm:text-price-md flex items-center justify-center text-center leading-tight transition-all duration-200 shadow-md hover:shadow-xl min-w-0" to="/products">KHÁM PHÁ SẢN PHẨM</Link>
            <Link className="min-h-[48px] h-auto py-2.5 sm:h-12 sm:py-0 px-2 sm:px-8 rounded-lg bg-surface-pure/10 hover:bg-surface-pure/25 backdrop-blur-md text-on-primary font-headline-sm text-[11px] sm:text-price-md flex items-center justify-center text-center leading-tight transition-all duration-200 min-w-0" to="/products?bestSeller=1&page=0&size=12">XEM SẢN PHẨM BÁN CHẠY</Link>
          </div>
          <div className="hidden sm:grid sm:grid-cols-3 gap-8 sm:mt-16 sm:pt-8 max-w-3xl">
            <div>
              <div className="font-headline-lg text-headline-lg text-on-primary font-bold">01</div>
              <div className="font-body-md text-body-md text-on-primary mt-1 mb-2">Thiết kế cho giờ nghỉ</div>
              <div className="font-body-sm text-body-sm text-surface-container-high leading-relaxed">Những thiết kế nhẹ nhàng, ưu tiên sự thoải mái khi ở nhà và thư giãn.</div>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-on-primary font-bold">02</div>
              <div className="font-body-md text-body-md text-on-primary mt-1 mb-2">Mềm mại trong từng chi tiết</div>
              <div className="font-body-sm text-body-sm text-surface-container-high leading-relaxed">Tập trung vào cảm giác dễ chịu, phom dáng và những chi tiết tinh tế.</div>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-on-primary font-bold">03</div>
              <div className="font-body-md text-body-md text-on-primary mt-1 mb-2">Pijama cho mỗi ngày</div>
              <div className="font-body-sm text-body-sm text-surface-container-high leading-relaxed">Những lựa chọn đơn giản để mặc ở nhà, nghỉ ngơi và tận hưởng khoảng thời gian riêng.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
