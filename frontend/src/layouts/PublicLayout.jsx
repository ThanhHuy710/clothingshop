import { Outlet } from 'react-router-dom';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import MobileMenuDrawer from '../components/layout/MobileMenuDrawer';
import FloatingContactButtons from '../components/layout/FloatingContactButtons';

import { useUIStore } from '../stores/uiStore';

export default function PublicLayout() {
    const { isMenuDrawerOpen, setMenuDrawerOpen } = useUIStore();

    return (
        <div className="flex flex-col min-h-screen pb-16 lg:pb-0 w-full overflow-x-hidden">
            <Header />
            <main className="flex-grow w-full">
                <Outlet />
            </main>
            <Footer />
            
            {/* Quick Contact Floating Buttons */}
            <FloatingContactButtons />

            {/* Mobile Components */}
            <MobileBottomNav />
            <MobileMenuDrawer 
                isOpen={isMenuDrawerOpen} 
                onClose={() => setMenuDrawerOpen(false)} 
            />
            
        </div>
    );
}
