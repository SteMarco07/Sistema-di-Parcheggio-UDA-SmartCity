import Menu from "./Menu.jsx";

function Navbar() {
    return (
        <div className=" fixed top-0 left-0 right-0 z-50 navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <div className="join join-horizontal">
                    <Menu className="join join-item" />
                    <a className="btn btn-ghost text-3xl join join-item" href = "/parcheggi">Parcheggio</a>
                </div>
            </div>

            <div className="flex gap-2">
                <input type="text" placeholder="Cerca..." className="input input-bordered w-24 md:w-auto" />
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                                alt="P"/>
                        </div>
                    </div>
                    <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
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