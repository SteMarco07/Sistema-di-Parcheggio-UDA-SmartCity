import { useState } from "react";
import { useStore } from "../store.jsx";
import { useNavigate } from 'react-router-dom';

import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";


function PaginaAutenticazione() {

    const {authMode} = useStore();
    const navigate = useNavigate();

    return (
        <>
            < div className="h-[calc(100vh-64px)] w-full px-6 py-7 flex justify-center" >
                <div className="w-[90%] lg:w-[30%] lg:min-w-120 md:w-[50%] h-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col items-center gap-4" >
                    {/* Mosta il form del Login o Signup */}
                    {authMode === "login" ? <LoginForm /> : <SignupForm />}
                    <button className="btn btn-primary" onClick={() => navigate('/parcheggi')}>Salta autenticazione</button>
                </div>
            </div>

        </>
    );
}

export default PaginaAutenticazione;