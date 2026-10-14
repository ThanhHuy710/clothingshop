
import HeroSection from '../../components/home/HeroSection';
import TrustPillars from '../../components/home/TrustPillars';
import CategoryExploration from '../../components/home/CategoryExploration';
import NewArrivals from '../../components/home/NewArrivals';

import BestSellers from '../../components/home/BestSellers';

export default function HomePage() {
    return (
        <div className="flex flex-col w-full">
            {/* //hero */}
            <HeroSection />
            
            <TrustPillars />
            {/* //danh mục sản phẩm */}
            <CategoryExploration />
            {/* //sản phẩm mới */}
            <NewArrivals />
            {/* //bán chạy */}
            <BestSellers />
        </div>
    );
}
