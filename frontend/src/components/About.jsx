import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope, FaSpaceShuttle } from "react-icons/fa";

export default function About() {
    return (
        <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '3rem' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#fff', fontWeight: '300' }}>About hiRISAT</h2>
                <div style={{ width: '60px', height: '2px', background: 'var(--accent-gold)', margin: '0 auto', opacity: 0.7 }}></div>
            </div>

            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#ccc', marginBottom: '3rem', textAlign: 'center', maxWidth: '90%', marginInline: 'auto' }}>
                <strong style={{ color: '#fff' }}>hiRISAT</strong> is a specialized satellite tracking application dedicated to ISRO’s
                Radar Imaging Satellite (RISAT) constellation. It provides high-precision pass predictions by solving orbital mechanics in real-time.
            </p>

            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    <FaSpaceShuttle /> The Mission
                </h3>
                <p style={{ color: '#bbb', lineHeight: '1.8', fontSize: '1.05rem' }}>
                    This project started out of pure curiosity and evolved into a passion project.
                    Exploring orbital mechanics and tracking real Indian satellites offered a unique way to connect
                    with space technology. Seeing predictions align with reality is incredibly satisfying, and
                    hiRISAT is my way of sharing that experience.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                <div>
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Developer</h3>
                    <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>Srivatsan S</p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: '#888', lineHeight: '1.6' }}>
                            Computer Science Student<br />
                            Space Systems Enthusiast<br />
                            Music Producer
                        </p>
                    </div>
                </div>

                <div>
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Connect</h3>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                        <SocialLink href="https://www.linkedin.com/in/the-vatsan/" icon={<FaLinkedin />} label="LinkedIn" />
                        <SocialLink href="https://github.com/BrownCurryyy" icon={<FaGithub />} label="GitHub" />
                        <SocialLink href="mailto:srivatsan.s13@gmail.com" icon={<FaEnvelope />} label="Email" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SocialLink({ href, icon, label }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
                color: '#aaa',
                fontSize: '2rem',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            title={label}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-gold)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {icon}
        </a>
    );
}
