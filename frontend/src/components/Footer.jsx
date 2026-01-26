export default function Footer() {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '2rem',
            marginTop: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#666',
            fontSize: '0.9rem'
        }}>
            <p>&copy; {new Date().getFullYear()} hiRISAT. Developed with &hearts; for ISRO RISAT enthusiasts.</p>
        </footer>
    );
}
