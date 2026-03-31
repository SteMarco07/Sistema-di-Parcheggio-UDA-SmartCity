
import React, { useState } from "react";
import { useStore } from "../../store.jsx";
import { useNavigate } from 'react-router-dom';

function LoginForm() {

    const { setAuthMode, login } = useStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Login submit:", { email, password, remember });
        // qui andrebbe la chiamata all'API per autenticare; al momento navighiamo direttamente
        const result = await login(email, password);
        if (result.success) {
            console.log(`Ho fatto il login: ${JSON.stringify(result)}`);
            navigate('/parcheggi');
        } else {
            console.error(`Errore durante il login: ${result.message}`);
        }
    }

    return (
        <>
            <h1 className="text-3xl font-bold">Accesso</h1>
            <form onSubmit={handleSubmit} className="space-y-4 px-5 w-full h-full mt-10">
                {/* Campo email */}
                <div>
                    <label className="label"><span className="label-text">Email</span></label>
                    <input type="email" value={email} placeholder="Inserisci la tua Email" onChange={(e) => setEmail(e.target.value)} required className="input input-bordered w-full" />
                </div>

                {/* Campo password */}
                <div>
                    <label className="label"><span className="label-text">Password</span></label>
                    <input type="password" value={password} placeholder="Inserisci la tua Password" onChange={(e) => setPassword(e.target.value)} required className="input input-bordered w-full"/>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="checkbox"
                    />
                    <label htmlFor="remember">Ricordami</label>
                </div>

                <div className="flex flex-col items-center mt-20">
                    <button type="submit" className="btn btn-primary w-[50%] items-center">Accedi</button>
                </div>
            </form>

            {/* Link per passare al form di registrazione */}
            <div className="flex flex-col items-center mb-0">
                <div className="flex flex-horizontal gap-2 items-center">
                    <p>Non hai un account?</p>
                    <a href="#" role="button" className="link link-primary" onClick={(e) => { e.preventDefault(); setAuthMode(1); }}>Registrati</a>
                </div>
            </div>
        </>
    );

}

export default LoginForm;