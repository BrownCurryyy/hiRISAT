import { Outlet, Link, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import useMobile from "./hooks/useMobile";

export default function Layout() {
    const location = useLocation();
    const isMobile = useMobile();

    return (
        <>
            <Header />
            {/* Navigation Bar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? '0.8rem' : '2rem',
                padding: isMobile ? '0.6rem 0.5rem' : '1rem',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(5px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                width: '100%',
                boxSizing: 'border-box',
                position: isMobile ? 'static' : 'sticky',
                top: 0,
                zIndex: 1001,
                overflowX: isMobile ? 'auto' : 'visible',
                scrollbarWidth: 'none'
            }}>
                <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
                <NavLink to="/" current={location.pathname} isMobile={isMobile}>Pass-Predictor</NavLink>
                <NavLink to="/scheduling" current={location.pathname} isMobile={isMobile}>Scheduling</NavLink>
                <NavLink to="/info" current={location.pathname} isMobile={isMobile}>Info</NavLink>
                <NavLink to="/about" current={location.pathname} isMobile={isMobile}>About</NavLink>
            </nav>

            <div className="container" style={{ minHeight: '80vh' }}>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

function NavLink({ to, current, children, isMobile }) {
    const isActive = current === to;
    return (
        <Link
            to={to}
            style={{
                textDecoration: 'none',
                color: isActive ? 'var(--accent-gold)' : '#888',
                fontWeight: isActive ? 'bold' : 'normal',
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.5px' : '1px',
                fontSize: isMobile ? '0.7rem' : '0.85rem',
                paddingBottom: '4px',
                borderBottom: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                flexShrink: 0
            }}
        >
            {children}
        </Link>
    );
}
