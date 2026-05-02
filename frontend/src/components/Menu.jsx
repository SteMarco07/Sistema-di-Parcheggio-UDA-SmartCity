import { useState, useRef, useEffect } from "react"
import * as motion from "motion/react-client"
import { Link } from "react-router-dom"
import { useStore } from "../store.jsx"

const useDimensions = (ref) => {
    const dimensions = useRef({ width: 0, height: 0 })
    useEffect(() => {
        if (ref.current) {
            dimensions.current.height = ref.current.offsetHeight
            dimensions.current.width = ref.current.offsetWidth
        }
    }, [ref])
    return dimensions.current
}

const sidebarVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 20,
        },
    },
    closed: {
        y: "-100%",   // 👈 parte sopra lo schermo
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 30,
        },
    },
}

const listVariants = {
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const itemVariants = {
    open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
    closed: { y: 20, opacity: 0, transition: { y: { stiffness: 1000 } } },
}

const Path = (props) => (
    <motion.path
        fill="transparent"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        {...props}
    />
)

// Styled as a DaisyUI btn-ghost btn-circle to match the navbar
function MenuToggle({ toggle }) {
    return (
        <button onClick={toggle} className="btn btn-ghost btn-circle">
            <svg width="20" height="20" viewBox="0 0 20 20">
                <Path
                    variants={{
                        closed: { d: "M 2 2 L 18 2" },
                        open: { d: "M 3 15 L 15 3" },
                    }}
                />
                <Path
                    d="M 2 9 L 18 9"
                    variants={{
                        closed: { opacity: 1 },
                        open: { opacity: 0 },
                    }}
                    transition={{ duration: 0.1 }}
                />
                <Path
                    variants={{
                        closed: { d: "M 2 16 L 18 16" },
                        open: { d: "M 3 3 L 15 15" },
                    }}
                />
            </svg>
        </button>
    )
}

const baseLinks = [
    { to: "/parcheggi", label: "Mappa parcheggi" },
    { to: "/prenotazioni", label: "Prenotazioni" },
]

function NavLinks({ links, onClose }) {
    return (
        <motion.ul variants={listVariants} style={styles.list}>
            {links.map((link) => (
                <motion.li
                    key={link.to}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    style={styles.item}
                >
                    <Link to={link.to} onClick={onClose} style={styles.link}>
                        {link.label}
                    </Link>
                </motion.li>
            ))}
        </motion.ul>
    )
}

function Menu() {
    const [isOpen, setIsOpen] = useState(false)
    const { utente } = useStore()
    const containerRef = useRef(null)
    const { height } = useDimensions(containerRef)

    const links = utente?.admin
        ? [...baseLinks, { to: "/dashboard", label: "Dashboard" }]
        : baseLinks

    const toggle = () => setIsOpen((v) => !v)
    const close = () => setIsOpen(false)

    return (
        <>
            {/* ① Button sits inline inside the navbar join — no extra wrapper */}
            <motion.div
                initial={false}
                animate={isOpen ? "open" : "closed"}
            >
                <MenuToggle toggle={toggle} />
            </motion.div>

                    {/* ② Backdrop — below navbar, closes panel on click */}
                    {isOpen && (
                        <div onClick={close} style={styles.backdrop} />
                    )}

                    {/* ③ Sliding panel — rendered only when open to avoid occupying layout space when closed */}
                    {isOpen && (
                        <motion.nav
                            ref={containerRef}
                            initial={false}
                            animate={"open"}
                            custom={height}
                            style={{ ...styles.nav, pointerEvents: "auto" }}
                        >
                            <motion.div style={styles.background} variants={sidebarVariants} initial="open" animate="open" />
                            <NavLinks links={links} onClose={close} />
                        </motion.nav>
                    )}
        </>
    )
}

const styles = {
    backdrop: {
        position: "fixed",
        top: 64,           // below the 64px navbar
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        background: "rgba(0,0,0,0.15)",
    },
    nav: {
        position: "fixed",
        top: 64,           // below the 64px navbar
        left: 0,
        width: 280,
        height: "calc(100vh - 64px)",
        zIndex: 45,        // above backdrop (40), below navbar (50)
        overflow: "hidden",
    },
    background: {
        position: "absolute",
        inset: 0,
        background: "var(--color-base-100, #fff)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
        pointerEvents: "auto",
        transformOrigin: "top",
    },
    list: {
        position: "absolute",
        top: 24,
        left: 0,
        width: "100%",
        listStyle: "none",
        padding: "0 12px",
        margin: 0,
        pointerEvents: "auto",
    },
    item: {
        marginBottom: 4,
    },
    link: {
        display: "block",
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 500,
        textDecoration: "none",
        color: "inherit",
    },
}

export default Menu