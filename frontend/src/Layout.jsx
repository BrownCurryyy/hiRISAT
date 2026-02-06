import { Outlet, Link, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Layout() {
    const location = useLocation();

    return (
        <>
            <Header />
            {/* Navigation Bar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                padding: '1rem',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(5px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <NavLink to="/" current={location.pathname}>Pass-Predictor</NavLink>
                <NavLink to="/scheduling" current={location.pathname}>Scheduling</NavLink>
                <NavLink to="/info" current={location.pathname}>Info</NavLink>
                <NavLink to="/about" current={location.pathname}>About</NavLink>
            </nav>

            <div className="container" style={{ minHeight: '80vh' }}>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

function NavLink({ to, current, children }) {
    const isActive = current === to;
    return (
        <Link
            to={to}
            style={{
                textDecoration: 'none',
                color: isActive ? 'var(--accent-gold)' : '#aaa',
                fontWeight: isActive ? 'bold' : 'normal',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem',
                paddingBottom: '4px',
                borderBottom: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
                transition: 'all 0.3s'
            }}
        >
            {children}
        </Link>
    );
}
