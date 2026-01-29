import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white selection:bg-blue-500/30 overflow-hidden font-sans">

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px]" />
                <div className="absolute top-[20%] left-[30%] w-[60%] h-[60%] bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <Sidebar />

            <main className="pl-64 min-h-screen relative z-10 overflow-y-auto overflow-x-hidden">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default Layout;
