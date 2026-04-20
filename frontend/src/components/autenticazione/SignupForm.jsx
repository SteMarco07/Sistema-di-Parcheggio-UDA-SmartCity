import React, { useEffect, useState } from "react";
import { useStore } from "../../store.jsx";
import { useNavigate } from 'react-router-dom';


function SignupForm() {

    const { setAuthMode, register } = useStore();
    const { utente, setUser } = useStore();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [targa, setTarga] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    //const [admin, setAdmin] = useState(false);

    const [signupError, setSignupError] = useState(null);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirm) {
            alert("Le password non corrispondono");
            return;
        }

        const initials = `${(name || '').charAt(0)}${(surname || '').charAt(0)}`.toUpperCase();

        setUser({
            nome: name,
            cognome: surname,
            email: email,
            targa: targa,
            password: password,
            iniziali: initials
        });

        const result = await register(name, surname, email, targa, password);
        console.log("Risultato registrazione:", result);
        if (result.success) {
            navigate('/parcheggi');
        } else {
            setSignupError(JSON.parse(result.message)['message'] || "Errore sconosciuto durante la registrazione");
            console.error("Dettagli dell'errore:", result);
        }
    }

    return (
        <>
            <h1 className="text-3xl font-bold px-5">Registrazione</h1>
            <form onSubmit={handleSubmit} className="flex flex-col justify-between px-5 w-full h-full mt-10">
                <div className="flex-1 space-y-4">
                    {/* Campo nome */}
                    <div>
                        <label className="label"><span className="label-text">Nome</span></label>
                        <input type="text" value={name} placeholder="Inserisci il tuo nome" onChange={(e) => setName(e.target.value)} required className="input input-bordered w-full" />
                    </div>

                    {/* Campo cognome */}
                    <div>
                        <label className="label"><span className="label-text">Cognome</span></label>
                        <input type="text" value={surname} placeholder="Inserisci il tuo cognome" onChange={(e) => setSurname(e.target.value)} required className="input input-bordered w-full" />
                    </div>

                    {/* Campo email */}
                    <div>
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" value={email} placeholder="Inserisci il tuo indirizzo email" onChange={(e) => setEmail(e.target.value)} required className="input input-bordered w-full" />
                    </div>

                    {/* Campo targa */}
                    <div>
                        <label className="label"><span className="label-text">Targa</span></label>
                        <input type="text" value={targa} placeholder="Inserisci la targa del tuo veicolo" onChange={(e) => setTarga(e.target.value)} required className="input input-bordered w-full" />
                    </div>

                    {/* Campo password */}
                    <div>
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" value={password} placeholder="Inserisci la tua password" onChange={(e) => setPassword(e.target.value)} required className="input input-bordered w-full" />
                    </div>

                    {/* Campo conferma password */}
                    <div>
                        <label className="label"><span className="label-text">Conferma password</span></label>
                        <input type="password" value={confirm} placeholder="Conferma la tua password" onChange={(e) => setConfirm(e.target.value)} required className="input input-bordered w-full" />
                    </div>




                    <div className="flex flex-col items-center mt-6">

                        {
                        signupError && <div className="alert alert-error w-full mb-4">
                            <div>
                                <span>{signupError}</span>
                            </div>
                        </div>
                    }
                        <button type="submit" className="btn btn-primary w-[50%]">Registrati</button>
                    </div>
                </div>

            </form>

            
        </>
    )

}

export default SignupForm;