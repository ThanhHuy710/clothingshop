export default function TrustPillars() {
  return (
    <>
      {/*  TRUST VALUE PILLARS  */}
      <section className="w-full bg-surface-pure py-8 shadow-sm">
        <div className="max-w-max-width-content mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-canvas/60 hover:bg-surface-canvas transition-colors">
              <div className="w-12 h-12 rounded-full bg-surface-pure flex items-center justify-center text-accent-terracotta shadow-sm shrink-0">
                <span className="material-symbols-outlined text-2xl">checkroom</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-body-md text-text-primary">Thiết kế chỉn chu</h4>
                <p className="font-body-sm text-body-sm text-text-secondary">Từng đường may và chi tiết được chăm chút để mang lại cảm giác thoải mái trong từng khoảnh khắc.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-canvas/60 hover:bg-surface-canvas transition-colors">
              <div className="w-12 h-12 rounded-full bg-surface-pure flex items-center justify-center text-accent-terracotta shadow-sm shrink-0">
                <span className="material-symbols-outlined text-2xl">eco</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-body-md text-text-primary">Chất liệu được chọn lọc</h4>
                <p className="font-body-sm text-body-sm text-text-secondary">Ưu tiên những chất liệu mềm mại, nhẹ nhàng và phù hợp cho những giờ nghỉ ngơi thư thái.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
