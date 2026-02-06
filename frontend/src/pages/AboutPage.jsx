import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import profile from "../assets/profile.jpg";

export default function AboutPage() {
    return (
        <div style={{
            height: "calc(100vh - 100px)",
            width: "100%",
            display: "flex",
            overflow: "hidden",
            padding: "0 2rem"
        }}>
            {/* --- LEFT PANEL: MISSION & TECH --- */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingRight: "4rem"
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ width: "40px", height: "2px", background: "var(--accent-gold)" }} />
                        <span style={{ color: "var(--accent-gold)", letterSpacing: "2px", fontSize: "0.9rem", fontWeight: "bold" }}>MISSION CONTROL</span>
                    </div>

                    <h1 style={{
                        fontSize: "4rem", fontWeight: "200", lineHeight: "1.1", marginBottom: "2rem",
                        background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                    }}>
                        Mapping the <br /> Sky accurately.
                    </h1>

                    <p style={{ fontSize: "1.1rem", color: "#aaa", lineHeight: "1.8", marginBottom: "3rem", maxWidth: "600px" }}>
                        <strong style={{ color: "#fff" }}>hiRISAT</strong> is a mission-style satellite tracking and scheduling engine focused on ISRO’s RISAT fleet.
                        <br /><br />
                        It models real satellite orbits using SGP4 propagation and live TLE updates to predict contact windows across multiple Indian and overseas ground stations.
                        <br /><br />
                        The goal is to make satellite tracking accessible and intuitive, whether for hobbyists, students, or professional ground station operators.
                        <br /><br />
                        So next time you look up at the sky, you know exactly when you can catch a glimpse of our RISAT fleet - <div style={{ color: "var(--accent-gold)" }}>WAVE A HI TO THEM</div>
                    </p>
                </motion.div>
            </div>

            {/* --- RIGHT PANEL: DEVELOPER PROFILE --- */}
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
            }}>
                {/* Decorative Background Elements */}
                <div style={{
                    position: "absolute", top: "20%", right: "10%", width: "300px", height: "300px",
                    background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 70%)",
                    zIndex: 0
                }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "24px",
                        padding: "3rem",
                        width: "100%",
                        maxWidth: "500px",
                        zIndex: 1,
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                        <div style={{
                            width: "60px", height: "60px", borderRadius: "50%", background: "#222",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: "1px solid var(--accent-gold)"
                        }}>
                            <img style={{ width: "100%", height: "100%", borderRadius: "50%" }} src={profile} alt="" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: "1.8rem", margin: 0, fontWeight: "400" }}>Srivatsan S</h2>
                            <div style={{ color: "var(--accent-gold)", fontSize: "0.9rem", opacity: 0.8 }}>Lead Developer</div>
                        </div>
                    </div>

                    <p style={{ color: "#888", lineHeight: "1.6", marginBottom: "2rem" }}>
                        Computer science student who likes building things and recently fell down the space-systems rabbit hole.<p>(cant beleive that you are reading this lol)</p></p>


                    <div style={{ display: "flex", gap: "1rem" }}>
                        <SocialButton href="https://www.linkedin.com/in/the-vatsan/" icon={<FaLinkedin />} label="LinkedIn" />
                        <SocialButton href="https://github.com/BrownCurryyy/hiRISAT" icon={<FaGithub />} label="GitHub" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function SocialButton({ href, icon, label }) {
    return (
        <a href={href} target="_blank" rel="noreferrer" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            background: "#fff", color: "#000", padding: "12px", borderRadius: "8px",
            textDecoration: "none", fontWeight: "bold", fontSize: "0.9rem",
            transition: "transform 0.2s"
        }}>
            {icon} {label}
        </a>
    );
}
