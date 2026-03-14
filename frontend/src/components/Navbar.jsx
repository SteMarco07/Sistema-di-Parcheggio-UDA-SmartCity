import Menu from "./Menu.jsx";
import { useStore } from "../store.jsx";

function Navbar() {
    const { utente } = useStore();

    return (
        <div className=" fixed top-0 left-0 right-0 z-50 navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <div className="join join-horizontal">
                    <Menu className="join join-item" />
                    <a className="btn btn-ghost text-3xl join join-item" href="/parcheggi">Parcheggio</a>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text font-bold shadow-md">
                        {utente.iniziali || '--'}
                    </div>
                        </div>
                    </div>

                    <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow ">
                        <li>
                            <a className="justify-between" href="/profilo">
                                Profilo
                            </a>
                        </li>
                        <li><a href="/auth">Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar;