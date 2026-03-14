import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx';

function closeDrawer() {
    const el = document.getElementById('my-drawer-1')
    if (el) el.checked = false
}

function Menu() {
    const { utente } = useStore();

    return (
        <div className="drawer">
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label htmlFor="my-drawer-1" className="btn drawer-button">☰</label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    <li><Link to="/parcheggi" onClick={closeDrawer}>Mappa parcheggi</Link></li>
                    <li><Link to="/prenotazioni" onClick={closeDrawer}>Prenotazioni</Link></li>
                    {utente.admin && (
                        <li><Link to="/dashboard" onClick={closeDrawer}>Dashboard</Link></li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Menu;