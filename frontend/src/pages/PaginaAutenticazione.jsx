import { useStore } from "../store.jsx";
import LoginForm from "../components/autenticazione/LoginForm.jsx";
import SignupForm from "../components/autenticazione/SignupForm.jsx";

function PaginaAutenticazione() {
    const { authMode, setAuthMode } = useStore();

    return (
        <div className="min-h-[calc(100vh-64px)] w-full px-6 py-7 flex justify-center items-start md:items-center bg-gray-50">
            <div className="w-full sm:w-[80%] md:w-[50%] lg:w-[30%] lg:min-w-[480px] bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col items-center gap-4">

                {/* Tab switcher */}
                <div className="flex w-full rounded-lg bg-gray-100 p-1 ">
                    <button
                        onClick={() => setAuthMode("login")}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            authMode === "login"
                                ? "bg-white shadow text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Accedi
                    </button>
                    <button
                        onClick={() => setAuthMode("signup")}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            authMode === "signup"
                                ? "bg-white shadow text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Registrati
                    </button>
                </div>

                {/* Form con transizione */}
                <div className="w-full transition-all duration-300">
                    {authMode === "login" ? <LoginForm /> : <SignupForm />}
                </div>

            </div>
        </div>
    );
}

export default PaginaAutenticazione;